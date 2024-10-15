import bcrypt from "bcrypt";
import admin from "../../firebaseAdmin.js"; // Firebase Admin SDK importé
import * as userDatamapper from "../datamappers/users.datamapper.js";
import * as roleDatamapper from "../datamappers/role.datamapper.js";

const saltRounds = process.env.SALT_ROUNDS;

export default {
  signup: async (request, response) => {
    delete request.body.passwordConfirm; // on supprime le passwordConfirm

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
      centerId,
      activityId
    } = request.body;

    const normalizedMail = mail.toLowerCase();

    // Vérifier si l'utilisateur existe déjà
    const userEntriesCheck = await userDatamapper.checkUsersInformations(
      pseudo,
      normalizedMail
    );

    if (userEntriesCheck[0]) {
      return response.status(401).json({ error: "L'utilisateur ou l'email existe déjà" });
    }

    // Chiffrement du mot de passe et des réponses aux questions secrètes
    const salt = await bcrypt.genSalt(parseInt(saltRounds, 10));
    const encryptedPassword = await bcrypt.hash(password, salt);
    const encryptedAnswer1 = await bcrypt.hash(firstAnswer, salt);
    const encryptedAnswer2 = await bcrypt.hash(secondAnswer, salt);

    // Créer l'utilisateur dans la base de données
    const user = await userDatamapper.createUser(
      pseudo,
      firstname,
      lastname,
      normalizedMail,
      encryptedPassword,
      firstQuestion,
      encryptedAnswer1,
      secondQuestion,
      encryptedAnswer2,
      centerId,
      activityId
    );

    if (!user) {
      return response.status(500).json({ error: "Une erreur est survenue pendant l'enregistrement" });
    }

    // Lier l'utilisateur à un rôle
    const roleNewUser = await roleDatamapper.linkUserWithRole("9", user.id);
    if (!roleNewUser) {
      return response.status(500).json({ error: "Une erreur est survenue pendant l'enregistrement du rôle" });
    }

    return response.status(200).send(user);
  },

  signIn: async (request, response) => {
    const { mail, password } = request.body;
    const normalizedMail = mail.toLowerCase();

    // Vérifier si l'utilisateur existe
    const user = await userDatamapper.findUserByEmail(normalizedMail);
    if (!user) {
      return response.status(401).json({ error: "L'utilisateur n'existe pas ou le mot de passe est incorrect" });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return response.status(401).json({ error: "L'utilisateur n'existe pas ou le mot de passe est incorrect" });
    }

    // Optionnel : ici, vous pouvez générer une session côté client avec Firebase.
    // L'application frontend va gérer la connexion via Firebase Auth côté client.
    
    // Mettre à jour la dernière activité de l'utilisateur
    const updatedLastActivity = await userDatamapper.updateLastActivity(user.id);
    if (!updatedLastActivity) {
      return response.status(500).json({ error: "Impossible de modifier la date d'activité" });
    }

    // Ne plus renvoyer les tokens ici, Firebase gère ça côté frontend
    return response.status(200).json({
      message: "Connexion réussie",
      user
    });
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
    const normalizedMail = mail.toLowerCase();

    const user = await userDatamapper.findUserByEmail(normalizedMail);

    if (!user) {
      return response.status(401).json({ error: "Utilisateur introuvable" });
    }

    const validAnswer1 = await bcrypt.compare(answer1, user.first_answer);
    if (!validAnswer1) {
      return response.status(401).json({ error: "Réponse incorrecte" });
    }

    const validAnswer2 = await bcrypt.compare(answer2, user.second_answer);
    if (!validAnswer2) {
      return response.status(401).json({ error: "Réponse incorrecte" });
    }

    return response.status(200).json(normalizedMail);
  },

  resetingPassword: async (request, response) => {
    delete request.body.passwordConfirm;

    const { mail, password } = request.body;
    const normalizedMail = mail.toLowerCase();

    const user = await userDatamapper.findUserByEmail(normalizedMail);

    if (!user) {
      return response.status(401).json({ error: "Utilisateur introuvable" });
    }

    const salt = await bcrypt.genSalt(parseInt(saltRounds, 10));
    const encryptedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await userDatamapper.updateUserPassword(
      normalizedMail,
      encryptedPassword
    );

    if (!updatedUser) {
      return response.status(500).json({ error: "Une erreur est survenue lors de la modification" });
    }

    return response.status(200).send(updatedUser);
  },

  // Vérification du token envoyé depuis le frontend
  verifyToken: async (request, response) => {
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      return response.status(401).json({ error: "Autorisation manquante" });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return response.status(401).json({ error: "Token manquant, merci de vous reconnecter" });
    }

    try {
      // Vérifier le token Firebase côté serveur
      const decodedToken = await admin.auth().verifyIdToken(token);
      return response.status(200).json({ message: "Token valide", user: decodedToken });
    } catch (error) {
      return response.status(401).json({ error: "Token expiré ou invalide" });
    }
  }
};
