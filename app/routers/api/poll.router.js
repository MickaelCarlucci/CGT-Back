import { Router } from "express";

import pollController from "../../controllers/poll.controller.js";
import controllerWrapper from "../../helpers/controllerWrapper.js";
import jwtExpirationVerification from "../../helpers/jwtVerifyToken.js";

const router = Router();

router.route('/newPoll').post(controllerWrapper(pollController.createPoll));
router.route('/:pollId(\\d+)/:userId(\\d+)').post(controllerWrapper(pollController.vote));
router.route('/polls').get(controllerWrapper(pollController.getPolls));
router.route('/:pollId(\\d+)').get(controllerWrapper(pollController.getOnePoll));

export default router;