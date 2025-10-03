import { Document, Types } from 'mongoose';
import { OpportunityStage } from 'src/common/enums/opportunity.enums';
export type OpportunityDocument = Opportunity & Document;
export declare class Opportunity {
    name: string;
    description: string;
    opportunityStage: OpportunityStage;
    amount: number;
    probability: number;
    leadSource: string;
    isClosed: boolean;
    isWon: boolean;
    nextStep: string;
    leadId: Types.ObjectId;
    campaignId: Types.ObjectId;
    ownerId: Types.ObjectId;
    closeDate: Date;
}
export declare const OpportunitySchema: import("mongoose").Schema<Opportunity, import("mongoose").Model<Opportunity, any, any, any, Document<unknown, any, Opportunity, any, {}> & Opportunity & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Opportunity, Document<unknown, {}, import("mongoose").FlatRecord<Opportunity>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Opportunity> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
