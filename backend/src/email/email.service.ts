import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Email, EmailDocument } from './schemas/email.schema';
import { EmailAnalysis, EmailAnalysisDocument } from './schemas/email-analysis.schema';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @InjectModel('Email') private emailModel: Model<EmailDocument>,
    @InjectModel('EmailAnalysis') private analysisModel: Model<EmailAnalysisDocument>,
  ) {}

  async saveEmail(emailData: any): Promise<EmailDocument | null> {
    try {
      const email = new this.emailModel(emailData);
      const savedEmail = await email.save();
      this.logger.log(`Email saved: ${emailData.subject}`);
      return savedEmail;
    } catch (error) {
      this.logger.error('Error saving email:', error);
      return null;
    }
  }

  async saveAnalysis(analysisData: any): Promise<EmailAnalysisDocument | null> {
    try {
      const analysis = new this.analysisModel(analysisData);
      const savedAnalysis = await analysis.save();
      
      // Mark email as processed
      await this.emailModel.findByIdAndUpdate(
        analysisData.emailId,
        { isProcessed: true }
      );
      
      this.logger.log(`Analysis saved for email: ${analysisData.subject}`);
      return savedAnalysis;
    } catch (error) {
      this.logger.error('Error saving analysis:', error);
      return null;
    }
  }

  async getAllEmails(limit = 50, skip = 0): Promise<EmailDocument[]> {
    try {
      return await this.emailModel
        .find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .exec();
    } catch (error) {
      this.logger.error('Error fetching emails:', error);
      return [];
    }
  }

  async getAllAnalyses(limit = 50, skip = 0): Promise<EmailAnalysisDocument[]> {
    try {
      return await this.analysisModel
        .find()
        .sort({ analyzedAt: -1 })
        .limit(limit)
        .skip(skip)
        .exec();
    } catch (error) {
      this.logger.error('Error fetching analyses:', error);
      return [];
    }
  }

  async getEmailById(id: string): Promise<EmailDocument | null> {
    try {
      return await this.emailModel.findById(id).exec();
    } catch (error) {
      this.logger.error('Error fetching email by ID:', error);
      return null;
    }
  }

  async getAnalysisById(id: string): Promise<EmailAnalysisDocument | null> {
    try {
      return await this.analysisModel.findById(id).exec();
    } catch (error) {
      this.logger.error('Error fetching analysis by ID:', error);
      return null;
    }
  }

  async getAnalysisByEmailId(emailId: string): Promise<EmailAnalysisDocument | null> {
    try {
      return await this.analysisModel.findOne({ emailId }).exec();
    } catch (error) {
      this.logger.error('Error fetching analysis by email ID:', error);
      return null;
    }
  }

  async getTestEmails(): Promise<EmailDocument[]> {
    try {
      return await this.emailModel
        .find({ isTestEmail: true })
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      this.logger.error('Error fetching test emails:', error);
      return [];
    }
  }

  async getTestAnalyses(): Promise<EmailAnalysisDocument[]> {
    try {
      return await this.analysisModel
        .find({ isTestEmail: true })
        .sort({ analyzedAt: -1 })
        .exec();
    } catch (error) {
      this.logger.error('Error fetching test analyses:', error);
      return [];
    }
  }

  async getEmailStats(): Promise<any> {
    try {
      const totalEmails = await this.emailModel.countDocuments();
      const processedEmails = await this.emailModel.countDocuments({ isProcessed: true });
      const testEmails = await this.emailModel.countDocuments({ isTestEmail: true });
      const totalAnalyses = await this.analysisModel.countDocuments();
      
      return {
        totalEmails,
        processedEmails,
        testEmails,
        totalAnalyses,
        processingRate: totalEmails > 0 ? (processedEmails / totalEmails * 100).toFixed(2) : 0,
      };
    } catch (error) {
      this.logger.error('Error fetching email stats:', error);
      return {
        totalEmails: 0,
        processedEmails: 0,
        testEmails: 0,
        totalAnalyses: 0,
        processingRate: 0,
      };
    }
  }

  async deleteEmail(id: string): Promise<boolean> {
    try {
      await this.emailModel.findByIdAndDelete(id);
      await this.analysisModel.findOneAndDelete({ emailId: id });
      this.logger.log(`Email and analysis deleted: ${id}`);
      return true;
    } catch (error) {
      this.logger.error('Error deleting email:', error);
      return false;
    }
  }

  async clearAllData(): Promise<boolean> {
    try {
      await this.emailModel.deleteMany({});
      await this.analysisModel.deleteMany({});
      this.logger.log('All email data cleared');
      return true;
    } catch (error) {
      this.logger.error('Error clearing email data:', error);
      return false;
    }
  }
}
