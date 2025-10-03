"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReminderStatus = exports.Priority = exports.Repeat = void 0;
var Repeat;
(function (Repeat) {
    Repeat["NEVER"] = "NEVER";
    Repeat["DAILY"] = "DAILY";
    Repeat["WEEKLY"] = "WEEKLY";
    Repeat["MONTHLY"] = "MONTHLY";
})(Repeat || (exports.Repeat = Repeat = {}));
var Priority;
(function (Priority) {
    Priority["LOW"] = "LOW";
    Priority["MEDIUM"] = "MEDIUM";
    Priority["HIGH"] = "HIGH";
})(Priority || (exports.Priority = Priority = {}));
var ReminderStatus;
(function (ReminderStatus) {
    ReminderStatus["PENDING"] = "PENDING";
    ReminderStatus["DONE"] = "DONE";
    ReminderStatus["CANCELLED"] = "CANCELLED";
})(ReminderStatus || (exports.ReminderStatus = ReminderStatus = {}));
//# sourceMappingURL=reminder.enums.js.map