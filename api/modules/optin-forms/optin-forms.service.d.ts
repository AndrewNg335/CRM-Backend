import { Model } from 'mongoose';
import { ParsedQuery } from 'src/common/utils/query-parser';
import { OptinForm, OptinFormDocument } from 'src/schemas/optin-form.schema';
export declare class OptinFormsService {
    private readonly optinFormModel;
    constructor(optinFormModel: Model<OptinFormDocument>);
    findAllParsed(parsed: ParsedQuery): Promise<{
        items: (import("mongoose").Document<unknown, {}, OptinFormDocument, {}, {}> & OptinForm & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<OptinForm>;
    create(data: Partial<OptinForm>): Promise<OptinForm>;
    update(id: string, data: Partial<OptinForm>): Promise<OptinFormDocument>;
    delete(id: string): Promise<void>;
    deleteMany(ids: string[]): Promise<{
        deletedCount: number;
    }>;
    findByAssignedTo(assignedTo: string, parsed: ParsedQuery): Promise<{
        items: (import("mongoose").Document<unknown, {}, OptinFormDocument, {}, {}> & OptinForm & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
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
