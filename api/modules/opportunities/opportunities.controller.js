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
exports.OpportunitiesController = void 0;
const common_1 = require("@nestjs/common");
const opportunities_service_1 = require("./opportunities.service");
const query_parser_1 = require("../../common/utils/query-parser");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const permissions_decorator_1 = require("../../auth/permissions.decorator");
const permissions_enum_1 = require("../../common/enums/permissions.enum");
let OpportunitiesController = class OpportunitiesController {
    service;
    constructor(service) {
        this.service = service;
    }
    async findAll(raw) {
        const parsed = (0, query_parser_1.parseHttpQueryToMongo)(raw, {
            textSearchFields: ['name'],
            allowedFilterFields: ['status', 'opportunityStage', 'ownerId', 'isClosed', 'isWon', 'leadId', 'campaignId'],
            defaultSort: { createdAt: -1 },
        });
        const { items, total, page, pageSize, totalPages } = await this.service.findAllParsed(parsed);
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
    async findByOwnerId(ownerId, raw) {
        const parsed = (0, query_parser_1.parseHttpQueryToMongo)(raw, {
            textSearchFields: ['name'],
            allowedFilterFields: ['status', 'opportunityStage', 'isClosed', 'isWon', 'leadId', 'campaignId'],
            defaultSort: { createdAt: -1 },
        });
        const { items, total, page, pageSize, totalPages } = await this.service.findByOwnerId(ownerId, parsed);
        return { data: items, total, page, pageSize, totalPages };
    }
    async getOpportunitiesOfLead(leadId, raw) {
        const parsed = (0, query_parser_1.parseHttpQueryToMongo)(raw, {
            textSearchFields: ['name'],
            allowedFilterFields: ['status', 'opportunityStage', 'ownerId', 'isClosed', 'isWon', 'campaignId'],
            defaultSort: { createdAt: -1 },
        });
        const { items, total, page, pageSize, totalPages } = await this.service.getOpportunitiesOfLead(leadId, parsed);
        return { data: items, total, page, pageSize, totalPages };
    }
};
exports.OpportunitiesController = OpportunitiesController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.VIEW_OPPORTUNITIES_ALL),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OpportunitiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.VIEW_SINGLE_OPPORTUNITY),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OpportunitiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.CREATE_OPPORTUNITY),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OpportunitiesController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.UPDATE_OPPORTUNITY),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OpportunitiesController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.DELETE_OPPORTUNITY),
    (0, common_1.Delete)('bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OpportunitiesController.prototype, "deleteMany", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.DELETE_OPPORTUNITY),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OpportunitiesController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.VIEW_OPPORTUNITIES_SELF),
    (0, common_1.Get)('owner/:ownerId'),
    __param(0, (0, common_1.Param)('ownerId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OpportunitiesController.prototype, "findByOwnerId", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.VIEW_LEAD_OPPORTUNITIES),
    (0, common_1.Get)('lead/:leadId'),
    __param(0, (0, common_1.Param)('leadId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OpportunitiesController.prototype, "getOpportunitiesOfLead", null);
exports.OpportunitiesController = OpportunitiesController = __decorate([
    (0, common_1.Controller)('opportunities'),
    __metadata("design:paramtypes", [opportunities_service_1.OpportunitiesService])
], OpportunitiesController);
//# sourceMappingURL=opportunities.controller.js.map