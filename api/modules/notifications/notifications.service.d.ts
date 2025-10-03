import { Model, Types } from 'mongoose';
import { ParsedQuery } from 'src/common/utils/query-parser';
import { Notification, NotificationDocument } from 'src/schemas/notification.schema';
export declare class NotificationsService {
    private notificationModel;
    constructor(notificationModel: Model<NotificationDocument>);
    create(data: Partial<Notification>): Promise<Notification>;
    createNotification(userId: string | Types.ObjectId, title: string, message: string, link?: string): Promise<Notification>;
    findByUserId(userId: string, parsed: ParsedQuery): Promise<{
        items: (import("mongoose").Document<unknown, {}, NotificationDocument, {}, {}> & Notification & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & {
            createdAt: Date;
            updatedAt: Date;
        } & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Notification>;
    update(id: string, data: Partial<Notification>): Promise<Notification>;
    markAsRead(id: string): Promise<Notification>;
    markAllAsRead(userId: string): Promise<{
        modifiedCount: number;
    }>;
    delete(id: string): Promise<void>;
    deleteMany(ids: string[]): Promise<{
        deletedCount: number;
    }>;
    getUnreadCount(userId: string): Promise<number>;
}
