import episodeController from "../controllers/episode.js";
import { authenticatedUser } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const {
  getAllEpisodes,
  getEpisodeById,
  requestForPreSignedUrlForEpisode,
} = episodeController;

const episodeRouter = Router();

// Public episode routes
episodeRouter.get("/", getAllEpisodes);
episodeRouter.get("/:id", getEpisodeById);

// Protected episode routes (require authentication)
episodeRouter.post("/upload-url", authenticatedUser, requestForPreSignedUrlForEpisode);

// Note: addEpisodeToPodcast will be handled in podcast routes as it's a nested resource
// POST /podcasts/:id/episodes

export default episodeRouter;
