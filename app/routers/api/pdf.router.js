import { Router } from "express";
import multer from 'multer';
import pdfController from '../../controllers/pdf.controller.js'
import controllerWrapper from "../../helpers/controllerWrapper.js";

const router = Router();

// Configuration de multer pour stocker les fichiers dans le dossier 'uploads/'
const storage = multer.diskStorage({
    destination: (request, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Génère un nom unique pour le fichier
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
      }
  });
  
  const upload = multer({ storage });

  router.route('/upload').post(upload.single('file'), controllerWrapper(pdfController.upload));
  router.route('/download/:userId(\\d+)').get(controllerWrapper(pdfController.download));
  router.route('/views').get(controllerWrapper(pdfController.getAll));

  export default router;