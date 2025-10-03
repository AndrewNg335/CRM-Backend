"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const query_parser_1 = require("../../common/utils/query-parser");
const notification_schema_1 = require("../../schemas/notification.schema");
let NotificationsService = class NotificationsService {
    notificationModel;
    constructor(notificationModel) {
        this.notificationModel = notificationModel;
    }
    async create(data) {
        const newNotification = new this.notificationModel(data);
        return newNotification.save();
    }
    async createNotification(userId, title, message, link) {
        const notificationData = {
            userId: new mongoose_2.Types.ObjectId(userId),
            title,
            message,
            link,
            isRead: false,
        };
        return this.create(notificationData);
    }
    async findByUserId(userId, parsed) {
        const filter = { userId: new mongoose_2.Types.ObjectId(userId), ...parsed.filter };
        return (0, query_parser_1.paginateModel)(this.notificationModel, { ...parsed, filter }, ['userId']);
    }
    async findOne(id) {
        const notification = await this.notificationModel
            .findById(id)
            .populate('userId', 'name email')
            .exec();
        if (!notification)
            throw new common_1.NotFoundException('Notification not found');
        return notification;
    }
    async update(id, data) {
        const updated = await this.notificationModel
            .findByIdAndUpdate(id, data, { new: true })
            .populate('userId', 'name email')
            .exec();
        if (!updated)
            throw new common_1.NotFoundException('Notification not found');
        return updated;
    }
    async markAsRead(id) {
        return this.update(id, { isRead: true });
    }
    async markAllAsRead(userId) {
        const result = await this.notificationModel
            .updateMany({ userId: new mongoose_2.Types.ObjectId(userId), isRead: false }, { isRead: true })
            .exec();
        return { modifiedCount: result.modifiedCount };
    }
    async delete(id) {
        const result = await this.notificationModel.findByIdAndDelete(id).exec();
        if (!result)
            throw new common_1.NotFoundException('Notification not found');
    }
    async deleteMany(ids) {
        const result = await this.notificationModel.deleteMany({ _id: { $in: ids } }).exec();
        return { deletedCount: result.deletedCount };
    }
    async getUnreadCount(userId) {
        return this.notificationModel.countDocuments({
            userId: new mongoose_2.Types.ObjectId(userId),
            isRead: false
        }).exec();
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map