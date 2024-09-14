import { Router } from "express";
import usersRouter from "./users.router.js";
import adminRouter from "./admin.router.js";
import searchRouter from "./search.router.js";
import pdfRouter from "./pdf.router.js";
import pollRouter from "./poll.router.js";

const router = Router();
router.use("/users", usersRouter);
router.use("/admin", adminRouter);
router.use("/search", searchRouter);
router.use("/pdf", pdfRouter);
router.use("/poll", pollRouter);



export default router;