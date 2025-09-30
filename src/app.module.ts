import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LeadsModule } from './modules/leads/leads.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { RemindersModule } from './modules/reminders/reminders.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { OpportunitiesModule } from './modules/opportunities/opportunities.module';
import { OptinFormsModule } from './modules/optin-forms/optin-forms.module';
import { RolesModule } from './modules/roles/roles.module';
import { ConfigModule } from '@nestjs/config';
import { InteractionsModule } from './modules/interactions/interactions.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    MongooseModule.forRoot('mongodb+srv://thuongmaidientu:annguyen03@tmdt.m6kzt.mongodb.net/crm?retryWrites=true&w=majority&appName=tmdt'),
    LeadsModule, TasksModule, RemindersModule,
    InteractionsModule,
     CampaignsModule, OpportunitiesModule, 
     OptinFormsModule, RolesModule, AuthModule  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
