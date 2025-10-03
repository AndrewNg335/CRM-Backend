import { Document, Types } from 'mongoose';
import { Priority, ReminderStatus, Repeat } from '../common/enums/reminder.enums';
export type ReminderDocument = Reminder & Document;
export declare class Reminder {
    title: string;
    detail?: string;
    timeReminder: Date;
    leadId?: Types.ObjectId;
    userId?: Types.ObjectId;
    repeat?: Repeat;
    priority?: Priority;
    reminderStatus?: ReminderStatus;
}
export declare const ReminderSchema: import("mongoose").Schema<Reminder, import("mongoose").Model<Reminder, any, any, any, Document<unknown, any, Reminder, any, {}> & Reminder & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Reminder, Document<unknown, {}, import("mongoose").FlatRecord<Reminder>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Reminder> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
