"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const mongoose_1 = require("@nestjs/mongoose");
const leads_module_1 = require("./modules/leads/leads.module");
const tasks_module_1 = require("./modules/tasks/tasks.module");
const reminders_module_1 = require("./modules/reminders/reminders.module");
const campaigns_module_1 = require("./modules/campaigns/campaigns.module");
const opportunities_module_1 = require("./modules/opportunities/opportunities.module");
const optin_forms_module_1 = require("./modules/optin-forms/optin-forms.module");
const roles_module_1 = require("./modules/roles/roles.module");
const config_1 = require("@nestjs/config");
const interactions_module_1 = require("./modules/interactions/interactions.module");
const auth_module_1 = require("./auth/auth.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    uri: config.get('MONGODB_URI'),
                }),
            }),
            leads_module_1.LeadsModule, tasks_module_1.TasksModule, reminders_module_1.RemindersModule,
            interactions_module_1.InteractionsModule,
            campaigns_module_1.CampaignsModule, opportunities_module_1.OpportunitiesModule,
            optin_forms_module_1.OptinFormsModule, roles_module_1.RolesModule, auth_module_1.AuthModule, notifications_module_1.NotificationsModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map