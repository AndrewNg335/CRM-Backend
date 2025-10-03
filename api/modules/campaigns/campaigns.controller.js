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
exports.CampaignsController = void 0;
const common_1 = require("@nestjs/common");
const campaigns_service_1 = require("./campaigns.service");
const query_parser_1 = require("../../common/utils/query-parser");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const permissions_decorator_1 = require("../../auth/permissions.decorator");
const permissions_enum_1 = require("../../common/enums/permissions.enum");
let CampaignsController = class CampaignsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async findAll(raw) {
        const parsed = (0, query_parser_1.parseHttpQueryToMongo)(raw, {
            textSearchFields: ['name', 'description'],
            allowedFilterFields: ['campaignStatus', 'isActive'],
            defaultSort: { createdAt: -1 },
        });
        const { items, total, page, pageSize, totalPages } = await this.service.findAllParsed(parsed);
        return { data: items, total, page, pageSize, totalPages };
    }
    async findByResponsibleUser(userId, raw) {
        const parsed = (0, query_parser_1.parseHttpQueryToMongo)(raw, {
            textSearchFields: ['name', 'description'],
            allowedFilterFields: ['campaignStatus', 'isActive'],
            defaultSort: { createdAt: -1 },
        });
        const { items, total, page, pageSize, totalPages } = await this.service.findByResponsibleUser(userId, parsed);
        return { data: items, total, page, pageSize, totalPages };
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    create(body) {
        return this.service.create(body);
    }
    update(id, body) {
        return this.service.update(id, body);
    }
    deleteMany(body) {
        return this.service.deleteMany(body.ids);
    }
    delete(id) {
        return this.service.delete(id);
    }
    addLeadToCampaign(id, leadId) {
        return this.service.addLeadToCampaign(id, leadId);
    }
    removeLeadFromCampaign(id, leadId) {
        return this.service.removeLeadFromCampaign(id, leadId);
    }
    async getLeadsOfCampaign(id, raw) {
        const parsed = (0, query_parser_1.parseHttpQueryToMongo)(raw, {
            textSearchFields: ['name', 'email', 'phone'],
            allowedFilterFields: ['status'],
            defaultSort: { createdAt: -1 },
        });
        const { items, total, page, pageSize, totalPages } = await this.service.getLeadsOfCampaign(id, parsed);
        return { data: items, total, page, pageSize, totalPages };
    }
    async getOpportunitiesOfCampaign(id, raw) {
        const parsed = (0, query_parser_1.parseHttpQueryToMongo)(raw, {
            textSearchFields: ['name'],
            allowedFilterFields: ['status', 'opportunityStage', 'ownerId'],
            defaultSort: { createdAt: -1 },
        });
        const { items, total, page, pageSize, totalPages } = await this.service.getOpportunitiesOfCampaign(id, parsed);
        return { data: items, total, page, pageSize, totalPages };
    }
};
exports.CampaignsController = CampaignsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.VIEW_CAMPAIGNS_ALL),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.VIEW_CAMPAIGNS_SELF),
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "findByResponsibleUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.VIEW_SINGLE_CAMPAIGN),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.CREATE_CAMPAIGN),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.UPDATE_CAMPAIGN),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.DELETE_CAMPAIGN),
    (0, common_1.Delete)('bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "deleteMany", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.DELETE_CAMPAIGN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.MANAGE_CAMPAIGN_LEADS),
    (0, common_1.Post)(':id/leads/:leadId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('leadId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "addLeadToCampaign", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.MANAGE_CAMPAIGN_LEADS),
    (0, common_1.Delete)(':id/leads/:leadId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('leadId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "removeLeadFromCampaign", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.VIEW_CAMPAIGN_LEADS),
    (0, common_1.Get)(':id/leads'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "getLeadsOfCampaign", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.VIEW_CAMPAIGN_OPPORTUNITIES),
    (0, common_1.Get)(':id/opportunities'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "getOpportunitiesOfCampaign", null);
exports.CampaignsController = CampaignsController = __decorate([
    (0, common_1.Controller)('campaigns'),
    __metadata("design:paramtypes", [campaigns_service_1.CampaignsService])
], CampaignsController);
//# sourceMappingURL=campaigns.controller.js.map