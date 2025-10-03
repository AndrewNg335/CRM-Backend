import { InteractionsService } from './interactions.service';
import { Interaction } from 'src/schemas/interaction.schema';
export declare class InteractionsController {
    private readonly service;
    constructor(service: InteractionsService);
    create(body: Partial<Interaction>): Promise<Interaction>;
    findAll(raw: Record<string, any>): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("src/schemas/interaction.schema").InteractionDocument, {}, {}> & Interaction & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & {
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
    findOne(id: string): Promise<Interaction>;
    findByLead(leadId: string): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("src/schemas/interaction.schema").InteractionDocument, {}, {}> & Interaction & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & {
            createdAt: Date;
            updatedAt: Date;
        } & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
    }>;
    update(id: string, body: Partial<Interaction>): Promise<Interaction>;
    deleteMany(body: {
        ids: string[];
    }): Promise<{
        deletedCount: number;
    }>;
    delete(id: string): Promise<void>;
}
