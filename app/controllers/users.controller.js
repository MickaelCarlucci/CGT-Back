import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import * as userDatamapper from "../datamappers/users.datamapper.js";

const JWTSecret = process.env.JWT_SECRET;
const JWTRefreshExpiration = process.env.JWT_REFRESH_EXPIRATION;
const saltRounds = process.env.SALT_ROUNDS;

export default {
signUp: async (request, response) => {
    delete request.body.passwordConfirm; // on supprime le passwordConfirm

    // on récupère les infos du body
    const {
        pseudo,
        firstname,
        lastname,
        mail,
        password,
        firstQuestion,
        firstAnswer,
        secondQuestion,
        secondAnswer,
        centerId
    } = request.body;


    // on check que les entrées du user ne correspondent pas aux entrées unique de la table user
    const userEntriesCheck = await userDatamapper.checkUsersInformations(
      pseudo,
      mail,
    );

    if (userEntriesCheck[0]) {
      return response
        .status(401)
        .json({ error: "L'utilisateur ou l'email existe déjà" });
    }
    // on encrypte le mot de passe
    const salt = await bcrypt.genSalt(parseInt(saltRounds, 10));

    const encryptedPassword = await bcrypt.hash(password, salt);
    const encryptedAnswer1 = await bcrypt.hash(firstAnswer, salt);
    const encryptedAnswer2 = await bcrypt.hash(secondAnswer, salt);
    // on crée le user dans la base de donnée
    const user = await userDatamapper.createUser(
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
    );

    if (!user) {
      return response
        .status(500)
        .json({ error: "Une erreur est survenue pendant l'enregistrement" });
    }
    // on renvoie les informations non sensibles du user
    return response.status(200).send(user);
  },

  signIn: async (request, response) => {
    const { mail, password } = request.body;

    const user = await userDatamapper.findUserByEmail(mail);
    //  vérifie que l'utilisateur existe
    if (!user) {
      return response
        .status(401)
        .json({
          error: "L'utilisateur n'éxiste pas ou le mot de passe est incorrect",
        });
    }
    //  vérifie que le password encrypté est correct avec la base de donnée
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return response
        .status(401)
        .json({
          error: "L'utilisateur n'éxiste pas ou le mot de passe est incorrect",
        });
    }
    //  donne un token a l'utilisateur après les vérification
    const accessToken = jwt.sign({
      id: user.id,
      pseudo: user.pseudo,
      mail: user.mail,
    }, JWTSecret, {
      expiresIn: JWTRefreshExpiration,
    });

    // retourne les information dans la réponse
    const userAuth = {
      id: user.id,
      pseudo: user.pseudo,
      email: user.mail,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      token: accessToken,
    };

    return response.status(200).send(userAuth);
  },

  deleteUserAccount: async (request, response) => {
   
      const { userId } = request.params;
      const { mail } = request.body;

      const user = await userDatamapper.findUserById(userId);

      if (!user) {
        return response.status(401).json({ error: "Le compte est introuvable" });
      }

      if (user.mail !== mail) {
        return response.status(401).json({
          error: "Merci de saisir l'adresse mail correspondant à votre compte",
        });
      }

      const deletedUser = await userDatamapper.deleteUser(mail);

      return response.status(200).send(deletedUser);
  },

  passwordReset: async (request, response) => {
    const { mail, answer1, answer2 } = request.body;
  
    const user = await userDatamapper.findUserByEmail(mail);
  
    if (!user) {
      return response.status(401).json({ error: "Utilisateur introuvable" });
    }
  
    const questions = {
      question1: user.first_question,
      question2: user.second_question,
    };
  
    const validAnswer1 = await bcrypt.compare(answer1, user.first_answer);
  
    if (!validAnswer1) {
      return response.status(401).json({ error: "Réponse incorrecte" });
    }
  
    const validAnswer2 = await bcrypt.compare(answer2, user.second_answer);
  
    if (!validAnswer2) {
      return response.status(401).json({ error: "Réponse incorrecte" });
    }
  
    // Utilisez .json() pour envoyer une réponse JSON valide
    return response.status(200).json({ questions, mail });
  },

  resetingPassword: async (request, response) => {
    delete request.body.passwordConfirm;

    const { mail, password } = request.body;

    const user = await userDatamapper.findUserByEmail(mail);

    if (!user) {
      return response.status(401).json({ error: "Utilisateur introuvable" });
    }

    const salt = await bcrypt.genSalt(parseInt(saltRounds, 10));

    const encryptedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await userDatamapper.updateUserPassword(
      mail,
      encryptedPassword,
    );

    if (!updatedUser) {
      return response
        .status(500)
        .json({ error: "Une erreur est survenue lors de la modification" });
    }

    return response.status(200).send(updatedUser);
  },

}