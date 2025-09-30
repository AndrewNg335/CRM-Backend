import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LeadDocument = Lead & Document  & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true }) 
export class Lead extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  status?: string; 

  @Prop()
  gender?: string

  @Prop({ type: Types.ObjectId, ref: 'User', required: true})
  responsibleUserId: Types.ObjectId;

  @Prop()
  source?: string;

  @Prop()
  lastInteractionDate?: Date;

  @Prop()
  note?: string;

  @Prop()
  address?: string;

  @Prop({ default: 0 })
  interactionCount: number;

}

export const LeadSchema = SchemaFactory.createForClass(Lead);
