import { Router } from "express";

import controllerWrapper from "../../helpers/controllerWrapper.js";
import usersController from "../../controllers/users.controller.js";

const router = Router();

router.route('/signup').post(controllerWrapper(usersController.signUp));
router.get('/test', (req, res) => {
    res.send('Endpoint de test fonctionnel');
  });
export default router;