import { Router } from "express";

import controllerWrapper from "../../helpers/controllerWrapper.js";
import usersController from "../../controllers/users.controller.js";
import profileController from "../../controllers/profile.controller.js";

import firebaseAuthMiddleware from "../../helpers/firebaseAuthMiddleware.js";

const router = Router();

router.route("/signup").post(controllerWrapper(usersController.signup));
router
  .route("/verifyEmail")
  .patch(controllerWrapper(usersController.verifyEmailAndAssignRole));
router
  .route("/:userId(\\d+)/delete")
  .delete(
    firebaseAuthMiddleware,
    controllerWrapper(usersController.deleteUserAccount)
  );
router.route("/signin").post(controllerWrapper(usersController.signIn));
router
  .route("/findUser")
  .get(controllerWrapper(profileController.findOneUserByMail));
router
  .route("/findUserProfile/:userId(\\d+)")
  .get(controllerWrapper(profileController.findOneUserById));

router
  .route("/:userId(\\d+)/pseudo")
  .patch(
    firebaseAuthMiddleware,
    controllerWrapper(profileController.pseudoModification)
  );
router
  .route("/:userId(\\d+)/firstname")
  .patch(
    firebaseAuthMiddleware,
    controllerWrapper(profileController.firstnameModification)
  );
router
  .route("/:userId(\\d+)/lastname")
  .patch(
    firebaseAuthMiddleware,
    controllerWrapper(profileController.lastnameModification)
  );
router
  .route("/:userId(\\d+)/mail")
  .patch(
    firebaseAuthMiddleware,
    controllerWrapper(profileController.mailModification)
  );
router
  .route("/:userId(\\d+)/phone")
  .patch(
    firebaseAuthMiddleware,
    controllerWrapper(profileController.phoneModification)
  );
router
  .route("/:userId(\\d+)/center")
  .patch(
    firebaseAuthMiddleware,
    controllerWrapper(profileController.ModificationUserCenter)
  );
router
  .route("/:userId(\\d+)/activity")
  .patch(
    firebaseAuthMiddleware,
    controllerWrapper(profileController.ModificationActivity)
  );

router
  .route("/refresh-token")
  .post(controllerWrapper(usersController.refreshToken));
router
  .route("/verify-token")
  .post(controllerWrapper(usersController.verifyToken));
router
  .route("/get-by-uid/:uid([A-Za-z0-9_-]+)")
  .get(controllerWrapper(usersController.getUserByUID));

router
  .route("/:userId(\\d+)/delete-by-admin")
  .delete(
    firebaseAuthMiddleware,
    controllerWrapper(usersController.deleteUserByAdmin)
  );

export default router;
