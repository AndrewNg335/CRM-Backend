import { Model } from 'mongoose';
import { Interaction, InteractionDocument } from 'src/schemas/interaction.schema';
import { LeadDocument } from 'src/schemas/lead.schema';
import { ParsedQuery } from 'src/common/utils/query-parser';
import { GeminiService } from '../gemini/gemini.service';
export declare class InteractionsService {
    private interactionModel;
    private leadModel;
    private readonly geminiService;
    private readonly logger;
    constructor(interactionModel: Model<InteractionDocument>, leadModel: Model<LeadDocument>, geminiService: GeminiService);
    create(data: Partial<Interaction>): Promise<Interaction>;
    findByLead(leadId: string): Promise<(import("mongoose").Document<unknown, {}, InteractionDocument, {}, {}> & Interaction & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & {
        createdAt: Date;
        updatedAt: Date;
    } & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findAllParsed(parsed: ParsedQuery): Promise<{
        items: (import("mongoose").Document<unknown, {}, InteractionDocument, {}, {}> & Interaction & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & {
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
    update(id: string, data: Partial<Interaction>): Promise<Interaction>;
    delete(id: string): Promise<void>;
    deleteMany(ids: string[]): Promise<{
        deletedCount: number;
    }>;
    transcribeAudio(base64Audio: string, mimeType: string): Promise<{
        success: boolean;
        data: {
            transcript: string;
        };
    }>;
    summarizeTranscript(transcript: string): Promise<{
        success: boolean;
        data: {
            summary: string;
        };
    }>;
}
