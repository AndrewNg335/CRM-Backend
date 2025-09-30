import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Lead } from './lead.schema';

export type InteractionDocument = Interaction & Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({ timestamps: true }) 
export class Interaction extends Document {
  @Prop({ required: true })
  interactionType: string;

  @Prop()
  detail: string;

  @Prop({ required: true, type: Types.ObjectId, ref: Lead.name })
  leadId: Types.ObjectId;

}


export const InteractionSchema = SchemaFactory.createForClass(Interaction);
