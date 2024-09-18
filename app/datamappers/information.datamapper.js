import client from "../helpers/pg.client.js";

export async function create(title, contain, imageUrl, userId, sectionId) {
    const query = {
        text: `INSERT INTO "information" ("title", "contain", "image_url", "user_id", "section_id") VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        values: [title, contain, imageUrl, userId, sectionId]
    }
    const result = await client.query(query);
    return result.rows[0];
}

export async function TenLastNews() {
    const query = {
        text: `SELECT * FROM "information"
                ORDER BY created_at DESC LIMIT 10`
    }
    const response = await client.query(query);
    return response.rows;
}