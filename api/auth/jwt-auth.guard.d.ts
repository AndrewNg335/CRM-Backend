import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schemas/user.schema';
export declare class JwtAuthGuard implements CanActivate {
    private jwtService;
    private reflector;
    private userModel;
    constructor(jwtService: JwtService, reflector: Reflector, userModel: Model<UserDocument>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
