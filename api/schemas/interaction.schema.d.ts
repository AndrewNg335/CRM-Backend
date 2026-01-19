import { Document, Types } from 'mongoose';
export type InteractionDocument = Interaction & Document & {
    createdAt: Date;
    updatedAt: Date;
};
export declare class Interaction extends Document {
    interactionType: string;
    detail: string;
    transcript?: string;
    leadId: Types.ObjectId;
}
export declare const InteractionSchema: import("mongoose").Schema<Interaction, import("mongoose").Model<Interaction, any, any, any, Document<unknown, any, Interaction, any, {}> & Interaction & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Interaction, Document<unknown, {}, import("mongoose").FlatRecord<Interaction>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Interaction> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
