import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as Imap from 'imap';
import { simpleParser } from 'mailparser';
import { EmailService } from './email.service';

@Injectable()
export class ImapService implements OnModuleInit {
  private readonly logger = new Logger(ImapService.name);
  private imap: Imap;
  private isConnected = false;

  constructor(
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async onModuleInit() {
    await this.connectToImap();
  }

  private async connectToImap() {
    try {
      this.imap = new Imap({
        user: this.configService.get('IMAP_USER'),
        password: this.configService.get('IMAP_PASSWORD'),
        host: this.configService.get('IMAP_HOST'),
        port: parseInt(this.configService.get('IMAP_PORT') || '993'),
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        connTimeout: 60000,
        authTimeout: 5000,
      });

      this.imap.on('ready', () => {
        this.logger.log('IMAP connection established');
        this.isConnected = true;
        this.openInbox();
      });

      this.imap.on('error', (err) => {
        this.logger.error('IMAP error:', err);
        this.isConnected = false;
      });

      this.imap.on('end', () => {
        this.logger.log('IMAP connection ended');
        this.isConnected = false;
      });

      this.imap.connect();
    } catch (error) {
      this.logger.error('Failed to connect to IMAP:', error);
    }
  }

  private openInbox() {
    this.imap.openBox('INBOX', false, (err, box) => {
      if (err) {
        this.logger.error('Error opening inbox:', err);
        return;
      }
      this.logger.log(`Opened inbox: ${box.messages.total} messages`);
    });
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async checkForNewEmails() {
    if (!this.isConnected) {
      this.logger.warn('IMAP not connected, attempting to reconnect...');
      await this.connectToImap();
      return;
    }

    try {
      this.imap.search(['UNSEEN'], (err, results) => {
        if (err) {
          this.logger.error('Error searching for emails:', err);
          return;
        }

        if (results.length === 0) {
          return;
        }

        this.logger.log(`Found ${results.length} new unread emails`);
        this.fetchEmails(results);
      });
    } catch (error) {
      this.logger.error('Error checking for new emails:', error);
    }
  }

  private fetchEmails(uids: number[]) {
    const fetch = this.imap.fetch(uids, {
      bodies: '',
      struct: true,
      markSeen: true,
    });

    fetch.on('message', (msg, seqno) => {
      let buffer = '';
      let attributes: any = {};

      msg.on('body', (stream, info) => {
        stream.on('data', (chunk) => {
          buffer += chunk.toString('utf8');
        });
      });

      msg.once('attributes', (attrs) => {
        attributes = attrs;
      });

      msg.once('end', async () => {
        try {
          const parsed = await simpleParser(buffer);
          await this.processEmail(parsed, attributes);
        } catch (error) {
          this.logger.error('Error parsing email:', error);
        }
      });
    });

    fetch.once('error', (err) => {
      this.logger.error('Fetch error:', err);
    });

    fetch.once('end', () => {
      this.logger.log('Fetch completed');
    });
  }

  private async processEmail(parsed: any, attributes: any) {
    try {
      const emailData = {
        messageId: parsed.messageId || `msg_${Date.now()}`,
        from: parsed.from?.text || '',
        to: parsed.to?.text || '',
        subject: parsed.subject || '',
        date: parsed.date || new Date(),
        headers: parsed.headers,
        text: parsed.text || '',
        html: parsed.html || '',
        isTestEmail: this.isTestEmail(parsed.subject),
        isProcessed: false,
        receivedAt: new Date(),
      };

      // Save raw email
      const savedEmail = await this.emailService.saveEmail(emailData);

      if (savedEmail) {
        // Analyze the email
        const analysis = await this.analyzeEmail(savedEmail);
        if (analysis) {
          this.logger.log(`Email analyzed: ${emailData.subject} - ESP: ${analysis.espType}`);
        }
      }
    } catch (error) {
      this.logger.error('Error processing email:', error);
    }
  }

  private isTestEmail(subject: string): boolean {
    return subject && subject.startsWith('TEST_EMAIL_');
  }

  private async analyzeEmail(email: any) {
    try {
      const startTime = Date.now();
      const headers = email.headers;
      
      // Extract receiving chain from headers
      const receivingChain = this.extractReceivingChain(headers);
      
      // Detect ESP type
      const espAnalysis = this.detectESPType(headers);
      
      const analysis = {
        emailId: email._id,
        messageId: email.messageId,
        from: email.from,
        subject: email.subject,
        receivingChain,
        espType: espAnalysis.type,
        espConfidence: espAnalysis.confidence,
        espIndicators: espAnalysis.indicators,
        analysisMetadata: {
          processingTime: Date.now() - startTime,
          headerCount: Object.keys(headers).length,
          chainLength: receivingChain.length,
        },
        isTestEmail: email.isTestEmail,
        analyzedAt: new Date(),
      };

      return await this.emailService.saveAnalysis(analysis);
    } catch (error) {
      this.logger.error('Error analyzing email:', error);
      return null;
    }
  }

  private extractReceivingChain(headers: any): any[] {
    const chain = [];
    const receivedHeaders = headers['received'] || headers['Received'] || [];
    
    if (Array.isArray(receivedHeaders)) {
      receivedHeaders.forEach((header: string) => {
        const parsed = this.parseReceivedHeader(header);
        if (parsed) {
          chain.push(parsed);
        }
      });
    } else if (typeof receivedHeaders === 'string') {
      const parsed = this.parseReceivedHeader(receivedHeaders);
      if (parsed) {
        chain.push(parsed);
      }
    }

    // Sort by timestamp if available
    return chain.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeA - timeB;
    });
  }

