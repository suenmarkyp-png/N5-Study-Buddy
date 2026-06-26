import { Router, type IRouter } from "express";
import healthRouter from "./health";
import customDataRouter from "./custom-data";
import openaiRouter from "./openai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(customDataRouter);
router.use(openaiRouter);

export default router;
