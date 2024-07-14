import CoreAdminDataMapper from './coreAdmin.datamapper.js';
import client from '../helpers/pg.client.js';

class CenterDataMapper extends CoreAdminDataMapper {
    constructor() {
        super(client, 'center');
    }

    async checkIfExistCenter(name) {
        const query = {
            text: 'SELECT * FROM "center" WHERE name=$1',
            values: [name]
        };
        const result = await client.query(query);
        return result.rows;
    }
}

export default new CenterDataMapper();