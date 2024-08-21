import { Router } from "express";

import controllerWrapper from "../../helpers/controllerWrapper.js";
import usersController from "../../controllers/users.controller.js";
import profileController from "../../controllers/profile.controller.js";
import jwtExpirationVerification from "../../helpers/jwtVerifyToken.js";

const router = Router();

router.route('/signup').post(controllerWrapper(usersController.signUp));
router.route('/:userId(\\d+)/delete').delete(jwtExpirationVerification, controllerWrapper(usersController.deleteUserAccount));
router.route('/signin').post(controllerWrapper(usersController.signIn));
router.route('/password/reset').post(controllerWrapper(usersController.passwordReset))
router.route('/password/reseting').patch(controllerWrapper(usersController.resetingPassword))

router.route('/:userId(\\d+)/pseudo').patch(jwtExpirationVerification, controllerWrapper(profileController.pseudoModification));
router.route('/:userId(\\d+)/password/modify').patch(jwtExpirationVerification, controllerWrapper(profileController.passwordModification));
router.route('/:userId(\\d+)/mail').patch(jwtExpirationVerification, controllerWrapper(profileController.mailModification));

router.route('/refresh-token').post(controllerWrapper(usersController.RefreshToken));
router.route('/verify-token').post(controllerWrapper(usersController.verifyToken));

export default router;