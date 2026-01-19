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
exports.InteractionSchema = exports.Interaction = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const lead_schema_1 = require("./lead.schema");
let Interaction = class Interaction extends mongoose_2.Document {
    interactionType;
    detail;
    transcript;
    leadId;
};
exports.Interaction = Interaction;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Interaction.prototype, "interactionType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Interaction.prototype, "detail", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Interaction.prototype, "transcript", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: lead_schema_1.Lead.name }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Interaction.prototype, "leadId", void 0);
exports.Interaction = Interaction = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Interaction);
exports.InteractionSchema = mongoose_1.SchemaFactory.createForClass(Interaction);
//# sourceMappingURL=interaction.schema.js.map