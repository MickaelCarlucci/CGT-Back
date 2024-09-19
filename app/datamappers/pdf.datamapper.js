import client from "../helpers/pg.client.js";

export async function findAll() {
  const query = {
    text: 'SELECT * FROM "leaflet_stored"',
  };
  const result = await client.query(query);
  return result.rows;
}

export async function findLastTract() {
  const query = {
    text: `SELECT * FROM "leaflet_stored"
WHERE section_id = 2 OR section_id = 3
ORDER BY created_at DESC
LIMIT 1;`
  };
  const result = await client.query(query);
  return result.rows[0];
}

export async function findById(id) {
  const query = {
    text: 'SELECT * FROM "leaflet_stored" WHERE id=$1',
    values: [id],
  };
  const result = await client.query(query);
  return result.rows[0];
}

export async function create(title, pdf_url, section_id, center_id) {
  const query = {
    text: 'INSERT INTO "leaflet_stored" ("title", "pdf_url", "section_id", "center_id") VALUES ($1, $2, $3, $4) RETURNING title, pdf_url',
    values: [title, pdf_url, section_id, center_id],
  };
  const result = await client.query(query);
  return result.rows[0];
}

export async function findAllPdfBySection(sectionId) {
  const query = {
    text: `SELECT "leaflet_stored".id, "leaflet_stored".title, "leaflet_stored".pdf_url FROM "leaflet_stored"
JOIN "section" ON "leaflet_stored".section_id = "section".id
WHERE "leaflet_stored".section_id = $1`,
    values: [sectionId],
  };
  const result = await client.query(query);
  return result.rows;
}

export async function findAllPdfByCenter(center_id) {
  const query = {
    text: `SELECT "leaflet_stored".id, "leaflet_stored".title, "leaflet_stored".pdf_url FROM "leaflet_stored"
    JOIN "center" ON "leaflet_stored".center_id = "center".id
    WHERE "leaflet_stored".center_id = $1`,
    values: [center_id],
  };
  const result = await client.query(query);
  return result.rows;
}
