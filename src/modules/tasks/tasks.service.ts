import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from 'src/schemas/task.schema';
import { ParsedQuery, paginateModel } from 'src/common/utils/query-parser';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().sort({ dueDate: 1 }).exec();
  }

  async findAllParsed(parsed: ParsedQuery) {
    return paginateModel(this.taskModel, parsed, []);
  }

  async findById(id: string) {
    return this.taskModel.findById(id).exec();
  }
  

  async create(data: Partial<Task>): Promise<Task> {
    const task = new this.taskModel(data);
    return task.save();
  }

  async update(id: string, data: Partial<Task>): Promise<Task> {
    const updated = await this.taskModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('Task not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const result = await this.taskModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Task not found');
  }

  async deleteMany(ids: string[]): Promise<{ deletedCount: number }> {
    const result = await this.taskModel.deleteMany({ _id: { $in: ids } }).exec();
    return { deletedCount: result.deletedCount };
  }

  async find(filter: any, skip: number, limit: number, sort: any) {
    return this.taskModel.find(filter).skip(skip).limit(limit).sort(sort).exec();
  }
  
  async count(filter: any) {
    return this.taskModel.countDocuments(filter).exec();
  }
  
}
