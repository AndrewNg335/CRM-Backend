"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const interactions_service_1 = require("./interactions.service");
const interaction_schema_1 = require("../../schemas/interaction.schema");
const interactions_controller_1 = require("./interactions.controller");
const lead_schema_1 = require("../../schemas/lead.schema");
const auth_module_1 = require("../../auth/auth.module");
const gemini_module_1 = require("../gemini/gemini.module");
let InteractionsModule = class InteractionsModule {
};
exports.InteractionsModule = InteractionsModule;
exports.InteractionsModule = InteractionsModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([
                { name: interaction_schema_1.Interaction.name, schema: interaction_schema_1.InteractionSchema },
                { name: lead_schema_1.Lead.name, schema: lead_schema_1.LeadSchema },
            ]),
            auth_module_1.AuthModule,
            gemini_module_1.GeminiModule],
        controllers: [interactions_controller_1.InteractionsController],
        providers: [interactions_service_1.InteractionsService],
    })
], InteractionsModule);
//# sourceMappingURL=interactions.module.js.map