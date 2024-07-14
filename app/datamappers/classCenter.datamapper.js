import CoreAdminDataMapper from './coreAdmin.datamapper.js';
import client from '../helpers/pg.client.js';

class CenterDataMapper extends CoreAdminDataMapper {
    constructor() {
        super(client, 'center');
    }
}

export default new CenterDataMapper();