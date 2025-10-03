"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptinFormsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const optin_forms_service_1 = require("./optin-forms.service");
const optin_forms_controller_1 = require("./optin-forms.controller");
const optin_form_schema_1 = require("../../schemas/optin-form.schema");
const auth_module_1 = require("../../auth/auth.module");
let OptinFormsModule = class OptinFormsModule {
};
exports.OptinFormsModule = OptinFormsModule;
exports.OptinFormsModule = OptinFormsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: optin_form_schema_1.OptinForm.name, schema: optin_form_schema_1.OptinFormSchema }]),
            auth_module_1.AuthModule,
        ],
        controllers: [optin_forms_controller_1.OptinFormsController],
        providers: [optin_forms_service_1.OptinFormsService],
    })
], OptinFormsModule);
//# sourceMappingURL=optin-forms.module.js.map