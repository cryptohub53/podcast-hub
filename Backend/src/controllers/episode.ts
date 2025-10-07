import { Request, Response } from "express";
import { Episode, EpisodeDocument, Podcast } from "../models/index";
import { PaginateResult } from "mongoose";
import { generateUploadUrl } from "../utils/aws";

/**
 * @desc Get all episodes (paginated)
 * @route GET /episodes
 * @access Public
 */
const getAllEpisodes = async (
  req: Request<{}, {}, {}, { page?: string; limit?: string }>,
  res: Response
): Promise<void> => {
  try {
    const { page = "1", limit = "10" } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
      select: "title description audioUrl duration createdAt",
    };

    const episodes: PaginateResult<EpisodeDocument> = await Episode.paginate({}, options);

    res.status(200).json({
      totalEpisodes: episodes.totalDocs,
      totalPages: episodes.totalPages,
      currentPage: episodes.page,
      episodes: episodes.docs,
    });
  } catch (error) {
    console.error("Error fetching episodes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get an episode by ID
 * @route GET /episodes/:id
 * @access Public
 */
const getEpisodeById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const episode = await Episode.findById(id);

    if (!episode) {
      res.status(404).json({ message: "Episode not found" });
      return;
    }

    res.status(200).json(episode);
  } catch (error) {
    console.error("Error fetching episode by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Generate pre-signed URL for episode audio upload
 * @route POST /episodes/upload-url
 * @access User
 */
const requestForPreSignedUrlForEpisode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { filename, contentType } = req.body;
    const response = await generateUploadUrl(filename, contentType);
    res.status(200).json({
      url: response.url,
      key: response.key,
      message: "Pre-signed URL generated successfully"
    });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Add an episode to a podcast
 * @route POST /podcasts/:id/episodes
 * @access User
 */
const addEpisodeToPodcast = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, audioKey, duration } = req.body;

    const podcast = await Podcast.findById(id);
    if (!podcast) {
      res.status(404).json({ message: "Podcast not found" });
      return;
    }

    const episode = await Episode.create({
      title,
      description,
      audioKey,
      duration,
      podcast: id,
    });

    podcast.episodes.push(episode._id);
    await podcast.save();

    res.status(200).json(episode);
        } catch (error) {
    console.error("Error adding episode to podcast:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default {
  getAllEpisodes,
  getEpisodeById,
  requestForPreSignedUrlForEpisode,
  addEpisodeToPodcast,
};
