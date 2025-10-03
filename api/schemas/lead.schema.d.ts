import { Document, Types } from 'mongoose';
export type LeadDocument = Lead & Document & {
    createdAt: Date;
    updatedAt: Date;
};
export declare class Lead extends Document {
    name: string;
    email: string;
    phone: string;
    status?: string;
    gender?: string;
    responsibleUserId: Types.ObjectId;
    source?: string;
    lastInteractionDate?: Date;
    note?: string;
    address?: string;
    interactionCount: number;
}
export declare const LeadSchema: import("mongoose").Schema<Lead, import("mongoose").Model<Lead, any, any, any, Document<unknown, any, Lead, any, {}> & Lead & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Lead, Document<unknown, {}, import("mongoose").FlatRecord<Lead>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Lead> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
