import client from "../helpers/pg.client.js";

export async function create(question, options) {
  try {
    await client.query("BEGIN"); // Démarre une transaction

    // Étape 1 : Insérer la question dans la table poll et récupérer l'ID
    const pollQuery = {
      text: `INSERT INTO poll (question) VALUES ($1) RETURNING id`,
      values: [question],
    };
    const pollResult = await client.query(pollQuery);
    const pollId = pollResult.rows[0].id; // Récupérer l'ID du sondage créé

    // Étape 2 : Insérer les options dans la table poll_options
    for (let option of options) {
      await client.query({
        text: `INSERT INTO poll_options (poll_id, option) VALUES ($1, $2)`,
        values: [pollId, option], // Utiliser l'ID du sondage pour chaque option
      });
    }

    await client.query("COMMIT"); // Valider la transaction
    return { pollId, question, options }; // Retourne les détails du sondage créé
  } catch (error) {
    await client.query("ROLLBACK"); // Annuler la transaction en cas d'erreur
    throw error;
  }
}

export async function insertVote(pollId, userId) {
  const query = {
    text: `INSERT INTO "votes" (poll_id, user_id) VALUES ($1, $2) RETURNING *;`,
    values: [pollId, userId],
  };
  const result = await client.query(query);
  return result.rows[0];
}

export async function updateVote(optionId) {
  const query = {
    text: `UPDATE "poll_options" SET vote = vote + 1 WHERE id = $1 RETURNING *;`,
    values: [optionId],
  };
  const result = await client.query(query);
  return result.rows[0];
}

export async function checkVote(pollId, userId) {
  const query = {
    text: `SELECT 1 FROM "votes" WHERE poll_id = $1 AND user_id = $2;`,
    values: [pollId, userId],
  };
  const result = await client.query(query);
  return result.rowCount > 0;
}

export async function findAll() {
  const query = {
    text: `SELECT * FROM "poll" ORDER BY "poll".created_at DESC;`,
  };
  const result = await client.query(query);
  return result.rows;
}

export async function findTenLastPoll() {
  const query = {
    text: ` SELECT 
            "poll".id, "poll".question
            FROM "poll"
            ORDER BY "poll".created_at DESC
            LIMIT 10;`,
  };
  const result = await client.query(query);
  return result.rows;
}

export async function findOne(id) {
  const query = {
    text: `SELECT * FROM "poll" 
               WHERE id = $1;`,
    values: [id],
  };
  const result = await client.query(query);
  return result.rows[0];
}

export async function findOptions(pollId) {
    const query = {
        text: `SELECT "poll_options".id, "poll_options".option, "poll_options".vote FROM "poll_options"
                WHERE "poll_id" = $1;`,
        values: [pollId]
    };
    const result = await client.query(query);
    return result.rows;
}

export async function deletePoll(pollId) {
  const query = {
    text: `DELETE FROM "poll" WHERE id = $1`,
    values: [pollId]
  }
  const result = await client.query(query);
  return result.rows[0];
}
