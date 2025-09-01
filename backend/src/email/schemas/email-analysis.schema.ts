import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EmailAnalysisDocument = EmailAnalysis & Document;

@Schema({ timestamps: true })
export class EmailAnalysis {
  @Prop({ type: Types.ObjectId, ref: 'Email', required: true })
  emailId: Types.ObjectId;

  @Prop({ required: true })
  messageId: string;

  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ type: [Object], required: true })
  receivingChain: Array<{
    server: string;
    timestamp: string;
    ip: string;
    helo: string;
    protocol: string;
  }>;

  @Prop({ required: true })
  espType: string;

  @Prop()
  espConfidence: number;

  @Prop({ type: [String] })
  espIndicators: string[];

  @Prop({ type: Object })
  analysisMetadata: {
    processingTime: number;
    headerCount: number;
    chainLength: number;
  };

  @Prop({ default: false })
  isTestEmail: boolean;

  @Prop()
  analyzedAt: Date;
}

export const EmailAnalysisSchema = SchemaFactory.createForClass(EmailAnalysis);
