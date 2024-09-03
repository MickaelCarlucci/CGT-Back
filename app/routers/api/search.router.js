import { Router } from "express";

import searchController from "../../controllers/search.controller.js"
import controllerWrapper from "../../helpers/controllerWrapper.js";
import jwtExpirationVerification from "../../helpers/jwtVerifyToken.js";

const router = Router();

router.route('/users').get(controllerWrapper(searchController.getAllUsers));
router.route('/users/:centerId(\\d+)').get(controllerWrapper(searchController.getUsersByCenter));
router.route('/users/:centerId(\\d+)/:activityId(\\d+)').get(controllerWrapper(searchController.getUsersByActivity));

export default router;