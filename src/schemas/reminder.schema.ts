import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Priority, ReminderStatus, Repeat } from '../common/enums/reminder.enums';
import { Lead } from './lead.schema';
import { User } from './user.schema';

export type ReminderDocument = Reminder & Document;

@Schema({ timestamps: true }) 
export class Reminder {
  @Prop({ required: true })
  title: string;

  @Prop()
  detail?: string;

  @Prop({ required: true })
  timeReminder: Date;

  @Prop({ type: Types.ObjectId, ref: Lead.name })
  leadId?: Types.ObjectId; 

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId?: Types.ObjectId;

  @Prop({ enum: Repeat, default: Repeat.NEVER })
  repeat?: Repeat;

  @Prop({ enum: Priority, default: Priority.MEDIUM })
  priority?: Priority;

  @Prop({ enum: ReminderStatus, default: ReminderStatus.PENDING })
  reminderStatus?: ReminderStatus;

}

export const ReminderSchema = SchemaFactory.createForClass(Reminder);
