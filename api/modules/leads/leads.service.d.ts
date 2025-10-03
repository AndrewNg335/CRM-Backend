import { Model } from 'mongoose';
import { ParsedQuery } from 'src/common/utils/query-parser';
import { Lead, LeadDocument } from 'src/schemas/lead.schema';
import { OptinFormDocument } from 'src/schemas/optin-form.schema';
import { CampaignsService } from '../campaigns/campaigns.service';
import { CampaignDocument } from 'src/schemas/campaign.schema';
import { CampaignLeadDocument } from 'src/schemas/campaign-lead.schema';
import { OpportunityDocument } from 'src/schemas/opportunity.schema';
import { Reminder, ReminderDocument } from 'src/schemas/reminder.schema';
import { NotificationsService } from '../notifications/notifications.service';
export declare class LeadsService {
    private leadModel;
    private optinFormModel;
    private campaignModel;
    private opportunityModel;
    private campaignLeadModel;
    private reminderModel;
    private readonly campaignsService;
    private readonly notificationsService;
    constructor(leadModel: Model<LeadDocument>, optinFormModel: Model<OptinFormDocument>, campaignModel: Model<CampaignDocument>, opportunityModel: Model<OpportunityDocument>, campaignLeadModel: Model<CampaignLeadDocument>, reminderModel: Model<ReminderDocument>, campaignsService: CampaignsService, notificationsService: NotificationsService);
    create(data: Partial<Lead>): Promise<Lead>;
    createFormOptinForm(optinFormId: string, payload: {
        name: string;
        email: string;
        phone: string;
        note?: string;
    }): Promise<Lead>;
    findAllParsed(parsed: ParsedQuery): Promise<{
        items: (import("mongoose").Document<unknown, {}, LeadDocument, {}, {}> & Lead & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & {
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
    findRemindersOfLead(leadId: string): Promise<(import("mongoose").Document<unknown, {}, ReminderDocument, {}, {}> & Reminder & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<Lead>;
    update(id: string, data: Partial<Lead>): Promise<Lead>;
    delete(leadId: string): Promise<void>;
    deleteMany(ids: string[]): Promise<{
        deletedCount: number;
    }>;
    findByResponsibleUserId(responsibleUserId: string, parsed: ParsedQuery): Promise<{
        items: (import("mongoose").Document<unknown, {}, LeadDocument, {}, {}> & Lead & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & {
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
}
