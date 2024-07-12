import { Router } from "express";

import controllerWrapper from "../../helpers/controllerWrapper.js";
import usersController from "../../controllers/users.controller.js";
import profileController from "../../controllers/profile.controller.js";

const router = Router();

router.route('/signup').post(controllerWrapper(usersController.signUp));
router.route('/:userId(\\d+)/delete').delete(controllerWrapper(usersController.deleteUserAccount));
router.route('/signin').post(controllerWrapper(usersController.signIn));
router.route('/password/reset').post(controllerWrapper(usersController.passwordReset))
router.route('/password/reseting').patch(controllerWrapper(usersController.resetingPassword))

router.route('/:userId(\\d+)/pseudo').patch(controllerWrapper(profileController.pseudoModification));
router.route('/:userId(\\d+)/password/modify').patch(controllerWrapper(profileController.passwordModification));
router.route('/:userId(\\d+)/mail').patch(controllerWrapper(profileController.mailModification));

export default router;