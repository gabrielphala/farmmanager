"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadUserInfo = exports.isNotEmployee = exports.isDepartmentManager = exports.isUserOwnerOrProjectManager = void 0;
const Jwt_1 = __importDefault(require("./helpers/Jwt"));
const isUserOwnerOrProjectManager = (req, res, next) => {
    if ((!req['store']) ||
        (req['store'] && !req['store'].userInfo)
    // (req['store'] && req['store'].userInfo && (req['store'].userInfo.role != 'Owner' || req['store'].userInfo.role != 'Project manager'))
    )
        return res.redirect('/sign-in');
    next();
};
exports.isUserOwnerOrProjectManager = isUserOwnerOrProjectManager;
const isDepartmentManager = (req, res, next) => {
    if ((!req['store']) ||
        (req['store'] && !req['store'].userInfo) ||
        (req['store'] && req['store'].userInfo && req['store'].userInfo.role != 'Department manager'))
        return res.redirect('/sign-in');
    next();
};
exports.isDepartmentManager = isDepartmentManager;
const isNotEmployee = (req, res, next) => {
    if ((!req['store']) ||
        (req['store'] && !req['store'].userInfo) ||
        (req['store'] && req['store'].userInfo && req['store'].userInfo.role == 'Employee'))
        return res.redirect('/sign-in');
    next();
};
exports.isNotEmployee = isNotEmployee;
const loadUserInfo = (req, res, next) => {
    if (!req.cookies || req.cookies && !req.cookies['fm_user'])
        return next();
    Jwt_1.default.verify(req.cookies['fm_user'].jwtAccess, (userInfo) => {
        if (!req['store'])
            req['store'] = {};
        req['store'].userInfo = userInfo;
        res.locals.userInfo = userInfo;
    });
    next();
};
exports.loadUserInfo = loadUserInfo;
//# sourceMappingURL=middleware.js.map