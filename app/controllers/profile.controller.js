import bcrypt from "bcrypt";
import * as userDatamapper from "../datamappers/users.datamapper.js";

const saltRounds = process.env.SALT_ROUNDS;

export default {
    findOneUserByMail: async (request, response) => {
      const mail = request.query.email;
      const user = await userDatamapper.findUserByEmail(mail);
      if (!user) {
        return response.status(403).json({ error: "Utilisateur introuvable" });
      }

      return response.status(200).send(user);
    },

    findOneUserById: async (request, response) => {
      const {userId} = request.params;
      const user = await userDatamapper.findUserById(userId);
      if (!user) {
        return response.status(403).json({ error: "Utilisateur introuvable" });
      }
      delete user.password;
      delete user.first_answer;
      delete user.second_answer;
      return response.status(200).send(user);
    },

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

    firstnameModification: async (request, response) => {
      const { userId } = request.params;
      const newFirstname = request.body.firstname;
      const user = await userDatamapper.findUserById(userId);
       if (!user) {
          return response.status(403).json({ error: "Utilisateur introuvable" });
      }

      const firstnameUpdated = await userDatamapper.updatePseudo(newFirstname, userId);
      if (!firstnameUpdated) {
        return response.status(500).json({ error: "Une erreur est survenue lors de la mise à jour de votre pseudo" });
      }
      return response.status(200).send(firstnameUpdated);
  },

  lastnameModification: async (request, response) => {
    const { userId } = request.params;
    const newLastname = request.body.lastname;
    const user = await userDatamapper.findUserById(userId);
     if (!user) {
        return response.status(403).json({ error: "Utilisateur introuvable" });
    }

    const lastnameUpdated = await userDatamapper.updateLastname(newLastname, userId);
    if (!lastnameUpdated) {
      return response.status(500).json({ error: "Une erreur est survenue lors de la mise à jour de votre pseudo" });
    }
    return response.status(200).send(lastnameUpdated);
},

    passwordModification: async(request, response) => {
        const { userId } = request.params;
        const { password, oldPassword } = request.body;

        const user = await userDatamapper.findUserById(userId);
        if (!user) {
          return response.status(403).json({ error: "Utilisateur introuvable" });
        }
        const mail = user.mail;
      
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
      
        const NewPassword = await userDatamapper.updateUserPassword(mail, encryptedNewPassword);
        if (!NewPassword) {
          return response.status(500).json({error: "Problème avec le server"})
        }
        return response.status(200).json({ mail });
    },

    mailModification: async(request, response) => {
        const { userId } = request.params;

        const newEmail = request.body.mail;
      
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
          return response.status(500).json({ error: "Une erreur est survenue lors de la mise à jour de votre adresse email" });
        }
      
        return response.status(200).send(emailUpdated);
    },

    firstQuestionAndAnswerModification: async(request, response) => {
      const { userId } = request.params;

      const newFirstQuestion = request.body.first_question;
      const newFirstAnswer = request.body.first_answer;
    
      const user = await userDatamapper.findUserById(userId);
      if (!user) {
        return response.status(403).json({ error: "utilisateur introuvable" });
      }
    
      const questionUpdated = await userDatamapper.updateFirstQuestion(newFirstQuestion, userId);
      if (!questionUpdated) {
        return response.status(500).json({ error: "Une erreur est survenue lors de la mise à jour de votre question" });
      }

      const salt = await bcrypt.genSalt(parseInt(saltRounds, 10));
      const encryptedAnswer = await bcrypt.hash(newFirstAnswer, salt)
      
      await userDatamapper.updateFirstAnswer(encryptedAnswer)
      return response.status(200).send(questionUpdated);
  },

  secondQuestionAndAnswerModification: async(request, response) => {
    const { userId } = request.params;

    const newSecondQuestion = request.body.second_question;
    const newSecondAnswer = request.body.second_answer;
  
    const user = await userDatamapper.findUserById(userId);
    if (!user) {
      return response.status(403).json({ error: "utilisateur introuvable" });
    }
  
    const questionUpdated = await userDatamapper.updateSecondQuestion(newSecondQuestion, userId);
    if (!questionUpdated) {
      return response.status(500).json({ error: "Une erreur est survenue lors de la mise à jour de votre question" });
    }

    const salt = await bcrypt.genSalt(parseInt(saltRounds, 10));
    const encryptedAnswer = await bcrypt.hash(newSecondAnswer, salt)
    
    await userDatamapper.updateSecondAnswer(encryptedAnswer)
    return response.status(200).send(questionUpdated);
},

  ModificationUserCenter: async(request,response) => {
    const {userId} = request.params;
    const newCenter = request.body.center_id;

    const user = await userDatamapper.findUserById(userId);
    if (!user) {
      return response.status(403).json({ error: "utilisateur introuvable" });
    }


    const centerUpdated = await userDatamapper.updateCenter(newCenter, userId)
    if (!centerUpdated) {
      return response.status(500).json({ error: "Une erreur est survenue lors de la mise à jour du centre" });
    }
    return response.status(200).send(centerUpdated)
  }
    
}

