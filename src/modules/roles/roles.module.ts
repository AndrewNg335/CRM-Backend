import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/schemas/role.schema';
import { RoleService } from './roles.service';
import { RoleController } from './roles.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
    ]),
     AuthModule
  ],
  providers: [RoleService],
  controllers: [RoleController],
})
export class RolesModule {}