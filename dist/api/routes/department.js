"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __importDefault(require("../controllers/base"));
const Department_1 = __importDefault(require("../../services/Department"));
exports.default = (app) => {
    app.post('/departments/get/by/farm', base_1.default.wrap_with_store(Department_1.default.getAllByFarm));
};
//# sourceMappingURL=department.js.map