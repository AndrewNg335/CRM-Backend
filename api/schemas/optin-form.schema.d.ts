import { Document, Types } from 'mongoose';
export type OptinFormDocument = OptinForm & Document;
export declare class OptinForm {
    title: string;
    description: string;
    isActive: boolean;
    campaignId: Types.ObjectId;
    assignedTo: Types.ObjectId;
    submissionCount: number;
}
export declare const OptinFormSchema: import("mongoose").Schema<OptinForm, import("mongoose").Model<OptinForm, any, any, any, Document<unknown, any, OptinForm, any, {}> & OptinForm & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OptinForm, Document<unknown, {}, import("mongoose").FlatRecord<OptinForm>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<OptinForm> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
