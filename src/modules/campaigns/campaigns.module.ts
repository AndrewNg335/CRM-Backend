import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { Campaign, CampaignSchema } from 'src/schemas/campaign.schema';
import { Lead, LeadSchema } from 'src/schemas/lead.schema';
import { CampaignLead, CampaignLeadSchema } from 'src/schemas/campaign-lead.schema';
import { Opportunity, OpportunitySchema } from 'src/schemas/opportunity.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
      { name: Lead.name, schema: LeadSchema },
      { name: Opportunity.name, schema: OpportunitySchema },
      { name: CampaignLead.name, schema: CampaignLeadSchema },
    ]),
    AuthModule,
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService],
  exports: [CampaignsService],
})
export class CampaignsModule {}
