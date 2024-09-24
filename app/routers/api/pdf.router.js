import { Router } from "express";
import multer from "multer";
import pdfController from "../../controllers/pdf.controller.js";
import controllerWrapper from "../../helpers/controllerWrapper.js";
import jwtExpirationVerification from "../../helpers/jwtVerifyToken.js";

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

  // route pdf
  router.route('/upload').post(jwtExpirationVerification, upload.single('file'), controllerWrapper(pdfController.upload));//!
  router.route('/download/:filename').get(controllerWrapper(pdfController.download));//!
  router.route('/views').get(controllerWrapper(pdfController.getAll));//!
  router.route('/last').get(controllerWrapper(pdfController.getLastTract)); //!
  router.route('/views/:sectionId(\\d+)').get(controllerWrapper(pdfController.getDocumentsBySection));//!
  router.route('/delete/:fileId(\\d+)').delete(jwtExpirationVerification, controllerWrapper(pdfController.deletePdf));//!




  export default router;