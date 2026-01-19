import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Put, UseGuards } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { Reminder } from 'src/schemas/reminder.schema';
import { parseHttpQueryToMongo } from 'src/common/utils/query-parser';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permissions } from 'src/auth/permissions.decorator';
import { Permissions as PermissionsEnum } from 'src/common/enums/permissions.enum';

@Controller('reminders')
export class RemindersController {
  constructor(private readonly service: RemindersService) { }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_REMINDERS_ALL)
  @Get()
  async findAll(@Query() raw: Record<string, any>) {
    const parsed = parseHttpQueryToMongo(raw, {
      textSearchFields: ['title', 'detail'],
      allowedFilterFields: ['priority', 'reminderStatus', 'leadId', 'timeReminder'],
      defaultSort: { createdAt: -1 },
    });
    const { items, total, page, pageSize, totalPages } = await this.service.findAllParsed(parsed);
    return { data: items, total, page, pageSize, totalPages };
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_REMINDERS_SELF)
  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string, @Query() raw: Record<string, any>) {
    const parsed = parseHttpQueryToMongo(raw, {
      textSearchFields: ['title', 'detail'],
      allowedFilterFields: ['priority', 'reminderStatus', 'leadId', 'timeReminder'],
      defaultSort: { createdAt: -1 },
    });
    const { items, total, page, pageSize, totalPages } = await this.service.findByUserId(userId, parsed);
    return { data: items, total, page, pageSize, totalPages };
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_SINGLE_REMINDER)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.CREATE_REMINDER)
  @Post()
  async create(@Body() body: Partial<Reminder>) {
    const data = await this.service.create(body);
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.UPDATE_REMINDER)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<Reminder>) {
    return this.service.update(id, body);
  
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.DELETE_REMINDER)
  @Delete('bulk')
  async deleteMany(@Body() body: { ids: string[] }) {
    return this.service.deleteMany(body.ids);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.DELETE_REMINDER)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}