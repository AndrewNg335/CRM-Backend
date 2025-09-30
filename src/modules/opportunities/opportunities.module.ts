import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OpportunitiesService } from './opportunities.service';
import { Opportunity, OpportunitySchema } from 'src/schemas/opportunity.schema';
import { OpportunitiesController } from './opportunities.controller';
import { Campaign, CampaignSchema } from 'src/schemas/campaign.schema';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Opportunity.name, schema: OpportunitySchema },
      { name: Campaign.name, schema: CampaignSchema },
    ]),
    AuthModule,
  ],
  controllers: [OpportunitiesController],
  providers: [OpportunitiesService],
})
export class OpportunitiesModule {}
