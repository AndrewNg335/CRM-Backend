import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ParsedQuery, paginateModel } from 'src/common/utils/query-parser';
import { OptinForm, OptinFormDocument } from 'src/schemas/optin-form.schema';

@Injectable()
export class OptinFormsService {
  constructor(
    @InjectModel(OptinForm.name) private readonly optinFormModel: Model<OptinFormDocument>,
  ) { }

  async findAllParsed(parsed: ParsedQuery) {
    return paginateModel(this.optinFormModel, parsed, []);
  }

  async findOne(id: string): Promise<OptinForm> {
    const form = await this.optinFormModel
      .findById(id)
      .populate('campaignId')
      .populate('assignedTo')
      .exec();
    if (!form) throw new NotFoundException('OptinForm not found');
    return form;
  }

  async create(data: Partial<OptinForm>): Promise<OptinForm> {
    const created = new this.optinFormModel(data);
    return created.save();
  }

  async update(id: string, data: Partial<OptinForm>): Promise<OptinFormDocument> {
    const updated = await this.optinFormModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('OptinForm not found');
    return updated;
  }
  async delete(id: string): Promise<void> {
    const result = await this.optinFormModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Optin-form not found');
  }

  async deleteMany(ids: string[]): Promise<{ deletedCount: number }> {
    const result = await this.optinFormModel.deleteMany({ _id: { $in: ids } }).exec();
    return { deletedCount: result.deletedCount };
  }
  
  async findByAssignedTo(assignedTo: string, parsed: ParsedQuery) {
    const extendedParsed = {
      ...parsed,
      filter: { ...parsed.filter, assignedTo },
    };
    return paginateModel(this.optinFormModel, extendedParsed, ['campaignId']);
  }
}