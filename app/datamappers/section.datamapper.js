import client from "../helpers/pg.client.js";

export async function findAll() {
    const query = {
        text: 'SELECT * FROM "section" ORDER BY name ASC'
      }
      const result = await client.query(query);
      return result.rows;
}