import { Model } from 'mongoose';
import { LeadDocument } from 'src/schemas/lead.schema';
import { OpportunityDocument } from 'src/schemas/opportunity.schema';
import { TaskDocument } from 'src/schemas/task.schema';
import { CampaignDocument } from 'src/schemas/campaign.schema';
export declare class AnalyticsService {
    private leadModel;
    private opportunityModel;
    private taskModel;
    private campaignModel;
    constructor(leadModel: Model<LeadDocument>, opportunityModel: Model<OpportunityDocument>, taskModel: Model<TaskDocument>, campaignModel: Model<CampaignDocument>);
    getDashboardStats(): Promise<{
        leadsByStatus: {
            status: any;
            count: any;
        }[];
        leadsBySource: {
            source: any;
            count: any;
        }[];
        opportunitiesByStage: {
            stage: any;
            count: any;
            totalValue: any;
        }[];
        tasksByStatus: {
            status: any;
            count: any;
        }[];
        revenueByMonth: {
            month: string;
            revenue: any;
            count: any;
        }[];
        campaignPerformance: {
            name: string;
            leadCount: number;
            status: string;
        }[];
        conversionRate: {
            totalLeads: number;
            totalOpportunities: number;
            wonOpportunities: number;
            leadToOpportunityRate: number;
            opportunityToWonRate: number;
        };
        totalCounts: {
            totalLeads: number;
            totalOpportunities: number;
            totalTasks: number;
            totalCampaigns: number;
        };
    }>;
    private getTotalCounts;
    private getLeadsByStatus;
    private getLeadsBySource;
    private getOpportunitiesByStage;
    private getTasksByStatus;
    private getRevenueByMonth;
    private getCampaignPerformance;
    private getConversionRate;
}
