"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __importDefault(require("../controllers/base"));
const Announcement_1 = __importDefault(require("../../services/Announcement"));
exports.default = (app) => {
    app.post('/announcement/add', base_1.default.wrap_with_store(Announcement_1.default.send));
    app.post('/announcement/remove', base_1.default.wrap(Announcement_1.default.remove));
    app.post('/announcements/get/by/farm', base_1.default.wrap_with_store(Announcement_1.default.getByFarm));
};
//# sourceMappingURL=announcement.js.map