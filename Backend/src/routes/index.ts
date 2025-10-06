import { Router } from "express";
import podcastRouter from "./podcastRoutes";

const router = Router();

router.use("/podcasts", podcastRouter);

export default router;
