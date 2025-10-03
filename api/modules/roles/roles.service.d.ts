import { Model } from 'mongoose';
import { Role, RoleDocument } from 'src/schemas/role.schema';
import { UserDocument } from 'src/schemas/user.schema';
import { ParsedQuery } from 'src/common/utils/query-parser';
export declare class RoleService {
    private roleModel;
    private userModel;
    constructor(roleModel: Model<RoleDocument>, userModel: Model<UserDocument>);
    createRole(dto: {
        name: string;
        permissions: string[];
    }): Promise<{
        success: boolean;
        message: string;
        role: import("mongoose").Document<unknown, {}, RoleDocument, {}, {}> & Role & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    getRoles(parsed: ParsedQuery): Promise<{
        items: (import("mongoose").Document<unknown, {}, RoleDocument, {}, {}> & Role & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
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
        role: import("mongoose").Document<unknown, {}, RoleDocument, {}, {}> & Role & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    updateRole(id: string, dto: {
        name?: string;
        permissions?: string[];
    }): Promise<{
        success: boolean;
        message: string;
        role: import("mongoose").Document<unknown, {}, RoleDocument, {}, {}> & Role & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    deleteRole(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteMany(ids: string[]): Promise<{
        deletedCount: number;
    }>;
}
