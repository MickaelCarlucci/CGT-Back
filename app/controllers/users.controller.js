import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import * as userDatamapper from "../datamappers/users.datamapper.js";
import * as roleDatamapper from "../datamappers/role.datamapper.js"

const JWTSecret = process.env.JWT_SECRET;
const JWTRefreshSecret = process.env.JWT_REFRESH_SECRET;
const saltRounds = process.env.SALT_ROUNDS;

export default {
  signup: async (request, response) => {
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
        centerId,
        activityId
    } = request.body;

    // On convertit l'email en minuscule
    const normalizedMail = mail.toLowerCase();

    // on check que les entrées du user ne correspondent pas aux entrées unique de la table user
    const userEntriesCheck = await userDatamapper.checkUsersInformations(
      pseudo,
      normalizedMail,
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
        normalizedMail,  // On utilise l'email en minuscule
        encryptedPassword,
        firstQuestion,
        encryptedAnswer1,
        secondQuestion,
        encryptedAnswer2,
        centerId,
        activityId
    );

    if (!user) {
      return response
        .status(500)
        .json({ error: "Une erreur est survenue pendant l'enregistrement" });
    }

    const roleNewUser = await roleDatamapper.linkUserWithRole("9", user.id);
    if(!roleNewUser) {
      return response
        .status(500)
        .json({ error: "Une erreur est survenue pendant l'enregistrement du role" });
    }
    return response.status(200).send(user);
  },


  signIn: async (request, response) => {
    const { mail, password } = request.body;
    const normalizedMail = mail.toLowerCase();

    const user = await userDatamapper.findUserByEmail(normalizedMail);


    if (!user) {
        return response.status(401).json({ error: "L'utilisateur n'existe pas ou le mot de passe est incorrect" });
    }

    
    const userWithRole = await roleDatamapper.findRolesByUser(user.id)
    console.log('Rôles trouvés:', userWithRole);
    if(!userWithRole) {
      return response.status(401).json({ error: "L'utilisateur n'existe pas ou n'a pas été trouvé" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return response.status(401).json({ error: "L'utilisateur n'existe pas ou le mot de passe est incorrect" });
    }

    // Génération de l'access token
    const accessToken = jwt.sign({
        id: user.id,
        pseudo: user.pseudo,
        mail: user.mail,
    }, JWTSecret, { expiresIn: '30m' }); // Access token de courte durée (30 minutes par exemple)

    // Génération du refresh token
    const refreshToken = jwt.sign({
        id: user.id,
        pseudo: user.pseudo,
        mail: user.mail,
    }, JWTRefreshSecret, { expiresIn: '7d' }); // Refresh token de plus longue durée (7 jours par exemple)

      delete userWithRole.first_answer;
      delete userWithRole.second_answer;
      delete userWithRole.password;

      const updatedLastActivity = await userDatamapper.updateLastActivity(user.id);
    if(!updatedLastActivity) {
      return response.status(500).json({error: "Impossible de modifier la date d'acitivité"})
    }
    // Retourner l'access token et le refresh token dans la réponse
    return response.status(200).json({
        accessToken,
        refreshToken,
        user: userWithRole
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
  
    // Utilisez .json() pour envoyer une réponse JSON valide
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
      encryptedPassword,
    );

    if (!updatedUser) {
      return response
        .status(500)
        .json({ error: "Une erreur est survenue lors de la modification" });
    }

    return response.status(200).send(updatedUser);
  },

  refreshToken: async (request, response) => {
    const { refreshToken } = request.body;

    // Vérifier si le refreshToken est fourni
    if (!refreshToken) {
        return response.status(401).json({ error: "Refresh token manquant" });
    }

    try {
        // Vérification du refreshToken avec JWT
        const user = jwt.verify(refreshToken, JWTRefreshSecret);
        console.log("Vérification du refreshToken réussie : ", user);

        // Générer un nouveau access token
        const newAccessToken = jwt.sign(
            {
                id: user.id,
                pseudo: user.pseudo,
                mail: user.mail,
            },
            JWTSecret,
            { expiresIn: '30m' } // Nouveau access token avec une durée de vie de 30 minutes
        );

        console.log("Nouveau accessToken généré :", newAccessToken);

        // Mettre à jour la dernière activité de l'utilisateur
        const updatedLastActivity = await userDatamapper.updateLastActivity(user.id);
        if (!updatedLastActivity) {
            return response.status(500).json({ error: "Impossible de mettre à jour la date d'activité" });
        }

        // Ne renvoyez un nouveau refreshToken que si nécessaire
        // Si vous voulez conserver le refreshToken, vous ne le renvoyez pas
        return response.status(200).json({
            accessToken: newAccessToken, // Uniquement le nouveau accessToken
            refreshToken: refreshToken,  // Retourner l'ancien refreshToken s'il est toujours valide
        });
    } catch (error) {
        console.error("Erreur lors du rafraîchissement du token :", error);
        return response.status(403).json({ error: "Refresh token invalide ou expiré" });
    }
},

verifyToken: (request, response) => {
  const authHeader = request.headers['authorization'];

  if (!authHeader) {
      return response.status(401).json({ error: "Autorisation manquante" });
  }

  // Vérifiez que l'en-tête utilise le schéma "Bearer"
  const token = authHeader.split(' ')[1]; // Récupérer le token après "Bearer"

  if (!token) {
      return response.status(401).json({ error: "Token manquant, merci de vous reconnecter" });
  }

  // Vérification du token d'accès
  jwt.verify(token, JWTSecret, (error, decoded) => {
      if (error) {
          return response.status(401).json({ error: "Token expiré ou invalide" });
      }

      // Token valide, renvoyer les informations utilisateur
      return response.status(200).json({ message: "Token valide", user: decoded });
  });
},


}