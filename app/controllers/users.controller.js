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
    if (!user) {
        return response.status(401).json({ error: "L'utilisateur n'existe pas ou le mot de passe est incorrect" });
    }

    const userWithRole = await roleDatamapper.findRolesByUser(user.id)
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
    }, JWTSecret, { expiresIn: '15m' }); // Access token de courte durée (15 minutes par exemple)

    // Génération du refresh token
    const refreshToken = jwt.sign({
        id: user.id,
        pseudo: user.pseudo,
        mail: user.mail,
    }, JWTRefreshSecret, { expiresIn: '7d' }); // Refresh token de plus longue durée (7 jours par exemple)

      delete userWithRole.first_answer;
      delete userWithRole.second_answer;
      delete userWithRole.password;
    // Retourner l'access token et le refresh token dans la réponse
    return response.status(200).json({
        accessToken,
        refreshToken,
        userWithRole
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
  
    const user = await userDatamapper.findUserByEmail(mail);
  
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
    return response.status(200).json(mail);
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

  RefreshToken: async (request,response) => {
    const { refreshToken } = request.body;
    if (!refreshToken) {
        return response.status(401).json({ error: "Refresh token manquant" });
    }

    jwt.verify(refreshToken, JWTRefreshSecret, (error, user) => {
        if (error) {
            return response.status(403).json({ error: "Refresh token invalide ou expiré" });
        }

        // Générer un nouveau access token
        const newAccessToken = jwt.sign({
            id: user.id,
            pseudo: user.pseudo,
            mail: user.mail,
        }, JWTSecret, { expiresIn: '15m' }); // Nouveau access token de courte durée

        return response.status(200).json({
            accessToken: newAccessToken,
        });
    });
  },

  verifyToken: (request, response) => {
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      return response.status(401).json({ error: "Autorisation manquante" });
    }

    // Le token est sous la forme "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
      return response.status(401).json({ error: "Token manquant" });
    }

    // Vérifier la validité du token
    jwt.verify(token, JWTSecret, (error, decoded) => {
      if (error) {
        return response.status(401).json({ error: "Token expiré ou invalide" });
      }

      // Token valide, renvoie les informations d'utilisateur si besoin
      return response.status(200).json({ message: "Token valide", user: decoded });
    });
  }

}