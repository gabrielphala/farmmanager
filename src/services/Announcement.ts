import Announcement from "../models/Announcement"
import Owner from "../models/Owner";
import DepartmentManager from "../models/DepartmentManager";
import ProjectManager from "../models/ProjectManager";
import Employee from "../models/Employee"

import v from "../helpers/Validation"

import { IAny, IResponse } from "../interfaces";

export default class AnnouncementServices {
    static async send (wrapRes: IResponse, body: IAny, { userInfo }: IAny) : Promise <IResponse> {
        try {
            const { message, subject } = body;

            v.validate({
                'Message': { value: message, min: 5, max: 1024 },
                'Subject': { value: message, min: 5, max: 255 }
            });

            await Announcement.insert({
                sender_id: userInfo.id,
                sender_type: userInfo.role,
                farm_id: userInfo.farm_id,
                subject,
                message
            })

            wrapRes.successful = true;

        } catch (e) { throw e; }

        return wrapRes;
    }

    static async remove (wrapRes: IResponse, body: IAny) : Promise <IResponse> {
        try {
            const { id } = body;

            Announcement.update({id}, { isDeleted: true })

            wrapRes.successful = true;

        } catch (e) { throw e; }

        return wrapRes;
    }

    static async getByFarm (wrapRes: IResponse, _: IAny, { userInfo }: IAny) : Promise <IResponse> {
        try {
            const models = {
                'Employee': Employee,
                'Department manager': DepartmentManager,
                'Project manager': ProjectManager,
                'Owner': Owner
            }

            wrapRes.announcements = await Announcement.find({
                condition: {
                    farm_id: userInfo.farm_id,
                    isDeleted: { $ne: true }
                }
            })

            for (let i = 0; i < wrapRes.announcements.length; i++) {
                const announcement = wrapRes.announcements[i];

                const details = await models[announcement.sender_type].findOne({
                    condition: {
                        id: announcement.sender_id
                    }
                })

                wrapRes.announcements[i] = { ...details.toObject(), ...announcement};
            }

            wrapRes.successful = true;

        } catch (e) { throw e; }

        return wrapRes;
    }
};