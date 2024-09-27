import client from "../helpers/pg.client.js";

export async function findAllRoles() {
  const query = {
    text: 'SELECT * FROM "role" WHERE "role".id != 1',
  };
  const result = await client.query(query);
  return result.rows;
}

export async function findOneRole(roleId) {
  const query = {
    text: 'SELECT * FROM "role" WHERE id=$1',
    values: [roleId],
  };
  const result = await client.query(query);
  return result.rows[0];
}

export async function linkUserWithRole(roleId, userId) {
  const query = {
    text: 'INSERT INTO "user_has_role" ("role_id", "user_id") VALUES ($1, $2) RETURNING role_id, user_id',
    values: [roleId, userId],
  };
  const result = await client.query(query);
  return result.rows[0];
}

export async function unlinkUserFromRole(roleId, userId) {
  const query = {
    text: 'DELETE FROM "user_has_role" WHERE role_id=$1 AND user_id=$2 RETURNING role_id, user_id',
    values: [roleId, userId],
  };
  const result = await client.query(query);
  return result.rows[0];
}

export async function findRolesByUser(userId) {
  const query = {
    text: `SELECT u.*, STRING_AGG(r.name, ', ') AS roles
FROM "user" u
JOIN "user_has_role" ur ON u.id = ur.user_id
JOIN "role" r ON ur.role_id = r.id
WHERE u.id =$1
GROUP BY u.id, u.pseudo;`,
    values: [userId],
  };
  const result = await client.query(query);
  return result.rows[0];
}

export async function findElected() {
  const query = {
    text: `SELECT "user".id, "user".lastname, "user".firstname, "user".phone, "user".mail, "user".center_id FROM "user"
          JOIN "user_has_role" ON "user".id = "user_has_role".user_id
          JOIN "role" ON "user_has_role".role_id = "role".id
          WHERE "role".id = 5
          ORDER BY "user".lastname ASC;`,
  }
  const result = await client.query(query);
  return result.rows;
}

export async function findElectedByCenter(centerId) {
  const query = {
    text: `SELECT "user".id, "user".lastname, "user".firstname, "user".phone, "user".mail, "user".center_id FROM "user"
          JOIN "user_has_role" ON "user".id = "user_has_role".user_id
          JOIN "role" ON "user_has_role".role_id = "role".id
          WHERE "role".id = 5
          AND "user".center_id = $1;
          ORDER BY "user".lastname ASC;`,
    values: [centerId]
  }
  const result = await client.query(query);
  return result.rows;
}


