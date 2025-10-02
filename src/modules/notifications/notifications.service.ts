import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ParsedQuery, paginateModel } from 'src/common/utils/query-parser';
import { Notification, NotificationDocument } from 'src/schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>
  ) {}

  async create(data: Partial<Notification>): Promise<Notification> {
    const newNotification = new this.notificationModel(data);
    return newNotification.save();
  }

  async createNotification(
    userId: string | Types.ObjectId,
    title: string,
    message: string,
    link?: string
  ): Promise<Notification> {
    const notificationData: Partial<Notification> = {
      userId: new Types.ObjectId(userId),
      title,
      message,
      link,
      isRead: false,
    };
    return this.create(notificationData);
  }

  async findByUserId(userId: string, parsed: ParsedQuery) {
    const filter = { userId: new Types.ObjectId(userId), ...parsed.filter };
    return paginateModel(this.notificationModel, { ...parsed, filter }, ['userId']);
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationModel
      .findById(id)
      .populate('userId', 'name email')
      .exec();
    if (!notification) throw new NotFoundException('Notification not found');
    return notification;
  }

  async update(id: string, data: Partial<Notification>): Promise<Notification> {
    const updated = await this.notificationModel
      .findByIdAndUpdate(id, data, { new: true })
      .populate('userId', 'name email')
      .exec();
    if (!updated) throw new NotFoundException('Notification not found');
    return updated;
  }

  async markAsRead(id: string): Promise<Notification> {
    return this.update(id, { isRead: true });
  }

  async markAllAsRead(userId: string): Promise<{ modifiedCount: number }> {
    const result = await this.notificationModel
      .updateMany(
        { userId: new Types.ObjectId(userId), isRead: false },
        { isRead: true }
      )
      .exec();
    return { modifiedCount: result.modifiedCount };
  }

  async delete(id: string): Promise<void> {
    const result = await this.notificationModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Notification not found');
  }

  async deleteMany(ids: string[]): Promise<{ deletedCount: number }> {
    const result = await this.notificationModel.deleteMany({ _id: { $in: ids } }).exec();
    return { deletedCount: result.deletedCount };
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({
      userId: new Types.ObjectId(userId),
      isRead: false
    }).exec();
  }
}
