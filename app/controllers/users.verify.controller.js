//import bcrypt from "bcrypt";
//import { v4 as uuidv4 } from "uuid";
// import * as userVerifyDatamapper from "../datamappers/userVerify.datamapper.js";
// import * as userDatamapper from "../datamappers/users.datamapper.js";
//import nodemailer from "nodemailer";
//import mailgunTransport from "nodemailer-mailgun-transport";

//const saltRounds = process.env.SALT_ROUNDS;


//export default {
    // signUp: async (request, response) => {
    //     delete request.body.passwordConfirm; // On supprime le passwordConfirm
    
    //     // On récupère les infos du body
    //     const {
    //       pseudo,
    //       firstname,
    //       lastname,
    //       mail,
    //       password,
    //       firstQuestion,
    //       firstAnswer,
    //       secondQuestion,
    //       secondAnswer,
    //       centerId,
    //     } = request.body;
    
    //     // On check que les entrées du user ne correspondent pas aux entrées uniques de la table user
    //     const userEntriesCheck = await userDatamapper.checkUsersInformations(pseudo, mail);
    
    //     if (userEntriesCheck[0]) {
    //       return response.status(401).json({ error: "L'utilisateur ou l'email existe déjà" });
    //     }
    
    //     // On encrypte le mot de passe
    //     const salt = await bcrypt.genSalt(parseInt(saltRounds, 10));
    //     const encryptedPassword = await bcrypt.hash(password, salt);
    //     const encryptedAnswer1 = await bcrypt.hash(firstAnswer, salt);
    //     const encryptedAnswer2 = await bcrypt.hash(secondAnswer, salt);
    //     const token = uuidv4();
            
    //         // Configurer le transporteur d'email avec Mailgun
    //         const transporter = nodemailer.createTransport(mailgunTransport({
    //           auth: {
    //             api_key: process.env.MAILGUN_API_KEY, // Clé API Mailgun
    //                 domain: process.env.MAILGUN_DOMAIN,   // Domaine Mailgun
    //               }
    //             }));
                
    //             // Créer le lien de vérification
    //             const verificationLink = `${process.env.NEXT_URL}/auth/verify?token=${token}`;
                
    //             // Définir les options de l'email
    //             const mailOptions = {
    //               from: `Didier <postmaster@${process.env.MAILGUN_DOMAIN}>`,
    //               to: mail,
    //               subject: "Validez votre compte",
    //               html: `<p>Bonjour ${pseudo},</p>
    //               <p>Merci de vous être inscrit. Veuillez cliquer sur le lien ci-dessous pour vérifier votre compte :</p>
    //               <a href="${verificationLink}">Valider mon compte</a>`,
    //             };
                
    //             // Envoyer l'email
    //             const confirmationMailSendin = await transporter.sendMail(mailOptions);

    //             if(!confirmationMailSendin) {
    //               return response.status(500).json({ error: "Le mail n'a pas pu être envoyé" });
    //             }
                
                
    //             const user = await userVerifyDatamapper.createUser(
    //                 pseudo,
    //                 firstname,
    //                 lastname,
    //                 mail,
    //                 encryptedPassword,
    //                 firstQuestion,
    //                 encryptedAnswer1,
    //                 secondQuestion,
    //                 encryptedAnswer2,
    //                 token,
    //                 centerId,
    //             );
            
    //             if (!user) {
    //                 throw new Error("Une erreur est survenue pendant l'enregistrement");
    //             }
    //             return response.status(200).json({ message: "Votre enregistrement a été fait avec succés", user });
    //         },
            
//             mailVerify: async (request, response) => {
//               const { token } = request.query;
              
//               const user = await userVerifyDatamapper.findUserByToken(token);
//               if (!user) {
//                 return response.status(400).json({ error: "Clé invalide" });
//               }
              
//               const userVerify = await userDatamapper.createUser(
//                 user.pseudo,
//                 user.firstname,
//       user.lastname,
//       user.mail,
//       user.password,
//       user.first_question,
//       user.first_answer,
//       user.second_question,
//       user.second_answer,
//       user.center_id
//     );
//     if (!userVerify) {
//       return response
//         .status(500)
//         .json({ error: "Une erreur est survenue pendant l'enregistrement" });
//     }
//     await userVerifyDatamapper.deleteUser(user.pseudo)
//     return response.status(200).send(user.pseudo);


//   },
// };
