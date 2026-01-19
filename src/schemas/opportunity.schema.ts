import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OpportunityStage } from 'src/common/enums/opportunity.enums';
import { Lead } from './lead.schema';
import { Campaign } from './campaign.schema';

export type OpportunityDocument = Opportunity & Document;

@Schema({ timestamps: true })
export class Opportunity {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string ;

  @Prop({ enum: OpportunityStage, default: OpportunityStage.QUALIFICATION})
  opportunityStage: OpportunityStage;

  @Prop()
  amount: number;

  @Prop()
  probability: number;

  @Prop({ default: false })
  isClosed: boolean;

  @Prop({ default: false })
  isWon: boolean;

  @Prop()
  nextStep: string;

  @Prop({ type: Types.ObjectId, ref: Lead.name, required: true })
  leadId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Campaign.name})
  campaignId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: Date })
  closeDate: Date;
}

export const OpportunitySchema = SchemaFactory.createForClass(Opportunity);