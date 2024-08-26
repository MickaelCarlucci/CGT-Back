import client from "../helpers/pg.client.js";

export async function findUserByToken(token) {
    const query = {
      text: 'SELECT * FROM "user_signup" WHERE token=$1',
      values: [token],
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
    encryptedPassword,
    firstQuestion,
    encryptedAnswer1,
    secondQuestion,
    encryptedAnswer2,
    token,
    centerId
) {
    const query = {
        text: 'INSERT INTO "user_signup" ("pseudo", "firstname", "lastname", "mail", "password", "first_question", "first_answer", "second_question", "second_answer", "token", "center_id") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING (pseudo, mail, created_at)',
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
          token,
          centerId
        ],
    };
    const result = await client.query(query);
    return result.rows;
  }

  export async function deleteUser(user) {
    const query = {
      text: `DELETE FROM "user_verify" WHERE pseudo=$1 RETURNING pseudo`,
      values: [user],
    };
    const result = await client.query(query);
    return result.rows;
  }
