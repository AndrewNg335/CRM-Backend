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
exports.ReminderSchema = exports.Reminder = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const reminder_enums_1 = require("../common/enums/reminder.enums");
const lead_schema_1 = require("./lead.schema");
const user_schema_1 = require("./user.schema");
let Reminder = class Reminder {
    title;
    detail;
    timeReminder;
    leadId;
    userId;
    repeat;
    priority;
    reminderStatus;
};
exports.Reminder = Reminder;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Reminder.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Reminder.prototype, "detail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Reminder.prototype, "timeReminder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: lead_schema_1.Lead.name }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Reminder.prototype, "leadId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: user_schema_1.User.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Reminder.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: reminder_enums_1.Repeat, default: reminder_enums_1.Repeat.NEVER }),
    __metadata("design:type", String)
], Reminder.prototype, "repeat", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: reminder_enums_1.Priority, default: reminder_enums_1.Priority.MEDIUM }),
    __metadata("design:type", String)
], Reminder.prototype, "priority", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: reminder_enums_1.ReminderStatus, default: reminder_enums_1.ReminderStatus.PENDING }),
    __metadata("design:type", String)
], Reminder.prototype, "reminderStatus", void 0);
exports.Reminder = Reminder = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Reminder);
exports.ReminderSchema = mongoose_1.SchemaFactory.createForClass(Reminder);
//# sourceMappingURL=reminder.schema.js.map