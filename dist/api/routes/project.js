"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __importDefault(require("../controllers/base"));
const Project_1 = __importDefault(require("../../services/Project"));
exports.default = (app) => {
    app.post('/project/add', base_1.default.wrap_with_store(Project_1.default.add));
    app.post('/projects/get/by/farm', base_1.default.wrap_with_store(Project_1.default.getAllByFarm));
};
//# sourceMappingURL=project.js.map