import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Put, UseGuards } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { Campaign } from 'src/schemas/campaign.schema';
import { parseHttpQueryToMongo } from 'src/common/utils/query-parser';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permissions } from 'src/auth/permissions.decorator';
import { Permissions as PermissionsEnum } from 'src/common/enums/permissions.enum';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly service: CampaignsService) { }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_CAMPAIGNS_ALL)
  @Get()
  async findAll(@Query() raw: Record<string, any>) {
    const parsed = parseHttpQueryToMongo(raw, {
      textSearchFields: ['name', 'description'],
      allowedFilterFields: ['campaignStatus', 'isActive'],
      defaultSort: { createdAt: -1 },
    });

    const { items, total, page, pageSize, totalPages } = await this.service.findAllParsed(parsed);
    return { data: items, total, page, pageSize, totalPages };
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_CAMPAIGNS_SELF)
  @Get('user/:userId')
  async findByResponsibleUser(@Param('userId') userId: string, @Query() raw: Record<string, any>) {
    const parsed = parseHttpQueryToMongo(raw, {
      textSearchFields: ['name', 'description'],
      allowedFilterFields: ['campaignStatus', 'isActive'],
      defaultSort: { createdAt: -1 },
    });
    const { items, total, page, pageSize, totalPages } = await this.service.findByResponsibleUser(userId, parsed);
    return { data: items, total, page, pageSize, totalPages };
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_SINGLE_CAMPAIGN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.CREATE_CAMPAIGN)
  @Post()
  create(@Body() body: Partial<Campaign>) {
    return this.service.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.UPDATE_CAMPAIGN)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<Campaign>) {
    return this.service.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.DELETE_CAMPAIGN)
  @Delete('bulk')
  deleteMany(@Body() body: { ids: string[] }) {
    return this.service.deleteMany(body.ids);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.DELETE_CAMPAIGN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.MANAGE_CAMPAIGN_LEADS)
  @Post(':id/leads/:leadId')
  addLeadToCampaign(@Param('id') id: string, @Param('leadId') leadId: string) {
    return this.service.addLeadToCampaign(id, leadId);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.MANAGE_CAMPAIGN_LEADS)
  @Delete(':id/leads/:leadId')
  removeLeadFromCampaign(@Param('id') id: string, @Param('leadId') leadId: string) {
    return this.service.removeLeadFromCampaign(id, leadId);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_CAMPAIGN_LEADS)
  @Get(':id/leads')
  async getLeadsOfCampaign(
    @Param('id') id: string,
    @Query() raw: Record<string, any>) {
    const parsed = parseHttpQueryToMongo(raw, {
      textSearchFields: ['name', 'email', 'phone'],
      allowedFilterFields: ['status'],
      defaultSort: { createdAt: -1 },
    });

    const { items, total, page, pageSize, totalPages } = await this.service.getLeadsOfCampaign(id, parsed);
    return { data: items, total, page, pageSize, totalPages };
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_CAMPAIGN_OPPORTUNITIES)
  @Get(':id/opportunities')
  async getOpportunitiesOfCampaign(
    @Param('id') id: string,
    @Query() raw: Record<string, any>) {
    const parsed = parseHttpQueryToMongo(raw, {
      textSearchFields: ['name'],
      allowedFilterFields: ['status', 'opportunityStage', 'ownerId'],
      defaultSort: { createdAt: -1 },
    });

    const { items, total, page, pageSize, totalPages } = await this.service.getOpportunitiesOfCampaign(id, parsed);
    return { data: items, total, page, pageSize, totalPages };
  }

}