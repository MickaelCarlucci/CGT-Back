import { Router } from "express";

import controllerWrapper from "../../helpers/controllerWrapper.js";
import usersController from "../../controllers/users.controller.js";
import profileController from "../../controllers/profile.controller.js";
// Import du nouveau middleware de vérification Firebase
import firebaseAuthMiddleware from "../../helpers/firebaseAuthMiddleware.js";

const router = Router();

router.route('/signup').post(controllerWrapper(usersController.signup)); //!
router.route('/:userId(\\d+)/delete').delete(firebaseAuthMiddleware, controllerWrapper(usersController.deleteUserAccount)); //!
router.route('/signin').post(controllerWrapper(usersController.signIn)); //!
router.route('/password/reset').post(controllerWrapper(usersController.passwordReset)); //!
router.route('/password/reseting').patch(controllerWrapper(usersController.resetingPassword)); //!
router.route('/findUser').get(controllerWrapper(profileController.findOneUserByMail));
router.route('/findUserProfile/:userId(\\d+)').get(controllerWrapper(profileController.findOneUserById)); //!

router.route('/:userId(\\d+)/pseudo').patch(firebaseAuthMiddleware, controllerWrapper(profileController.pseudoModification)); //!
router.route('/:userId(\\d+)/firstname').patch(firebaseAuthMiddleware, controllerWrapper(profileController.firstnameModification)); //!
router.route('/:userId(\\d+)/lastname').patch(firebaseAuthMiddleware, controllerWrapper(profileController.lastnameModification)); //!
router.route('/:userId(\\d+)/mail').patch(firebaseAuthMiddleware, controllerWrapper(profileController.mailModification)); //!
router.route('/:userId(\\d+)/password/modify').patch(firebaseAuthMiddleware, controllerWrapper(profileController.passwordModification)); //!
router.route('/:userId(\\d+)/firstSecretSecurity').patch(firebaseAuthMiddleware, controllerWrapper(profileController.firstQuestionAndAnswerModification)); //!
router.route('/:userId(\\d+)/secondSecretSecurity').patch(firebaseAuthMiddleware, controllerWrapper(profileController.secondQuestionAndAnswerModification)); //!
router.route('/:userId(\\d+)/phone').patch(firebaseAuthMiddleware, controllerWrapper(profileController.phoneModification)); //!
router.route('/:userId(\\d+)/center').patch(firebaseAuthMiddleware, controllerWrapper(profileController.ModificationUserCenter)); //!
router.route('/:userId(\\d+)/activity').patch(firebaseAuthMiddleware, controllerWrapper(profileController.ModificationActivity)); //!

router.route('/refresh-token').post(controllerWrapper(usersController.refreshToken)); //!
router.route('/verify-token').post(controllerWrapper(usersController.verifyToken)); //!

export default router;
