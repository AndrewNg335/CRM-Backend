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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const core_1 = require("@nestjs/core");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
let JwtAuthGuard = class JwtAuthGuard {
    jwtService;
    reflector;
    userModel;
    constructor(jwtService, reflector, userModel) {
        this.jwtService = jwtService;
        this.reflector = reflector;
        this.userModel = userModel;
    }
    async canActivate(context) {
        const requiredPermissions = this.reflector.get('permissions', context.getHandler()) || [];
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader)
            throw new common_1.UnauthorizedException('Không có token');
        const token = authHeader.split(' ')[1];
        try {
            const decoded = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
            });
            const user = await this.userModel
                .findById(decoded.id)
                .populate('role');
            if (!user)
                throw new common_1.UnauthorizedException('Không tìm thấy user');
            const userPermissions = user.role?.permissions || [];
            const hasPermission = requiredPermissions.every((p) => userPermissions.includes(p));
            if (!hasPermission) {
                throw new common_1.ForbiddenException('Không có quyền truy cập');
            }
            request.user = user;
            return true;
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Token không hợp lệ: ' + err.message);
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        core_1.Reflector,
        mongoose_2.Model])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map