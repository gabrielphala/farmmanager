import Department from "../models/Department";

import { IAny, IResponse } from "../interfaces";

export default class UserServices {
    static async getAllByFarm (wrapRes: IResponse, body: IAny, store: IAny) : Promise <IResponse> {
        wrapRes.departments = await Department.find({
			condition: {
				farm_id: store.userInfo.farm_id
			}
		});

        return wrapRes;
    }
};