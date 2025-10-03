import { Document, Types } from 'mongoose';
import { Role } from './role.schema';
export type UserDocument = User & Document;
export declare class User {
    name: string;
    email: string;
    password: string;
    role: Types.ObjectId | Role;
    phone: string;
    address: string;
    taskAssignedCount: number;
    leadAssignedCount: number;
    status: string;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
