import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel, Schema } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reminder, ReminderDocument } from 'src/schemas/reminder.schema';
import { ParsedQuery, paginateModel } from 'src/common/utils/query-parser';

@Injectable()
@Schema({ timestamps: true })
export class RemindersService {
  constructor(
    @InjectModel(Reminder.name) private reminderModel: Model<ReminderDocument>,
  ) {}


  async findAllParsed(parsed: ParsedQuery) {
    return paginateModel(this.reminderModel, parsed, []);
  }

  async count(filter: any = {}) {
    return this.reminderModel.countDocuments(filter).exec();
  }

  async findOne(id: string): Promise<Reminder> {
    const reminder = await this.reminderModel.findById(id).exec();
    if (!reminder) throw new NotFoundException('reminder not found');
    return reminder;
  }

  async create(data: Partial<Reminder>) {
    const reminder = new this.reminderModel(data);
    return reminder.save();
  }

  async update(id: string, data: Partial<Reminder>) {
    return this.reminderModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string) {
    const result = await this.reminderModel.findByIdAndDelete(id).exec();
    return result;
  }

  async deleteMany(ids: string[]): Promise<{ deletedCount: number }> {
    const result = await this.reminderModel.deleteMany({ _id: { $in: ids } }).exec();
    return { deletedCount: result.deletedCount };
  }

  async findByUserId(userId: string, parsed: ParsedQuery) {
    const filter = { userId, ...parsed.filter };
    return paginateModel(this.reminderModel, { ...parsed, filter }, []);
  }

}
