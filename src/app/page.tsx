"use client";

import { useState, useEffect } from "react";
import { Podcast } from "lucide-react";
import DarkModeToggle from "../components/DarkModeToggle";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import PodcastCard from "../components/PodcastCard";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("alphabetical");

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
        "A podcast about web development, hosted by Wes Bos and Scott Tolinski. They cover everything from JavaScript frameworks to career advice.",
      url: "https://syntax.fm",
      image:
        "https://i0.wp.com/www.lemonproductions.ca/wp-content/uploads/2021/11/Syntax-podcast.jpg?fit=1200%2C900&ssl=1",
      timestamp: "2024-09-01",
    },
    {
      title: "Darknet Diaries",
      category: "Cybersecurity",
      description: "True stories from the dark side of the internet. Explore the world of cybercrime, hackers, and digital forensics.",
      url: "https://darknetdiaries.com",
      image:
        "https://cybersecurityventures.com/wp-content/uploads/2023/11/dd-2.png",
      timestamp: "2024-08-15",
    },
    {
      title: "Shop Talk Show",
      category: "Web Development",
      description: "A podcast about front-end web design and development. Chris Coyier and Dave Rupert discuss the latest in web technology.",
      url: "https://shoptalkshow.com/",
      image:
        "https://images.cdn.kukufm.com/w:1080/f:webp/q:50/https://images.cdn.kukufm.com/f:webp/https://files.hubhopper.com/podcast/169605/1400x1400/the-reality-talk-show.jpg?v=1588485779",
      timestamp: "2024-09-20",
    },
  ];

  // Categories + Favorites tab
  const categories = ["All", ...new Set(podcasts.map((p) => p.category)), "❤️ Favorites"];

  // Filter podcasts
  let filteredPodcasts = podcasts.filter((podcast) => {
    const matchesSearch =
      podcast.title.toLowerCase().includes(search.toLowerCase()) ||
      podcast.category.toLowerCase().includes(search.toLowerCase()) ||
      podcast.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All"
        ? true
        : selectedCategory === "❤️ Favorites"
        ? favorites.includes(podcast.title)
        : podcast.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort podcasts
  filteredPodcasts = [...filteredPodcasts].sort((a, b) => {
    if (sortOption === "alphabetical") {
      return a.title.localeCompare(b.title);
    }
    if (sortOption === "category") {
      return a.category.localeCompare(b.category);
    }
    if (sortOption === "recent") {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    return 0;
  });

  // Toggle favorite
  const toggleFavorite = (title: string) => {
    setFavorites((prev) =>
      prev.includes(title) ? prev.filter((f) => f !== title) : [...prev, title]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      
      <main className="relative container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <Header />

        <div className="max-w-7xl mx-auto space-y-8">
          {/* Search and Filters */}
          <SearchBar
            search={search}
            onSearchChange={setSearch}
            sortOption={sortOption}
            onSortChange={setSortOption}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
          />

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredPodcasts.length === 0
                ? "No podcasts found"
                : `Showing ${filteredPodcasts.length} podcast${filteredPodcasts.length === 1 ? "" : "s"}`}
              {selectedCategory !== "All" && (
                <span className="ml-1">in "{selectedCategory}"</span>
              )}
            </p>
          </div>

          {/* Podcasts Grid */}
          {filteredPodcasts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPodcasts.map((podcast, index) => (
                <div
                  key={podcast.title}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PodcastCard
                    podcast={podcast}
                    isFavorite={favorites.includes(podcast.title)}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 animate-fade-in">
              <div className="mb-6">
                <Podcast className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {selectedCategory === "❤️ Favorites"
                    ? "No favorites yet"
                    : "No podcasts found"}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {selectedCategory === "❤️ Favorites"
                    ? "Start adding podcasts to your favorites by clicking the heart icon on any podcast card."
                    : "Try adjusting your search terms or browse different categories to find what you're looking for."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <DarkModeToggle />
      </main>
      
      {/* Footer */}
      <Footer 
      siteName="Podcast Hub"
        year={new Date().getFullYear()}
          quickLinks={[
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
          { label: "Terms", href: "/terms" },
          { label: "Privacy", href: "/privacy" },
        ]}
         social={[
          { name: "X", href: "https://x.com/podcast-hub" },
          { name: "GitHub", href: "https://github.com/podcast-hub" },
          { name: "LinkedIn", href: "https://linkedin.com/company/podcast-hub" },
          { name: "Instagram", href: "https://instagram.com/podcast-hub" },
        ]}
      
      />
    </div>
  );
}
