import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop()
  dueDate?: Date;

  @Prop()
  stage?: string; 

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId?: Types.ObjectId;
}



export const TaskSchema = SchemaFactory.createForClass(Task);
