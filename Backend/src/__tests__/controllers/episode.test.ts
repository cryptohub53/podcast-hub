import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../testApp";
import { Episode, Podcast } from "../../models";
import { mockEpisodesPodcast1, mockPodcasts } from "../../utils/mock";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Episode API Endpoints", () => {
  // ---------------- GET /episodes ----------------
  describe("GET /episodes", () => {
    it("should return paginated list of episodes", async () => {
      const paginateMock = {
        totalDocs: mockEpisodesPodcast1.length,
        totalPages: 1,
        page: 1,
        docs: mockEpisodesPodcast1,
      };

      vi.spyOn(Episode, "paginate").mockResolvedValue(paginateMock as any);

      const res = await request(app).get("/api/v1/episodes?page=1&limit=10");

      expect(res.status).toBe(200);
      expect(res.body.totalEpisodes).toBe(mockEpisodesPodcast1.length);
      expect(res.body.episodes[0].title).toBe(mockEpisodesPodcast1[0].title);
    });
  });

  // ---------------- GET /episodes/:id ----------------
  describe("GET /episodes/:id", () => {
    it("should return a single episode", async () => {
      vi.spyOn(Episode, "findById").mockResolvedValue(mockEpisodesPodcast1[0] as any);

      const res = await request(app).get(`/api/v1/episodes/${mockEpisodesPodcast1[0]._id}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.episode.title).toBe(mockEpisodesPodcast1[0].title);
    });
  });

  // ---------------- POST /:id/episodes ----------------
  describe("POST /:id/episodes", () => {
    it("should add an episode to a podcast", async () => {
      const mockPodcast = {
        ...mockPodcasts[0],
        episodes: [],
        save: vi.fn().mockResolvedValue(true),
      };

      vi.spyOn(Podcast, "findById").mockResolvedValue(mockPodcast as any);
      vi.spyOn(Episode, "create").mockResolvedValue({
        ...mockEpisodesPodcast1[0],
        title: "New Episode",
      } as any);

      const res = await request(app)
        .post(`/api/v1/podcasts/${mockPodcasts[0]._id}/episodes`)
        .send({
          title: "New Episode",
          description: "Description",
          audioKey: "audio/key.mp3",
          duration: 180,
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data.episode.title).toBe("New Episode");
    });
  });

  // ---------------- POST /episodes/upload-url ----------------
  describe("POST /episodes/upload-url", () => {
    it("should generate a pre-signed URL for episode audio upload", async () => {
      const res = await request(app)
        .post("/api/v1/episodes/upload-url")
        .send({
          filename: "audio.mp3",
          contentType: "audio/mpeg",
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.url).toBe("https://s3.amazonaws.com/fakebucket/fakefile.mp3");
      expect(res.body.data.key).toBe("pending/fake-key");
    });
  });
});     