  private parseReceivedHeader(header: string): any {
    try {
      // Basic parsing of Received header
      const match = header.match(/from\s+([^\s]+)\s+\(([^)]+)\)\s+by\s+([^\s]+)\s+with\s+([^\s]+)/i);
      if (match) {
        return {
          server: match[1],
          helo: match[2],
          protocol: match[4],
          timestamp: new Date().toISOString(), // Simplified timestamp
          ip: 'N/A',
        };
      }
      
      // Fallback parsing
      return {
        server: 'Unknown',
        helo: 'Unknown',
        protocol: 'Unknown',
        timestamp: new Date().toISOString(),
        ip: 'N/A',
      };
    } catch (error) {
      return null;
    }
  }

  private detectESPType(headers: any): { type: string; confidence: number; indicators: string[] } {
    const indicators: string[] = [];
    let confidence = 0;
    let espType = 'Unknown';

    // Check for Gmail indicators
    if (headers['x-google-smtp-source'] || headers['x-gm-message-state']) {
      indicators.push('Gmail SMTP headers detected');
      confidence += 40;
      espType = 'Gmail';
    }

    // Check for Outlook/Hotmail indicators
    if (headers['x-ms-has-attach'] || headers['x-ms-exchange-transport-fromentityheader']) {
      indicators.push('Microsoft Exchange headers detected');
      confidence += 40;
      espType = 'Outlook/Hotmail';
    }

    // Check for Amazon SES indicators
    if (headers['x-ses-receipt'] || headers['x-ses-outgoing-token']) {
      indicators.push('Amazon SES headers detected');
      confidence += 40;
      espType = 'Amazon SES';
    }

    // Check for Zoho indicators
    if (headers['x-zoho-virus-scanned'] || headers['x-zoho-authenticated']) {
      indicators.push('Zoho headers detected');
      confidence += 40;
      espType = 'Zoho';
    }

    // Check for SendGrid indicators
    if (headers['x-sg-eid'] || headers['x-sendgrid']) {
      indicators.push('SendGrid headers detected');
      confidence += 40;
      espType = 'SendGrid';
    }

    // Check for Mailgun indicators
    if (headers['x-mailgun-variables'] || headers['x-mailgun-sending-ip']) {
      indicators.push('Mailgun headers detected');
      confidence += 40;
      espType = 'Mailgun';
    }

    // Check for generic SMTP indicators
    if (headers['x-mailer'] || headers['user-agent']) {
      indicators.push('Generic SMTP client detected');
      confidence += 20;
    }

    // Check for custom ESP indicators
    if (headers['x-esp-type'] || headers['x-sending-provider']) {
      indicators.push('Custom ESP headers detected');
      confidence += 30;
    }

    // Normalize confidence to 0-100
    confidence = Math.min(confidence, 100);

    return { type: espType, confidence, indicators };
  }

  async disconnect() {
    if (this.imap && this.isConnected) {
      this.imap.end();
      this.isConnected = false;
    }
  }
}
