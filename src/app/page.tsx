"use client";

import { useState, useEffect } from "react";
import DarkModeToggle from "../components/DarkModeToggle";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDark, setIsDark] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Dark mode state listener
  useEffect(() => {
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Save favorites to localStorage when updated
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const podcasts = [
    {
      title: "Syntax",
      category: "Web Development",
      description:
        "A podcast about web development, hosted by Wes Bos and Scott Tolinski.",
      url: "https://syntax.fm",
      image:
        "https://i0.wp.com/www.lemonproductions.ca/wp-content/uploads/2021/11/Syntax-podcast.jpg?fit=1200%2C900&ssl=1",
    },
    {
      title: "Darknet Diaries",
      category: "Cybersecurity",
      description: "True stories from the dark side of the internet.",
      url: "https://darknetdiaries.com",
      image:
        "https://cybersecurityventures.com/wp-content/uploads/2023/11/dd-2.png",
    },
    {
      title: "Shop Talk Show",
      category: "Web Development",
      description: "A podcast about front-end and web design.",
      url: "https://shoptalkshow.com/",
      image:
        "https://images.cdn.kukufm.com/w:1080/f:webp/q:50/https://images.cdn.kukufm.com/f:webp/https://files.hubhopper.com/podcast/169605/1400x1400/the-reality-talk-show.jpg?v=1588485779",
    },
  ];

  // Categories + Favorites tab
  const categories = ["All", ...new Set(podcasts.map((p) => p.category)), "❤️ Favorites"];

  const filteredPodcasts = podcasts.filter((podcast) => {
    const matchesSearch =
      podcast.title.toLowerCase().includes(search.toLowerCase()) ||
      podcast.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All"
        ? true
        : selectedCategory === "❤️ Favorites"
        ? favorites.includes(podcast.title)
        : podcast.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Toggle favorite
  const toggleFavorite = (title: string) => {
    setFavorites((prev) =>
      prev.includes(title) ? prev.filter((f) => f !== title) : [...prev, title]
    );
  };

  return (
    <main
      className="min-h-screen p-10 font-sans transition-colors duration-300"
      style={{
        background: isDark
          ? "linear-gradient(to bottom right, #1f2937, #374151, #1f2937)"
          : "linear-gradient(to bottom right, #eff6ff, #faf5ff, #fdf2f8)",
      }}
    >
      {/* Header */}
      <header className="text-center mb-10">
        <h1
          className="text-5xl font-extrabold mb-4 transition-colors duration-300"
          style={{ color: isDark ? "#ffffff" : "#111827" }}
        >
          🎙️ Podcast Hub
        </h1>
        <p
          className="text-lg transition-colors duration-300"
          style={{ color: isDark ? "#d1d5db" : "#374151" }}
        >
          Discover, explore, and enjoy your favorite podcasts
        </p>
      </header>

      {/* Search Input */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search podcasts by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300"
          style={{
            backgroundColor: isDark ? "#374151" : "#ffffff",
            color: isDark ? "#e5e7eb" : "#1f2937",
            borderColor: isDark ? "#4b5563" : "#d1d5db",
          }}
        />

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full border transition-all duration-300 font-medium ${
                selectedCategory === category
                  ? "bg-purple-600 text-white border-purple-600"
                  : "hover:bg-purple-100"
              }`}
              style={{
                backgroundColor:
                  selectedCategory === category
                    ? "#9333ea"
                    : isDark
                    ? "#374151"
                    : "#ffffff",
                color:
                  selectedCategory === category
                    ? "#ffffff"
                    : isDark
                    ? "#e5e7eb"
                    : "#1f2937",
                borderColor:
                  selectedCategory === category
                    ? "#9333ea"
                    : isDark
                    ? "#4b5563"
                    : "#d1d5db",
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Podcasts Grid */}
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredPodcasts.length > 0 ? (
          filteredPodcasts.map((podcast) => (
            <div
              key={podcast.title}
              className="flex flex-col rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden relative"
              style={{
                backgroundColor: isDark ? "#1f2937" : "#ffffff",
              }}
            >
              {/* Heart Button */}
              <button
                onClick={() => toggleFavorite(podcast.title)}
                className="absolute top-3 right-3 text-2xl z-20 bg-white/70 dark:bg-gray-800/70 rounded-full p-1"
              >
                {favorites.includes(podcast.title) ? "❤️" : "🤍"}
              </button>

              {/* Image */}
              <div className="relative w-full h-44">
                <img
                  src={podcast.image}
                  alt={podcast.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                  {podcast.category}
                </span>
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col flex-1">
                <h2
                  className="text-xl font-bold mb-2 transition-colors duration-300"
                  style={{ color: isDark ? "#ffffff" : "#111827" }}
                >
                  {podcast.title}
                </h2>
                <p
                  className="text-sm flex-1 transition-colors duration-300"
                  style={{ color: isDark ? "#d1d5db" : "#4b5563" }}
                >
                  {podcast.description}
                </p>
                <a
                  href={podcast.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-purple-600 font-semibold text-sm hover:underline"
                >
                  Visit Podcast &rarr;
                </a>
              </div>
            </div>
          ))
        ) : (
          <p
            className="col-span-full text-center text-lg transition-colors duration-300"
            style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
          >
            {selectedCategory === "❤️ Favorites"
              ? "No favorites saved yet."
              : "No podcasts found."}
          </p>
        )}
      </div>

      {/* Dark Mode Toggle */}
      <DarkModeToggle />
    </main>
  );
}
