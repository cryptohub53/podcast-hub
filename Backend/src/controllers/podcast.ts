import { Request, Response } from "express";
import { Podcast, PodcastDocument } from "../models/index";
import { PaginateResult } from "mongoose";

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

export default {
  getAllPodcasts,
  getPodcastById,
  podcastSearchAndFilterByTitleOrCategory,
};
