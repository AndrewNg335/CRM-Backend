import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Put, UseGuards } from '@nestjs/common';
import { OptinFormsService } from './optin-forms.service';
import { parseHttpQueryToMongo } from 'src/common/utils/query-parser';
import { OptinForm } from 'src/schemas/optin-form.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permissions } from 'src/auth/permissions.decorator';
import { Permissions as PermissionsEnum } from 'src/common/enums/permissions.enum';

@Controller('optin-forms')
export class OptinFormsController {
  constructor(private readonly service: OptinFormsService) {}

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_OPTIN_FORMS_ALL)
  @Get()
  async findAll(@Query() raw: Record<string, any>) {
    const parsed = parseHttpQueryToMongo(raw, {
      textSearchFields: ['name', 'description'],
      allowedFilterFields: ['isActive', 'campaignId', 'assignedTo'],
      defaultSort: { createdAt: -1 },
    });
    const { items, total, page, pageSize, totalPages } = await this.service.findAllParsed(parsed);
    return { data: items, total, page, pageSize, totalPages };
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_OPTIN_FORMS_SELF)
  @Get('user/:userId')
  async findByAssignedTo(@Param('userId') userId: string, @Query() raw: Record<string, any>) {
    const parsed = parseHttpQueryToMongo(raw, {
      textSearchFields: ['name', 'description'],
      allowedFilterFields: ['isActive', 'campaignId', 'assignedTo'],
      defaultSort: { createdAt: -1 },
    });
    const { items, total, page, pageSize, totalPages } = await this.service.findByAssignedTo(userId, parsed);
    return { data: items, total, page, pageSize, totalPages };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.CREATE_OPTIN_FORM)
  @Post()
  create(@Body() body: Partial<OptinForm>) {
    return this.service.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.UPDATE_OPTIN_FORM)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<OptinForm>) {
    return this.service.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.DELETE_OPTIN_FORM)
  @Delete('bulk')
  deleteMany(@Body() body: { ids: string[] }) {
    return this.service.deleteMany(body.ids);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.DELETE_OPTIN_FORM)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}