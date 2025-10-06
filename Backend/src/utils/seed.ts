import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import { User, UserDocument, Episode, EpisodeDocument, Podcast, PodcastDocument  } from "../models/index";
import { UserRole, PodcastCategory } from "./constants";

dotenv.config();

const MONGO_URI = "mongodb://localhost:27017";

async function seed() {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB for seeding");

    // Clear old data
    await Promise.all([
      User.deleteMany({}),
      Podcast.deleteMany({}),
      Episode.deleteMany({}),
    ]);
    console.log("🧹 Old data cleared");

    // Create users
    const usersData: Partial<UserDocument>[] = [
      {
        name: "Alice Johnson",
        email: "alice@example.com",
        password: "hashed1234",
        avatarUrl: faker.image.avatar(),
        favorites: [],
        recentlyPlayed: [],
        role: UserRole.USER,
      },
      {
        name: "Bob Smith",
        email: "bob@example.com",
        password: "hashed1234",
        avatarUrl: faker.image.avatar(),
        favorites: [],
        recentlyPlayed: [],
        role: UserRole.ADMIN,
      },
    ];

    const users = await User.insertMany(usersData);
    console.log(`Created ${users.length} users`);

    // Create podcasts
    const podcastsData: Partial<PodcastDocument>[] = [
      {
        title: "Tech Minds",
        author: "Ethan Ray",
        description: faker.lorem.paragraph(),
        category: PodcastCategory.TECHNOLOGY,
        coverImageUrl: faker.image.urlLoremFlickr({ category: "technology" }),
        episodes: [],
      },
      {
        title: "Health Matters",
        author: "Dr. Jane Lee",
        description: faker.lorem.paragraph(),
        category: PodcastCategory.HEALTH,
        coverImageUrl: faker.image.urlLoremFlickr({ category: "health" }),
        episodes: [],
      },
      {
        title: "Business Unplugged",
        author: "Mark Thomas",
        description: faker.lorem.paragraph(),
        category: PodcastCategory.BUSINESS,
        coverImageUrl: faker.image.urlLoremFlickr({ category: "business" }),
        episodes: [],
      },
    ];

    const podcasts = await Podcast.insertMany(podcastsData);
    console.log(`Created ${podcasts.length} podcasts`);

    // Create episodes
    const episodeCounts = [3, 10, 15];
    const allEpisodes: any[] = [];

    for (let i = 0; i < podcasts.length; i++) {
      const podcast = podcasts[i];
      const count = episodeCounts[i] || 0;

      if (!podcast) {
        console.warn(`⚠️ Podcast at index ${i} is undefined, skipping...`);
        continue;
      }

      const episodesData: Partial<EpisodeDocument>[] = Array.from({ length: count }).map(() => ({
        title: faker.lorem.words(4),
        description: faker.lorem.paragraph(),
        audioUrl: `https://cdn.podcastapp.com/${faker.word.noun()}.mp3`,
        duration: faker.number.int({ min: 60, max: 3600 }),
        podcast: podcast._id,
        publishedAt: faker.date.past(),
      }));

      const episodes = await Episode.insertMany(episodesData);

      // Update podcast with episode references
      podcast.episodes = episodes.map((e) => e._id);
      if (podcast.save) {
        await podcast.save();
      }

      allEpisodes.push(...episodes);

      console.log(`🎧 Added ${count} episodes to podcast: ${podcast.title}`);
    }

    // Assign favorites & recently played to users
    for (const user of users) {
      if (!user) {
        console.warn(`User is undefined, skipping...`);
        continue;
      }

      const favCount = faker.number.int({ min: 1, max: podcasts.length });
      const favorites = faker.helpers.arrayElements(podcasts, favCount).map((p) => p._id);

      const playedCount = faker.number.int({ min: 1, max: 10 });
      const recentlyPlayed = faker.helpers.arrayElements(allEpisodes, playedCount).map((e) => e._id);

      user.favorites = favorites;
      user.recentlyPlayed = recentlyPlayed;
      if (user.save) {
        await user.save();
      }
    }

    console.log("Favorites & recently played assigned");
    console.log("🌱 Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding:", err);
    process.exit(1);
  }
}

seed();
