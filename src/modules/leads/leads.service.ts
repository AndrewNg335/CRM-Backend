import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ParsedQuery, paginateModel } from 'src/common/utils/query-parser';
import { Lead, LeadDocument } from 'src/schemas/lead.schema';
import { OptinForm, OptinFormDocument } from 'src/schemas/optin-form.schema';
import { CampaignsService } from '../campaigns/campaigns.service';
import { Campaign, CampaignDocument } from 'src/schemas/campaign.schema';
import { CampaignLead, CampaignLeadDocument } from 'src/schemas/campaign-lead.schema';
import { Opportunity, OpportunityDocument } from 'src/schemas/opportunity.schema';
import { Reminder, ReminderDocument } from 'src/schemas/reminder.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class LeadsService {
  constructor(@InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
  @InjectModel(OptinForm.name) private optinFormModel: Model<OptinFormDocument>,
  @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
  @InjectModel(Opportunity.name) private opportunityModel: Model<OpportunityDocument>,
  @InjectModel(CampaignLead.name) private campaignLeadModel: Model<CampaignLeadDocument>,
  @InjectModel(Reminder.name) private reminderModel: Model<ReminderDocument>,

  private readonly campaignsService: CampaignsService,
  private readonly notificationsService: NotificationsService

  ) { }

  async create(data: Partial<Lead>): Promise<Lead> {
    const newLead = new this.leadModel(data);
    const savedLead = await newLead.save();
    
    if (savedLead.responsibleUserId) {
      await this.notificationsService.createNotification(
        savedLead.responsibleUserId,
        'Lead mới được tạo',
        `Lead "${savedLead.name}" đã được tạo và được gán cho bạn`,
        `/leads/edit/${savedLead._id}`
      );
    }
    
    
    return savedLead;
  }

  async createFormOptinForm(
    optinFormId: string,
    payload: { name: string; email: string; phone: string; note?: string }
  ): Promise<Lead> {
    const optinForm = await this.optinFormModel.findById(optinFormId).exec();
    if (!optinForm) {
      throw new NotFoundException('OptinForm not found');
    }

    const leadData: Partial<Lead> = {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      note: payload.note,
      status: "new",
      responsibleUserId: optinForm.assignedTo,
    };

    const newLead = new this.leadModel(leadData);
    const savedLead = await newLead.save();

    await this.optinFormModel
      .findByIdAndUpdate(optinFormId, { $inc: { submissionCount: 1 } })
      .exec();

    if (optinForm.campaignId) {
      await this.campaignsService.addLeadToCampaign(
        optinForm.campaignId.toString(),
        (savedLead._id as any).toString()
      );
    }

    if (savedLead.responsibleUserId) {
      await this.notificationsService.createNotification(
        savedLead.responsibleUserId,
        'Lead mới từ Optin Form',
        `Lead "${savedLead.name}" đã được tạo từ optin form và được gán cho bạn`,
        `/leads/edit/${savedLead._id}`
      );
    }
    return savedLead;
  }


  async findAllParsed(parsed: ParsedQuery) {
    return paginateModel(this.leadModel, parsed, []);
  }

  async findRemindersOfLead(leadId: string) {
    const result = await this.reminderModel.find({ leadId }).sort({ createdAt: -1 }).exec();
    return result;
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.leadModel.findById(id).exec();
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async update(id: string, data: Partial<Lead>): Promise<Lead> {
    const updated = await this.leadModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('Lead not found');
    return updated;
  }

  async delete(leadId: string): Promise<void> {
    const opportunityCount = await this.opportunityModel.countDocuments({ leadId }).exec();
    if (opportunityCount > 0) {
      throw new BadRequestException(
        `Lead này đang liên kết với ${opportunityCount} cơ hội. Vui lòng xoá hết các cơ hội trước khi xoá lead.`
      );
    }
    await this.leadModel.findByIdAndDelete(leadId).exec();

    const campaignLead = await this.campaignLeadModel.findOne({ leadId }).exec();
    if (!campaignLead) {
      return;
    }

    const campaignId = campaignLead.campaignId;

    const result = await this.campaignLeadModel.deleteOne({ campaignId, leadId }).exec();
    if (result.deletedCount === 0) {
      return;
    }

    const leadCount = await this.campaignLeadModel.countDocuments({ campaignId }).exec();
    await this.campaignModel.findByIdAndUpdate(
      campaignId,
      { leadCount },
      { new: true }
    ).exec();
  }

  async deleteMany(ids: string[]): Promise<{ deletedCount: number }> {
    const leadsWithOpportunities = await this.opportunityModel.find({ leadId: { $in: ids } }).exec();
    if (leadsWithOpportunities.length > 0) {
      const leadIdsWithOpportunities = [...new Set(leadsWithOpportunities.map(o => o.leadId.toString()))];
      throw new BadRequestException(
        `Các lead có ID: ${leadIdsWithOpportunities.join(', ')} đang liên kết với cơ hội. Vui lòng xoá hết các cơ hội trước khi xoá lead.`
      );
    }

    const result = await this.leadModel.deleteMany({ _id: { $in: ids } }).exec();

    const campaignLeads = await this.campaignLeadModel.find({ leadId: { $in: ids } }).exec();
    if (campaignLeads.length > 0) {
      await this.campaignLeadModel.deleteMany({ leadId: { $in: ids } }).exec();
      
      const campaignIds = [...new Set(campaignLeads.map(cl => cl.campaignId.toString()))];
      for (const campaignId of campaignIds) {
        const leadCount = await this.campaignLeadModel.countDocuments({ campaignId }).exec();
        await this.campaignModel.findByIdAndUpdate(
          campaignId,
          { leadCount },
          { new: true }
        ).exec();
      }
    }

    return { deletedCount: result.deletedCount };
  }

  async findByResponsibleUserId(responsibleUserId: string, parsed: ParsedQuery) {
    const filter = { responsibleUserId, ...parsed.filter };
    return paginateModel(this.leadModel, { ...parsed, filter }, []);
  }

}
