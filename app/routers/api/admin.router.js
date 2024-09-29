import { Router } from "express";

import centerController from "../../controllers/center.controller.js";
import activityController from "../../controllers/activity.controller.js";
import roleController from "../../controllers/role.controller.js";
import sectionController from "../../controllers/section.controller.js";
import controllerWrapper from "../../helpers/controllerWrapper.js";
import jwtExpirationVerification from "../../helpers/jwtVerifyToken.js";


const router = Router();
//center routes
router.route('/centers').get(controllerWrapper(centerController.findAllCenters));//!
router.route('/center/:centerId(\\d+)').get(controllerWrapper(centerController.findCenterById));
router.route('/addCenter').post(jwtExpirationVerification, controllerWrapper(centerController.addNewCenter));//!
router.route('/:centerId(\\d+)/deleteCenter').delete(jwtExpirationVerification, controllerWrapper(centerController.deleteCenter));//!
router.route('/:centerId(\\d+)/updateCenter').post(jwtExpirationVerification, controllerWrapper(centerController.modificationCenter));
router.route('/center/:centerId(\\d+)/unlink/:activityId(\\d+)').delete(jwtExpirationVerification, controllerWrapper(centerController.unlickActivityAndCenter));//!
router.route('/center/:centerId(\\d+)/activities').get(controllerWrapper(centerController.findActivitiesByCenter));//!

//activity routes
router.route('/activities').get(controllerWrapper(activityController.findAllActivities));//!
router.route('/activity/:activityId(\\d+)').get(controllerWrapper(activityController.findActivityById));
router.route('/addActivity').post(jwtExpirationVerification, controllerWrapper(activityController.addNewActivity));//!
router.route('/:activityId(\\d+)/deleteActivity').delete(jwtExpirationVerification, controllerWrapper(activityController.deleteActivity));//!
router.route('/:activityId(\\d+)/updateActivity').post(jwtExpirationVerification, controllerWrapper(activityController.modificationActivity));
router.route('/link').post(jwtExpirationVerification, controllerWrapper(activityController.linkActivityWithNewCenter));//!
router.route('/activity/:activityId(\\d+)/centers').get(controllerWrapper(activityController.findCenterByActivity));

//role routes
router.route('/roles').get(controllerWrapper(roleController.findRoles));//!
router.route('/role/:roleId(\\d+)').get(controllerWrapper(roleController.findRoleById));
router.route('/role/:userId(\\d+)/link').post( controllerWrapper(roleController.linkUserWithRole));//!
router.route('/role/:userId(\\d+)/unLink').delete(jwtExpirationVerification, controllerWrapper(roleController.unlinkUserWithRole));//!
router.route('/:userId(\\d+)/roles').get(controllerWrapper(roleController.checkRoleFromUser));

//section route
router.route('/sections').get(controllerWrapper(sectionController.getAllSection));//!

//contact routes
router.route('/elected').get(controllerWrapper(roleController.getElected));//!
router.route('/elected/:centerId(\\d+)').get(controllerWrapper(roleController.getElectedByCenter));//!
router.route('/electedRole/:roleId(\\d+)').get(controllerWrapper(roleController.getElectedByRole));//!


export default router;