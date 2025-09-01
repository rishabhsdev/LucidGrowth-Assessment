import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): string {
    return 'Email Analyzer Backend is running! 🚀';
  }

  getSystemInfo() {
    return {
      service: 'Email Analyzer Backend',
      version: '1.0.0',
      environment: this.configService.get('NODE_ENV') || 'development',
      timestamp: new Date().toISOString(),
      features: [
        'IMAP Email Processing',
        'Receiving Chain Analysis',
        'ESP Type Detection',
        'MongoDB Storage',
        'Real-time Updates'
      ]
    };
  }

  generateTestEmailInfo() {
    // Generate a unique test email address and subject
    const timestamp = Date.now();
    const testEmail = `test-${timestamp}@yourdomain.com`;
    const testSubject = `TEST_EMAIL_${timestamp}`;
    
    return {
      testEmail,
      testSubject,
      instructions: [
        'Send an email to the address above',
        'Use the exact subject line shown',
        'The system will automatically detect and analyze it',
        'Results will appear in real-time on the dashboard'
      ]
    };
  }
}
