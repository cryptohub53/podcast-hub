import episodeController from "../controllers/episode";
import { Router } from "express";

const { 
  getAllEpisodes, 
  getEpisodeById, 
  requestForPreSignedUrlForEpisode,
} = episodeController;

const episodeRouter = Router();

// Episode routes
episodeRouter.get("/", getAllEpisodes);
episodeRouter.get("/:id", getEpisodeById);
episodeRouter.post("/upload-url", requestForPreSignedUrlForEpisode);

// Note: addEpisodeToPodcast will be handled in podcast routes as it's a nested resource
// POST /podcasts/:id/episodes

export default episodeRouter;
