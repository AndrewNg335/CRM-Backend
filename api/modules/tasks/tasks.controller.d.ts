import { TasksService } from './tasks.service';
import { Task } from 'src/schemas/task.schema';
export declare class TasksController {
    private readonly service;
    constructor(service: TasksService);
    findAll(raw: Record<string, any>): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("src/schemas/task.schema").TaskDocument, {}, {}> & Task & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    findByUserId(userId: string, raw: Record<string, any>): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("src/schemas/task.schema").TaskDocument, {}, {}> & Task & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    create(body: Partial<Task>): Promise<{
        data: Task;
    }>;
    findOne(id: string): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("src/schemas/task.schema").TaskDocument, {}, {}> & Task & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }) | null;
    }>;
    update(id: string, body: Partial<Task>): Promise<{
        data: Task;
    }>;
    deleteMany(body: {
        ids: string[];
    }): Promise<{
        deletedCount: number;
    }>;
    delete(id: string): Promise<void>;
}
