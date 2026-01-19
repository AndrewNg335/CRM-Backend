import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lead, LeadDocument } from 'src/schemas/lead.schema';
import { Opportunity, OpportunityDocument } from 'src/schemas/opportunity.schema';
import { Task, TaskDocument } from 'src/schemas/task.schema';
import { Campaign, CampaignDocument } from 'src/schemas/campaign.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
    @InjectModel(Opportunity.name) private opportunityModel: Model<OpportunityDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
  ) {}

  async getDashboardStats() {
    const [
      leadsByStatus,
      leadsBySource,
      opportunitiesByStage,
      tasksByStatus,
      revenueByMonth,
      campaignPerformance,
      conversionRate,
      totalCounts,
    ] = await Promise.all([
      this.getLeadsByStatus(),
      this.getLeadsBySource(),
      this.getOpportunitiesByStage(),
      this.getTasksByStatus(),
      this.getRevenueByMonth(),
      this.getCampaignPerformance(),
      this.getConversionRate(),
      this.getTotalCounts(),
    ]);

    return {
      leadsByStatus,
      leadsBySource,
      opportunitiesByStage,
      tasksByStatus,
      revenueByMonth,
      campaignPerformance,
      conversionRate,
      totalCounts,
    };
  }

  private async getTotalCounts() {
    const [totalLeads, totalOpportunities, totalTasks, totalCampaigns] = await Promise.all([
      this.leadModel.countDocuments(),
      this.opportunityModel.countDocuments(),
      this.taskModel.countDocuments(),
      this.campaignModel.countDocuments(),
    ]);

    return {
      totalLeads,
      totalOpportunities,
      totalTasks,
      totalCampaigns,
    };
  }

  private async getLeadsByStatus() {
    const result = await this.leadModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return result.map((item) => ({
      status: item._id || 'Không xác định',
      count: item.count,
    }));
  }

  private async getLeadsBySource() {
    const result = await this.leadModel.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return result.map((item) => ({
      source: item._id || 'Không xác định',
      count: item.count,
    }));
  }

  private async getOpportunitiesByStage() {
    const result = await this.opportunityModel.aggregate([
      {
        $group: {
          _id: '$opportunityStage',
          count: { $sum: 1 },
          totalValue: { $sum: '$amount' },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return result.map((item) => ({
      stage: item._id || 'Không xác định',
      count: item.count,
      totalValue: item.totalValue || 0,
    }));
  }

  private async getTasksByStatus() {
    const result = await this.taskModel.aggregate([
      {
        $group: {
          _id: '$stage',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return result.map((item) => ({
      status: item._id || 'Không xác định',
      count: item.count,
    }));
  }

  private async getRevenueByMonth() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const result = await this.opportunityModel.aggregate([
      {
        $match: {
          isWon: true,
          updatedAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$updatedAt' },
            month: { $month: '$updatedAt' },
          },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    return result.map((item) => ({
      month: `${item._id.month}/${item._id.year}`,
      revenue: item.revenue || 0,
      count: item.count,
    }));
  }

  private async getCampaignPerformance() {
    const campaigns = await this.campaignModel
      .find()
      .select('name leadCount campaignStatus')
      .limit(10)
      .sort({ leadCount: -1 })
      .exec();

    return campaigns.map((campaign) => ({
      name: campaign.name,
      leadCount: campaign.leadCount || 0,
      status: campaign.campaignStatus,
    }));
  }

  private async getConversionRate() {
    const totalLeads = await this.leadModel.countDocuments();
    const totalOpportunities = await this.opportunityModel.countDocuments();
    const wonOpportunities = await this.opportunityModel.countDocuments({ stage: 'won' });

    const leadToOpportunityRate = totalLeads > 0 ? (totalOpportunities / totalLeads) * 100 : 0;
    const opportunityToWonRate = totalOpportunities > 0 ? (wonOpportunities / totalOpportunities) * 100 : 0;

    return {
      totalLeads,
      totalOpportunities,
      wonOpportunities,
      leadToOpportunityRate: parseFloat(leadToOpportunityRate.toFixed(2)),
      opportunityToWonRate: parseFloat(opportunityToWonRate.toFixed(2)),
    };
  }
}