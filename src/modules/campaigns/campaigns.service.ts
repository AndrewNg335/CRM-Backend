import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ParsedQuery, paginateModel } from 'src/common/utils/query-parser';
import { CampaignLead, CampaignLeadDocument } from 'src/schemas/campaign-lead.schema';
import { Campaign, CampaignDocument } from 'src/schemas/campaign.schema';
import { Opportunity, OpportunityDocument } from 'src/schemas/opportunity.schema';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
    @InjectModel(CampaignLead.name) private campaignLeadModel: Model<CampaignLeadDocument>,
    @InjectModel(Opportunity.name) private opportunityModel: Model<OpportunityDocument>,
  ) {}

  async findAllParsed(parsed: ParsedQuery) {
    return paginateModel(this.campaignModel, parsed, []);
  }

  async findOne(id: string): Promise<Campaign> {
    const campaign = await this.campaignModel.findById(id).exec();
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async create(data: Partial<Campaign>): Promise<Campaign> {
    const created = new this.campaignModel(data);
    return created.save();
  }

  async update(id: string, data: Partial<Campaign>): Promise<Campaign> {
    const updated = await this.campaignModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('Campaign not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const result = await this.campaignModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Campaign not found');
  }

  async deleteMany(ids: string[]): Promise<{ deletedCount: number }> {
    const result = await this.campaignModel.deleteMany({ _id: { $in: ids } }).exec();
    return { deletedCount: result.deletedCount };
  }

  async addLeadToCampaign(campaignId: string, leadId: string): Promise<CampaignLead>  {
    const exists = await this.campaignLeadModel.findOne({ campaignId, leadId }).exec();
    if (!exists) {
      const link = new this.campaignLeadModel({campaignId,leadId});
      await link.save();

      const leadCount = await this.campaignLeadModel.countDocuments({ campaignId }).exec();
      await this.campaignModel.findByIdAndUpdate(
        campaignId,
        { leadCount },
        { new: true }
      ).exec();

      return link;
    }
    return exists;
  }

  async getLeadsOfCampaign(
    campaignId: string,
    parsed: ParsedQuery
  ) {
    const extendedParsed = {
      ...parsed,
      filter: { ...parsed.filter, campaignId }
    };
    
    const result = await paginateModel(this.campaignLeadModel, extendedParsed, ['leadId']);
    
    return {
      ...result,
      items: result.items.map((cl: any) => cl.leadId),
    };
  }
 async getOpportunitiesOfCampaign(
    campaignId: string,
    parsed: ParsedQuery
  ) {
    const extendedParsed = {
      ...parsed,
      filter: { ...parsed.filter, campaignId }
    };
    
    return paginateModel(this.opportunityModel, extendedParsed, ["leadId", "campaignId"]);
  }
  async removeLeadFromCampaign(campaignId: string, leadId: string): Promise<void> {
    const result = await this.campaignLeadModel.deleteOne({ campaignId, leadId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Lead not found in this campaign');
    }

    const leadCount = await this.campaignLeadModel.countDocuments({ campaignId, leadId }).exec();
    await this.campaignModel.findByIdAndUpdate(
      campaignId,
      { leadCount },
      { new: true }
    ).exec();

  }

	async findByResponsibleUser(responsibleUserId: string, parsed: ParsedQuery) {
		const extendedParsed = {
			...parsed,
			filter: { ...parsed.filter, responsibleUserId }
		};
		return paginateModel(this.campaignModel, extendedParsed, []);
	}

}