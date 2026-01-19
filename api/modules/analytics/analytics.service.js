"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const lead_schema_1 = require("../../schemas/lead.schema");
const opportunity_schema_1 = require("../../schemas/opportunity.schema");
const task_schema_1 = require("../../schemas/task.schema");
const campaign_schema_1 = require("../../schemas/campaign.schema");
let AnalyticsService = class AnalyticsService {
    leadModel;
    opportunityModel;
    taskModel;
    campaignModel;
    constructor(leadModel, opportunityModel, taskModel, campaignModel) {
        this.leadModel = leadModel;
        this.opportunityModel = opportunityModel;
        this.taskModel = taskModel;
        this.campaignModel = campaignModel;
    }
    async getDashboardStats() {
        const [leadsByStatus, leadsBySource, opportunitiesByStage, tasksByStatus, revenueByMonth, campaignPerformance, conversionRate, totalCounts,] = await Promise.all([
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
    async getTotalCounts() {
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
    async getLeadsByStatus() {
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
    async getLeadsBySource() {
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
    async getOpportunitiesByStage() {
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
    async getTasksByStatus() {
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
    async getRevenueByMonth() {
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
    async getCampaignPerformance() {
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
    async getConversionRate() {
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
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(lead_schema_1.Lead.name)),
    __param(1, (0, mongoose_1.InjectModel)(opportunity_schema_1.Opportunity.name)),
    __param(2, (0, mongoose_1.InjectModel)(task_schema_1.Task.name)),
    __param(3, (0, mongoose_1.InjectModel)(campaign_schema_1.Campaign.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map