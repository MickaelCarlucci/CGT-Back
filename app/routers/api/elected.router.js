import { Router } from "express";
import electedController from "../../controllers/elected.controller.js";
import controllerWrapper from "../../helpers/controllerWrapper.js";
import firebaseAuthMiddleware from "../../helpers/firebaseAuthMiddleware.js";

const router = Router();

router.route('/appointment').get(controllerWrapper(electedController.getAppointment));
router.route('/appointment/update').patch(firebaseAuthMiddleware, controllerWrapper(electedController.updateAppointment));


export default router;