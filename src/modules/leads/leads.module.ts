import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaign, CampaignSchema } from 'src/schemas/campaign.schema';
import { Lead, LeadSchema } from 'src/schemas/lead.schema';
import { OptinForm, OptinFormSchema } from 'src/schemas/optin-form.schema';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { CampaignLead, CampaignLeadSchema } from 'src/schemas/campaign-lead.schema';
import { Opportunity, OpportunitySchema } from 'src/schemas/opportunity.schema';
import { Reminder, ReminderSchema } from 'src/schemas/reminder.schema';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
      { name: CampaignLead.name, schema: CampaignLeadSchema },
      { name: Lead.name, schema: LeadSchema },
      { name: OptinForm.name, schema: OptinFormSchema },
      { name: Opportunity.name, schema: OpportunitySchema },
      { name: Reminder.name, schema: ReminderSchema },

    ]),
    CampaignsModule,
    AuthModule,
    NotificationsModule
  ], controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule { }