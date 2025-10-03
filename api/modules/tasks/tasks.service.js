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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const task_schema_1 = require("../../schemas/task.schema");
const query_parser_1 = require("../../common/utils/query-parser");
let TasksService = class TasksService {
    taskModel;
    constructor(taskModel) {
        this.taskModel = taskModel;
    }
    async findAll() {
        return this.taskModel.find().sort({ dueDate: 1 }).exec();
    }
    async findAllParsed(parsed) {
        return (0, query_parser_1.paginateModel)(this.taskModel, parsed, []);
    }
    async findById(id) {
        return this.taskModel.findById(id).exec();
    }
    async create(data) {
        const task = new this.taskModel(data);
        return task.save();
    }
    async update(id, data) {
        const updated = await this.taskModel.findByIdAndUpdate(id, data, { new: true }).exec();
        if (!updated)
            throw new common_1.NotFoundException('Task not found');
        return updated;
    }
    async delete(id) {
        const result = await this.taskModel.findByIdAndDelete(id).exec();
        if (!result)
            throw new common_1.NotFoundException('Task not found');
    }
    async deleteMany(ids) {
        const result = await this.taskModel.deleteMany({ _id: { $in: ids } }).exec();
        return { deletedCount: result.deletedCount };
    }
    async find(filter, skip, limit, sort) {
        return this.taskModel.find(filter).skip(skip).limit(limit).sort(sort).exec();
    }
    async count(filter) {
        return this.taskModel.countDocuments(filter).exec();
    }
    async findByUserId(userId, parsed) {
        const filter = { userId, ...parsed.filter };
        return (0, query_parser_1.paginateModel)(this.taskModel, { ...parsed, filter }, []);
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(task_schema_1.Task.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TasksService);
//# sourceMappingURL=tasks.service.js.map