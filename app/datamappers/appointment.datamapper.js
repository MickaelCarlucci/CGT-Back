import client from '../helpers/pg.client.js';

export async function find(){
    const query = {
        text: `SELECT * FROM "appointment" WHERE id = 1`
    }
    const result = await client.query(query);
    return result.rows[0];
}

export async function update(subject, date, linkMeeting) {
    const query = {
        text: `UPDATE "appointment" SET "subject" = $1, "date" = $2, "linkMeeting" = $3 WHERE id = 1 RETURNING *; `,
        values: [subject, date, linkMeeting]
    }
    const result = await client.query(query);
    return result.rows[0]
}