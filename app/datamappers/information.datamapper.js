import client from "../helpers/pg.client.js";

export async function create(title, contain, imageUrl, userId, sectionId) {
    const query = {
        text: `INSERT INTO "information" ("title", "contain", "image_url", "user_id", "section_id") VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        values: [title, contain, imageUrl, userId, sectionId]
    }
    const result = await client.query(query);
    return result.rows[0];
}

export async function findById(id) {
    const query = {
        text: `SELECT * FROM "information" WHERE id = $1;`,
        values: [id]
    }
    const result = await client.query(query);
    return result.rows[0];
}

export async function updateTitle(title, id) {
    const query = {
        text: `UPDATE "information" SET title = $1 WHERE id = $2 RETURNING title;`,
        values: [title, id]
    }
    const result = await client.query(query);
    return result.rows[0];
}

export async function updateContain(contain, id) {
    const query = {
        text: `UPDATE "information" SET contain = $1 WHERE id = $2 RETURNING contain;`,
        values: [contain, id]
    }
    const result = await client.query(query);
    return result.rows[0];
}

export async function lastNews() {
    const query = {
        text: `(
  SELECT 
    'information' AS source,
    id,
    title,
    contain,
    image_url,
    NULL AS pdf_url,
    section_id,
    created_at
  FROM information
)
UNION
(
  SELECT
    'leaflet_stored' AS source,
    id,
    title,
    NULL AS contain,
    NULL AS image_url,
    pdf_url,
    section_id,
    created_at
  FROM leaflet_stored
	WHERE section_id = 2
)
ORDER BY created_at DESC
LIMIT 3;`
    }
    const result = await client.query(query);
    return result.rows;
}

export async function TenLastNews() {
    const query = {
        text: `SELECT * FROM "information" WHERE section_id = 6
                ORDER BY created_at DESC LIMIT 10`
    }
    const response = await client.query(query);
    return response.rows;
}

export async function TenLastDidYouKnow() {
    const query = {
        text: `SELECT * FROM "information" WHERE section_id = 11
                ORDER BY created_at DESC LIMIT 10`
    }
    const response = await client.query(query);
    return response.rows;
}

export async function DeleteNews(newsId) {
    const query = {
        text: `DELETE FROM "information" WHERE id = $1`,
        values: [newsId]
    }
    const response = await client.query(query);
    return response.rows[0];
}

