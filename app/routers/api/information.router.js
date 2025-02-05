import { Router } from "express";
import infoController from "../../controllers/information.controller.js";
import controllerWrapper from "../../helpers/controllerWrapper.js";
import firebaseAuthMiddleware from "../../helpers/firebaseAuthMiddleware.js";
import multer from "multer"; // Utilisation d'import pour multer
import path from "path";

// Configuration de Multer pour stocker les images dans le dossier images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("images")); // Résolution du chemin depuis la racine du projet
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Générer un nom unique pour chaque fichier
  },
});

const upload = multer({ storage: storage });

const router = Router();

// Route pour créer une nouvelle information avec un fichier image
router
  .route("/news/:userId(\\d+)")
  .post(
    firebaseAuthMiddleware,
    upload.single("image"),
    controllerWrapper(infoController.newInformation)
  );

// Route pour la dernière nouvelle crée
router.route("/news").get(controllerWrapper(infoController.recentInformation));

// Route pour obtenir les dernières news
router.route("/latestNews").get(controllerWrapper(infoController.LastNews));

// Route pour obtenir les dernière "le saviez-vous ?"
router
  .route("/latestDidYouKnow")
  .get(controllerWrapper(infoController.LastDidYouKnow));

//Route pour supprimer une information
router
  .route("/delete/:newsId(\\d+)")
  .delete(
    firebaseAuthMiddleware,
    controllerWrapper(infoController.deleteInformation)
  );

//Route pour trouver une news
router
  .route("/news/:newsId(\\d+)")
  .get(controllerWrapper(infoController.getOneNews));

//Route pour modifier un titre
router
  .route("/news/:newsId(\\d+)/updateTitle")
  .patch(
    firebaseAuthMiddleware,
    controllerWrapper(infoController.updateTitleNews)
  );

//Route pour modifier un contenu
router
  .route("/news/:newsId(\\d+)/updateContain")
  .patch(
    firebaseAuthMiddleware,
    controllerWrapper(infoController.updateContainNews)
  );

export default router;
