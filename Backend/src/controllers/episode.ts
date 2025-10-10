import { Request, Response } from "express";
import { Episode, EpisodeDocument, Podcast } from "../models/index";
import { PaginateResult } from "mongoose";
import { generateUploadUrl } from "../utils/aws";
import { catchAsync } from "../middlewares/errorMiddleware";
import { NotFoundError, AWSError } from "../utils/error";

/**
 * @desc Get all episodes (paginated)
 * @route GET /episodes
 * @access Public
 */
const getAllEpisodes = catchAsync(async (
  req: Request<{}, {}, {}, { page?: string; limit?: string }>,
  res: Response
): Promise<void> => {
  const { page = "1", limit = "10" } = req.query;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    select: "title description audioUrl duration createdAt",
  };

  const episodes: PaginateResult<EpisodeDocument> = await Episode.paginate({}, options);

  res.status(200).json({
    status: 'success',
    totalEpisodes: episodes.totalDocs,
    totalPages: episodes.totalPages,
    currentPage: episodes.page,
    episodes: episodes.docs,
  });
});

/**
 * @desc Get an episode by ID
 * @route GET /episodes/:id
 * @access Public
 */
const getEpisodeById = catchAsync(async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const episode = await Episode.findById(id);

  if (!episode) {
    throw new NotFoundError("Episode not found");
  }

  res.status(200).json({
    status: 'success',
    data: {
      episode
    }
  });
});

/**
 * @desc Generate pre-signed URL for episode audio upload
 * @route POST /episodes/upload-url
 * @access User
 */
const requestForPreSignedUrlForEpisode = catchAsync(async (
  req: Request,
  res: Response
): Promise<void> => {
  const { filename, contentType } = req.body;

  try {
    const response = await generateUploadUrl(filename, contentType);
    res.status(200).json({
      status: 'success',
      message: "Pre-signed URL generated successfully",
      data: {
        url: response.url,
        key: response.key
      }
    });
  } catch (error) {
    throw new AWSError("Failed to generate upload URL");
  }
});

/**
 * @desc Add an episode to a podcast
 * @route POST /podcasts/:id/episodes
 * @access User
 */
const addEpisodeToPodcast = catchAsync(async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { title, description, audioKey, duration } = req.body;

  const podcast = await Podcast.findById(id);
  if (!podcast) {
    throw new NotFoundError("Podcast not found");
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

  res.status(201).json({
    status: 'success',
    message: 'Episode added to podcast successfully',
    data: {
      episode
    }
  });
});

export default {
  getAllEpisodes,
  getEpisodeById,
  requestForPreSignedUrlForEpisode,
  addEpisodeToPodcast,
};
