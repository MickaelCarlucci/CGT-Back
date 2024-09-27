import client from '../helpers/pg.client.js';

export async function find(){
    const query = {
        text: `SELECT * FROM "appointment" WHERE id = 1`
    }
    const result = await client.query(query);
    return result.rows[0];
}

export async function update(subject, date, link) {
    const query = {
        text: `UPDATE "appointment" SET "subject" = $1, "date" = $2, "link" = $3 WHERE id = 1 RETURNING *; `,
        values: [subject, date, link]
    }
    const result = await client.query(query);
    return result.rows[0]
}