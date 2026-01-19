import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InteractionsService } from './interactions.service';
import { Interaction, InteractionSchema } from 'src/schemas/interaction.schema';
import { InteractionsController } from './interactions.controller';
import { Lead, LeadSchema } from 'src/schemas/lead.schema';
import { AuthModule } from 'src/auth/auth.module';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Interaction.name, schema: InteractionSchema },
    { name: Lead.name, schema: LeadSchema },
  ]),
  AuthModule,
  GeminiModule],
  controllers: [InteractionsController],
  providers: [InteractionsService],
})
export class InteractionsModule {}