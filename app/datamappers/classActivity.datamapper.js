import CoreAdminDataMapper from "./coreAdmin.datamapper.js";
import client from "../helpers/pg.client.js";


class ActivityDataMapper extends CoreAdminDataMapper {
    constructor() {
        super(client, 'activity');
    }
}

export default new ActivityDataMapper();