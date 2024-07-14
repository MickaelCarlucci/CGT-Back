import { Router } from "express";
import usersRouter from "./users.router.js";
import adminRouter from "./admin.router.js"

const router = Router();
router.use("/users", usersRouter);
router.use("/admin", adminRouter);



export default router;