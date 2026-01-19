import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from 'src/schemas/role.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { ParsedQuery, paginateModel } from 'src/common/utils/query-parser';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createRole(dto: { name: string; permissions: string[] }) {
    const { name, permissions } = dto;
    if (!name || !permissions) {
      throw new BadRequestException('Cần có tên và quyền');
    }

    const exists = await this.roleModel.findOne({ name });
    if (exists) throw new ConflictException('Vai trò đã tồn tại');

    const role = new this.roleModel({ name, permissions });
    await role.save();
    return { success: true, message: 'Tạo vai trò thành công', role };
  }

  async getRoles(parsed: ParsedQuery) {
    return paginateModel(this.roleModel, parsed, []);
  }

  async getRoleById(id: string) {
    const role = await this.roleModel.findById(id);
    if (!role) throw new NotFoundException('Vai trò không tồn tại');
    return { success: true, role };
  }

  async updateRole(id: string, dto: { name?: string; permissions?: string[] }) {
    const role = await this.roleModel.findById(id);
    if (!role) throw new NotFoundException('Vai trò không tồn tại');

    if (dto.name) role.name = dto.name;
    if (dto.permissions) role.permissions = dto.permissions;

    await role.save();
    return { success: true, message: 'Cập nhật vai trò thành công', role };
  }

  async deleteRole(id: string) {
    const role = await this.roleModel.findById(id);
    if (!role) throw new NotFoundException('Vai trò không tồn tại');

    const usersWithRole = await this.userModel.find({ role: id });
    if (usersWithRole.length > 0) {
      throw new BadRequestException('Không thể xóa vai trò đang được sử dụng');
    }

    await this.roleModel.findByIdAndDelete(id);
    return { success: true, message: 'Xóa vai trò thành công' };
  }

  async deleteMany(ids: string[]): Promise<{ deletedCount: number }> {
    const rolesInUse = await this.userModel.find({ role: { $in: ids } }).exec();
    if (rolesInUse.length > 0) {
      const roleIdsInUse = [...new Set(rolesInUse.map(u => u.role.toString()))];
      throw new BadRequestException(
        `Các vai trò có ID: ${roleIdsInUse.join(', ')} đang được sử dụng bởi người dùng. Không thể xóa.`
      );
    }

    const result = await this.roleModel.deleteMany({ _id: { $in: ids } }).exec();
    return { deletedCount: result.deletedCount };
  }
}