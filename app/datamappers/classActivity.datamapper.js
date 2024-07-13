import CoreAdminDataMapper from "./coreAdmin.datamapper";

export default class ActivityDataMapper extends CoreAdminDataMapper {
    constructor(client) {
        super(client, 'activity');
    }
}