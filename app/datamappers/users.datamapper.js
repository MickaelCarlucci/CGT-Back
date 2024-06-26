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
      text: 'SELECT * FROM "user" WHERE id=$1',
      values: [id],
    };
    const result = await client.query(query);
    return result.rows[0];
  }

  export async function checkUsersInformations(pseudo, mail, ) {
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
    encryptedPassword,
    firstQuestion,
    encryptedAnswer1,
    secondQuestion,
    encryptedAnswer2,
    centerId
) {
    const query = {
        text: 'INSERT INTO "user" ("pseudo", "firstname", "lastname", "mail", "password", "first_question", "first_answer", "second_question", "second_answer", "center_id") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING (pseudo, mail, created_at)',
        values: [
          pseudo,
          firstname,
          lastname,
          mail,
          encryptedPassword,
          firstQuestion,
          encryptedAnswer1,
          secondQuestion,
          encryptedAnswer2,
          centerId
        ],
    };
    const result = await client.query(query);
    return result.rows;
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
        text: 'UPDATE "user" SET mail=$1 WHERE id=$2 RETURNING (pseudo, mail) ',
        values: [newPseudo, userId],
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

  export async function updateUserPassword(mail, newPassword) {
    const query = {
      text: 'UPDATE "user" SET password=$2 WHERE mail=$1 RETURNING (pseudo, mail)',
      values: [mail, newPassword],
    };
    const result = await client.query(query);
    return result.rows[0];
  }

  export async function updateCenter(center) {
    const query = {
        text: 'UPDATE "center" SET name=$1 RETURNING (name)',
        values: [center],
    };
    const result = await client.query(query);
    return result.rows[0];
  }

  export async function updateActivity(activity) {
    const query = {
        text: 'UPDATE "activity" SET name=$1 RETURNING (name)',
        values: [activity],
    };
    const result = await client.query(query);
    return result.rows[0];
  }
