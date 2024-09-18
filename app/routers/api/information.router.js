import { Router } from "express";
import infoController from "../../controllers/information.controller.js";
import controllerWrapper from "../../helpers/controllerWrapper.js";
import jwtExpirationVerification from "../../helpers/jwtVerifyToken.js";

const router = Router();
router.route('/new/:userId(\\d+)').post(controllerWrapper(infoController.newInformation));
router.route('/latest').get(controllerWrapper(infoController.LastInformations));


export default router;