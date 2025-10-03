import { OptinFormsService } from './optin-forms.service';
import { OptinForm } from 'src/schemas/optin-form.schema';
export declare class OptinFormsController {
    private readonly service;
    constructor(service: OptinFormsService);
    findAll(raw: Record<string, any>): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("src/schemas/optin-form.schema").OptinFormDocument, {}, {}> & OptinForm & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    findByAssignedTo(userId: string, raw: Record<string, any>): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("src/schemas/optin-form.schema").OptinFormDocument, {}, {}> & OptinForm & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
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
    create(body: Partial<OptinForm>): Promise<OptinForm>;
    update(id: string, body: Partial<OptinForm>): Promise<import("src/schemas/optin-form.schema").OptinFormDocument>;
    deleteMany(body: {
        ids: string[];
    }): Promise<{
        deletedCount: number;
    }>;
    delete(id: string): Promise<void>;
}
