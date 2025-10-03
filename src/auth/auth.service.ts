import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Task, TaskDocument } from 'src/schemas/task.schema';
import { Lead, LeadDocument } from 'src/schemas/lead.schema';
import { Reminder, ReminderDocument } from 'src/schemas/reminder.schema';
import { Campaign, CampaignDocument } from 'src/schemas/campaign.schema';
import { OptinForm, OptinFormDocument } from 'src/schemas/optin-form.schema';
import { ParsedQuery, paginateModel } from 'src/common/utils/query-parser';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
    @InjectModel(Reminder.name) private reminderModel: Model<ReminderDocument>,
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
    @InjectModel(OptinForm.name) private optinFormModel: Model<OptinFormDocument>,
    private jwtService: JwtService,
  ) {}

  private createToken(id: string) {
    return this.jwtService.sign({ id });
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).populate('role').exec();
    if (!user) throw new NotFoundException('Không tìm thấy user');
    return user;
  }


    async register(data: Partial<User>): Promise<User> {
    const exists = await this.userModel.findOne({email: data.email});
    if (exists) throw new BadRequestException('Email đã tồn tại');

    if (!data.password) throw new BadRequestException('Password là bắt buộc');
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userModel.create({
      ...data,
      password: hashedPassword,
    });
    return user;
  }

  async login(dto: { email: string; password: string }) {
    const { email, password } = dto;
    const user = await this.userModel.findOne({ email })
      .populate('role');
    if (!user) throw new UnauthorizedException('Không tìm thấy user');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Sai mật khẩu');

    const token = this.createToken(user.id);
    return { success: true, token, user };
  }

  async viewProfile(user: any) {
    if (!user) throw new NotFoundException('Không tìm thấy user');
    return { success: true, user };
  }

  async adminUpdate(userId: string,  data: Partial<User>) {
        const existingUser = await this.userModel.findById(userId);
        if (!existingUser) throw new NotFoundException('Không tìm thấy user');
    
        if (data.email) {
          const emailExists = await this.userModel.findOne({ email: data.email, _id: { $ne: userId } });
          if (emailExists) throw new BadRequestException('Email đã tồn tại');
        }
        const updateData: any = {};
          
        if (data.role !== undefined) updateData.role = data.role;
        if (data.name !== undefined) updateData.name = data.name;
        if (data.phone !== undefined) updateData.phone = data.phone;
        if (data.address !== undefined) updateData.address = data.address;
        if (data.status !== undefined) updateData.status = data.status;

        
        if (data.password && data.password.trim() !== '') {
          updateData.password = await bcrypt.hash(data.password, 10);
        }
        const updatedUser = await this.userModel.findByIdAndUpdate(
          userId,
          updateData,
          { new: true, runValidators: true }
        );
        if (!updatedUser) return;
        const { password, ...userWithoutPassword } = updatedUser.toObject();
        return { success: true, message: 'Cập nhật thông tin thành công', user: userWithoutPassword };
      }
    
  async getUsers(parsed: ParsedQuery) {
    return paginateModel(this.userModel, parsed, ['role']);
  }
    
      async userUpdate(id: string,  data: Partial<User>) {
        const user = await this.userModel.findById(id);
        if (!user) throw new NotFoundException('Không tìm thấy user');
    
        const updateData: any = {};
    
        if (data.name !== undefined) updateData.name = data.name;
        if (data.phone !== undefined) updateData.phone = data.phone;
        if (data.address !== undefined) updateData.address = data.address;
    
        const updatedUser = await this.userModel.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        );
        if (!updatedUser) return;
        const { password, ...userWithoutPassword } = updatedUser.toObject();
        return { success: true, message: 'Cập nhật user thành công', user: userWithoutPassword };
      }

  async delete(userId: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Không tìm thấy user');

    const taskCount = await this.taskModel.countDocuments({ userId }).exec();
    const leadCount = await this.leadModel.countDocuments({ responsibleUserId: userId }).exec();
    const campaignCount = await this.campaignModel.countDocuments({ responsibleUserId: userId }).exec();
    const optinFormCount = await this.optinFormModel.countDocuments({ assignedTo: userId }).exec();

    if (taskCount > 0 || leadCount > 0 || campaignCount > 0 || optinFormCount > 0) {
      const relatedData: string[] = [];
      if (taskCount > 0) relatedData.push(`${taskCount} task(s)`);
      if (leadCount > 0) relatedData.push(`${leadCount} lead(s)`);
      if (campaignCount > 0) relatedData.push(`${campaignCount} campaign(s)`);
      if (optinFormCount > 0) relatedData.push(`${optinFormCount} optin form(s)`);
      
      throw new BadRequestException(
        `Không thể xóa user này vì đang liên kết với: ${relatedData.join(', ')}. Vui lòng xử lý các dữ liệu liên quan trước khi xóa user.`
      );
    }

    await this.userModel.findByIdAndDelete(userId).exec();
  }

  async deleteMany(ids: string[]): Promise<{ deletedCount: number }> {
    const users = await this.userModel.find({ _id: { $in: ids } }).exec();
    if (users.length === 0) {
      return { deletedCount: 0 };
    }

    const relatedDataChecks = await Promise.all([
      this.taskModel.find({ userId: { $in: ids } }).exec(),
      this.leadModel.find({ responsibleUserId: { $in: ids } }).exec(),
      this.campaignModel.find({ responsibleUserId: { $in: ids } }).exec(),
      this.optinFormModel.find({ assignedTo: { $in: ids } }).exec(),
    ]);

    const [tasks, leads, campaigns, optinForms] = relatedDataChecks;

    if (tasks.length > 0 || leads.length > 0 || campaigns.length > 0 || optinForms.length > 0) {
      const userIdsWithRelatedData = new Set<string>();
      
      tasks.forEach(task => task.userId && userIdsWithRelatedData.add(task.userId.toString()));
      leads.forEach(lead => userIdsWithRelatedData.add(lead.responsibleUserId.toString()));
      campaigns.forEach(campaign => userIdsWithRelatedData.add(campaign.responsibleUserId.toString()));
      optinForms.forEach(form => userIdsWithRelatedData.add(form.assignedTo.toString()));

      throw new BadRequestException(
        `Không thể xóa các user có ID: ${Array.from(userIdsWithRelatedData).join(', ')} vì đang có dữ liệu liên quan. Vui lòng xử lý các dữ liệu liên quan trước khi xóa user.`
      );
    }


    const result = await this.userModel.deleteMany({ _id: { $in: ids } }).exec();
    return { deletedCount: result.deletedCount };
  }
}
