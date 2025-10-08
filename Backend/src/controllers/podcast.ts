import { Request, Response, NextFunction } from "express";
import { EpisodeDocument, Podcast, PodcastDocument, User } from "../models/index";
import { PaginateResult } from "mongoose";
import mongoose from "mongoose";
import { Status, UserRole } from "../utils/constants";
import { moveObjectToPermanentBucket } from "../utils/aws";
import { catchAsync } from "../middlewares/errorMiddleware";
import { NotFoundError, ForbiddenError, ValidationError, AWSError } from "../utils/error";

/**
 * @desc Get all podcasts (paginated)
 * @route GET /podcasts
 * @access Public
 */
const getAllPodcasts = catchAsync(async (
  req: Request<{}, {}, {}, { page?: string; limit?: string }>,
  res: Response
): Promise<void> => {
  const { page = "1", limit = "10" } = req.query;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    select: "title author description category coverImageUrl createdAt",
  };

  const podcasts: PaginateResult<PodcastDocument> = await Podcast.paginate({}, options);

  res.status(200).json({
    status: 'success',
    totalPodcasts: podcasts.totalDocs,
    totalPages: podcasts.totalPages,
    currentPage: podcasts.page,
    podcasts: podcasts.docs,
  });
});

/**
 * @desc Get a single podcast by ID (with its episodes)
 * @route GET /podcasts/:id
 * @access Public
 */
const getPodcastById = catchAsync(async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const podcast = await Podcast.findById(id).populate({
    path: "episodes",
    select: "title description audioUrl duration createdAt",
    options: { sort: { createdAt: -1 } },
  });

  if (!podcast) {
    throw new NotFoundError("Podcast not found");
  }

  res.status(200).json({
    status: 'success',
    data: {
      podcast
    }
  });
});

/**
 * @desc Search podcasts by title or filter by category (paginated)
 * @route GET /podcasts/search?query=react&category=Technology&page=1&limit=5
 * @access Public
 */
const podcastSearchAndFilterByTitleOrCategory = catchAsync(async (
  req: Request<{}, {}, {}, { query?: string; category?: string; page?: string; limit?: string }>,
  res: Response
): Promise<void> => {
  const { query = "", category, page = "1", limit = "10" } = req.query;

  const filter: Record<string, any> = {};

  if (query) {
    filter.title = { $regex: query, $options: "i" };
  }

  if (category && category !== "All") {
    filter.category = category;
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    select: "title author description category coverImageUrl createdAt",
  };

  const podcasts: PaginateResult<PodcastDocument> = await Podcast.paginate(filter, options);

  res.status(200).json({
    status: 'success',
    totalResults: podcasts.totalDocs,
    totalPages: podcasts.totalPages,
    currentPage: podcasts.page,
    podcasts: podcasts.docs,
  });
});

/**
 * @desc User requests to upload a podcast (saved as pending)
 * @route POST /podcasts/request-upload
 * @access Public
 */
const requestToUploadPodcastByUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { title, description, author, category, coverImageUrl, userId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const podcast = await Podcast.create({
    title,
    description,
    author,
    category,
    coverImageUrl,
    status: Status.PENDING,
  });

  res.status(201).json({
    status: 'success',
    message: "Request to upload podcast submitted successfully",
    data: {
      podcast: {
        id: podcast._id,
        title: podcast.title,
        status: podcast.status,
        createdAt: podcast.createdAt
      }
    }
  });
});

/**
 * @desc Admin approves or rejects a podcast request
 * @route PATCH /podcasts/:id/approve-reject
 * @access Admin
 */
const adminApproveOrRejectPodcast = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;
    const { status, adminId } = req.body;

    // Validate status
    const validStatuses = [Status.APPROVED, Status.REJECTED];
    if (!validStatuses.includes(status)) {
      throw new ValidationError("Invalid status. Must be 'approved' or 'rejected'");
    }
    if (!adminId) {
      throw new ValidationError("Admin ID is required");
    }
    // Check admin exists and has admin role
    const admin = await User.findById(adminId);
    if (!admin) {
      throw new NotFoundError("Admin not found");
    }

    if (admin.role !== UserRole.ADMIN) {
      throw new ForbiddenError("Access denied. Admin role required");
    }

    // Start transaction
    session.startTransaction();

    // Fetch podcast and its episodes
    const podcast = await Podcast.findById(id).populate<{ episodes: EpisodeDocument[] }>("episodes").session(session);
    if (!podcast) {
      throw new NotFoundError("Podcast not found");
    }

    // If approved, move all episodes from TEMP to PERM bucket
    if (status === Status.APPROVED) {
      for (const episode of podcast.episodes) {
        if (episode.audioKey) {
          try {
            // Move audio file and get public URL
            const audioUrl = await moveObjectToPermanentBucket(episode.audioKey);

            // Update episode with approved URL
            episode.audioUrl = audioUrl;
            await episode.save({ session });
          } catch (awsError) {
            console.error(`Error moving episode ${episode._id} to permanent bucket:`, awsError);
            throw new AWSError(`Failed to move episode ${episode._id} to permanent storage`);
          }
        }
      }
      podcast.status = Status.APPROVED;
    } else if (status === Status.REJECTED) {
      podcast.status = Status.REJECTED;
    }

    await podcast.save({ session });
    await session.commitTransaction();

    res.status(200).json({
      status: 'success',
      message: `Podcast ${status.toLowerCase()} successfully`,
      data: {
        podcast: {
          id: podcast._id,
          title: podcast.title,
          status: podcast.status,
          updatedAt: podcast.updatedAt
        }
      }
    });
  } catch (error) {
    await session.abortTransaction();
    throw error; // Re-throw to be handled by global error handler
  } finally {
    await session.endSession();
  }
});

export default {
  getAllPodcasts,
  getPodcastById,
  podcastSearchAndFilterByTitleOrCategory,
  requestToUploadPodcastByUser,
  adminApproveOrRejectPodcast,
};
