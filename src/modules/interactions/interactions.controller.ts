import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { parseHttpQueryToMongo } from 'src/common/utils/query-parser';
import { InteractionsService } from './interactions.service';
import { Interaction } from 'src/schemas/interaction.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permissions } from 'src/auth/permissions.decorator';
import { Permissions as PermissionsEnum } from 'src/common/enums/permissions.enum';

@Controller('interactions')
export class InteractionsController {
  constructor(private readonly service: InteractionsService) { }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.CREATE_INTERACTION)
  @Post()
  async create(@Body() body: Partial<Interaction>) {
    return this.service.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_INTERACTIONS)
  @Get()
  async findAll(@Query() raw: Record<string, any>) {
    const parsed = parseHttpQueryToMongo(raw, {
      textSearchFields: ['detail'],
      allowedFilterFields: ['interactionType', 'leadId'],
      defaultSort: { createdAt: -1 },
    });
    const { items, total, page, pageSize, totalPages } = await this.service.findAllParsed(parsed);
    return { data: items, total, page, pageSize, totalPages };
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_SINGLE_INTERACTION)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_LEAD_INTERACTIONS)
  @Get('lead/:leadId')
  async findByLead(@Param('leadId') leadId: string) {
    const data = await this.service.findByLead(leadId);
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.UPDATE_INTERACTION)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<Interaction>) {
    return this.service.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.DELETE_INTERACTION)
  @Delete('bulk')
  async deleteMany(@Body() body: { ids: string[] }) {
    return this.service.deleteMany(body.ids);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.DELETE_INTERACTION)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
