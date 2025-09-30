import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Campaign } from './campaign.schema';
import { Lead } from './lead.schema';

export type CampaignLeadDocument = CampaignLead & Document;

@Schema({ timestamps: true })
export class CampaignLead {
  @Prop({ type: Types.ObjectId, ref: Campaign.name, required: true })
  campaignId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Lead.name, required: true })
  leadId: Types.ObjectId;
}

export const CampaignLeadSchema = SchemaFactory.createForClass(CampaignLead);
