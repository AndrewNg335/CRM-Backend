import { 
    Body, 
    Controller, 
    Get, 
    Param, 
    Post, 
    Put, 
    Delete, 
    UseGuards,
    Query
  } from '@nestjs/common';
import { RoleService } from './roles.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permissions } from 'src/auth/permissions.decorator';
import { Permissions as PermissionsEnum } from 'src/common/enums/permissions.enum';
import { parseHttpQueryToMongo } from 'src/common/utils/query-parser';
  
  
  @Controller('roles')
  export class RoleController {
    constructor(private readonly roleService: RoleService) {}
  
    @UseGuards(JwtAuthGuard)
    @Permissions(PermissionsEnum.CREATE_ROLE)
    @Post('')
    createRole(@Body() body: { name: string; permissions: string[] }) {
      return this.roleService.createRole(body);
    }
  
    @UseGuards(JwtAuthGuard)
    @Permissions(PermissionsEnum.VIEW_ROLE)
    @Get()
    async getRoles(@Query() raw: Record<string, any>) {
      const parsed = parseHttpQueryToMongo(raw, {
        textSearchFields: ['name'],
        allowedFilterFields: ['permissions'],
        defaultSort: { createdAt: -1 },
      });

      const { items, total, page, pageSize, totalPages } = await this.roleService.getRoles(parsed);
      return { data: items, total, page, pageSize, totalPages };
    }
  
    @UseGuards(JwtAuthGuard)
    @Permissions(PermissionsEnum.VIEW_SINGLE_ROLE)
    @Get(':id')
    getRoleById(@Param('id') id: string) {
      return this.roleService.getRoleById(id);
    }
  
    @UseGuards(JwtAuthGuard)
    @Permissions(PermissionsEnum.UPDATE_ROLE)
    @Put(':id')
    updateRole(
      @Param('id') id: string, 
      @Body() body: { name?: string; permissions?: string[] }
    ) {
      return this.roleService.updateRole(id, body);
    }
  
    @UseGuards(JwtAuthGuard)
    @Permissions(PermissionsEnum.DELETE_ROLE)
    @Delete('bulk')
    deleteMany(@Body() body: { ids: string[] }) {
      return this.roleService.deleteMany(body.ids);
    }

    @UseGuards(JwtAuthGuard)
    @Permissions(PermissionsEnum.DELETE_ROLE)
    @Delete(':id')
    deleteRole(@Param('id') id: string) {
      return this.roleService.deleteRole(id);
    }
  }
  