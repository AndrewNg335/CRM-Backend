import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Interaction, InteractionDocument } from 'src/schemas/interaction.schema';
import { Lead, LeadDocument } from 'src/schemas/lead.schema';
import { ParsedQuery, paginateModel } from 'src/common/utils/query-parser';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class InteractionsService {
  private readonly logger = new Logger(InteractionsService.name);

  constructor(
    @InjectModel(Interaction.name) private interactionModel: Model<InteractionDocument>, 
    @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
    private readonly geminiService: GeminiService,
  ) {}

  async create(data: Partial<Interaction>): Promise<Interaction> {
    const newInteraction = new this.interactionModel(data);
    await newInteraction.save();
    
    const interactionCount = await this.interactionModel.countDocuments({ leadId: data.leadId }).exec();
    await this.leadModel.findByIdAndUpdate(
      data.leadId, 
      {interactionCount },
      { new: true }
    )
    return newInteraction;

  }

  async findByLead(leadId: string) {
    const result = await this.interactionModel.find({ leadId }).sort({ createdAt: -1 }).exec();
    return result;
  }

  async findAllParsed(parsed: ParsedQuery) {
    return paginateModel(this.interactionModel, parsed, []);
  }

  async findOne(id: string): Promise<Interaction> {
    const interaction = await this.interactionModel.findById(id).exec();
    if (!interaction) throw new NotFoundException('interaction not found');
    return interaction;
  }

  async update(id: string, data: Partial<Interaction>): Promise<Interaction> {
    const updated = await this.interactionModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('interaction not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const interaction = await this.interactionModel.findById(id);
    if (!interaction) throw new NotFoundException('Interaction not found');
  
    const leadId = interaction.leadId;

    await this.interactionModel.findByIdAndDelete(id);

    const lead = await this.leadModel.findById(leadId);
    if (!lead) throw new NotFoundException('Lead not found');

  const remainingInteractions = await this.interactionModel
    .find({ leadId })
    .sort({ createdAt: -1 }) 
    .exec();

  const lastInteractionDate =
    remainingInteractions.length > 0
      ? remainingInteractions[0].createdAt
      : lead.createdAt;

  lead.interactionCount = remainingInteractions.length;
  lead.lastInteractionDate = lastInteractionDate;
  await lead.save();

  }

  async deleteMany(ids: string[]): Promise<{ deletedCount: number }> {
    const interactions = await this.interactionModel.find({ _id: { $in: ids } }).exec();
    if (interactions.length === 0) {
      return { deletedCount: 0 };
    }
    const interactionsByLead = new Map<string, any[]>();
    for (const interaction of interactions) {
      const leadId = interaction.leadId.toString();
      if (!interactionsByLead.has(leadId)) {
        interactionsByLead.set(leadId, []);
      }
      interactionsByLead.get(leadId)!.push(interaction);
    }

    const result = await this.interactionModel.deleteMany({ _id: { $in: ids } }).exec();

    for (const [leadId, deletedInteractions] of interactionsByLead) {
      const lead = await this.leadModel.findById(leadId).exec();
      if (!lead) continue;

      const remainingInteractions = await this.interactionModel
        .find({ leadId })
        .sort({ createdAt: -1 })
        .exec();

      const lastInteractionDate =
        remainingInteractions.length > 0
          ? remainingInteractions[0].createdAt
          : lead.createdAt;

      lead.interactionCount = remainingInteractions.length;
      lead.lastInteractionDate = lastInteractionDate;
      await lead.save();
    }

    return { deletedCount: result.deletedCount };
  }

  async transcribeAudio(base64Audio: string, mimeType: string) {
    try {

      const transcript = await this.geminiService.transcribeAudio(
        base64Audio,
        mimeType
      );

      return {
        success: true,
        data: {
          transcript,
        },
      };
    } catch (error) {
      this.logger.error('Error transcribing audio:', error);
      throw error;
    }
  }

  async summarizeTranscript(transcript: string) {
    try {

      const summary = await this.geminiService.summarizeTranscript(transcript);

      return {
        success: true,
        data: {
          summary,
        },
      };
    } catch (error) {
      this.logger.error('Error summarizing transcript:', error);
      throw error;
    }
  }
}