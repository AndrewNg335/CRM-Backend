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
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const query_parser_1 = require("../../common/utils/query-parser");
const lead_schema_1 = require("../../schemas/lead.schema");
const optin_form_schema_1 = require("../../schemas/optin-form.schema");
const campaigns_service_1 = require("../campaigns/campaigns.service");
const campaign_schema_1 = require("../../schemas/campaign.schema");
const campaign_lead_schema_1 = require("../../schemas/campaign-lead.schema");
const opportunity_schema_1 = require("../../schemas/opportunity.schema");
const reminder_schema_1 = require("../../schemas/reminder.schema");
const notifications_service_1 = require("../notifications/notifications.service");
let LeadsService = class LeadsService {
    leadModel;
    optinFormModel;
    campaignModel;
    opportunityModel;
    campaignLeadModel;
    reminderModel;
    campaignsService;
    notificationsService;
    constructor(leadModel, optinFormModel, campaignModel, opportunityModel, campaignLeadModel, reminderModel, campaignsService, notificationsService) {
        this.leadModel = leadModel;
        this.optinFormModel = optinFormModel;
        this.campaignModel = campaignModel;
        this.opportunityModel = opportunityModel;
        this.campaignLeadModel = campaignLeadModel;
        this.reminderModel = reminderModel;
        this.campaignsService = campaignsService;
        this.notificationsService = notificationsService;
    }
    async create(data) {
        const newLead = new this.leadModel(data);
        const savedLead = await newLead.save();
        if (savedLead.responsibleUserId) {
            await this.notificationsService.createNotification(savedLead.responsibleUserId, 'Lead mới được tạo', `Lead "${savedLead.name}" đã được tạo và được gán cho bạn`, `/leads/edit/${savedLead._id}`);
        }
        return savedLead;
    }
    async createFormOptinForm(optinFormId, payload) {
        const optinForm = await this.optinFormModel.findById(optinFormId).exec();
        if (!optinForm) {
            throw new common_1.NotFoundException('OptinForm not found');
        }
        const leadData = {
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            note: payload.note,
            status: "new",
            responsibleUserId: optinForm.assignedTo,
        };
        const newLead = new this.leadModel(leadData);
        const savedLead = await newLead.save();
        await this.optinFormModel
            .findByIdAndUpdate(optinFormId, { $inc: { submissionCount: 1 } })
            .exec();
        if (optinForm.campaignId) {
            await this.campaignsService.addLeadToCampaign(optinForm.campaignId.toString(), savedLead._id.toString());
        }
        if (savedLead.responsibleUserId) {
            await this.notificationsService.createNotification(savedLead.responsibleUserId, 'Lead mới từ Optin Form', `Lead "${savedLead.name}" đã được tạo từ optin form và được gán cho bạn`, `/leads/edit/${savedLead._id}`);
        }
        return savedLead;
    }
    async findAllParsed(parsed) {
        return (0, query_parser_1.paginateModel)(this.leadModel, parsed, []);
    }
    async findRemindersOfLead(leadId) {
        const result = await this.reminderModel.find({ leadId }).sort({ createdAt: -1 }).exec();
        return result;
    }
    async findOne(id) {
        const lead = await this.leadModel.findById(id).exec();
        if (!lead)
            throw new common_1.NotFoundException('Lead not found');
        return lead;
    }
    async update(id, data) {
        const updated = await this.leadModel.findByIdAndUpdate(id, data, { new: true }).exec();
        if (!updated)
            throw new common_1.NotFoundException('Lead not found');
        return updated;
    }
    async delete(leadId) {
        const opportunityCount = await this.opportunityModel.countDocuments({ leadId }).exec();
        if (opportunityCount > 0) {
            throw new common_1.BadRequestException(`Lead này đang liên kết với ${opportunityCount} cơ hội. Vui lòng xoá hết các cơ hội trước khi xoá lead.`);
        }
        await this.leadModel.findByIdAndDelete(leadId).exec();
        const campaignLead = await this.campaignLeadModel.findOne({ leadId }).exec();
        if (!campaignLead) {
            return;
        }
        const campaignId = campaignLead.campaignId;
        const result = await this.campaignLeadModel.deleteOne({ campaignId, leadId }).exec();
        if (result.deletedCount === 0) {
            return;
        }
        const leadCount = await this.campaignLeadModel.countDocuments({ campaignId }).exec();
        await this.campaignModel.findByIdAndUpdate(campaignId, { leadCount }, { new: true }).exec();
    }
    async deleteMany(ids) {
        const leadsWithOpportunities = await this.opportunityModel.find({ leadId: { $in: ids } }).exec();
        if (leadsWithOpportunities.length > 0) {
            const leadIdsWithOpportunities = [...new Set(leadsWithOpportunities.map(o => o.leadId.toString()))];
            throw new common_1.BadRequestException(`Các lead có ID: ${leadIdsWithOpportunities.join(', ')} đang liên kết với cơ hội. Vui lòng xoá hết các cơ hội trước khi xoá lead.`);
        }
        const result = await this.leadModel.deleteMany({ _id: { $in: ids } }).exec();
        const campaignLeads = await this.campaignLeadModel.find({ leadId: { $in: ids } }).exec();
        if (campaignLeads.length > 0) {
            await this.campaignLeadModel.deleteMany({ leadId: { $in: ids } }).exec();
            const campaignIds = [...new Set(campaignLeads.map(cl => cl.campaignId.toString()))];
            for (const campaignId of campaignIds) {
                const leadCount = await this.campaignLeadModel.countDocuments({ campaignId }).exec();
                await this.campaignModel.findByIdAndUpdate(campaignId, { leadCount }, { new: true }).exec();
            }
        }
        return { deletedCount: result.deletedCount };
    }
    async findByResponsibleUserId(responsibleUserId, parsed) {
        const filter = { responsibleUserId, ...parsed.filter };
        return (0, query_parser_1.paginateModel)(this.leadModel, { ...parsed, filter }, []);
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(lead_schema_1.Lead.name)),
    __param(1, (0, mongoose_1.InjectModel)(optin_form_schema_1.OptinForm.name)),
    __param(2, (0, mongoose_1.InjectModel)(campaign_schema_1.Campaign.name)),
    __param(3, (0, mongoose_1.InjectModel)(opportunity_schema_1.Opportunity.name)),
    __param(4, (0, mongoose_1.InjectModel)(campaign_lead_schema_1.CampaignLead.name)),
    __param(5, (0, mongoose_1.InjectModel)(reminder_schema_1.Reminder.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        campaigns_service_1.CampaignsService,
        notifications_service_1.NotificationsService])
], LeadsService);
//# sourceMappingURL=leads.service.js.map