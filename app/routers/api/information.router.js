import { Router } from "express";
import infoController from "../../controllers/information.controller.js";
import controllerWrapper from "../../helpers/controllerWrapper.js";
import jwtExpirationVerification from "../../helpers/jwtVerifyToken.js";
import multer from "multer";  // Utilisation d'import pour multer
import path from "path";

// Configuration de Multer pour stocker les images dans le dossier images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve('images')); // Résolution du chemin depuis la racine du projet
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Générer un nom unique pour chaque fichier
  }
});

const upload = multer({ storage: storage });

const router = Router();

// Route pour créer une nouvelle information avec un fichier image
router.route('/news/:userId(\\d+)')//!
  .post(jwtExpirationVerification, upload.single('image'), controllerWrapper(infoController.newInformation));

// Route pour la dernière nouvelle crée
router.route('/news')//!
  .get(controllerWrapper(infoController.recentInformation));

// Route pour obtenir les dernières informations
router.route('/latest')//!
  .get(controllerWrapper(infoController.LastInformations));

//Route pour supprimer une information
router.route('/delete/:newsId(\\d+)')//!
  .delete(jwtExpirationVerification, controllerWrapper(infoController.deleteInformation));

export default router;
