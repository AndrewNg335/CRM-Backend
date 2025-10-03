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
exports.RoleController = void 0;
const common_1 = require("@nestjs/common");
const roles_service_1 = require("./roles.service");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const permissions_decorator_1 = require("../../auth/permissions.decorator");
const permissions_enum_1 = require("../../common/enums/permissions.enum");
const query_parser_1 = require("../../common/utils/query-parser");
let RoleController = class RoleController {
    roleService;
    constructor(roleService) {
        this.roleService = roleService;
    }
    createRole(body) {
        return this.roleService.createRole(body);
    }
    async getRoles(raw) {
        const parsed = (0, query_parser_1.parseHttpQueryToMongo)(raw, {
            textSearchFields: ['name'],
            allowedFilterFields: ['permissions'],
            defaultSort: { createdAt: -1 },
        });
        const { items, total, page, pageSize, totalPages } = await this.roleService.getRoles(parsed);
        return { data: items, total, page, pageSize, totalPages };
    }
    getRoleById(id) {
        return this.roleService.getRoleById(id);
    }
    updateRole(id, body) {
        return this.roleService.updateRole(id, body);
    }
    deleteMany(body) {
        return this.roleService.deleteMany(body.ids);
    }
    deleteRole(id) {
        return this.roleService.deleteRole(id);
    }
};
exports.RoleController = RoleController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.CREATE_ROLE),
    (0, common_1.Post)(''),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoleController.prototype, "createRole", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.VIEW_ROLE),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "getRoles", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.VIEW_SINGLE_ROLE),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoleController.prototype, "getRoleById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.UPDATE_ROLE),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RoleController.prototype, "updateRole", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.DELETE_ROLE),
    (0, common_1.Delete)('bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoleController.prototype, "deleteMany", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.DELETE_ROLE),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoleController.prototype, "deleteRole", null);
exports.RoleController = RoleController = __decorate([
    (0, common_1.Controller)('roles'),
    __metadata("design:paramtypes", [roles_service_1.RoleService])
], RoleController);
//# sourceMappingURL=roles.controller.js.map