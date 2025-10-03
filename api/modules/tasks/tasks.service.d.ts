import { Model } from 'mongoose';
import { Task, TaskDocument } from 'src/schemas/task.schema';
import { ParsedQuery } from 'src/common/utils/query-parser';
export declare class TasksService {
    private taskModel;
    constructor(taskModel: Model<TaskDocument>);
    findAll(): Promise<Task[]>;
    findAllParsed(parsed: ParsedQuery): Promise<{
        items: (import("mongoose").Document<unknown, {}, TaskDocument, {}, {}> & Task & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<(import("mongoose").Document<unknown, {}, TaskDocument, {}, {}> & Task & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    create(data: Partial<Task>): Promise<Task>;
    update(id: string, data: Partial<Task>): Promise<Task>;
    delete(id: string): Promise<void>;
    deleteMany(ids: string[]): Promise<{
        deletedCount: number;
    }>;
    find(filter: any, skip: number, limit: number, sort: any): Promise<(import("mongoose").Document<unknown, {}, TaskDocument, {}, {}> & Task & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    count(filter: any): Promise<number>;
    findByUserId(userId: string, parsed: ParsedQuery): Promise<{
        items: (import("mongoose").Document<unknown, {}, TaskDocument, {}, {}> & Task & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
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
