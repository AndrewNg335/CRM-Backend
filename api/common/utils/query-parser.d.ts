import { Model, Document } from 'mongoose';
export type ParsedQuery = {
    page: number;
    pageSize: number;
    filter: Record<string, any>;
    sort?: Record<string, 1 | -1>;
};
export declare function parseHttpQueryToMongo(raw: Record<string, any>, options?: {
    textSearchFields?: string[];
    allowedFilterFields?: string[];
    defaultSort?: Record<string, 1 | -1>;
}): ParsedQuery;
export declare function paginateModel<T extends Document>(model: Model<T>, parsed: ParsedQuery, populateFields?: string[]): Promise<{
    items: import("mongoose").IfAny<T, any, Document<unknown, {}, T, {}, {}> & (import("mongoose").Require_id<T> extends infer T_1 ? T_1 extends import("mongoose").Require_id<T> ? T_1 extends {
        __v?: infer U;
    } ? T_1 : T_1 & {
        __v: number;
    } : never : never)>[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}>;
