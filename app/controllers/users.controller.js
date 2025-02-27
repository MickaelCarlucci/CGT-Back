import admin from "../../firebaseAdmin.js";
import * as userDatamapper from "../datamappers/users.datamapper.js";
import * as roleDatamapper from "../datamappers/role.datamapper.js";

export default {
  signup: async (request, response) => {
    const {
      pseudo,
      firstname,
      lastname,
      mail,
      firebaseUID,
      centerId,
      activityId,
    } = request.body;

    const normalizedMail = mail.toLowerCase();

    const userEntriesCheck = await userDatamapper.checkUsersInformations(
      pseudo,
      normalizedMail
    );

    if (userEntriesCheck[0]) {
      return response
        .status(401)
        .json({ error: "L'utilisateur ou l'email existe déjà" });
    }

    try {
      const user = await userDatamapper.createUser(
        pseudo,
        firstname,
        lastname,
        normalizedMail,
        firebaseUID,
        centerId,
        activityId
      );

      if (!user) {
        return response
          .status(500)
          .json({ error: "Une erreur est survenue pendant l'enregistrement" });
      }

      return response
        .status(200)
        .json({ message: "Utilisateur créé, veuillez vérifier votre email." });
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur :", error);
      return response.status(500).json({ error: "Erreur interne du serveur" });
    }
  },

  verifyEmailAndAssignRole: async (request, response) => {
    const { firebaseUID } = request.body;

    try {
      const userRecord = await admin.auth().getUser(firebaseUID);

      if (userRecord.emailVerified) {
        const updatedUser = await userDatamapper.updateEmailVerifiedStatus(
          true,
          firebaseUID
        );

        if (!updatedUser) {
          return response
            .status(500)
            .json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
        }
        const roleNewUser = await roleDatamapper.linkUserWithRole(
          "8",
          updatedUser.id
        );

        if (!roleNewUser) {
          return response
            .status(500)
            .json({ error: "Erreur lors de l'attribution du rôle" });
        }

        return response
          .status(200)
          .json({ message: "Email vérifié et rôle attribué avec succès." });
      } else {
        return response
          .status(400)
          .json({ error: "L'e-mail n'a pas encore été vérifié." });
      }
    } catch (error) {
      console.error("Erreur lors du traitement de la vérification :", error);
      return response
        .status(500)
        .json({ error: "Erreur lors du traitement de la vérification." });
    }
  },

  signIn: async (request, response) => {
    const { token } = request.body;

    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUID = decodedToken.uid;

    const user = await userDatamapper.findByFirebaseUID(firebaseUID);
    if (!user) {
      return response.status(401).json({
        error: "L'utilisateur n'existe pas ou le mot de passe est incorrect",
      });
    }

    const updatedLastActivity = await userDatamapper.updateLastActivity(
      user.id
    );
    if (!updatedLastActivity) {
      return response
        .status(500)
        .json({ error: "Impossible de modifier la date d'activité" });
    }

    return response.status(200).json({
      message: "Connexion réussie",
      user,
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

  deleteUserByAdmin: async (request, response) => {
    const userId = request.params.userId;

    const userUid = await userDatamapper.findUID(userId);

    if (!userUid) {
      return response
        .status(404)
        .json({ error: "Aucun utilisateur n'a été trouvé" });
    }
    await admin.auth().deleteUser(userUid.firebaseUID);
    return response
      .status(200)
      .send({ message: "Utilisateur supprimé avec succès" });
  },

  verifyToken: async (request, response) => {
    const authHeader = request.headers["authorization"];

    if (!authHeader) {
      return response.status(401).json({ error: "Autorisation manquante" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return response
        .status(401)
        .json({ error: "Token manquant, merci de vous reconnecter" });
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);

      const userWithUID = await userDatamapper.findByFirebaseUID(
        decodedToken.uid
      );
      if (!userWithUID) {
        return response
          .status(401)
          .json({ error: "L'utilisateur n'a pas été retrouvé" });
      }

      const updatedLastActivity = await userDatamapper.updateLastActivity(
        userWithUID.id
      );

      if (!updatedLastActivity) {
        return response
          .status(500)
          .json({ error: "Impossible de modifier la date d'activité" });
      }

      return response.status(200).json({
        message: "Token valide et activité mise à jour",
        user: decodedToken,
      });
    } catch (error) {
      console.error(error);
      return response.status(401).json({ error: "Token expiré ou invalide" });
    }
  },

  getUserByUID: async (request, response) => {
    const { uid } = request.params;

    if (!uid) {
      return response.status(400).json({ error: "UID manquant" });
    }

    try {
      const user = await userDatamapper.findByFirebaseUID(uid);

      if (!user) {
        return response.status(404).json({ error: "Utilisateur non trouvé" });
      }

      return response.status(200).json({ user });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'utilisateur par UID:",
        error
      );
      return response.status(500).json({ error: "Erreur interne du serveur" });
    }
  },
};
