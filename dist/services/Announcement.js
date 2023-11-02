"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Announcement_1 = __importDefault(require("../models/Announcement"));
const Owner_1 = __importDefault(require("../models/Owner"));
const DepartmentManager_1 = __importDefault(require("../models/DepartmentManager"));
const ProjectManager_1 = __importDefault(require("../models/ProjectManager"));
const Employee_1 = __importDefault(require("../models/Employee"));
const Validation_1 = __importDefault(require("../helpers/Validation"));
class AnnouncementServices {
    static async send(wrapRes, body, { userInfo }) {
        try {
            const { message, subject } = body;
            Validation_1.default.validate({
                'Message': { value: message, min: 5, max: 1024 },
                'Subject': { value: message, min: 5, max: 255 }
            });
            await Announcement_1.default.insert({
                sender_id: userInfo.id,
                sender_type: userInfo.role,
                farm_id: userInfo.farm_id,
                subject,
                message
            });
            wrapRes.successful = true;
        }
        catch (e) {
            throw e;
        }
        return wrapRes;
    }
    static async remove(wrapRes, body) {
        try {
            const { id } = body;
            Announcement_1.default.update({ id }, { isDeleted: true });
            wrapRes.successful = true;
        }
        catch (e) {
            throw e;
        }
        return wrapRes;
    }
    static async getByFarm(wrapRes, _, { userInfo }) {
        try {
            const models = {
                'Employee': Employee_1.default,
                'Department manager': DepartmentManager_1.default,
                'Project manager': ProjectManager_1.default,
                'Owner': Owner_1.default
            };
            wrapRes.announcements = await Announcement_1.default.find({
                condition: {
                    farm_id: userInfo.farm_id,
                    isDeleted: { $ne: true }
                }
            });
            for (let i = 0; i < wrapRes.announcements.length; i++) {
                const announcement = wrapRes.announcements[i];
                const details = await models[userInfo.role].findOne({
                    condition: {
                        id: announcement.sender_id
                    }
                });
                wrapRes.announcements[i] = { ...announcement, ...details.toObject() };
            }
            wrapRes.successful = true;
        }
        catch (e) {
            throw e;
        }
        return wrapRes;
    }
}
exports.default = AnnouncementServices;
;
//# sourceMappingURL=Announcement.js.map