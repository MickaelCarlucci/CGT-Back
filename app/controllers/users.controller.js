import admin from "../../firebaseAdmin.js"; // Firebase Admin SDK importé
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

    // Vérifier si l'utilisateur existe déjà
    const userEntriesCheck = await userDatamapper.checkUsersInformations(
      pseudo,
      normalizedMail
    );

    if (userEntriesCheck[0]) {
      return response
        .status(401)
        .json({ error: "L'utilisateur ou l'email existe déjà" });
    }

    // Ajout d'un log pour vérifier les valeurs avant l'insertion
    console.log("Données utilisateur avant création : ", {
      pseudo,
      firstname,
      lastname,
      mail: normalizedMail,
      firebaseUID,
      centerId,
      activityId,
      emailVerified: false,
    });

    try {
      // Créer l'utilisateur avec emailVerified = false par défaut
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
    console.log("FirebaseUID reçu :", firebaseUID);

    try {
      const userRecord = await admin.auth().getUser(firebaseUID);

      if (userRecord.emailVerified) {
        // Mettre à jour le statut de vérification de l'email dans la base de données
        const updatedUser = await userDatamapper.updateEmailVerifiedStatus(
          true,
          firebaseUID
        );

        if (!updatedUser) {
          return response
            .status(500)
            .json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
        }
        // Attribuer le rôle à l'utilisateur
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
        console.log("L'email n'est pas encore vérifié.");
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
    const { token } = request.body; // Le token JWT envoyé depuis le frontend
    console.log("Token reçu :", token); // Ajout du log

    // Vérification du token Firebase côté serveur pour s'assurer de l'identité de l'utilisateur
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Decoded Token :", decodedToken); // Vérifie le token décodé
    const firebaseUID = decodedToken.uid;
    console.log("Recherche de l'utilisateur avec Firebase UID :", firebaseUID);

    // Vérifier si l'utilisateur existe dans la base de données
    const user = await userDatamapper.findByFirebaseUID(firebaseUID);
    console.log("Utilisateur trouvé dans la base de données :", user);
    if (!user) {
      return response
        .status(401)
        .json({
          error: "L'utilisateur n'existe pas ou le mot de passe est incorrect",
        });
    }

    // Mettre à jour la dernière activité de l'utilisateur
    const updatedLastActivity = await userDatamapper.updateLastActivity(
      user.id
    );
    if (!updatedLastActivity) {
      return response
        .status(500)
        .json({ error: "Impossible de modifier la date d'activité" });
    }

    // Renvoyer les informations de l'utilisateur (vous pouvez personnaliser ces informations)
    return response.status(200).json({
      message: "Connexion réussie",
      user, // Vous pouvez filtrer les données pour ne renvoyer que les informations nécessaires
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

  // Vérification du token envoyé depuis le frontend
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
      // Vérifier le token Firebase côté serveur
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Utiliser le firebaseUID (uid) pour mettre à jour la dernière activité
      const userWithUID = await userDatamapper.findByFirebaseUID(
        decodedToken.uid
      );
      if (!userWithUID) {
        return response
          .status(401)
          .json({ error: "L'utilisateur n'a pas été retrouvé" });
      }

      // Supposons que ta base de données enregistre l'utilisateur avec cet UID
      const updatedLastActivity = await userDatamapper.updateLastActivity(
        userWithUID.id
      );

      if (!updatedLastActivity) {
        return response
          .status(500)
          .json({ error: "Impossible de modifier la date d'activité" });
      }

      // Si la mise à jour est réussie, retourner une réponse avec succès
      return response
        .status(200)
        .json({
          message: "Token valide et activité mise à jour",
          user: decodedToken,
        });
    } catch (error) {
      console.error(error);
      return response.status(401).json({ error: "Token expiré ou invalide" });
    }
  },

  getUserByUID: async (request, response) => {
    const { uid } = request.params; // UID transmis en tant que paramètre de l'URL

    if (!uid) {
      return response.status(400).json({ error: "UID manquant" });
    }

    try {
      // Récupérer l'utilisateur depuis la base de données en utilisant l'UID
      const user = await userDatamapper.findByFirebaseUID(uid);

      if (!user) {
        return response.status(404).json({ error: "Utilisateur non trouvé" });
      }

      // Retourner les informations de l'utilisateur
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
