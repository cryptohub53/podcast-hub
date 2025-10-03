"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDark, setIsDark] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("alphabetical");

  // Dark mode listener
  useEffect(() => {
    const checkDarkMode = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const podcasts = [
    {
      title: "Syntax",
      category: "Web Development",
      description: "A podcast about web development, hosted by Wes Bos and Scott Tolinski.",
      url: "https://syntax.fm",
      image: "https://i0.wp.com/www.lemonproductions.ca/wp-content/uploads/2021/11/Syntax-podcast.jpg?fit=1200%2C900&ssl=1",
      timestamp: "2024-09-01",
    },
    {
      title: "Darknet Diaries",
      category: "Cybersecurity",
      description: "True stories from the dark side of the internet.",
      url: "https://darknetdiaries.com",
      image: "https://cybersecurityventures.com/wp-content/uploads/2023/11/dd-2.png",
      timestamp: "2024-08-15",
    },
    {
      title: "Shop Talk Show",
      category: "Web Development",
      description: "A podcast about front-end and web design.",
      url: "https://shoptalkshow.com/",
      image: "https://images.cdn.kukufm.com/w:1080/f:webp/q:50/https://images.cdn.kukufm.com/f:webp/https://files.hubhopper.com/podcast/169605/1400x1400/the-reality-talk-show.jpg?v=1588485779",
      timestamp: "2024-09-20",
    },
  ];

  const categories = ["All", ...new Set(podcasts.map((p) => p.category)), "❤️ Favorites"];

  // Filter and sort
  let filteredPodcasts = podcasts.filter((podcast) => {
    const matchesSearch = podcast.title.toLowerCase().includes(search.toLowerCase()) || podcast.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All"
        ? true
        : selectedCategory === "❤️ Favorites"
        ? favorites.includes(podcast.title)
        : podcast.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  filteredPodcasts = [...filteredPodcasts].sort((a, b) => {
    if (sortOption === "alphabetical") return a.title.localeCompare(b.title);
    if (sortOption === "category") return a.category.localeCompare(b.category);
    if (sortOption === "recent") return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    return 0;
  });

  const toggleFavorite = (title: string) => {
    setFavorites((prev) => (prev.includes(title) ? prev.filter((f) => f !== title) : [...prev, title]));
  };

  return (
    <>
      <Navbar />
      <main
        className="min-h-screen p-6 md:p-10 font-sans transition-colors duration-300"
        style={{
          background: isDark
            ? "linear-gradient(to bottom right, #1f2937, #374151)"
            : "linear-gradient(to bottom right, #eff6ff, #faf5ff)",
        }}
      >
        {/* Hero */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 animate-pulse">
            🎙️ Podcast Hub
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-700 dark:text-gray-300">
            Discover, explore, and enjoy your favorite podcasts
          </p>
        </header>

        {/* Search + Sort */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Search podcasts by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-4 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            style={{
              backgroundColor: isDark ? "#374151" : "#ffffff",
              color: isDark ? "#e5e7eb" : "#1f2937",
              borderColor: isDark ? "#4b5563" : "#d1d5db",
            }}
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-3 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            style={{
              backgroundColor: isDark ? "#374151" : "#ffffff",
              color: isDark ? "#e5e7eb" : "#1f2937",
              borderColor: isDark ? "#4b5563" : "#d1d5db",
            }}
          >
            <option value="alphabetical">Sort: A–Z</option>
            <option value="category">Sort: By Category</option>
            <option value="recent">Sort: Most Recent</option>
          </select>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full border transition-all duration-300 font-medium ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent"
                  : "hover:bg-purple-100 dark:hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Podcasts Grid */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredPodcasts.length > 0 ? (
            filteredPodcasts.map((podcast) => (
              <div
                key={podcast.title}
                className="flex flex-col rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden relative"
                style={{
                  backgroundColor: isDark ? "#1f2937" : "#ffffff",
                }}
              >
                <button
                  onClick={() => toggleFavorite(podcast.title)}
                  className="absolute top-3 right-3 text-2xl z-20 bg-white/70 dark:bg-gray-800/70 rounded-full p-1 transition-transform duration-200 hover:scale-110"
                >
                  {favorites.includes(podcast.title) ? "❤️" : "🤍"}
                </button>

                <div className="relative w-full h-44">
                  <img src={podcast.image} alt={podcast.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                    {podcast.category}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{podcast.title}</h2>
                  <p className="text-sm flex-1 text-gray-600 dark:text-gray-300">{podcast.description}</p>
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
            <p className="col-span-full text-center text-lg text-gray-500 dark:text-gray-400">
              {selectedCategory === "❤️ Favorites" ? "No favorites saved yet." : "No podcasts found."}
            </p>
          )}
        </div>
      </main>
    </>
  );
}
