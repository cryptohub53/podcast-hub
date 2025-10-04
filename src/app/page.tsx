"use client";

import { useState, useEffect } from "react";
import { Podcast } from "lucide-react";
import DarkModeToggle from "../components/DarkModeToggle";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import PodcastCard from "../components/PodcastCard";
import Footer from "../components/Footer";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("alphabetical");
  const [visibleCount, setVisibleCount] = useState(3); // initial visible cards

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
      description:
        "True stories from the dark side of the internet. Explore the world of cybercrime, hackers, and digital forensics.",
      url: "https://darknetdiaries.com",
      image:
        "https://cybersecurityventures.com/wp-content/uploads/2023/11/dd-2.png",
      timestamp: "2024-08-15",
    },
    {
      title: "Shop Talk Show",
      category: "Web Development",
      description:
        "A podcast about front-end web design and development. Chris Coyier and Dave Rupert discuss the latest in web technology.",
      url: "https://shoptalkshow.com/",
      image:
        "https://images.cdn.kukufm.com/w:1080/f:webp/q:50/https://images.cdn.kukufm.com/f:webp/https://files.hubhopper.com/podcast/169605/1400x1400/the-reality-talk-show.jpg?v=1588485779",
      timestamp: "2024-09-20",
    },
    // Add more podcasts here
  ];

  const categories = ["All", ...new Set(podcasts.map((p) => p.category)), "❤️ Favorites"];

  // Filter + Sort
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

  filteredPodcasts = [...filteredPodcasts].sort((a, b) => {
    if (sortOption === "alphabetical") return a.title.localeCompare(b.title);
    if (sortOption === "category") return a.category.localeCompare(b.category);
    if (sortOption === "recent")
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    return 0;
  });

  const visiblePodcasts = filteredPodcasts.slice(0, visibleCount);

  const toggleFavorite = (title: string) => {
    setFavorites((prev) =>
      prev.includes(title) ? prev.filter((f) => f !== title) : [...prev, title]
    );
  };

  // Infinite scroll + auto-load until page is scrollable
  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, filteredPodcasts.length));
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 50
      ) {
        loadMore();
      }
    };

    const loadUntilScrollable = () => {
      if (document.documentElement.scrollHeight <= window.innerHeight) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    loadUntilScrollable(); // initial check
    const interval = setInterval(loadUntilScrollable, 100); // keep checking until scrollable

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, [filteredPodcasts.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      <main className="relative container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <Header />

        <div className="max-w-7xl mx-auto space-y-8">
          <SearchBar
            search={search}
            onSearchChange={setSearch}
            sortOption={sortOption}
            onSortChange={setSortOption}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
          />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredPodcasts.length === 0
                ? "No podcasts found"
                : `Showing ${visiblePodcasts.length} of ${filteredPodcasts.length} podcast${
                    filteredPodcasts.length === 1 ? "" : "s"
                  }`}
              {selectedCategory !== "All" && <span className="ml-1">in "{selectedCategory}"</span>}
            </p>
          </div>

          {visiblePodcasts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visiblePodcasts.map((podcast, index) => (
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
                  {selectedCategory === "❤️ Favorites" ? "No favorites yet" : "No podcasts found"}
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

        <DarkModeToggle />
      </main>

      <Footer />
    </div>
  );
}
