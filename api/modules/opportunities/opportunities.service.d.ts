import { Model } from 'mongoose';
import { ParsedQuery } from 'src/common/utils/query-parser';
import { CampaignDocument } from 'src/schemas/campaign.schema';
import { Opportunity, OpportunityDocument } from 'src/schemas/opportunity.schema';
export declare class OpportunitiesService {
    private readonly opportunityModel;
    private campaignModel;
    constructor(opportunityModel: Model<OpportunityDocument>, campaignModel: Model<CampaignDocument>);
    findAllParsed(parsed: ParsedQuery): Promise<{
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
    findOne(id: string): Promise<Opportunity>;
    create(data: Partial<Opportunity>): Promise<Opportunity>;
    update(id: string, data: Partial<Opportunity>): Promise<Opportunity>;
    refreshOpportunityCount(campaignId: string): Promise<void>;
    delete(id: string): Promise<void>;
    deleteMany(ids: string[]): Promise<{
        deletedCount: number;
    }>;
    getOpportunitiesOfLead(leadId: string, parsed: ParsedQuery): Promise<{
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
    findByOwnerId(ownerId: string, parsed: ParsedQuery): Promise<{
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
}
