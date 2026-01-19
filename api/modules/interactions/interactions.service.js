"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var InteractionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const interaction_schema_1 = require("../../schemas/interaction.schema");
const lead_schema_1 = require("../../schemas/lead.schema");
const query_parser_1 = require("../../common/utils/query-parser");
const gemini_service_1 = require("../gemini/gemini.service");
let InteractionsService = InteractionsService_1 = class InteractionsService {
    interactionModel;
    leadModel;
    geminiService;
    logger = new common_1.Logger(InteractionsService_1.name);
    constructor(interactionModel, leadModel, geminiService) {
        this.interactionModel = interactionModel;
        this.leadModel = leadModel;
        this.geminiService = geminiService;
    }
    async create(data) {
        const newInteraction = new this.interactionModel(data);
        await newInteraction.save();
        const interactionCount = await this.interactionModel.countDocuments({ leadId: data.leadId }).exec();
        await this.leadModel.findByIdAndUpdate(data.leadId, { interactionCount }, { new: true });
        return newInteraction;
    }
    async findByLead(leadId) {
        const result = await this.interactionModel.find({ leadId }).sort({ createdAt: -1 }).exec();
        return result;
    }
    async findAllParsed(parsed) {
        return (0, query_parser_1.paginateModel)(this.interactionModel, parsed, []);
    }
    async findOne(id) {
        const interaction = await this.interactionModel.findById(id).exec();
        if (!interaction)
            throw new common_1.NotFoundException('interaction not found');
        return interaction;
    }
    async update(id, data) {
        const updated = await this.interactionModel.findByIdAndUpdate(id, data, { new: true }).exec();
        if (!updated)
            throw new common_1.NotFoundException('interaction not found');
        return updated;
    }
    async delete(id) {
        const interaction = await this.interactionModel.findById(id);
        if (!interaction)
            throw new common_1.NotFoundException('Interaction not found');
        const leadId = interaction.leadId;
        await this.interactionModel.findByIdAndDelete(id);
        const lead = await this.leadModel.findById(leadId);
        if (!lead)
            throw new common_1.NotFoundException('Lead not found');
        const remainingInteractions = await this.interactionModel
            .find({ leadId })
            .sort({ createdAt: -1 })
            .exec();
        const lastInteractionDate = remainingInteractions.length > 0
            ? remainingInteractions[0].createdAt
            : lead.createdAt;
        lead.interactionCount = remainingInteractions.length;
        lead.lastInteractionDate = lastInteractionDate;
        await lead.save();
    }
    async deleteMany(ids) {
        const interactions = await this.interactionModel.find({ _id: { $in: ids } }).exec();
        if (interactions.length === 0) {
            return { deletedCount: 0 };
        }
        const interactionsByLead = new Map();
        for (const interaction of interactions) {
            const leadId = interaction.leadId.toString();
            if (!interactionsByLead.has(leadId)) {
                interactionsByLead.set(leadId, []);
            }
            interactionsByLead.get(leadId).push(interaction);
        }
        const result = await this.interactionModel.deleteMany({ _id: { $in: ids } }).exec();
        for (const [leadId, deletedInteractions] of interactionsByLead) {
            const lead = await this.leadModel.findById(leadId).exec();
            if (!lead)
                continue;
            const remainingInteractions = await this.interactionModel
                .find({ leadId })
                .sort({ createdAt: -1 })
                .exec();
            const lastInteractionDate = remainingInteractions.length > 0
                ? remainingInteractions[0].createdAt
                : lead.createdAt;
            lead.interactionCount = remainingInteractions.length;
            lead.lastInteractionDate = lastInteractionDate;
            await lead.save();
        }
        return { deletedCount: result.deletedCount };
    }
    async transcribeAudio(base64Audio, mimeType) {
        try {
            const transcript = await this.geminiService.transcribeAudio(base64Audio, mimeType);
            return {
                success: true,
                data: {
                    transcript,
                },
            };
        }
        catch (error) {
            this.logger.error('Error transcribing audio:', error);
            throw error;
        }
    }
    async summarizeTranscript(transcript) {
        try {
            const summary = await this.geminiService.summarizeTranscript(transcript);
            return {
                success: true,
                data: {
                    summary,
                },
            };
        }
        catch (error) {
            this.logger.error('Error summarizing transcript:', error);
            throw error;
        }
    }
};
exports.InteractionsService = InteractionsService;
exports.InteractionsService = InteractionsService = InteractionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(interaction_schema_1.Interaction.name)),
    __param(1, (0, mongoose_1.InjectModel)(lead_schema_1.Lead.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        gemini_service_1.GeminiService])
], InteractionsService);
//# sourceMappingURL=interactions.service.js.map