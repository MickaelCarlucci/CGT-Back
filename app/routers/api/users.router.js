import { Router } from "express";

import controllerWrapper from "../../helpers/controllerWrapper.js";
import usersController from "../../controllers/users.controller.js";

const router = Router();

router.route('/signup').post(controllerWrapper(usersController.signUp));
router.route('/:userId(\\d+)/delete').delete(controllerWrapper(usersController.deleteUserAccount));
router.route('/signin').post(controllerWrapper(usersController.signIn));

export default router;