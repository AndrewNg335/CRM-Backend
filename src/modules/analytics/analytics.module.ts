import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Lead, LeadSchema } from 'src/schemas/lead.schema';
import { Opportunity, OpportunitySchema } from 'src/schemas/opportunity.schema';
import { Task, TaskSchema } from 'src/schemas/task.schema';
import { Campaign, CampaignSchema } from 'src/schemas/campaign.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lead.name, schema: LeadSchema },
      { name: Opportunity.name, schema: OpportunitySchema },
      { name: Task.name, schema: TaskSchema },
      { name: Campaign.name, schema: CampaignSchema },
    ]),
    AuthModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}