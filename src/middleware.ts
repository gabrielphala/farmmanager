import { NextFunction, Request, Response } from "express";

import Jwt from "./helpers/Jwt";

export const isUserOwnerOrProjectManager = (req: Request, res: Response, next: NextFunction) => {
    if (
        (!req['store']) ||
        (req['store'] && !req['store'].userInfo)
        // (req['store'] && req['store'].userInfo && (req['store'].userInfo.role != 'Owner' || req['store'].userInfo.role != 'Project manager'))
        )
        return res.redirect('/sign-in');

    next();
}

export const isDepartmentManagerOrEmployee = (req: Request, res: Response, next: NextFunction) => {
    if (
        (!req['store']) ||
        (req['store'] && !req['store'].userInfo)
    )
        return res.redirect('/sign-in');

    next();
}

export const isNotEmployee = (req: Request, res: Response, next: NextFunction) => {
    if (
        (!req['store']) ||
        (req['store'] && !req['store'].userInfo) ||
        (req['store'] && req['store'].userInfo && req['store'].userInfo.role == 'Employee')
    )
        return res.redirect('/sign-in');

    next();
}

export const loadUserInfo = (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies || req.cookies && !req.cookies['fm_user'])
        return next();

    Jwt.verify(req.cookies['fm_user'].jwtAccess, (userInfo: object) => {
        if (!req['store']) req['store'] = {}
        req['store'].userInfo = userInfo;
        res.locals.userInfo = userInfo;
    });

    next();
}