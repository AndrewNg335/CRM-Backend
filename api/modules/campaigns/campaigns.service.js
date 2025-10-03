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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const query_parser_1 = require("../../common/utils/query-parser");
const campaign_lead_schema_1 = require("../../schemas/campaign-lead.schema");
const campaign_schema_1 = require("../../schemas/campaign.schema");
const opportunity_schema_1 = require("../../schemas/opportunity.schema");
let CampaignsService = class CampaignsService {
    campaignModel;
    campaignLeadModel;
    opportunityModel;
    constructor(campaignModel, campaignLeadModel, opportunityModel) {
        this.campaignModel = campaignModel;
        this.campaignLeadModel = campaignLeadModel;
        this.opportunityModel = opportunityModel;
    }
    async findAllParsed(parsed) {
        return (0, query_parser_1.paginateModel)(this.campaignModel, parsed, []);
    }
    async findOne(id) {
        const campaign = await this.campaignModel.findById(id).exec();
        if (!campaign)
            throw new common_1.NotFoundException('Campaign not found');
        return campaign;
    }
    async create(data) {
        const created = new this.campaignModel(data);
        return created.save();
    }
    async update(id, data) {
        const updated = await this.campaignModel.findByIdAndUpdate(id, data, { new: true }).exec();
        if (!updated)
            throw new common_1.NotFoundException('Campaign not found');
        return updated;
    }
    async delete(id) {
        const result = await this.campaignModel.findByIdAndDelete(id).exec();
        if (!result)
            throw new common_1.NotFoundException('Campaign not found');
    }
    async deleteMany(ids) {
        const result = await this.campaignModel.deleteMany({ _id: { $in: ids } }).exec();
        return { deletedCount: result.deletedCount };
    }
    async addLeadToCampaign(campaignId, leadId) {
        const exists = await this.campaignLeadModel.findOne({ campaignId, leadId }).exec();
        if (!exists) {
            const link = new this.campaignLeadModel({ campaignId, leadId });
            await link.save();
            const leadCount = await this.campaignLeadModel.countDocuments({ campaignId }).exec();
            await this.campaignModel.findByIdAndUpdate(campaignId, { leadCount }, { new: true }).exec();
            return link;
        }
        return exists;
    }
    async getLeadsOfCampaign(campaignId, parsed) {
        const extendedParsed = {
            ...parsed,
            filter: { ...parsed.filter, campaignId }
        };
        const result = await (0, query_parser_1.paginateModel)(this.campaignLeadModel, extendedParsed, ['leadId']);
        return {
            ...result,
            items: result.items.map((cl) => cl.leadId),
        };
    }
    async getOpportunitiesOfCampaign(campaignId, parsed) {
        const extendedParsed = {
            ...parsed,
            filter: { ...parsed.filter, campaignId }
        };
        return (0, query_parser_1.paginateModel)(this.opportunityModel, extendedParsed, ["leadId", "campaignId"]);
    }
    async removeLeadFromCampaign(campaignId, leadId) {
        const result = await this.campaignLeadModel.deleteOne({ campaignId, leadId }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException('Lead not found in this campaign');
        }
        const leadCount = await this.campaignLeadModel.countDocuments({ campaignId, leadId }).exec();
        await this.campaignModel.findByIdAndUpdate(campaignId, { leadCount }, { new: true }).exec();
    }
    async findByResponsibleUser(responsibleUserId, parsed) {
        const extendedParsed = {
            ...parsed,
            filter: { ...parsed.filter, responsibleUserId }
        };
        return (0, query_parser_1.paginateModel)(this.campaignModel, extendedParsed, []);
    }
};
exports.CampaignsService = CampaignsService;
exports.CampaignsService = CampaignsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(campaign_schema_1.Campaign.name)),
    __param(1, (0, mongoose_1.InjectModel)(campaign_lead_schema_1.CampaignLead.name)),
    __param(2, (0, mongoose_1.InjectModel)(opportunity_schema_1.Opportunity.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], CampaignsService);
//# sourceMappingURL=campaigns.service.js.map