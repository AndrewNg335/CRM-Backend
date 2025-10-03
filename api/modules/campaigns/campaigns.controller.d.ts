import { CampaignsService } from './campaigns.service';
import { Campaign } from 'src/schemas/campaign.schema';
export declare class CampaignsController {
    private readonly service;
    constructor(service: CampaignsService);
    findAll(raw: Record<string, any>): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("src/schemas/campaign.schema").CampaignDocument, {}, {}> & Campaign & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    findByResponsibleUser(userId: string, raw: Record<string, any>): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("src/schemas/campaign.schema").CampaignDocument, {}, {}> & Campaign & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Campaign>;
    create(body: Partial<Campaign>): Promise<Campaign>;
    update(id: string, body: Partial<Campaign>): Promise<Campaign>;
    deleteMany(body: {
        ids: string[];
    }): Promise<{
        deletedCount: number;
    }>;
    delete(id: string): Promise<void>;
    addLeadToCampaign(id: string, leadId: string): Promise<import("../../schemas/campaign-lead.schema").CampaignLead>;
    removeLeadFromCampaign(id: string, leadId: string): Promise<void>;
    getLeadsOfCampaign(id: string, raw: Record<string, any>): Promise<{
        data: any[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    getOpportunitiesOfCampaign(id: string, raw: Record<string, any>): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../../schemas/opportunity.schema").OpportunityDocument, {}, {}> & import("../../schemas/opportunity.schema").Opportunity & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
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
