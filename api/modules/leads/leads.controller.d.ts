import type { Response } from 'express';
import { Lead } from 'src/schemas/lead.schema';
import { LeadsService } from './leads.service';
export declare class LeadsController {
    private readonly leadsService;
    constructor(leadsService: LeadsService);
    create(body: Partial<Lead>): Promise<Lead>;
    createFromOptinForm(optinFormId: string, body: {
        name: string;
        email: string;
        phone: string;
        note?: string;
    }, res: Response): Promise<any>;
    getStats(): Promise<{
        data: {
            total: number;
            new: number;
            contacting: number;
            converted: number;
            not_interested: number;
        };
    }>;
    findAll(raw: Record<string, any>): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("src/schemas/lead.schema").LeadDocument, {}, {}> & Lead & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & {
            createdAt: Date;
            updatedAt: Date;
        } & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    getStatsByUser(userId: string): Promise<{
        data: {
            total: number;
            new: number;
            contacting: number;
            converted: number;
            not_interested: number;
        };
    }>;
    findByResponsibleUserId(userId: string, raw: Record<string, any>): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("src/schemas/lead.schema").LeadDocument, {}, {}> & Lead & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & {
            createdAt: Date;
            updatedAt: Date;
        } & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    findRemindersOfLead(leadId: string): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../../schemas/reminder.schema").ReminderDocument, {}, {}> & import("../../schemas/reminder.schema").Reminder & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
    }>;
    findOne(id: string): Promise<Lead>;
    update(id: string, body: Partial<Lead>): Promise<Lead>;
    deleteMany(body: {
        ids: string[];
    }): Promise<{
        deletedCount: number;
    }>;
    delete(id: string): Promise<void>;
}
