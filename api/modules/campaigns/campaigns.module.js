"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const campaigns_service_1 = require("./campaigns.service");
const campaigns_controller_1 = require("./campaigns.controller");
const campaign_schema_1 = require("../../schemas/campaign.schema");
const lead_schema_1 = require("../../schemas/lead.schema");
const campaign_lead_schema_1 = require("../../schemas/campaign-lead.schema");
const opportunity_schema_1 = require("../../schemas/opportunity.schema");
const auth_module_1 = require("../../auth/auth.module");
let CampaignsModule = class CampaignsModule {
};
exports.CampaignsModule = CampaignsModule;
exports.CampaignsModule = CampaignsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: campaign_schema_1.Campaign.name, schema: campaign_schema_1.CampaignSchema },
                { name: lead_schema_1.Lead.name, schema: lead_schema_1.LeadSchema },
                { name: opportunity_schema_1.Opportunity.name, schema: opportunity_schema_1.OpportunitySchema },
                { name: campaign_lead_schema_1.CampaignLead.name, schema: campaign_lead_schema_1.CampaignLeadSchema },
            ]),
            auth_module_1.AuthModule,
        ],
        controllers: [campaigns_controller_1.CampaignsController],
        providers: [campaigns_service_1.CampaignsService],
        exports: [campaigns_service_1.CampaignsService],
    })
], CampaignsModule);
//# sourceMappingURL=campaigns.module.js.map