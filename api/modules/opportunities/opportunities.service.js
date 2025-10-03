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
exports.OpportunitiesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const query_parser_1 = require("../../common/utils/query-parser");
const campaign_schema_1 = require("../../schemas/campaign.schema");
const opportunity_enums_1 = require("../../common/enums/opportunity.enums");
const opportunity_schema_1 = require("../../schemas/opportunity.schema");
let OpportunitiesService = class OpportunitiesService {
    opportunityModel;
    campaignModel;
    constructor(opportunityModel, campaignModel) {
        this.opportunityModel = opportunityModel;
        this.campaignModel = campaignModel;
    }
    async findAllParsed(parsed) {
        return (0, query_parser_1.paginateModel)(this.opportunityModel, parsed, ["leadId", "campaignId"]);
    }
    async findOne(id) {
        const opp = await this.opportunityModel
            .findById(id)
            .exec();
        if (!opp)
            throw new common_1.NotFoundException('Opportunity not found');
        return opp;
    }
    async create(data) {
        if (data.opportunityStage) {
            if (data.opportunityStage === opportunity_enums_1.OpportunityStage.CLOSED_WON) {
                data.isClosed = true;
                data.isWon = true;
            }
            else if (data.opportunityStage === opportunity_enums_1.OpportunityStage.CLOSED_LOST) {
                data.isClosed = true;
                data.isWon = false;
            }
            else {
                data.isClosed = false;
                data.isWon = false;
            }
        }
        const created = new this.opportunityModel(data);
        const saved = await created.save();
        if (data.campaignId) {
            const opportunityCount = await this.opportunityModel.countDocuments({ campaignId: data.campaignId });
            await this.campaignModel.findByIdAndUpdate(data.campaignId, { opportunityCount }, { new: true }).exec();
        }
        return saved;
    }
    async update(id, data) {
        const opportunity = await this.opportunityModel.findById(id).exec();
        if (!opportunity) {
            throw new common_1.NotFoundException('Opportunity not found');
        }
        if (data.opportunityStage) {
            if (data.opportunityStage === opportunity_enums_1.OpportunityStage.CLOSED_WON) {
                data.isClosed = true;
                data.isWon = true;
            }
            else if (data.opportunityStage === opportunity_enums_1.OpportunityStage.CLOSED_LOST) {
                data.isClosed = true;
                data.isWon = false;
            }
            else {
                data.isClosed = false;
                data.isWon = false;
            }
        }
        const campaignChanged = data.campaignId &&
            data.campaignId.toString() !== opportunity.campaignId.toString();
        const updated = await this.opportunityModel
            .findByIdAndUpdate(id, data, { new: true })
            .exec();
        if (campaignChanged) {
            await this.refreshOpportunityCount(opportunity.campaignId.toString());
            await this.refreshOpportunityCount(data.campaignId.toString());
        }
        return updated;
    }
    async refreshOpportunityCount(campaignId) {
        const count = await this.opportunityModel.countDocuments({ campaignId }).exec();
        await this.campaignModel.findByIdAndUpdate(campaignId, { opportunityCount: count }).exec();
    }
    async delete(id) {
        const opp = await this.opportunityModel.findById(id).exec();
        if (!opp)
            throw new common_1.NotFoundException('Opportunity not found');
        await this.opportunityModel.findByIdAndDelete(id).exec();
        if (opp.campaignId) {
            const opportunityCount = await this.opportunityModel.countDocuments({ campaignId: opp.campaignId });
            await this.campaignModel.findByIdAndUpdate(opp.campaignId, { opportunityCount }, { new: true }).exec();
        }
    }
    async deleteMany(ids) {
        const opportunities = await this.opportunityModel.find({ _id: { $in: ids } }).exec();
        if (opportunities.length === 0) {
            return { deletedCount: 0 };
        }
        const opportunitiesByCampaign = new Map();
        for (const opportunity of opportunities) {
            if (opportunity.campaignId) {
                const campaignId = opportunity.campaignId.toString();
                if (!opportunitiesByCampaign.has(campaignId)) {
                    opportunitiesByCampaign.set(campaignId, []);
                }
                opportunitiesByCampaign.get(campaignId).push(opportunity);
            }
        }
        const result = await this.opportunityModel.deleteMany({ _id: { $in: ids } }).exec();
        for (const [campaignId, deletedOpportunities] of opportunitiesByCampaign) {
            const opportunityCount = await this.opportunityModel.countDocuments({ campaignId }).exec();
            await this.campaignModel.findByIdAndUpdate(campaignId, { opportunityCount }, { new: true }).exec();
        }
        return { deletedCount: result.deletedCount };
    }
    async getOpportunitiesOfLead(leadId, parsed) {
        const extendedParsed = {
            ...parsed,
            filter: { ...parsed.filter, leadId }
        };
        return (0, query_parser_1.paginateModel)(this.opportunityModel, extendedParsed, ["leadId", "campaignId"]);
    }
    async findByOwnerId(ownerId, parsed) {
        const filter = { ownerId, ...parsed.filter };
        return (0, query_parser_1.paginateModel)(this.opportunityModel, { ...parsed, filter }, ["leadId", "campaignId"]);
    }
};
exports.OpportunitiesService = OpportunitiesService;
exports.OpportunitiesService = OpportunitiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(opportunity_schema_1.Opportunity.name)),
    __param(1, (0, mongoose_1.InjectModel)(campaign_schema_1.Campaign.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], OpportunitiesService);
//# sourceMappingURL=opportunities.service.js.map