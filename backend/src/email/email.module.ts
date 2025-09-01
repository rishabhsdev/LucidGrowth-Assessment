import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { ImapService } from './imap.service';
import { EmailSchema } from './schemas/email.schema';
import { EmailAnalysisSchema } from './schemas/email-analysis.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Email', schema: EmailSchema },
      { name: 'EmailAnalysis', schema: EmailAnalysisSchema },
    ]),
  ],
  controllers: [EmailController],
  providers: [EmailService, ImapService],
  exports: [EmailService, ImapService],
})
export class EmailModule {}
