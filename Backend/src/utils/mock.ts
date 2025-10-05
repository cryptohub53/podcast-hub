import { Types } from "mongoose";
import { UserDocument, PodcastDocument, EpisodeDocument } from "../models";
import { UserRole, PodcastCategory } from "../utils/constants";

// -------------------- USERS --------------------
export const mockUsers: UserDocument[] = [
  {
    _id: new Types.ObjectId(),
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "hashedpassword1",
    favorites: [],
    recentlyPlayed: [],
    avatarUrl: "https://example.com/avatar1.jpg",
    role: UserRole.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as UserDocument,
  {
    _id: new Types.ObjectId(),
    name: "Bob Smith",
    email: "bob@example.com",
    password: "hashedpassword2",
    favorites: [],
    recentlyPlayed: [],
    avatarUrl: "https://example.com/avatar2.jpg",
    role: UserRole.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as UserDocument,
];

// -------------------- PODCASTS --------------------
export const mockPodcasts: PodcastDocument[] = [
  {
    _id: new Types.ObjectId(),
    title: "Tech Talks Daily",
    description: "Your daily dose of tech insights and innovations.",
    author: "Alice Johnson",
    category: PodcastCategory.TECHNOLOGY,
    coverImageUrl: "https://example.com/cover-tech.jpg",
    episodes: [],
    followers: [mockUsers[0]._id, mockUsers[1]._id],
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as PodcastDocument,
  {
    _id: new Types.ObjectId(),
    title: "The Startup Mindset",
    description: "Stories and lessons from successful entrepreneurs.",
    author: "Bob Smith",
    category: PodcastCategory.BUSINESS,
    coverImageUrl: "https://example.com/cover-startup.jpg",
    episodes: [],
    followers: [mockUsers[0]._id],
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as PodcastDocument,
  {
    _id: new Types.ObjectId(),
    title: "Science Simplified",
    description: "Explaining complex scientific concepts in simple terms.",
    author: "Alice Johnson",
    category: PodcastCategory.TECHNOLOGY,
    coverImageUrl: "https://example.com/cover-science.jpg",
    episodes: [],
    followers: [mockUsers[1]._id],
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as PodcastDocument,
];

// -------------------- EPISODES --------------------

// Helper function to create mock episodes
function createMockEpisodes(count: number, podcastId: Types.ObjectId): EpisodeDocument[] {
  return Array.from({ length: count }).map((_, i) => ({
    _id: new Types.ObjectId(),
    title: `Episode ${i + 1}`,
    description: `Description for episode ${i + 1}`,
    audioUrl: `https://example.com/audio/${podcastId}/${i + 1}.mp3`,
    duration: 180 + i * 10,
    podcast: podcastId,
    publishedAt: new Date(),
    playCount: Math.floor(Math.random() * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as EpisodeDocument));
}

export const mockEpisodesPodcast1 = createMockEpisodes(3, mockPodcasts[0]._id);
export const mockEpisodesPodcast2 = createMockEpisodes(10, mockPodcasts[1]._id);
export const mockEpisodesPodcast3 = createMockEpisodes(15, mockPodcasts[2]._id);

// Link episodes to their podcasts
mockPodcasts[0].episodes = mockEpisodesPodcast1.map(e => e._id);
mockPodcasts[1].episodes = mockEpisodesPodcast2.map(e => e._id);
mockPodcasts[2].episodes = mockEpisodesPodcast3.map(e => e._id);
