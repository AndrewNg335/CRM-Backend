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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpportunitySchema = exports.Opportunity = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const opportunity_enums_1 = require("../common/enums/opportunity.enums");
const lead_schema_1 = require("./lead.schema");
const campaign_schema_1 = require("./campaign.schema");
let Opportunity = class Opportunity {
    name;
    description;
    opportunityStage;
    amount;
    probability;
    leadSource;
    isClosed;
    isWon;
    nextStep;
    leadId;
    campaignId;
    ownerId;
    closeDate;
};
exports.Opportunity = Opportunity;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Opportunity.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Opportunity.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: opportunity_enums_1.OpportunityStage, default: opportunity_enums_1.OpportunityStage.QUALIFICATION }),
    __metadata("design:type", String)
], Opportunity.prototype, "opportunityStage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Opportunity.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Opportunity.prototype, "probability", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Opportunity.prototype, "leadSource", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Opportunity.prototype, "isClosed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Opportunity.prototype, "isWon", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Opportunity.prototype, "nextStep", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: lead_schema_1.Lead.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Opportunity.prototype, "leadId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: campaign_schema_1.Campaign.name }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Opportunity.prototype, "campaignId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Opportunity.prototype, "ownerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Opportunity.prototype, "closeDate", void 0);
exports.Opportunity = Opportunity = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Opportunity);
exports.OpportunitySchema = mongoose_1.SchemaFactory.createForClass(Opportunity);
//# sourceMappingURL=opportunity.schema.js.map