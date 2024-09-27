import { Router } from "express";
import electedController from "../../controllers/elected.controller.js";
import controllerWrapper from "../../helpers/controllerWrapper.js";
import jwtExpirationVerification from "../../helpers/jwtVerifyToken.js";

const router = Router();

router.route('/appointment').get(controllerWrapper(electedController.getAppointment));
router.route('/appointment/update').patch(jwtExpirationVerification, controllerWrapper(electedController.updateAppointment));


export default router;