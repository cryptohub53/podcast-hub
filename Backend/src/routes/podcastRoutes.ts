import podcastController from "../controllers/podcast";
import { Router } from "express";
const { getAllPodcasts, getPodcastById, podcastSearchAndFilterByTitleOrCategory } = podcastController;

const podcastRouter = Router();
podcastRouter.get("/", getAllPodcasts);
podcastRouter.get("/search/filter", podcastSearchAndFilterByTitleOrCategory);
podcastRouter.get("/:id", getPodcastById);

export default podcastRouter;
