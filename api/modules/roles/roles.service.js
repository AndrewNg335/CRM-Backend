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
exports.RoleService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const role_schema_1 = require("../../schemas/role.schema");
const user_schema_1 = require("../../schemas/user.schema");
const query_parser_1 = require("../../common/utils/query-parser");
let RoleService = class RoleService {
    roleModel;
    userModel;
    constructor(roleModel, userModel) {
        this.roleModel = roleModel;
        this.userModel = userModel;
    }
    async createRole(dto) {
        const { name, permissions } = dto;
        if (!name || !permissions) {
            throw new common_1.BadRequestException('Cần có tên và quyền');
        }
        const exists = await this.roleModel.findOne({ name });
        if (exists)
            throw new common_1.ConflictException('Vai trò đã tồn tại');
        const role = new this.roleModel({ name, permissions });
        await role.save();
        return { success: true, message: 'Tạo vai trò thành công', role };
    }
    async getRoles(parsed) {
        return (0, query_parser_1.paginateModel)(this.roleModel, parsed, []);
    }
    async getRoleById(id) {
        const role = await this.roleModel.findById(id);
        if (!role)
            throw new common_1.NotFoundException('Vai trò không tồn tại');
        return { success: true, role };
    }
    async updateRole(id, dto) {
        const role = await this.roleModel.findById(id);
        if (!role)
            throw new common_1.NotFoundException('Vai trò không tồn tại');
        if (dto.name)
            role.name = dto.name;
        if (dto.permissions)
            role.permissions = dto.permissions;
        await role.save();
        return { success: true, message: 'Cập nhật vai trò thành công', role };
    }
    async deleteRole(id) {
        const role = await this.roleModel.findById(id);
        if (!role)
            throw new common_1.NotFoundException('Vai trò không tồn tại');
        const usersWithRole = await this.userModel.find({ role: id });
        if (usersWithRole.length > 0) {
            throw new common_1.BadRequestException('Không thể xóa vai trò đang được sử dụng');
        }
        await this.roleModel.findByIdAndDelete(id);
        return { success: true, message: 'Xóa vai trò thành công' };
    }
    async deleteMany(ids) {
        const rolesInUse = await this.userModel.find({ role: { $in: ids } }).exec();
        if (rolesInUse.length > 0) {
            const roleIdsInUse = [...new Set(rolesInUse.map(u => u.role.toString()))];
            throw new common_1.BadRequestException(`Các vai trò có ID: ${roleIdsInUse.join(', ')} đang được sử dụng bởi người dùng. Không thể xóa.`);
        }
        const result = await this.roleModel.deleteMany({ _id: { $in: ids } }).exec();
        return { deletedCount: result.deletedCount };
    }
};
exports.RoleService = RoleService;
exports.RoleService = RoleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(role_schema_1.Role.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], RoleService);
//# sourceMappingURL=roles.service.js.map