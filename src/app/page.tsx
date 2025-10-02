"use client";

import { useState } from "react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const podcasts = [
    {
      title: "Syntax",
      category: "Web Development",
      description:
        "A podcast about web development, hosted by Wes Bos and Scott Tolinski.",
      url: "https://syntax.fm",
      image: "https://i0.wp.com/www.lemonproductions.ca/wp-content/uploads/2021/11/Syntax-podcast.jpg?fit=1200%2C900&ssl=1",
    },
    {
      title: "Darknet Diaries",
      category: "Cybersecurity",
      description: "True stories from the dark side of the internet.",
      url: "https://darknetdiaries.com",
      image: "https://cybersecurityventures.com/wp-content/uploads/2023/11/dd-2.png",
    },
    {
      title: "Shop Talk Show",
      category: "Web Development",
      description: "A podcast about front-end and web design.",
      url: "https://shoptalkshow.com/",
      image: "https://images.cdn.kukufm.com/w:1080/f:webp/q:50/https://images.cdn.kukufm.com/f:webp/https://files.hubhopper.com/podcast/169605/1400x1400/the-reality-talk-show.jpg?v=1588485779",
    },
  ];

  const categories = ["All", ...new Set(podcasts.map((p) => p.category))];

  const filteredPodcasts = podcasts.filter((podcast) => {
    const matchesSearch =
      podcast.title.toLowerCase().includes(search.toLowerCase()) ||
      podcast.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || podcast.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-10 font-sans">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold mb-4 text-gray-900">
          🎙️ Podcast Hub
        </h1>
        <p className="text-gray-700 text-lg">
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
          className="flex-1 p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
        />

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full border transition font-medium ${
                selectedCategory === category
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-purple-100"
              }`}
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
            <a
              key={podcast.title}
              href={podcast.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
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
                <h2 className="text-xl font-bold mb-2 text-gray-900">
                  {podcast.title}
                </h2>
                <p className="text-gray-600 text-sm flex-1">{podcast.description}</p>
                <span className="mt-4 inline-block text-purple-600 font-semibold text-sm hover:underline">
                  Visit Podcast &rarr;
                </span>
              </div>
            </a>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center text-lg">
            No podcasts found.
          </p>
        )}
      </div>
    </main>
  );
}
