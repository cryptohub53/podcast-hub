import { Request, Response } from "express";
import { EpisodeDocument, Podcast, PodcastDocument, User } from "../models/index";
import { PaginateResult } from "mongoose";
import mongoose from "mongoose";
import Constants from "../utils/constants";
import { moveObjectToPermanentBucket } from "../utils/aws";

/**
 * @desc Get all podcasts (paginated)
 * @route GET /podcasts
 * @access Public
 */
const getAllPodcasts = async (
  req: Request<{}, {}, {}, { page?: string; limit?: string }>,
  res: Response
): Promise<void> => {
  try {
    const { page = "1", limit = "10" } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
      select: "title author description category coverImageUrl createdAt",
    };

    const podcasts: PaginateResult<PodcastDocument> = await Podcast.paginate({}, options);

    res.status(200).json({
      totalPodcasts: podcasts.totalDocs,
      totalPages: podcasts.totalPages,
      currentPage: podcasts.page,
      podcasts: podcasts.docs,
    });
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get a single podcast by ID (with its episodes)
 * @route GET /podcasts/:id
 * @access Public
 */
const getPodcastById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const podcast = await Podcast.findById(id).populate({
      path: "episodes",
      select: "title description audioUrl duration createdAt",
      options: { sort: { createdAt: -1 } },
    });

    if (!podcast) {
      res.status(404).json({ message: "Podcast not found" });
      return;
    }

    res.status(200).json(podcast);
  } catch (error) {
    console.error("Error fetching podcast by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Search podcasts by title or filter by category (paginated)
 * @route GET /podcasts/search?query=react&category=Technology&page=1&limit=5
 * @access Public
 */
const podcastSearchAndFilterByTitleOrCategory = async (
  req: Request<{}, {}, {}, { query?: string; category?: string; page?: string; limit?: string }>,
  res: Response
): Promise<void> => {
  try {
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
      totalResults: podcasts.totalDocs,
      totalPages: podcasts.totalPages,
      currentPage: podcasts.page,
      podcasts: podcasts.docs,
    });
  } catch (error) {
    console.error("Error searching/filtering podcasts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc User requests to upload a podcast (saved as pending)
 * @route POST /podcasts/request-upload
 * @access Public
 */
const requestToUploadPodcastByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, author, category, coverImageUrl, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const podcast = await Podcast.create({
      title,
      description,
      author,
      category,
      coverImageUrl,
      status: Constants.Status.PENDING,
    });
    res.status(201).json({
      message: "Request to upload podcast submitted successfully",
      podcast: {
        id: podcast._id,
        title: podcast.title,
        status: podcast.status,
        createdAt: podcast.createdAt
      }
    });
  } catch (error) {
    console.error("Error requesting to upload podcast:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Admin approves or rejects a podcast request
 * @route PATCH /podcasts/:id/approve-reject
 * @access Admin
 */
const adminApproveOrRejectPodcast = async (req: Request, res: Response): Promise<void> => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;
    const { status, adminId } = req.body;

    // Validate status
    const validStatuses = [Constants.Status.APPROVED, Constants.Status.REJECTED];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        message: "Invalid status. Must be 'approved' or 'rejected'"
      });
      return;
    }

    // Check admin exists and has admin role
    const admin = await User.findById(adminId);
    if (!admin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }

    if (admin.role !== Constants.UserRole.ADMIN) {
      res.status(403).json({ message: "Access denied. Admin role required" });
      return;
    }

    // Start transaction
    session.startTransaction();

    // Fetch podcast and its episodes
    const podcast = await Podcast.findById(id).populate<{ episodes: EpisodeDocument[] }>("episodes").session(session);
    if (!podcast) {
      res.status(404).json({ message: "Podcast not found" });
      return;
    }

    // If approved, move all episodes from TEMP to PERM bucket
    if (status === Constants.Status.APPROVED) {
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
            // Continue with other episodes, but log the error
          }
        }
      }
      podcast.status = Constants.Status.APPROVED;
    } else if (status === Constants.Status.REJECTED) {
      podcast.status = Constants.Status.REJECTED;
    }

    await podcast.save({ session });
    await session.commitTransaction();

    res.status(200).json({
      message: `Podcast ${status.toLowerCase()} successfully`,
      podcast: {
        id: podcast._id,
        title: podcast.title,
        status: podcast.status,
        updatedAt: podcast.updatedAt
      }
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error updating podcast:", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    await session.endSession();
  }
};

export default {
  getAllPodcasts,
  getPodcastById,
  podcastSearchAndFilterByTitleOrCategory,
  requestToUploadPodcastByUser,
  adminApproveOrRejectPodcast,
};
