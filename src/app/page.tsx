"use client";

import { useState } from "react";

export default function Home() {
  const [search, setSearch] = useState("");

  const podcasts = [
    {
      title: "Syntax",
      category: "Web Development",
      description:
        "A podcast about web development, hosted by Wes Bos and Scott Tolinski.",
      url: "https://syntax.fm",
      image: "https://syntax.fm/static/logo.png",
    },
    {
      title: "Darknet Diaries",
      category: "Cybersecurity",
      description: "True stories from the dark side of the internet.",
      url: "https://darknetdiaries.com",
      image: "https://darknetdiaries.com/imgs/logo.jpg",
    },
    // Add more podcasts here
  ];

  // Filter podcasts based on search input
  const filteredPodcasts = podcasts.filter(
    (podcast) =>
      podcast.title.toLowerCase().includes(search.toLowerCase()) ||
      podcast.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-6">🎙️ Podcast Hub</h1>
      <p className="text-gray-600 mb-6">Discover and explore podcasts</p>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search podcasts by title or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Podcasts grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {filteredPodcasts.length > 0 ? (
          filteredPodcasts.map((podcast) => (
            <a
              key={podcast.title}
              href={podcast.url}
              target="_blank"
              className="p-6 border rounded-xl hover:shadow-md transition flex flex-col"
            >
              <img
                src={podcast.image}
                alt={podcast.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold">{podcast.title}</h2>
              <p className="text-gray-600 text-sm">{podcast.description}</p>
              <span className="mt-2 text-xs text-blue-600">
                {podcast.category}
              </span>
            </a>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No podcasts found.</p>
        )}
      </div>
    </main>
  );
}
