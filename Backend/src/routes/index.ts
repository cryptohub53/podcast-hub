import { Router } from "express";
import podcastRouter from "./podcastRoutes";
import contactRouter from "./contactRoutes";
import episodeRouter from "./episodeRoutes";

const router = Router();

router.use("/podcasts", podcastRouter);
router.use("/contact", contactRouter);
router.use("/episodes", episodeRouter);

export default router;
