import podcastController from "../controllers/podcast";
import episodeController from "../controllers/episode";
import { Router } from "express";

const {
  getAllPodcasts,
  getPodcastById,
  podcastSearchAndFilterByTitleOrCategory,
  requestToUploadPodcastByUser,
  adminApproveOrRejectPodcast
} = podcastController;

const { addEpisodeToPodcast } = episodeController;

const podcastRouter = Router();

// Public routes
podcastRouter.get("/", getAllPodcasts);
podcastRouter.get("/search/filter", podcastSearchAndFilterByTitleOrCategory);
podcastRouter.get("/:id", getPodcastById);

// User routes
podcastRouter.post("/request-upload", requestToUploadPodcastByUser);
podcastRouter.post("/:id/episodes", addEpisodeToPodcast);

// Admin routes
podcastRouter.patch("/:id/status", adminApproveOrRejectPodcast);

export default podcastRouter;
