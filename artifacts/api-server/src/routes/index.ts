import { Router, type IRouter } from "express";
import healthRouter from "./health";
import customDataRouter from "./custom-data";

const router: IRouter = Router();

router.use(healthRouter);
router.use(customDataRouter);

export default router;
