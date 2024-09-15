import { Router } from "express";

import pollController from "../../controllers/poll.controller.js";
import controllerWrapper from "../../helpers/controllerWrapper.js";
import jwtExpirationVerification from "../../helpers/jwtVerifyToken.js";

const router = Router();

router.route('/newPoll').post(controllerWrapper(pollController.createPoll));
router.route('/vote/:pollId(\\d+)/:userId(\\d+)').post(controllerWrapper(pollController.vote));
router.route('/polls').get(controllerWrapper(pollController.getPolls));
router.route('/latest').get(controllerWrapper(pollController.getLatestPolls));
router.route('/:pollId(\\d+)').get(controllerWrapper(pollController.getOnePoll));
router.route('/:pollId(\\d+)/vote-status/:userId(\\d+)').get(controllerWrapper(pollController.verifyVote));
router.route('/:pollId(\\d+)/options').get(controllerWrapper(pollController.pollOptions));
router.route('/delete/:pollId(\\d+)').delete(controllerWrapper(pollController.deletePoll));

export default router;