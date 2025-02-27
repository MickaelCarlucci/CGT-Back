import { Router } from "express";
import infoController from "../../controllers/information.controller.js";
import controllerWrapper from "../../helpers/controllerWrapper.js";
import firebaseAuthMiddleware from "../../helpers/firebaseAuthMiddleware.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("images"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = Router();

router
  .route("/news/:userId(\\d+)")
  .post(
    firebaseAuthMiddleware,
    upload.single("image"),
    controllerWrapper(infoController.newInformation)
  );

router.route("/news").get(controllerWrapper(infoController.recentInformation));

router.route("/latestNews").get(controllerWrapper(infoController.LastNews));

router
  .route("/latestDidYouKnow")
  .get(controllerWrapper(infoController.LastDidYouKnow));

router
  .route("/delete/:newsId(\\d+)")
  .delete(
    firebaseAuthMiddleware,
    controllerWrapper(infoController.deleteInformation)
  );

router
  .route("/news/:newsId(\\d+)")
  .get(controllerWrapper(infoController.getOneNews));

router
  .route("/news/:newsId(\\d+)/updateTitle")
  .patch(
    firebaseAuthMiddleware,
    controllerWrapper(infoController.updateTitleNews)
  );

router
  .route("/news/:newsId(\\d+)/updateContain")
  .patch(
    firebaseAuthMiddleware,
    controllerWrapper(infoController.updateContainNews)
  );

export default router;
