import CoreAdminDataMapper from "./coreAdmin.datamapper.js";
import client from "../helpers/pg.client.js";

class ActivityDataMapper extends CoreAdminDataMapper {
    constructor() {
        super(client, 'activity');
    }

    async checkIfExistActivity(name) {
        const query = {
            text: 'SELECT * FROM "activity" WHERE name=$1',
            values: [name]
        };
        const result = await client.query(query);
        return result.rows;
    }
}

export default new ActivityDataMapper();