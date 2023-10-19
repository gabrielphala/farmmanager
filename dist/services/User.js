"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const Farm_1 = __importDefault(require("../models/Farm"));
const Validation_1 = __importDefault(require("../helpers/Validation"));
const Hasher_1 = __importDefault(require("../helpers/Hasher"));
const Jwt_1 = __importDefault(require("../helpers/Jwt"));
class UserServices {
    static async signUpOwner(wrapRes, body) {
        try {
            const { fullname, farmName, email, password, passwordAgain } = body;
            Validation_1.default.validate({
                'farm name': { value: farmName, min: 5, max: 36 },
                'full name': { value: fullname, min: 5, max: 36 },
                'email address': { value: email, min: 5, max: 46 },
                'password': { value: password, min: 8, max: 16 },
                'password again': { value: passwordAgain, is: ['password', 'Passwords do not match'] }
            });
            if ((await User_1.default.exists({ email })).found)
                throw `Email address: ${email} already exists`;
            if ((await Farm_1.default.exists({ name: farmName })).found)
                throw `Farm name: ${farmName} already exists`;
            const ownerDetails = await User_1.default.insert({
                fullname,
                role: 'Owner',
                email,
                password: await Hasher_1.default.hash(password)
            });
            const farmDetails = await Farm_1.default.insert({
                name: farmName,
                owner_id: ownerDetails.id
            });
            ownerDetails.farm_id = farmDetails.id;
            ownerDetails.save();
            delete ownerDetails.password;
            let details = { ...ownerDetails.toObject(), ...farmDetails.toObject() };
            const tokens = Jwt_1.default.get_cookie_tokens(details);
            wrapRes.set_cookie('fm_user', tokens);
            wrapRes.userDetails = details;
            wrapRes.successful = true;
        }
        catch (e) {
            throw e;
        }
        return wrapRes;
    }
    static async addProjectManager(wrapRes, body, { userInfo }) {
        try {
            const { fullname, email } = body;
            Validation_1.default.validate({
                'full name': { value: fullname, min: 5, max: 36 },
                'email address': { value: email, min: 5, max: 46 }
            });
            await User_1.default.insert({
                fullname,
                role: 'Project manager',
                email,
                farm_id: userInfo.farm_id,
                password: await Hasher_1.default.hash('Password123')
            });
            wrapRes.successful = true;
        }
        catch (e) {
            throw e;
        }
        return wrapRes;
    }
    static async addDepartmentManager(wrapRes, body, { userInfo }) {
        try {
            const { department, fullname, email } = body;
            Validation_1.default.validate({
                'Department name': { value: department, min: 5, max: 55 },
                'full name': { value: fullname, min: 5, max: 36 },
                'email address': { value: email, min: 5, max: 46 }
            });
            if ((await User_1.default.exists({ email })).found)
                throw `Email address: ${email} already exists`;
            if ((await User_1.default.exists({ department, role: 'Department manager' })).found)
                throw `Department on farm already added`;
            await User_1.default.insert({
                fullname,
                role: 'Department manager',
                department,
                email,
                farm_id: userInfo.farm_id,
                password: await Hasher_1.default.hash('Password123')
            });
            wrapRes.successful = true;
        }
        catch (e) {
            throw e;
        }
        return wrapRes;
    }
    static async removeFarmUser(wrapRes, body) {
        try {
            const { userId } = body;
            await User_1.default.update({ id: userId }, { isDeleted: true });
            wrapRes.successful = true;
        }
        catch (e) {
            throw e;
        }
        return wrapRes;
    }
    static async addDepartmentEmployee(wrapRes, body, { userInfo }) {
        try {
            const { fullname, email } = body;
            Validation_1.default.validate({
                'full name': { value: fullname, min: 5, max: 36 },
                'email address': { value: email, min: 5, max: 46 }
            });
            if ((await User_1.default.exists({ email })).found)
                throw `Email address: ${email} already exists`;
            await User_1.default.insert({
                fullname,
                role: 'Employee',
                department: userInfo.department,
                email,
                farm_id: userInfo.farm_id,
                password: await Hasher_1.default.hash('Password123')
            });
            wrapRes.successful = true;
        }
        catch (e) {
            throw e;
        }
        return wrapRes;
    }
    static async signIn(wrapRes, body) {
        try {
            const { email, password, role } = body;
            Validation_1.default.validate({
                'email address': { value: email, min: 5, max: 46 },
                'password': { value: password, min: 8, max: 16 }
            });
            const userInfo = await User_1.default.findOne({
                condition: { email, role, isDeleted: false },
                join: {
                    ref: 'farm',
                    id: 'farm_id'
                }
            });
            if (!userInfo)
                throw 'User does not exist';
            if (!(await Hasher_1.default.isSame(userInfo.password, password)))
                throw 'Password incorrect';
            const farmDetails = await Farm_1.default.findOne({
                condition: { id: userInfo.farm_id }
            });
            delete userInfo.password;
            const tokens = Jwt_1.default.get_cookie_tokens(userInfo.toObject());
            wrapRes.set_cookie('fm_user', tokens);
            wrapRes.userDetails = userInfo.toObject();
            wrapRes.successful = true;
        }
        catch (e) {
            throw e;
        }
        return wrapRes;
    }
    static async getCurrentUserBySession(wrapRes, _, store) {
        wrapRes.userDetails = store.userInfo;
        return wrapRes;
    }
    static async getProjectManagers(wrapRes, body, store) {
        wrapRes.managers = await User_1.default.getProjectManagers(store.userInfo.farm_id);
        return wrapRes;
    }
    static async getDepartmentManagers(wrapRes, body, store) {
        wrapRes.managers = await User_1.default.getDepartmentManagers(store.userInfo.farm_id);
        return wrapRes;
    }
    static async getDepartmentEmployees(wrapRes, body, store) {
        wrapRes.employees = await User_1.default.getDepartmentEmployees(store.userInfo.farm_id);
        return wrapRes;
    }
}
exports.default = UserServices;
;
//# sourceMappingURL=User.js.map