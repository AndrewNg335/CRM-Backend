import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: any): Promise<import("../schemas/user.schema").User>;
    login(body: any): Promise<{
        success: boolean;
        token: string;
        user: import("mongoose").Document<unknown, {}, import("../schemas/user.schema").UserDocument, {}, {}> & import("../schemas/user.schema").User & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    viewProfile(req: any): Promise<{
        success: boolean;
        user: any;
    }>;
    adminUpdate(id: string, body: any): Promise<{
        success: boolean;
        message: string;
        user: {
            name: string;
            email: string;
            role: import("mongoose").Types.ObjectId | import("../schemas/role.schema").Role;
            phone: string;
            address: string;
            taskAssignedCount: number;
            leadAssignedCount: number;
            status: string;
            _id: unknown;
            $locals: Record<string, unknown>;
            $op: "save" | "validate" | "remove" | null;
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection;
            db: import("mongoose").Connection;
            errors?: import("mongoose").Error.ValidationError;
            id?: any;
            isNew: boolean;
            schema: import("mongoose").Schema;
            __v: number;
        };
    } | undefined>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/user.schema").UserDocument, {}, {}> & import("../schemas/user.schema").User & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getUsers(raw: Record<string, any>): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../schemas/user.schema").UserDocument, {}, {}> & import("../schemas/user.schema").User & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    userUpdate(id: string, body: any): Promise<{
        success: boolean;
        message: string;
        user: {
            name: string;
            email: string;
            role: import("mongoose").Types.ObjectId | import("../schemas/role.schema").Role;
            phone: string;
            address: string;
            taskAssignedCount: number;
            leadAssignedCount: number;
            status: string;
            _id: unknown;
            $locals: Record<string, unknown>;
            $op: "save" | "validate" | "remove" | null;
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection;
            db: import("mongoose").Connection;
            errors?: import("mongoose").Error.ValidationError;
            id?: any;
            isNew: boolean;
            schema: import("mongoose").Schema;
            __v: number;
        };
    } | undefined>;
    deleteMany(body: {
        ids: string[];
    }): Promise<{
        deletedCount: number;
    }>;
    delete(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
