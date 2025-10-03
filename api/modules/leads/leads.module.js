"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const campaign_schema_1 = require("../../schemas/campaign.schema");
const lead_schema_1 = require("../../schemas/lead.schema");
const optin_form_schema_1 = require("../../schemas/optin-form.schema");
const campaigns_module_1 = require("../campaigns/campaigns.module");
const leads_controller_1 = require("./leads.controller");
const leads_service_1 = require("./leads.service");
const campaign_lead_schema_1 = require("../../schemas/campaign-lead.schema");
const opportunity_schema_1 = require("../../schemas/opportunity.schema");
const reminder_schema_1 = require("../../schemas/reminder.schema");
const auth_module_1 = require("../../auth/auth.module");
const notifications_module_1 = require("../notifications/notifications.module");
let LeadsModule = class LeadsModule {
};
exports.LeadsModule = LeadsModule;
exports.LeadsModule = LeadsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: campaign_schema_1.Campaign.name, schema: campaign_schema_1.CampaignSchema },
                { name: campaign_lead_schema_1.CampaignLead.name, schema: campaign_lead_schema_1.CampaignLeadSchema },
                { name: lead_schema_1.Lead.name, schema: lead_schema_1.LeadSchema },
                { name: optin_form_schema_1.OptinForm.name, schema: optin_form_schema_1.OptinFormSchema },
                { name: opportunity_schema_1.Opportunity.name, schema: opportunity_schema_1.OpportunitySchema },
                { name: reminder_schema_1.Reminder.name, schema: reminder_schema_1.ReminderSchema },
            ]),
            campaigns_module_1.CampaignsModule,
            auth_module_1.AuthModule,
            notifications_module_1.NotificationsModule
        ], controllers: [leads_controller_1.LeadsController],
        providers: [leads_service_1.LeadsService],
    })
], LeadsModule);
//# sourceMappingURL=leads.module.js.map