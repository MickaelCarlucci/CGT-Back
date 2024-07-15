import { Router } from "express";

import centerController from "../../controllers/center.controller.js";
import controllerWrapper from "../../helpers/controllerWrapper.js";

const router = Router();
//center route
router.route('/centers').get(controllerWrapper(centerController.findAllCenters));
router.route('/center/:centerId(\\d+)').get(controllerWrapper(centerController.findCenterById));
router.route('/addCenter').post(controllerWrapper(centerController.addNewCenter));
router.route('/:centerId(\\d+)/deleteCenter').delete(controllerWrapper(centerController.deleteCenter));
router.route('/:centerId(\\d+)/updateCenter').post(controllerWrapper(centerController.modificationCenter));


export default router;