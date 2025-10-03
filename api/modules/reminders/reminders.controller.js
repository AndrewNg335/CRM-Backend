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
exports.RemindersController = void 0;
const common_1 = require("@nestjs/common");
const reminders_service_1 = require("./reminders.service");
const query_parser_1 = require("../../common/utils/query-parser");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const permissions_decorator_1 = require("../../auth/permissions.decorator");
const permissions_enum_1 = require("../../common/enums/permissions.enum");
let RemindersController = class RemindersController {
    service;
    constructor(service) {
        this.service = service;
    }
    async findAll(raw) {
        const parsed = (0, query_parser_1.parseHttpQueryToMongo)(raw, {
            textSearchFields: ['title', 'detail'],
            allowedFilterFields: ['priority', 'reminderStatus', 'leadId', 'timeReminder'],
            defaultSort: { createdAt: -1 },
        });
        const { items, total, page, pageSize, totalPages } = await this.service.findAllParsed(parsed);
        return { data: items, total, page, pageSize, totalPages };
    }
    async findByUserId(userId, raw) {
        const parsed = (0, query_parser_1.parseHttpQueryToMongo)(raw, {
            textSearchFields: ['title', 'detail'],
            allowedFilterFields: ['priority', 'reminderStatus', 'leadId', 'timeReminder'],
            defaultSort: { createdAt: -1 },
        });
        const { items, total, page, pageSize, totalPages } = await this.service.findByUserId(userId, parsed);
        return { data: items, total, page, pageSize, totalPages };
    }
    async findOne(id) {
        return this.service.findOne(id);
    }
    async create(body) {
        const data = await this.service.create(body);
        return { data };
    }
    async update(id, body) {
        return this.service.update(id, body);
    }
    async deleteMany(body) {
        return this.service.deleteMany(body.ids);
    }
    async delete(id) {
        return this.service.delete(id);
    }
};
exports.RemindersController = RemindersController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.VIEW_REMINDERS_ALL),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RemindersController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.VIEW_REMINDERS_SELF),
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RemindersController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.VIEW_SINGLE_REMINDER),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RemindersController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.CREATE_REMINDER),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RemindersController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.UPDATE_REMINDER),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RemindersController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.DELETE_REMINDER),
    (0, common_1.Delete)('bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RemindersController.prototype, "deleteMany", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.DELETE_REMINDER),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RemindersController.prototype, "delete", null);
exports.RemindersController = RemindersController = __decorate([
    (0, common_1.Controller)('reminders'),
    __metadata("design:paramtypes", [reminders_service_1.RemindersService])
], RemindersController);
//# sourceMappingURL=reminders.controller.js.map