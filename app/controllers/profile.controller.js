import * as userDatamapper from "../datamappers/users.datamapper.js";

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


  phoneModification: async(request, response) => {
    const { userId } = request.params;

    const newPhone = request.body.phone;
  
    const user = await userDatamapper.findUserById(userId);
    if (!user) {
      return response.status(403).json({ error: "utilisateur introuvable" });
    }
  
    const phoneUpdated = await userDatamapper.updatePhone(newPhone, userId);
    if (!phoneUpdated) {
      return response.status(500).json({ error: "Une erreur est survenue lors de la mise à jour de votre téléphone" });
    }

    return response.status(200).send(phoneUpdated);
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
  },
   
  ModificationActivity: async(request, response) => {
    const {userId} = request.params;
    const activity_id = request.body.activity_id;
    
    const user = await userDatamapper.findUserById(userId);
    if (!user) {
      return response.status(403).json({ error: "utilisateur introuvable" });
    }

    const activityUpdated = await userDatamapper.updateActivity(activity_id, userId)

    if (!activityUpdated) {
      return response.status(500).json({ error: "Une erreur est survenue lors de la mise à jour de l'activité" });
    }

    return response.status(200).send(activityUpdated)
  }
}

