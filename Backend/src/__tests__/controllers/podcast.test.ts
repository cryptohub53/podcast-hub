import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../testApp";
import { Podcast, User } from "../../models";
import { mockPodcasts, mockEpisodesPodcast1, mockUsers } from "../../utils/mock";
import mongoose from "mongoose";

beforeEach(() => {
  vi.clearAllMocks();
});


describe("Podcast API Endpoints", () => {
  // ---------------- GET /podcasts ----------------
  describe("GET /podcasts", () => {
    it("should return paginated list of podcasts", async () => {
      const paginateMock = {
        totalDocs: mockPodcasts.length,
        totalPages: 1,
        page: 1,
        docs: mockPodcasts,
      };

      vi.spyOn(Podcast, "paginate").mockResolvedValue(paginateMock as any);

      const res = await request(app).get("/api/v1/podcasts?page=1&limit=10");

      expect(res.status).toBe(200);
      expect(res.body.totalPodcasts).toBe(mockPodcasts.length);
      expect(res.body.podcasts[0].title).toBe(mockPodcasts[0].title);
    });
    // TODO: Add tests for error cases
  });

  // ---------------- GET /podcasts/:id ----------------
  describe("GET /podcasts/:id", () => {
    it("should return a single podcast with episodes", async () => {
      const podcastWithEpisodes = { ...mockPodcasts[0], episodes: mockEpisodesPodcast1 };
      vi.spyOn(Podcast, "findById").mockReturnValue({
        populate: vi.fn().mockResolvedValue(podcastWithEpisodes)
      } as any);

      const res = await request(app).get(`/api/v1/podcasts/${mockPodcasts[0]._id}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.podcast.title).toBe(mockPodcasts[0].title);
      expect(res.body.data.podcast.episodes.length).toBe(mockEpisodesPodcast1.length);
    });

    it("should return 404 if podcast not found", async () => {
      vi.spyOn(Podcast, "findById").mockReturnValue({
        populate: vi.fn().mockResolvedValue(null)
      } as any);

      const res = await request(app).get(`/api/v1/podcasts/507f1f77bcf86cd799439011`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Podcast not found");
    });
  });

  // ---------------- GET /podcasts/search ----------------
  describe("GET /podcasts/search", () => {
    it("should search podcasts by query", async () => {
      const paginateMock = {
        totalDocs: 1,
        totalPages: 1,
        page: 1,
        docs: [mockPodcasts[0]],
      };

      vi.spyOn(Podcast, "paginate").mockResolvedValue(paginateMock as any);

      const res = await request(app).get("/api/v1/podcasts/search/filter?query=Tech&page=1&limit=10");

      expect(res.status).toBe(200);
      expect(res.body.totalResults).toBe(1);
      expect(res.body.podcasts[0].title).toContain("Tech");
    });

    it("should filter podcasts by category", async () => {
      const paginateMock = {
        totalDocs: 1,
        totalPages: 1,
        page: 1,
        docs: [mockPodcasts[0]],
      };

      vi.spyOn(Podcast, "paginate").mockResolvedValue(paginateMock as any);

      const res = await request(app).get("/api/v1/podcasts/search/filter?category=Technology");

      expect(res.status).toBe(200);
      expect(res.body.totalResults).toBe(1);
      expect(res.body.podcasts[0].category).toBe("Technology");
    });

    it("should return empty array if no results", async () => {
      const paginateMock = {
        totalDocs: 0,
        totalPages: 0,
        page: 1,
        docs: [],
      };

      vi.spyOn(Podcast, "paginate").mockResolvedValue(paginateMock as any);

      const res = await request(app).get("/api/v1/podcasts/search/filter?query=NonExistent");

      expect(res.status).toBe(200);
      expect(res.body.totalResults).toBe(0);
      expect(res.body.podcasts).toEqual([]);
    });
    // TODO: Add tests for error cases
  });

  // ---------------- POST /podcasts/request-upload ----------------
  describe("POST /podcasts/request-upload", () => {
    it("should create a new podcast request", async () => {
      vi.spyOn(User, "findById").mockResolvedValue(mockUsers[0] as any);
      vi.spyOn(Podcast, "create").mockResolvedValue(mockPodcasts[0] as any);

      const res = await request(app)
        .post("/api/v1/podcasts/request-upload")
        .send({
          title: "New Podcast",
          description: "Description",
          author: "Author",
          category: "Technology",
          coverImageUrl: "https://example.com/cover.jpg",
          userId: mockUsers[0]._id,
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data.podcast.title).toBe(mockPodcasts[0].title);
    });
    // TODO: Add tests for error cases
  });

  // ---------------- PATCH /podcasts/:id/status ----------------
  describe("PATCH /podcasts/:id/status", () => {
    const admin = mockUsers[1];
    const podcast = mockPodcasts[0];

    it("should approve a podcast request", async () => {
      // Mock mongoose session
      const commitTransaction = vi.fn();
      const abortTransaction = vi.fn();
      const endSession = vi.fn();
      const startTransaction = vi.fn();

      vi.spyOn(mongoose, "startSession").mockResolvedValue({
        startTransaction,
        commitTransaction,
        abortTransaction,
        endSession,
      } as any);

      // Mock DB calls
      vi.spyOn(User, "findById").mockResolvedValue(admin as any);

      // Create mock episodes with save method
      const mockEpisodesWithSave = mockEpisodesPodcast1.map(episode => ({
        ...episode,
        save: vi.fn().mockResolvedValue(true),
      }));

      const mockPodcastWithMethods = {
        ...podcast,
        episodes: mockEpisodesWithSave,
        save: vi.fn().mockResolvedValue(true),
      };

      vi.spyOn(Podcast, "findById").mockReturnValue({
        populate: vi.fn().mockReturnValue({
          session: vi.fn().mockResolvedValue(mockPodcastWithMethods),
        }),
      } as any);

      const res = await request(app)
        .patch(`/api/v1/podcasts/${podcast._id}/status`)
        .send({
          status: "approved",
          adminId: admin._id,
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.podcast.title).toBe(podcast.title);
    });
  });

  // TODO: Add tests for error cases
});