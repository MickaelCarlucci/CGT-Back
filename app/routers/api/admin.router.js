import { Router } from "express";

import centerController from "../../controllers/center.controller.js";
import controllerWrapper from "../../helpers/controllerWrapper.js";

const router = Router();
router.route('/centers').get(controllerWrapper(centerController.findAllCenters));
router.route('/center/:centerId(\\d+)').get(controllerWrapper(centerController.findCenterById));
router.route('/addCenter').post(controllerWrapper(centerController.addNewCenter));



export default router;