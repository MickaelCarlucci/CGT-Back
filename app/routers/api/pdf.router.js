import { Router } from "express";
import multer from "multer";
import pdfController from "../../controllers/pdf.controller.js";
import controllerWrapper from "../../helpers/controllerWrapper.js";
import firebaseAuthMiddleware from "../../helpers/firebaseAuthMiddleware.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, "/var/www/uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 40 * 1024 * 1024 },
});

router.route("/upload").post(
  firebaseAuthMiddleware,
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ error: "Le fichier est trop volumineux (max 40MB)" });
      }
      next();
    });
  },
  controllerWrapper(pdfController.upload)
);
router
  .route("/download/:filename")
  .get(controllerWrapper(pdfController.download));
router.route("/views").get(controllerWrapper(pdfController.getAll));
router.route("/last").get(controllerWrapper(pdfController.getLastTract));
router
  .route("/views/:sectionId(\\d+)")
  .get(controllerWrapper(pdfController.getDocumentsBySection));
router
  .route("/delete/:fileId(\\d+)")
  .delete(firebaseAuthMiddleware, controllerWrapper(pdfController.deletePdf));

export default router;
