import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Task, TaskSchema } from 'src/schemas/task.schema';
import { Lead, LeadSchema } from 'src/schemas/lead.schema';
import { Reminder, ReminderSchema } from 'src/schemas/reminder.schema';
import { Campaign, CampaignSchema } from 'src/schemas/campaign.schema';
import { OptinForm, OptinFormSchema } from 'src/schemas/optin-form.schema';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Task.name, schema: TaskSchema },
      { name: Lead.name, schema: LeadSchema },
      { name: Reminder.name, schema: ReminderSchema },
      { name: Campaign.name, schema: CampaignSchema },
      { name: OptinForm.name, schema: OptinFormSchema },
    ]),
    JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          secret: config.get<string>('JWT_SECRET'),
        }),
      }),
  ],
  providers: [AuthService, JwtAuthGuard],
  controllers: [AuthController],
  exports: [JwtModule, MongooseModule, JwtAuthGuard],
})
export class AuthModule {}
