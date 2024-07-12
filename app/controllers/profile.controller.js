import bcrypt from "bcrypt";
import * as userDatamapper from "../datamappers/users.datamapper.js";

const saltRounds = process.env.SALT_ROUNDS;

export default {
    pseudoModification: async (request, response) => {
        const { userId } = request.params;
        const newPseudo = request.body.pseudo;
        const user = await userDatamapper.findUserById(userId);
         if (!user) {
            return response.status(403).json({ error: "Utilisateur introuvable" });
        }
        const databaseComparePseudo = await userDatamapper.findByPseudo(newPseudo);
        if (databaseComparePseudo) {
            return response.status(403).json({ error: "Ce pseudonyme existe déjà" });
        }
        const pseudoUpdated = await userDatamapper.updatePseudo(newPseudo, userId);
        if (!pseudoUpdated) {
          return response.status(500).json({ error: "Une erreur est survenue lors de la mise à jour de votre pseudo" });
        }
        return response.status(200).send(pseudoUpdated);
    },

    passwordModification: async(request, response) => {
        const { userId } = request.params;
        const { password, oldPassword } = request.body;

        const user = await userDatamapper.findUserById(userId);
        if (!user) {
          return response.status(403).json({ error: "Utilisateur introuvable" });
        }
      
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
          return response.status(403).json({ error: "L'ancien mot de passe est incorrect" });
        }
      
        const salt = await bcrypt.genSalt(parseInt(saltRounds, 10));
      
        const encryptedNewPassword = await bcrypt.hash(password, salt);
      
        const comparedPassword = await bcrypt.compare(encryptedNewPassword, oldPassword);
        if (comparedPassword) {
          return response.status(403).json({ error: "Le nouveau mot de passe ne peut pas être identique à votre ancien mot de passe" });
        }
      
        await userDatamapper.updateUserPassword(userId, encryptedNewPassword);
        return response.status(200).send();
    },

    mailModification: async(request, response) => {
        const { userId } = request.params;

        const newEmail = request.body.email;
      
        const user = await userDatamapper.findUserById(userId);
        if (!user) {
          return response.status(403).json({ error: "utilisateur introuvable" });
        }
      
        const databaseCompareMail = await userDatamapper.findUserByEmail(newEmail);
        if (databaseCompareMail) {
          return response.status(403).json({ error: "Cet email existe déjà" });
        }
      
        const emailUpdated = await userDatamapper.updateMail(newEmail, userId);
        if (!emailUpdated) {
          return response.status(500).json({ error: "Une erreur est survenue lors de la mise à jour de votre pseudo" });
        }
      
        return response.status(200).send(emailUpdated);
    },
    
}

