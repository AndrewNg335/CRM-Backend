import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { TaskDocument } from 'src/schemas/task.schema';
import { LeadDocument } from 'src/schemas/lead.schema';
import { ReminderDocument } from 'src/schemas/reminder.schema';
import { CampaignDocument } from 'src/schemas/campaign.schema';
import { OptinFormDocument } from 'src/schemas/optin-form.schema';
import { ParsedQuery } from 'src/common/utils/query-parser';
export declare class AuthService {
    private userModel;
    private taskModel;
    private leadModel;
    private reminderModel;
    private campaignModel;
    private optinFormModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, taskModel: Model<TaskDocument>, leadModel: Model<LeadDocument>, reminderModel: Model<ReminderDocument>, campaignModel: Model<CampaignDocument>, optinFormModel: Model<OptinFormDocument>, jwtService: JwtService);
    private createToken;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    register(data: Partial<User>): Promise<User>;
    login(dto: {
        email: string;
        password: string;
    }): Promise<{
        success: boolean;
        token: string;
        user: import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    viewProfile(user: any): Promise<{
        success: boolean;
        user: any;
    }>;
    adminUpdate(userId: string, data: Partial<User>): Promise<{
        success: boolean;
        message: string;
        user: {
            name: string;
            email: string;
            role: Types.ObjectId | import("../schemas/role.schema").Role;
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
    getUsers(parsed: ParsedQuery): Promise<{
        items: (import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    userUpdate(id: string, data: Partial<User>): Promise<{
        success: boolean;
        message: string;
        user: {
            name: string;
            email: string;
            role: Types.ObjectId | import("../schemas/role.schema").Role;
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
    delete(userId: string): Promise<void>;
    deleteMany(ids: string[]): Promise<{
        deletedCount: number;
    }>;
}
