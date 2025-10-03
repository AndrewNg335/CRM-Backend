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
exports.RemindersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const reminder_schema_1 = require("../../schemas/reminder.schema");
const query_parser_1 = require("../../common/utils/query-parser");
let RemindersService = class RemindersService {
    reminderModel;
    constructor(reminderModel) {
        this.reminderModel = reminderModel;
    }
    async findAllParsed(parsed) {
        return (0, query_parser_1.paginateModel)(this.reminderModel, parsed, []);
    }
    async count(filter = {}) {
        return this.reminderModel.countDocuments(filter).exec();
    }
    async findOne(id) {
        const reminder = await this.reminderModel.findById(id).exec();
        if (!reminder)
            throw new common_1.NotFoundException('reminder not found');
        return reminder;
    }
    async create(data) {
        const reminder = new this.reminderModel(data);
        return reminder.save();
    }
    async update(id, data) {
        return this.reminderModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }
    async delete(id) {
        const result = await this.reminderModel.findByIdAndDelete(id).exec();
        return result;
    }
    async deleteMany(ids) {
        const result = await this.reminderModel.deleteMany({ _id: { $in: ids } }).exec();
        return { deletedCount: result.deletedCount };
    }
    async findByUserId(userId, parsed) {
        const filter = { userId, ...parsed.filter };
        return (0, query_parser_1.paginateModel)(this.reminderModel, { ...parsed, filter }, []);
    }
};
exports.RemindersService = RemindersService;
exports.RemindersService = RemindersService = __decorate([
    (0, common_1.Injectable)(),
    (0, mongoose_1.Schema)({ timestamps: true }),
    __param(0, (0, mongoose_1.InjectModel)(reminder_schema_1.Reminder.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RemindersService);
//# sourceMappingURL=reminders.service.js.map