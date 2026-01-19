import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards
} from '@nestjs/common';
import { parseHttpQueryToMongo } from 'src/common/utils/query-parser';
import { Notification } from 'src/schemas/notification.schema';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my-notifications')
  async findMyNotifications(@Query() raw: Record<string, any>, @Req() req: any) {
    const parsed = parseHttpQueryToMongo(raw, {
        allowedFilterFields: ['isRead'],
        defaultSort: { createdAt: -1 },
      });
    const { items, total, page, pageSize, totalPages } = await this.notificationsService.findByUserId(req.user.id, parsed);
    return { data: items, total, page, pageSize, totalPages };
  }

  @UseGuards(JwtAuthGuard)
  @Get('unread-count')
  async getUnreadCount(@Req() req: any) {
    const count = await this.notificationsService.getUnreadCount(req.user.id);
    return { count };
  }

  @Post()
  async create(@Body() body: Partial<Notification>) {
    const data = await this.notificationsService.create(body);
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.notificationsService.findOne(id);
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: Partial<Notification>) {
    const data = await this.notificationsService.update(id, body);
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/mark-read')
  async markAsRead(@Param('id') id: string) {
    const data = await this.notificationsService.markAsRead(id);
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('mark-all-read')
  async markAllAsRead(@Req() req: any) {
    const result = await this.notificationsService.markAllAsRead(req.user.id);
    return { message: `Marked ${result.modifiedCount} notifications as read` };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.notificationsService.delete(id);
    return { message: 'Notification deleted successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async removeMany(@Body('ids') ids: string[]) {
    const result = await this.notificationsService.deleteMany(ids);
    return { message: `Deleted ${result.deletedCount} notifications` };
  }
}