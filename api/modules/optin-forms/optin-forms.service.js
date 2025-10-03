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
exports.OptinFormsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const query_parser_1 = require("../../common/utils/query-parser");
const optin_form_schema_1 = require("../../schemas/optin-form.schema");
let OptinFormsService = class OptinFormsService {
    optinFormModel;
    constructor(optinFormModel) {
        this.optinFormModel = optinFormModel;
    }
    async findAllParsed(parsed) {
        return (0, query_parser_1.paginateModel)(this.optinFormModel, parsed, []);
    }
    async findOne(id) {
        const form = await this.optinFormModel
            .findById(id)
            .populate('campaignId')
            .populate('assignedTo')
            .exec();
        if (!form)
            throw new common_1.NotFoundException('OptinForm not found');
        return form;
    }
    async create(data) {
        const created = new this.optinFormModel(data);
        return created.save();
    }
    async update(id, data) {
        const updated = await this.optinFormModel.findByIdAndUpdate(id, data, { new: true }).exec();
        if (!updated)
            throw new common_1.NotFoundException('OptinForm not found');
        return updated;
    }
    async delete(id) {
        const result = await this.optinFormModel.findByIdAndDelete(id).exec();
        if (!result)
            throw new common_1.NotFoundException('Optin-form not found');
    }
    async deleteMany(ids) {
        const result = await this.optinFormModel.deleteMany({ _id: { $in: ids } }).exec();
        return { deletedCount: result.deletedCount };
    }
    async findByAssignedTo(assignedTo, parsed) {
        const extendedParsed = {
            ...parsed,
            filter: { ...parsed.filter, assignedTo },
        };
        return (0, query_parser_1.paginateModel)(this.optinFormModel, extendedParsed, ['campaignId']);
    }
};
exports.OptinFormsService = OptinFormsService;
exports.OptinFormsService = OptinFormsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(optin_form_schema_1.OptinForm.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OptinFormsService);
//# sourceMappingURL=optin-forms.service.js.map