import { OpportunitiesService } from './opportunities.service';
import { Opportunity } from 'src/schemas/opportunity.schema';
export declare class OpportunitiesController {
    private readonly service;
    constructor(service: OpportunitiesService);
    findAll(raw: Record<string, any>): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("src/schemas/opportunity.schema").OpportunityDocument, {}, {}> & Opportunity & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
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
    create(body: Partial<Opportunity>): Promise<Opportunity>;
    update(id: string, body: Partial<Opportunity>): Promise<Opportunity>;
    deleteMany(body: {
        ids: string[];
    }): Promise<{
        deletedCount: number;
    }>;
    delete(id: string): Promise<void>;
    findByOwnerId(ownerId: string, raw: Record<string, any>): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("src/schemas/opportunity.schema").OpportunityDocument, {}, {}> & Opportunity & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    getOpportunitiesOfLead(leadId: string, raw: Record<string, any>): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("src/schemas/opportunity.schema").OpportunityDocument, {}, {}> & Opportunity & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
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
