import Announcement from "../models/Announcement"

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
                farm_id: userInfo.farm_id,
                subject,
                message
            })

            wrapRes.successful = true;

        } catch (e) { throw e; }

        return wrapRes;
    }

    static async getByFarm (wrapRes: IResponse, _: IAny, { userInfo }: IAny) : Promise <IResponse> {
        try {
            wrapRes.announcements = await Announcement.find({
                condition: {
                    farm_id: userInfo.farm_id
                },
                join: {
                    ref: 'user',
                    id: 'sender_id'
                }
            })

            wrapRes.successful = true;

        } catch (e) { throw e; }

        return wrapRes;
    }
};