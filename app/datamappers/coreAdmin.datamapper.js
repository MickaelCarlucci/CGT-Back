
export default class CoreAdminDataMapper {
constructor(client, tablename) {
    this.client = client;
    this.tablename = tablename;
}

async findAll() {
    const query = {
        text: `SELECT * FROM "${this.tablename}"`
    };
    const result = await this.client.query(query);
    return result.rows[0];
}

async findById(id) {
    const query = {
        text: `SELECT * FROM "${this.tablename}" WHERE id=$1`,
        values: [id],
    };
    const result = await this.client.query(query);
    return result.rows[0];
}

async create(name) {
    const query = {
        text: `INSERT INTO "${this.tablename}" ("name") VALUES ($1) RETURNING (name, created_at)`,
        values: [name]
    }
    const result = await this.client.query(query);
    return result.rows;
}

async delete(id) {
    const query = {
        text: `DELETE FROM "${this.tablename}" WHERE id=$1 RETURNING name`,
        values: [id]
    };
    const result = await this.client.query(query);
    return result.rows;
}

async update(name, id) {
    const query = {
        text: `UPDATE "${this.tablename}" SET name=$1 WHERE id=$2 RETURNING (name)`,
        values: [name, id],
    };
    const result = await this.client.query(query);
    return result.rows;
}

}


