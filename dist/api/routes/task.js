"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __importDefault(require("../controllers/base"));
const Task_1 = __importDefault(require("../../services/Task"));
exports.default = (app) => {
    app.post('/task/add', base_1.default.wrap_with_store(Task_1.default.add));
    app.post('/task/get/by/farm', base_1.default.wrap_with_store(Task_1.default.getByFarm));
};
//# sourceMappingURL=task.js.map