import { Router } from "express";
import podcastRouter from "./podcastRoutes";
import contactRouter from "./contactRoutes";

const router = Router();

router.use("/podcasts", podcastRouter);
router.use("/contact", contactRouter);

export default router;
