import CoreAdminDataMapper from "./coreAdmin.datamapper";

export default class CenterDataMapper extends CoreAdminDataMapper {
    constructor(client) {
        super(client, 'center');
    }
}