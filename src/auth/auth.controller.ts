import { Body, Controller, Get, Post, Put, Param, Req, UseGuards, Query, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Permissions } from './permissions.decorator';
import { Permissions as PermissionsEnum } from 'src/common/enums/permissions.enum';
import { parseHttpQueryToMongo } from 'src/common/utils/query-parser';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  register(@Body() body) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body) {
    return this.authService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  viewProfile(@Req() req) {
    return this.authService.viewProfile(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.ADMIN_UPDATE_USER)
  @Put('adminUpdate/:id')
  adminUpdate(@Param('id') id: string, @Body() body) {
    return this.authService.adminUpdate(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_SINGLE_USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_USERS)
  @Get()
  async getUsers(@Query() raw: Record<string, any>) {
    const parsed = parseHttpQueryToMongo(raw, {
      textSearchFields: ['name', 'email', 'phone'],
      allowedFilterFields: ['status', 'role'],
      defaultSort: { createdAt: -1 },
    });

    const { items, total, page, pageSize, totalPages } = await this.authService.getUsers(parsed);
    return { data: items, total, page, pageSize, totalPages };
  }

  @UseGuards(JwtAuthGuard)
  @Put('userUpdate/:id')
  userUpdate(@Param('id') id: string, @Body() body) {
    return this.authService.userUpdate(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.DELETE_USER)
  @Delete('bulk')
  async deleteMany(@Body() body: { ids: string[] }) {
    return this.authService.deleteMany(body.ids);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.DELETE_USER)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.authService.delete(id);
    return { success: true, message: 'Xóa user thành công' };
  }
}
