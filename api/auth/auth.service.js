"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const jwt_1 = require("@nestjs/jwt");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const user_schema_1 = require("../schemas/user.schema");
const task_schema_1 = require("../schemas/task.schema");
const lead_schema_1 = require("../schemas/lead.schema");
const reminder_schema_1 = require("../schemas/reminder.schema");
const campaign_schema_1 = require("../schemas/campaign.schema");
const optin_form_schema_1 = require("../schemas/optin-form.schema");
const query_parser_1 = require("../common/utils/query-parser");
let AuthService = class AuthService {
    userModel;
    taskModel;
    leadModel;
    reminderModel;
    campaignModel;
    optinFormModel;
    jwtService;
    constructor(userModel, taskModel, leadModel, reminderModel, campaignModel, optinFormModel, jwtService) {
        this.userModel = userModel;
        this.taskModel = taskModel;
        this.leadModel = leadModel;
        this.reminderModel = reminderModel;
        this.campaignModel = campaignModel;
        this.optinFormModel = optinFormModel;
        this.jwtService = jwtService;
    }
    createToken(id) {
        return this.jwtService.sign({ id });
    }
    async findOne(id) {
        const user = await this.userModel.findById(id).populate('role').exec();
        if (!user)
            throw new common_1.NotFoundException('Không tìm thấy user');
        return user;
    }
    async register(data) {
        const exists = await this.userModel.findOne({ email: data.email });
        if (exists)
            throw new common_1.BadRequestException('Email đã tồn tại');
        if (!data.password)
            throw new common_1.BadRequestException('Password là bắt buộc');
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.userModel.create({
            ...data,
            password: hashedPassword,
        });
        return user;
    }
    async login(dto) {
        const { email, password } = dto;
        const user = await this.userModel.findOne({ email })
            .populate('role');
        if (!user)
            throw new common_1.UnauthorizedException('Không tìm thấy user');
        const match = await bcrypt.compare(password, user.password);
        if (!match)
            throw new common_1.UnauthorizedException('Sai mật khẩu');
        const token = this.createToken(user.id);
        return { success: true, token, user };
    }
    async viewProfile(user) {
        if (!user)
            throw new common_1.NotFoundException('Không tìm thấy user');
        return { success: true, user };
    }
    async adminUpdate(userId, data) {
        const existingUser = await this.userModel.findById(userId);
        if (!existingUser)
            throw new common_1.NotFoundException('Không tìm thấy user');
        if (data.email) {
            const emailExists = await this.userModel.findOne({ email: data.email, _id: { $ne: userId } });
            if (emailExists)
                throw new common_1.BadRequestException('Email đã tồn tại');
        }
        const updateData = {};
        if (data.role !== undefined)
            updateData.role = data.role;
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.phone !== undefined)
            updateData.phone = data.phone;
        if (data.address !== undefined)
            updateData.address = data.address;
        if (data.status !== undefined)
            updateData.status = data.status;
        if (data.password && data.password.trim() !== '') {
            updateData.password = await bcrypt.hash(data.password, 10);
        }
        const updatedUser = await this.userModel.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
        if (!updatedUser)
            return;
        const { password, ...userWithoutPassword } = updatedUser.toObject();
        return { success: true, message: 'Cập nhật thông tin thành công', user: userWithoutPassword };
    }
    async getUsers(parsed) {
        return (0, query_parser_1.paginateModel)(this.userModel, parsed, ['role']);
    }
    async userUpdate(id, data) {
        const user = await this.userModel.findById(id);
        if (!user)
            throw new common_1.NotFoundException('Không tìm thấy user');
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.phone !== undefined)
            updateData.phone = data.phone;
        if (data.address !== undefined)
            updateData.address = data.address;
        const updatedUser = await this.userModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updatedUser)
            return;
        const { password, ...userWithoutPassword } = updatedUser.toObject();
        return { success: true, message: 'Cập nhật user thành công', user: userWithoutPassword };
    }
    async delete(userId) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('Không tìm thấy user');
        const taskCount = await this.taskModel.countDocuments({ userId }).exec();
        const leadCount = await this.leadModel.countDocuments({ responsibleUserId: userId }).exec();
        const campaignCount = await this.campaignModel.countDocuments({ responsibleUserId: userId }).exec();
        const optinFormCount = await this.optinFormModel.countDocuments({ assignedTo: userId }).exec();
        if (taskCount > 0 || leadCount > 0 || campaignCount > 0 || optinFormCount > 0) {
            const relatedData = [];
            if (taskCount > 0)
                relatedData.push(`${taskCount} task(s)`);
            if (leadCount > 0)
                relatedData.push(`${leadCount} lead(s)`);
            if (campaignCount > 0)
                relatedData.push(`${campaignCount} campaign(s)`);
            if (optinFormCount > 0)
                relatedData.push(`${optinFormCount} optin form(s)`);
            throw new common_1.BadRequestException(`Không thể xóa user này vì đang liên kết với: ${relatedData.join(', ')}. Vui lòng xử lý các dữ liệu liên quan trước khi xóa user.`);
        }
        await this.userModel.findByIdAndDelete(userId).exec();
    }
    async deleteMany(ids) {
        const users = await this.userModel.find({ _id: { $in: ids } }).exec();
        if (users.length === 0) {
            return { deletedCount: 0 };
        }
        const relatedDataChecks = await Promise.all([
            this.taskModel.find({ userId: { $in: ids } }).exec(),
            this.leadModel.find({ responsibleUserId: { $in: ids } }).exec(),
            this.campaignModel.find({ responsibleUserId: { $in: ids } }).exec(),
            this.optinFormModel.find({ assignedTo: { $in: ids } }).exec(),
        ]);
        const [tasks, leads, campaigns, optinForms] = relatedDataChecks;
        if (tasks.length > 0 || leads.length > 0 || campaigns.length > 0 || optinForms.length > 0) {
            const userIdsWithRelatedData = new Set();
            tasks.forEach(task => task.userId && userIdsWithRelatedData.add(task.userId.toString()));
            leads.forEach(lead => userIdsWithRelatedData.add(lead.responsibleUserId.toString()));
            campaigns.forEach(campaign => userIdsWithRelatedData.add(campaign.responsibleUserId.toString()));
            optinForms.forEach(form => userIdsWithRelatedData.add(form.assignedTo.toString()));
            throw new common_1.BadRequestException(`Không thể xóa các user có ID: ${Array.from(userIdsWithRelatedData).join(', ')} vì đang có dữ liệu liên quan. Vui lòng xử lý các dữ liệu liên quan trước khi xóa user.`);
        }
        const result = await this.userModel.deleteMany({ _id: { $in: ids } }).exec();
        return { deletedCount: result.deletedCount };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(task_schema_1.Task.name)),
    __param(2, (0, mongoose_1.InjectModel)(lead_schema_1.Lead.name)),
    __param(3, (0, mongoose_1.InjectModel)(reminder_schema_1.Reminder.name)),
    __param(4, (0, mongoose_1.InjectModel)(campaign_schema_1.Campaign.name)),
    __param(5, (0, mongoose_1.InjectModel)(optin_form_schema_1.OptinForm.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map