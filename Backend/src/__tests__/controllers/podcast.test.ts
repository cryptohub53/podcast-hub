import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../app";
import { Podcast } from "../../models";
import { mockPodcasts, mockEpisodesPodcast1 } from "../../utils/mock";

beforeEach(() => {
  vi.restoreAllMocks();
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
      expect(res.body.title).toBe(mockPodcasts[0].title);
      expect(res.body.episodes.length).toBe(mockEpisodesPodcast1.length);
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
  });
});