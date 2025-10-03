import { Document, Types } from 'mongoose';
export type CampaignLeadDocument = CampaignLead & Document;
export declare class CampaignLead {
    campaignId: Types.ObjectId;
    leadId: Types.ObjectId;
}
export declare const CampaignLeadSchema: import("mongoose").Schema<CampaignLead, import("mongoose").Model<CampaignLead, any, any, any, Document<unknown, any, CampaignLead, any, {}> & CampaignLead & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CampaignLead, Document<unknown, {}, import("mongoose").FlatRecord<CampaignLead>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<CampaignLead> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
