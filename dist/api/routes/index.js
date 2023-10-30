"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __importDefault(require("./base"));
const user_1 = __importDefault(require("./user"));
const task_1 = __importDefault(require("./task"));
const project_1 = __importDefault(require("./project"));
const department_1 = __importDefault(require("./department"));
const announcement_1 = __importDefault(require("./announcement"));
exports.default = (app) => {
    (0, base_1.default)(app);
    (0, user_1.default)(app);
    (0, task_1.default)(app);
    (0, project_1.default)(app);
    (0, department_1.default)(app);
    (0, announcement_1.default)(app);
};
//# sourceMappingURL=index.js.map