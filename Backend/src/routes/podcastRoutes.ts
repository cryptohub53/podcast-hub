import podcastController from "../controllers/podcast.js";
import episodeController from "../controllers/episode.js";
import { authenticatedUser, requireAdmin } from "../middlewares/auth.middleware.js";
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

// User routes (require authentication)
podcastRouter.post("/request-upload", authenticatedUser, requestToUploadPodcastByUser);
podcastRouter.post("/:id/episodes", authenticatedUser, addEpisodeToPodcast);

// Admin routes (require authentication + admin role)
podcastRouter.patch("/:id/status", authenticatedUser, requireAdmin, adminApproveOrRejectPodcast);

export default podcastRouter;
