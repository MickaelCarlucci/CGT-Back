import client from "../helpers/pg.client.js";

export async function findUsersByRoles() {
  const query = {
    text: `SELECT DISTINCT "user".id, "user".firstname, "user".lastname
FROM "role"
JOIN "user_has_role" ON "role".id = "user_has_role".role_id
JOIN "user" ON "user_has_role".user_id = "user".id
WHERE "role".id != 1
AND "user".id != 1
ORDER BY "user".lastname ASC;`,
  };
  const result = await client.query(query);
  return result.rows;
}

export async function findUserWithoutRoles() {
  const query = {
    text: `SELECT "user".id, "user".firstname, "user".lastname
FROM "user"
LEFT JOIN "user_has_role" ON "user".id = "user_has_role".user_id
WHERE "user_has_role".role_id IS NULL
ORDER BY "user".lastname ASC;`,
  };
  const result = await client.query(query);
  return result.rows;
}

export async function findUsersByCenter(centerId) {
  const query = {
    text: `SELECT DISTINCT "user".id, "user".firstname, "user".lastname FROM "center"
           JOIN "user" ON "center".id = "user".center_id
           JOIN "user_has_role" ON "user".id = "user_has_role".user_id
           JOIN "role" ON "user_has_role".role_id = "role".id
           WHERE "center".id = $1
           AND "role".id != 1
           ORDER BY "user".lastname ASC;`,
    values: [centerId],
  };
  const result = await client.query(query);
  return result.rows;
}

export async function findUsersByCenterByActivity(centerId, activityId) {
  const query = {
    text: `SELECT DISTINCT "user".id, "user".firstname, "user".lastname FROM "center"
             JOIN "user" ON "center".id = "user".center_id
             JOIN "user_has_role" ON "user".id = "user_has_role".user_id
             JOIN "role" ON "user_has_role".role_id = "role".id
             JOIN "center_has_activity" ON "center".id = "center_has_activity".center_id
             JOIN "activity" ON "center_has_activity".activity_id = "activity".id
             WHERE "center".id = $1
             AND "activity".id = $2
             AND "user".activity_id = $2
             AND "role".id != 1
             ORDER BY "user".lastname ASC;`,
    values: [centerId, activityId],
  };
  const result = await client.query(query);
  return result.rows;
}
