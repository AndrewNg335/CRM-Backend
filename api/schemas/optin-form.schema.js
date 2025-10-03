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
exports.OptinFormSchema = exports.OptinForm = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const campaign_schema_1 = require("./campaign.schema");
let OptinForm = class OptinForm {
    title;
    description;
    isActive;
    campaignId;
    assignedTo;
    submissionCount;
};
exports.OptinForm = OptinForm;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], OptinForm.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], OptinForm.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], OptinForm.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: campaign_schema_1.Campaign.name }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], OptinForm.prototype, "campaignId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], OptinForm.prototype, "assignedTo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], OptinForm.prototype, "submissionCount", void 0);
exports.OptinForm = OptinForm = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], OptinForm);
exports.OptinFormSchema = mongoose_1.SchemaFactory.createForClass(OptinForm);
//# sourceMappingURL=optin-form.schema.js.map