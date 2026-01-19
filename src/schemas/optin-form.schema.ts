import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Campaign } from './campaign.schema';

export type OptinFormDocument = OptinForm & Document;

@Schema({ timestamps: true })
export class OptinForm {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: Campaign.name })
  campaignId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  assignedTo: Types.ObjectId;

  @Prop({ default: 0 })
  submissionCount: number;
}

export const OptinFormSchema = SchemaFactory.createForClass(OptinForm);