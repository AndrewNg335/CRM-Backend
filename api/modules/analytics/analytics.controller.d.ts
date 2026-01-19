import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
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
}
