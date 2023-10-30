"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Department_1 = __importDefault(require("../models/Department"));
class UserServices {
    static async getAllByFarm(wrapRes, body, store) {
        wrapRes.departments = await Department_1.default.find({
            condition: {
                farm_id: store.userInfo.farm_id
            }
        });
        return wrapRes;
    }
}
exports.default = UserServices;
;
//# sourceMappingURL=Department.js.map