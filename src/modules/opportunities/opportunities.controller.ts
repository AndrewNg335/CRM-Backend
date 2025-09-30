import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Put, UseGuards } from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service';
import { Opportunity } from 'src/schemas/opportunity.schema';
import { parseHttpQueryToMongo } from 'src/common/utils/query-parser';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permissions } from 'src/auth/permissions.decorator';
import { Permissions as PermissionsEnum } from 'src/common/enums/permissions.enum';

@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly service: OpportunitiesService) {}

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_OPPORTUNITIES_ALL)
  @Get()
  async findAll(@Query() raw: Record<string, any>) {
    const parsed = parseHttpQueryToMongo(raw, {
      textSearchFields: ['name'],
      allowedFilterFields: ['status', 'opportunityStage', 'ownerId', 'isClosed', 'isWon', 'leadId', 'campaignId'],
      defaultSort: { createdAt: -1 },
    });
    const { items, total, page, pageSize, totalPages } = await this.service.findAllParsed(parsed);
    return { data: items, total, page, pageSize, totalPages };
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_SINGLE_OPPORTUNITY)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.CREATE_OPPORTUNITY)
  @Post()
  create(@Body() body: Partial<Opportunity>) {
    return this.service.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.UPDATE_OPPORTUNITY)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<Opportunity>) {
    return this.service.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.DELETE_OPPORTUNITY)
  @Delete('bulk')
  deleteMany(@Body() body: { ids: string[] }) {
    return this.service.deleteMany(body.ids);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.DELETE_OPPORTUNITY)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_OPPORTUNITIES_SELF)
  @Get('owner/:ownerId')
  async findByOwnerId(@Param('ownerId') ownerId: string, @Query() raw: Record<string, any>) {
    const parsed = parseHttpQueryToMongo(raw, {
      textSearchFields: ['name'],
      allowedFilterFields: ['status', 'opportunityStage', 'isClosed', 'isWon', 'leadId', 'campaignId'],
      defaultSort: { createdAt: -1 },
    });
    const { items, total, page, pageSize, totalPages } = await this.service.findByOwnerId(ownerId, parsed);
    return { data: items, total, page, pageSize, totalPages };
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_LEAD_OPPORTUNITIES)
  @Get('lead/:leadId')
  async getOpportunitiesOfLead(
    @Param('leadId') leadId: string,
    @Query() raw: Record<string, any>) {
    const parsed = parseHttpQueryToMongo(raw, {
      textSearchFields: ['name'],
      allowedFilterFields: ['status', 'opportunityStage', 'ownerId', 'isClosed', 'isWon', 'campaignId'],
      defaultSort: { createdAt: -1 },
    });

    const { items, total, page, pageSize, totalPages } = await this.service.getOpportunitiesOfLead(leadId, parsed);
    return { data: items, total, page, pageSize, totalPages };
  }
}
