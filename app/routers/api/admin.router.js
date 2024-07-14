import { Router } from "express";

import centerController from "../../controllers/center.controller.js";
import controllerWrapper from "../../helpers/controllerWrapper.js";

const router = Router();
router.route('/centers').get(controllerWrapper(centerController.findAllCenters));



export default router;