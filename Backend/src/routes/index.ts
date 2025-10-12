import { Router } from "express";
import podcastRouter from "./podcastRoutes.js";
import contactRouter from "./contactRoutes.js";
import episodeRouter from "./episodeRoutes.js";

const router = Router();

router.use("/podcasts", podcastRouter);
router.use("/contact", contactRouter);
router.use("/episodes", episodeRouter);

export default router;
