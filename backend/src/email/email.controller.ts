import { Controller, Get, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { AppService } from '../app.service';

@Controller('api/emails')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly appService: AppService,
  ) {}

  @Get()
  async getAllEmails(
    @Query('limit') limit = 50,
    @Query('skip') skip = 0,
  ) {
    const emails = await this.emailService.getAllEmails(parseInt(limit), parseInt(skip));
    return {
      success: true,
      data: emails,
      count: emails.length,
    };
  }

  @Get('analyses')
  async getAllAnalyses(
    @Query('limit') limit = 50,
    @Query('skip') skip = 0,
  ) {
    const analyses = await this.emailService.getAllAnalyses(parseInt(limit), parseInt(skip));
    return {
      success: true,
      data: analyses,
      count: analyses.length,
    };
  }

  @Get('test')
  async getTestEmails() {
    const emails = await this.emailService.getTestEmails();
    return {
      success: true,
      data: emails,
      count: emails.length,
    };
  }

  @Get('test/analyses')
  async getTestAnalyses() {
    const analyses = await this.emailService.getTestAnalyses();
    return {
      success: true,
      data: analyses,
      count: analyses.length,
    };
  }

  @Get('stats')
  async getEmailStats() {
    const stats = await this.emailService.getEmailStats();
    return {
      success: true,
      data: stats,
    };
  }

  @Get('test-info')
  async getTestEmailInfo() {
    const testInfo = this.appService.generateTestEmailInfo();
    return {
      success: true,
      data: testInfo,
    };
  }

  @Get(':id')
  async getEmailById(@Param('id') id: string) {
    const email = await this.emailService.getEmailById(id);
    if (!email) {
      return {
        success: false,
        message: 'Email not found',
      };
    }
    return {
      success: true,
      data: email,
    };
  }

  @Get(':id/analysis')
  async getEmailAnalysis(@Param('id') id: string) {
    const analysis = await this.emailService.getAnalysisByEmailId(id);
    if (!analysis) {
      return {
        success: false,
        message: 'Analysis not found',
      };
    }
    return {
      success: true,
      data: analysis,
    };
  }

  @Delete(':id')
  async deleteEmail(@Param('id') id: string) {
    const success = await this.emailService.deleteEmail(id);
    if (success) {
      return {
        success: true,
        message: 'Email deleted successfully',
      };
    }
    return {
      success: false,
      message: 'Failed to delete email',
    };
  }

  @Delete('clear/all')
  async clearAllData() {
    const success = await this.emailService.clearAllData();
    if (success) {
      return {
        success: true,
        message: 'All email data cleared successfully',
      };
    }
    return {
      success: false,
      message: 'Failed to clear email data',
    };
  }

  @Post('manual-analysis')
  async manualAnalysis(@Body() emailData: any) {
    try {
      // This endpoint allows manual email analysis for testing
      const savedEmail = await this.emailService.saveEmail(emailData);
      if (savedEmail) {
        // For manual analysis, we'll create a basic analysis
        const analysis = {
          emailId: savedEmail._id,
          messageId: savedEmail.messageId,
          from: savedEmail.from,
          subject: savedEmail.subject,
          receivingChain: [],
          espType: 'Manual Entry',
          espConfidence: 100,
          espIndicators: ['Manually entered email'],
          analysisMetadata: {
            processingTime: 0,
            headerCount: 0,
            chainLength: 0,
          },
          isTestEmail: savedEmail.isTestEmail,
          analyzedAt: new Date(),
        };
        
        const savedAnalysis = await this.emailService.saveAnalysis(analysis);
        return {
          success: true,
          data: {
            email: savedEmail,
            analysis: savedAnalysis,
          },
        };
      }
      return {
        success: false,
        message: 'Failed to save email',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error processing manual analysis',
        error: error.message,
      };
    }
  }
}
