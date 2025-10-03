import { Notification } from 'src/schemas/notification.schema';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findMyNotifications(raw: Record<string, any>, req: any): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("src/schemas/notification.schema").NotificationDocument, {}, {}> & Notification & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & {
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
    getUnreadCount(req: any): Promise<{
        count: number;
    }>;
    create(body: Partial<Notification>): Promise<{
        data: Notification;
    }>;
    findOne(id: string): Promise<{
        data: Notification;
    }>;
    update(id: string, body: Partial<Notification>): Promise<{
        data: Notification;
    }>;
    markAsRead(id: string): Promise<{
        data: Notification;
    }>;
    markAllAsRead(req: any): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    removeMany(ids: string[]): Promise<{
        message: string;
    }>;
}
