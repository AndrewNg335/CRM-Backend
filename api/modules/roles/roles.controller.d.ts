import { RoleService } from './roles.service';
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
    createRole(body: {
        name: string;
        permissions: string[];
    }): Promise<{
        success: boolean;
        message: string;
        role: import("mongoose").Document<unknown, {}, import("../../schemas/role.schema").RoleDocument, {}, {}> & import("../../schemas/role.schema").Role & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    getRoles(raw: Record<string, any>): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../../schemas/role.schema").RoleDocument, {}, {}> & import("../../schemas/role.schema").Role & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    getRoleById(id: string): Promise<{
        success: boolean;
        role: import("mongoose").Document<unknown, {}, import("../../schemas/role.schema").RoleDocument, {}, {}> & import("../../schemas/role.schema").Role & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    updateRole(id: string, body: {
        name?: string;
        permissions?: string[];
    }): Promise<{
        success: boolean;
        message: string;
        role: import("mongoose").Document<unknown, {}, import("../../schemas/role.schema").RoleDocument, {}, {}> & import("../../schemas/role.schema").Role & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    deleteMany(body: {
        ids: string[];
    }): Promise<{
        deletedCount: number;
    }>;
    deleteRole(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
