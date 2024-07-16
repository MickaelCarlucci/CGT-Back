import { Router } from "express";

import centerController from "../../controllers/center.controller.js";
import activityController from "../../controllers/activity.controller.js";
import controllerWrapper from "../../helpers/controllerWrapper.js";

const router = Router();
//center routes
router.route('/centers').get(controllerWrapper(centerController.findAllCenters));
router.route('/center/:centerId(\\d+)').get(controllerWrapper(centerController.findCenterById));
router.route('/addCenter').post(controllerWrapper(centerController.addNewCenter));
router.route('/:centerId(\\d+)/deleteCenter').delete(controllerWrapper(centerController.deleteCenter));
router.route('/:centerId(\\d+)/updateCenter').post(controllerWrapper(centerController.modificationCenter));
router.route('/center/:centerId(\\d+)/unlink').delete(controllerWrapper(centerController.unlickActivityAndCenter))

//activity routes
router.route('/activities').get(controllerWrapper(activityController.findAllActivities));
router.route('/activity/:activityId(\\d+)').get(controllerWrapper(activityController.findActivityById));
router.route('/addActivity').post(controllerWrapper(activityController.addNewActivity));
router.route('/:activityId(\\d+)/deleteActivity').delete(controllerWrapper(activityController.deleteActivity));
router.route('/:activityId(\\d+)/updateActivity').post(controllerWrapper(activityController.modificationActivity));
router.route('/link').post(controllerWrapper(activityController.linkActivityWithNewCenter));

export default router;