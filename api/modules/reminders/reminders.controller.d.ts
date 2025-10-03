import { RemindersService } from './reminders.service';
import { Reminder } from 'src/schemas/reminder.schema';
export declare class RemindersController {
    private readonly service;
    constructor(service: RemindersService);
    findAll(raw: Record<string, any>): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("src/schemas/reminder.schema").ReminderDocument, {}, {}> & Reminder & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    findByUserId(userId: string, raw: Record<string, any>): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("src/schemas/reminder.schema").ReminderDocument, {}, {}> & Reminder & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Reminder>;
    create(body: Partial<Reminder>): Promise<{
        data: import("mongoose").Document<unknown, {}, import("src/schemas/reminder.schema").ReminderDocument, {}, {}> & Reminder & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    update(id: string, body: Partial<Reminder>): Promise<(import("mongoose").Document<unknown, {}, import("src/schemas/reminder.schema").ReminderDocument, {}, {}> & Reminder & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    deleteMany(body: {
        ids: string[];
    }): Promise<{
        deletedCount: number;
    }>;
    delete(id: string): Promise<(import("mongoose").Document<unknown, {}, import("src/schemas/reminder.schema").ReminderDocument, {}, {}> & Reminder & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
