import { Router } from "express";

import controllerWrapper from "../../helpers/controllerWrapper.js";
import usersController from "../../controllers/users.controller.js";
import profileController from "../../controllers/profile.controller.js";
//import userVerifyController from "../../controllers/users.verify.controller.js"
import jwtExpirationVerification from "../../helpers/jwtVerifyToken.js";


const router = Router();

router.route('/signup').post(controllerWrapper(usersController.signup));//!
router.route('/:userId(\\d+)/delete').delete(jwtExpirationVerification, controllerWrapper(usersController.deleteUserAccount));//!
router.route('/signin').post(controllerWrapper(usersController.signIn));//!
router.route('/password/reset').post(controllerWrapper(usersController.passwordReset));//!
router.route('/password/reseting').patch(controllerWrapper(usersController.resetingPassword));//!
router.route('/findUser').get(controllerWrapper(profileController.findOneUserByMail));
router.route('/findUserProfile/:userId(\\d+)').get(controllerWrapper(profileController.findOneUserById));//!

router.route('/:userId(\\d+)/pseudo').patch(jwtExpirationVerification, controllerWrapper(profileController.pseudoModification));//!
router.route('/:userId(\\d+)/firstname').patch(jwtExpirationVerification, controllerWrapper(profileController.firstnameModification));//!
router.route('/:userId(\\d+)/lastname').patch(jwtExpirationVerification, controllerWrapper(profileController.lastnameModification));//!
router.route('/:userId(\\d+)/mail').patch(jwtExpirationVerification, controllerWrapper(profileController.mailModification));//!
router.route('/:userId(\\d+)/password/modify').patch(jwtExpirationVerification, controllerWrapper(profileController.passwordModification));//!
router.route('/:userId(\\d+)/firstSecretSecurity').patch(jwtExpirationVerification, controllerWrapper(profileController.firstQuestionAndAnswerModification));//!
router.route('/:userId(\\d+)/secondSecretSecurity').patch(jwtExpirationVerification, controllerWrapper(profileController.secondQuestionAndAnswerModification));//!
router.route('/:userId(\\d+)/phone').patch(jwtExpirationVerification, controllerWrapper(profileController.phoneModification));//!
router.route('/:userId(\\d+)/center').patch(jwtExpirationVerification, controllerWrapper(profileController.ModificationUserCenter));//!
router.route('/:userId(\\d+)/activity').patch(jwtExpirationVerification, controllerWrapper(profileController.ModificationActivity));//!

router.route('/refresh-token').post(usersController.refreshToken);//!
router.route('/verify-token').post(controllerWrapper(usersController.verifyToken));//!

//router.route('/signup').post(controllerWrapper(userVerifyController.signUp));
//router.route('/verify').get(controllerWrapper(userVerifyController.mailVerify));

export default router;