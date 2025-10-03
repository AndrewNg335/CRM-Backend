import { Document, Types } from 'mongoose';
export type CampaignDocument = Campaign & Document;
export declare class Campaign {
    name: string;
    description: string;
    isActive: boolean;
    campaignStatus: string;
    responsibleUserId: Types.ObjectId;
    campaignBudgetCost: number;
    campaignExpectedRevenue: number;
    startDate: Date;
    endDate: Date;
    opportunityCount: number;
    leadCount: number;
}
export declare const CampaignSchema: import("mongoose").Schema<Campaign, import("mongoose").Model<Campaign, any, any, any, Document<unknown, any, Campaign, any, {}> & Campaign & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Campaign, Document<unknown, {}, import("mongoose").FlatRecord<Campaign>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Campaign> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
