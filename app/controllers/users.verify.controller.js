import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import * as userVerifyDatamapper from "../datamappers/userVerify.datamapper.js";
import * as userDatamapper from "../datamappers/users.datamapper.js";
import nodemailer from "nodemailer";

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
      centerId,
    } = request.body;

    // on check que les entrées du user ne correspondent pas aux entrées unique de la table user
    const userEntriesCheck = await userDatamapper.checkUsersInformations(
      pseudo,
      mail
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
    const token = uuidv4();
    // on crée le user dans la base de donnée
    const user = await userVerifyDatamapper.createUser(
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
    );

    if (!user) {
      return response
        .status(500)
        .json({ error: "Une erreur est survenue pendant l'enregistrement" });
    }
    // on renvoie les informations non sensibles du user
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationLink = `${process.env.NEXT_URL}/auth/verify?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: mail,
      subject: "Validez votre compte",
      html: `<p>Bonjour ${pseudo},</p>
               <p>Merci de vous être inscrit. Veuillez cliquer sur le lien ci-dessous pour vérifier votre compte :</p>
               <a href="${verificationLink}">Valider mon compte</a>`,
    };

    const mailSending = await transporter.sendMail(mailOptions);
    if (!mailSending) {
      return response
        .status(500)
        .json({ error: "Erreur lors de l'envoi de l'e-mail" });
    }

    return response
      .status(200)
      .json({ message: "Email de validation envoyé", user })
  },

  mailVerify: async (request, response) => {
    const { token } = request.query;

    const user = await userVerifyDatamapper.findUserByToken(token);
    if (!user) {
      return response.status(400).json({ error: "Clé invalide" });
    }

    const userVerify = await userDatamapper.createUser(
      user.pseudo,
      user.firstname,
      user.lastname,
      user.mail,
      user.password,
      user.first_question,
      user.first_answer,
      user.second_question,
      user.second_answer,
      user.center_id
    );
    if (!userVerify) {
      return response
        .status(500)
        .json({ error: "Une erreur est survenue pendant l'enregistrement" });
    }
    await userVerifyDatamapper.deleteUser(user.pseudo)
    return response.status(200).send(user.pseudo);


  },
};
