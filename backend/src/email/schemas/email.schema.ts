import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmailDocument = Email & Document;

@Schema({ timestamps: true })
export class Email {
  @Prop({ required: true })
  messageId: string;

  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop({ required: true })
  subject: string;

  @Prop()
  date: Date;

  @Prop({ type: Object })
  headers: Record<string, any>;

  @Prop({ type: String })
  text: string;

  @Prop({ type: String })
  html: string;

  @Prop({ default: false })
  isTestEmail: boolean;

  @Prop({ default: false })
  isProcessed: boolean;

  @Prop()
  receivedAt: Date;
}

export const EmailSchema = SchemaFactory.createForClass(Email);
