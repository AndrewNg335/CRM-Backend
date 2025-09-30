import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from 'src/schemas/user.schema';
import { ParsedQuery, paginateModel } from 'src/common/utils/query-parser';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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
}
