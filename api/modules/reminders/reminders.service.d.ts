import { Model } from 'mongoose';
import { Reminder, ReminderDocument } from 'src/schemas/reminder.schema';
import { ParsedQuery } from 'src/common/utils/query-parser';
export declare class RemindersService {
    private reminderModel;
    constructor(reminderModel: Model<ReminderDocument>);
    findAllParsed(parsed: ParsedQuery): Promise<{
        items: (import("mongoose").Document<unknown, {}, ReminderDocument, {}, {}> & Reminder & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    count(filter?: any): Promise<number>;
    findOne(id: string): Promise<Reminder>;
    create(data: Partial<Reminder>): Promise<import("mongoose").Document<unknown, {}, ReminderDocument, {}, {}> & Reminder & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(id: string, data: Partial<Reminder>): Promise<(import("mongoose").Document<unknown, {}, ReminderDocument, {}, {}> & Reminder & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    delete(id: string): Promise<(import("mongoose").Document<unknown, {}, ReminderDocument, {}, {}> & Reminder & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    deleteMany(ids: string[]): Promise<{
        deletedCount: number;
    }>;
    findByUserId(userId: string, parsed: ParsedQuery): Promise<{
        items: (import("mongoose").Document<unknown, {}, ReminderDocument, {}, {}> & Reminder & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
}
