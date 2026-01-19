import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CampaignDocument = Campaign & Document;

@Schema({ timestamps: true })
export class Campaign {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  campaignStatus: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  responsibleUserId: Types.ObjectId;

  @Prop({ default: 0 })
  campaignBudgetCost: number;

  @Prop({ default: 0 })
  campaignExpectedRevenue: number;

  @Prop()
  startDate: Date; 

  @Prop()
  endDate: Date; 

  @Prop({ default: 0 })
  opportunityCount: number;

  @Prop({ default: 0 })
  leadCount: number;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);