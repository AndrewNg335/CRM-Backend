import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { parseHttpQueryToMongo } from 'src/common/utils/query-parser';
import { Lead } from 'src/schemas/lead.schema';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permissions } from 'src/auth/permissions.decorator';
import { Permissions as PermissionsEnum } from 'src/common/enums/permissions.enum';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) { }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.CREATE_LEAD)
  @Post()
  async create(@Body() body: Partial<Lead>) {
    return this.leadsService.create(body);
  }

  @Post('optinForm/:optinFormId')
  async createFromOptinForm(
    @Param('optinFormId') optinFormId: string,
    @Body() body: {
      name: string;
      email: string;
      phone: string;
      note?: string;
    },
    @Res() res: Response,
  ): Promise<any> {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    const lead = await this.leadsService.createFormOptinForm(optinFormId, body);
    return res.json(lead);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_LEADS_ALL)
  @Get()
  async findAll(@Query() raw: Record<string, any>) {
    const parsed = parseHttpQueryToMongo(raw, {
      textSearchFields: ['name', 'email', 'phone'],
      allowedFilterFields: ['status', 'source', 'isClosed', 'responsibleUserId'],
      defaultSort: { createdAt: -1 },
    });

    const { items, total, page, pageSize, totalPages } = await this.leadsService.findAllParsed(parsed);

    return { data: items, total, page, pageSize, totalPages };
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_LEADS_SELF)
  @Get('user/:userId')
  async findByResponsibleUserId(@Param('userId') userId: string, @Query() raw: Record<string, any>) {
    const parsed = parseHttpQueryToMongo(raw, {
      textSearchFields: ['name', 'email', 'phone'],
      allowedFilterFields: ['status', 'source', 'isClosed'],
      defaultSort: { createdAt: -1 },
    });
    const { items, total, page, pageSize, totalPages } = await this.leadsService.findByResponsibleUserId(userId, parsed);
    return { data: items, total, page, pageSize, totalPages };
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_LEAD_REMINDERS)
  @Get('/:id/reminders')
    async findRemindersOfLead(@Param('id') leadId: string) {
    const data = await this.leadsService.findRemindersOfLead(leadId);
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_SINGLE_LEAD)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.UPDATE_LEAD)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<Lead>) {
    return this.leadsService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.DELETE_LEAD)
  @Delete('bulk')
  async deleteMany(@Body() body: { ids: string[] }) {
    return this.leadsService.deleteMany(body.ids);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.DELETE_LEAD)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.leadsService.delete(id);
  }

}