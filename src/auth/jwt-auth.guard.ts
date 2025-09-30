import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    ForbiddenException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Reflector } from '@nestjs/core';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Role } from 'src/schemas/role.schema';
  
  @Injectable()
  export class JwtAuthGuard implements CanActivate {
    constructor(
      private jwtService: JwtService,
      private reflector: Reflector,
      @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const requiredPermissions =
        this.reflector.get<string[]>('permissions', context.getHandler()) || [];
  
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      if (!authHeader) throw new UnauthorizedException('Không có token');
  
      const token = authHeader.split(' ')[1];
      try {
        const decoded = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET,
        });
  
        const user = await this.userModel
          .findById(decoded.id)
          .populate<{ role: Role }>('role');
        if (!user) throw new UnauthorizedException('Không tìm thấy user');
  
        const userPermissions = user.role?.permissions || [];
        const hasPermission = requiredPermissions.every((p) =>
          userPermissions.includes(p),
        );
  
        if (!hasPermission) {
          throw new ForbiddenException('Không có quyền truy cập');
        }
  
        request.user = user; 
        return true;
      } catch (err) {
        throw new UnauthorizedException('Token không hợp lệ: ' + err.message);
      }
    }
  }
  