import client from "../helpers/pg.client.js";

export async function findUserByEmail(mail) {
    const query = {
      text: 'SELECT * FROM "user" WHERE mail=$1',
      values: [mail],
    };
    const result = await client.query(query);
    return result.rows[0];
  }

  export async function findUserById(id) {
    const query = {
      text: `SELECT "user".*, string_agg("role".name, ', ') AS roles 
FROM "user"
JOIN "user_has_role" ON "user".id = "user_has_role".user_id
JOIN "role" ON "user_has_role".role_id = "role".id
WHERE "user".id = $1
GROUP BY "user".id;`,
      values: [id],
    };
    const result = await client.query(query);
    return result.rows[0];
  }

  export async function findByPseudo(newpseudo) {
    const query = {
      text: 'SELECT * FROM "user" WHERE pseudo=$1',
      values: [newpseudo],
    };
    const result = await client.query(query);
    return result.rows[0];
  }

  export async function findByFirebaseUID(UID) {
    const query = {
      text: `SELECT "user".*, string_agg("role".name, ', ') AS roles 
FROM "user"
JOIN "user_has_role" ON "user".id = "user_has_role".user_id
JOIN "role" ON "user_has_role".role_id = "role".id
WHERE "user"."firebaseUID" = $1
GROUP BY "user".id;`,
      values: [UID],
    };
    const result = await client.query(query);
    return result.rows[0];
  }

  export async function checkUsersInformations(pseudo, mail) {
    const query = {
      text: 'SELECT "pseudo" FROM "user" WHERE pseudo=$1 OR mail=$2',
      values: [pseudo, mail],
    };
    const result = await client.query(query);
    return result.rows;
  }

  export async function createUser ( 
    pseudo,
    firstname,
    lastname,
    mail,
    firebaseUID,
    centerId,
    activityId
) {
    const query = {
        text: 'INSERT INTO "user" ("pseudo", "firstname", "lastname", "mail", "firebaseUID", "center_id", "activity_id") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, pseudo, mail, created_at;',
        values: [
          pseudo,
          firstname,
          lastname,
          mail,
          firebaseUID,
          centerId,
          activityId
        ],
    };
    try {
      const result = await client.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Détails de l\'erreur lors de l\'insertion :', error.message);
      console.error('Requête exécutée :', query.text);
      console.error('Valeurs :', query.values);
      throw error;
    }
  }

  export async function deleteUser(mail) {
    const query = {
      text: `DELETE FROM "user" WHERE mail=$1 RETURNING mail`,
      values: [mail],
    };
    const result = await client.query(query);
    return result.rows;
  }

  export async function updatePseudo(newPseudo, userId) {
    const query = {
        text: 'UPDATE "user" SET pseudo=$1 WHERE id=$2 RETURNING (pseudo, mail) ',
        values: [newPseudo, userId],
    };
    const result = await client.query(query);
    return result.rows[0];
  }

  export async function updateFirstname(newFirstname, userId) {
    const query = {
        text: 'UPDATE "user" SET firstname=$1 WHERE id=$2 RETURNING (firstname, mail) ',
        values: [newFirstname, userId],
    };
    const result = await client.query(query);
    return result.rows[0];
  }

  export async function updateLastname(newLastname, userId) {
    const query = {
        text: 'UPDATE "user" SET lastname=$1 WHERE id=$2 RETURNING (lastname, mail) ',
        values: [newLastname, userId],
    };
    const result = await client.query(query);
    return result.rows[0];
  }

  export async function updateMail(newMail, userId) {
    const query = {
        text: 'UPDATE "user" SET mail=$1 WHERE id=$2 RETURNING (pseudo, mail) ',
        values: [newMail, userId],
    };
    const result = await client.query(query);
    return result.rows[0];
  }

  export async function updateFirstQuestion(newQuestion, userId) {
    const query = {
        text: 'UPDATE "user" SET first_question=$1 WHERE id=$2 RETURNING (pseudo, first_question) ',
        values: [newQuestion, userId],
    };
    const result = await client.query(query);
    return result.rows[0];
  }  

  export async function updateFirstAnswer(newAnswer, userId) {
    const query = {
        text: 'UPDATE "user" SET first_answer=$1 WHERE id=$2 RETURNING (first_question)',
        values: [newAnswer, userId],
    };
    const result = await client.query(query);
    return result.rows[0];
  }  

  export async function updateSecondQuestion(newQuestion, userId) {
    const query = {
        text: 'UPDATE "user" SET second_question=$1 WHERE id=$2 RETURNING (pseudo, second_question) ',
        values: [newQuestion, userId],
    };
    const result = await client.query(query);
    return result.rows[0];
  }  

  export async function updateSecondAnswer(newAnswer, userId) {
    const query = {
        text: 'UPDATE "user" SET second_answer=$1 WHERE id=$2 RETURNING (second_question) ',
        values: [newAnswer, userId],
    };
    const result = await client.query(query);
    return result.rows[0];
  }

  export async function updatePhone(phone, userId) {
    const query = {
        text: 'UPDATE "user" SET phone=$1 WHERE id=$2 RETURNING phone',
        values: [phone, userId],
    };
    const result = await client.query(query);
    return result.rows[0];
  }


  export async function updateUserPassword(mail, encryptedNewPassword) {
    const query = {
      text: 'UPDATE "user" SET password=$2 WHERE mail=$1 RETURNING (pseudo, mail)',
      values: [mail, encryptedNewPassword],
    };
    const result = await client.query(query);
    return result.rows[0];
  }

  export async function updateCenter(center, userId) {
    const query = {
        text: 'UPDATE "user" SET center_id=$1 WHERE id=$2 RETURNING (center_id)',
        values: [center, userId],
    };
    const result = await client.query(query);
    return result.rows[0];
  }

  export async function updateActivity(activityId, userId) {
    const query = {
      text:'UPDATE "user" SET activity_id=$1 WHERE id=$2 RETURNING (activity_id);',
      values: [activityId, userId],
    };
    const result = await client.query(query);
    return result.rows[0];
  }

  export async function updateLastActivity(userId) {
    const query = {
      text: `UPDATE "user" SET last_activity = NOW() WHERE id = $1 RETURNING (last_activity);`,
      values: [userId]
    };
    const result = await client.query(query);
    return result.rows[0];
  }

  export async function updateEmailVerifiedStatus(isVerified, firebaseUID) {
    const query = {
      text: `UPDATE "user" SET emailVerified = $1 WHERE firebaseUID = $2 RETURNING (mail);`,
      values: [isVerified, firebaseUID]
    };
    const result = await client.query(query);
    return result.rows[0];
  }

  
