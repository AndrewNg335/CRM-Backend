import { Model } from 'mongoose';
import { ParsedQuery } from 'src/common/utils/query-parser';
import { CampaignLead, CampaignLeadDocument } from 'src/schemas/campaign-lead.schema';
import { Campaign, CampaignDocument } from 'src/schemas/campaign.schema';
import { Opportunity, OpportunityDocument } from 'src/schemas/opportunity.schema';
export declare class CampaignsService {
    private campaignModel;
    private campaignLeadModel;
    private opportunityModel;
    constructor(campaignModel: Model<CampaignDocument>, campaignLeadModel: Model<CampaignLeadDocument>, opportunityModel: Model<OpportunityDocument>);
    findAllParsed(parsed: ParsedQuery): Promise<{
        items: (import("mongoose").Document<unknown, {}, CampaignDocument, {}, {}> & Campaign & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
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
    create(data: Partial<Campaign>): Promise<Campaign>;
    update(id: string, data: Partial<Campaign>): Promise<Campaign>;
    delete(id: string): Promise<void>;
    deleteMany(ids: string[]): Promise<{
        deletedCount: number;
    }>;
    addLeadToCampaign(campaignId: string, leadId: string): Promise<CampaignLead>;
    getLeadsOfCampaign(campaignId: string, parsed: ParsedQuery): Promise<{
        items: any[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    getOpportunitiesOfCampaign(campaignId: string, parsed: ParsedQuery): Promise<{
        items: (import("mongoose").Document<unknown, {}, OpportunityDocument, {}, {}> & Opportunity & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    removeLeadFromCampaign(campaignId: string, leadId: string): Promise<void>;
    findByResponsibleUser(responsibleUserId: string, parsed: ParsedQuery): Promise<{
        items: (import("mongoose").Document<unknown, {}, CampaignDocument, {}, {}> & Campaign & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
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
