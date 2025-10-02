import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ParsedQuery, paginateModel } from 'src/common/utils/query-parser';
import { Campaign, CampaignDocument } from 'src/schemas/campaign.schema';
import { OpportunityStage } from 'src/common/enums/opportunity.enums';
import { Opportunity, OpportunityDocument } from 'src/schemas/opportunity.schema';

@Injectable()
export class OpportunitiesService {
  constructor(
    @InjectModel(Opportunity.name) private readonly opportunityModel: Model<OpportunityDocument>,
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
  ) { }


  async findAllParsed(parsed: ParsedQuery) {
    return paginateModel(this.opportunityModel, parsed, ["leadId", "campaignId"]);
  }

  async findOne(id: string): Promise<Opportunity> {
    const opp = await this.opportunityModel
      .findById(id)
      .exec();
    if (!opp) throw new NotFoundException('Opportunity not found');
    return opp;
  }

  async create(data: Partial<Opportunity>): Promise<Opportunity> {
    if (data.opportunityStage) {
      if (data.opportunityStage === OpportunityStage.CLOSED_WON) {
        data.isClosed = true;
        data.isWon = true;
      } else if (data.opportunityStage === OpportunityStage.CLOSED_LOST) {
        data.isClosed = true;
        data.isWon = false;
      } else {
        data.isClosed = false;
        data.isWon = false;
      }
    }
    const created = new this.opportunityModel(data);
    const saved = await created.save();

    if (data.campaignId) {
      const opportunityCount = await this.opportunityModel.countDocuments({ campaignId: data.campaignId });
      await this.campaignModel.findByIdAndUpdate(
        data.campaignId,
        { opportunityCount },
        { new: true }
      ).exec();
    }
    return saved;
  }

  async update(id: string, data: Partial<Opportunity>): Promise<Opportunity> {
    const opportunity = await this.opportunityModel.findById(id).exec();
    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }
    if (data.opportunityStage) {
      if (data.opportunityStage === OpportunityStage.CLOSED_WON) {
        data.isClosed = true;
        data.isWon = true;
      } else if (data.opportunityStage === OpportunityStage.CLOSED_LOST) {
        data.isClosed = true;
        data.isWon = false;
      } else {
        data.isClosed = false;
        data.isWon = false;
      }
    }
    const campaignChanged =
      data.campaignId &&
      data.campaignId.toString() !== opportunity.campaignId.toString();

    const updated = await this.opportunityModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();

    if (campaignChanged) {
      await this.refreshOpportunityCount(opportunity.campaignId.toString());
      await this.refreshOpportunityCount(data.campaignId!.toString());
    }

    return updated!;
  }

  async refreshOpportunityCount(campaignId: string) {
    const count = await this.opportunityModel.countDocuments({ campaignId }).exec();
    await this.campaignModel.findByIdAndUpdate(campaignId, { opportunityCount: count }).exec();
  }


  async delete(id: string): Promise<void> {
    const opp = await this.opportunityModel.findById(id).exec();
    if (!opp) throw new NotFoundException('Opportunity not found');
    await this.opportunityModel.findByIdAndDelete(id).exec();
  
    if (opp.campaignId) {
      const opportunityCount = await this.opportunityModel.countDocuments({ campaignId: opp.campaignId });
      await this.campaignModel.findByIdAndUpdate(
        opp.campaignId,
        { opportunityCount },
        { new: true }
      ).exec();
    }
  }

  async deleteMany(ids: string[]): Promise<{ deletedCount: number }> {
    const opportunities = await this.opportunityModel.find({ _id: { $in: ids } }).exec();
    if (opportunities.length === 0) {
      return { deletedCount: 0 };
    }

    const opportunitiesByCampaign = new Map<string, any[]>();
    for (const opportunity of opportunities) {
      if (opportunity.campaignId) {
        const campaignId = opportunity.campaignId.toString();
        if (!opportunitiesByCampaign.has(campaignId)) {
          opportunitiesByCampaign.set(campaignId, []);
        }
        opportunitiesByCampaign.get(campaignId)!.push(opportunity);
      }
    }

    const result = await this.opportunityModel.deleteMany({ _id: { $in: ids } }).exec();

    for (const [campaignId, deletedOpportunities] of opportunitiesByCampaign) {
      const opportunityCount = await this.opportunityModel.countDocuments({ campaignId }).exec();
      await this.campaignModel.findByIdAndUpdate(
        campaignId,
        { opportunityCount },
        { new: true }
      ).exec();
    }

    return { deletedCount: result.deletedCount };
  }
  
  async getOpportunitiesOfLead(
    leadId: string,
    parsed: ParsedQuery
  ) {
    const extendedParsed = {
      ...parsed,
      filter: { ...parsed.filter, leadId }
    };
    
    return paginateModel(this.opportunityModel, extendedParsed, ["leadId", "campaignId"]);
  }

  async findByOwnerId(ownerId: string, parsed: ParsedQuery) {
    const filter = { ownerId, ...parsed.filter };
    return paginateModel(this.opportunityModel, { ...parsed, filter }, ["leadId", "campaignId"]);
  }
}
