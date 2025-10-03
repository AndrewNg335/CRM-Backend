"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const jwt_1 = require("@nestjs/jwt");
const user_schema_1 = require("../schemas/user.schema");
const task_schema_1 = require("../schemas/task.schema");
const lead_schema_1 = require("../schemas/lead.schema");
const reminder_schema_1 = require("../schemas/reminder.schema");
const campaign_schema_1 = require("../schemas/campaign.schema");
const optin_form_schema_1 = require("../schemas/optin-form.schema");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const config_1 = require("@nestjs/config");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: task_schema_1.Task.name, schema: task_schema_1.TaskSchema },
                { name: lead_schema_1.Lead.name, schema: lead_schema_1.LeadSchema },
                { name: reminder_schema_1.Reminder.name, schema: reminder_schema_1.ReminderSchema },
                { name: campaign_schema_1.Campaign.name, schema: campaign_schema_1.CampaignSchema },
                { name: optin_form_schema_1.OptinForm.name, schema: optin_form_schema_1.OptinFormSchema },
            ]),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET'),
                }),
            }),
        ],
        providers: [auth_service_1.AuthService, jwt_auth_guard_1.JwtAuthGuard],
        controllers: [auth_controller_1.AuthController],
        exports: [jwt_1.JwtModule, mongoose_1.MongooseModule, jwt_auth_guard_1.JwtAuthGuard],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map