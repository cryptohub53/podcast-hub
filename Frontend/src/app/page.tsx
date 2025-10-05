"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Podcast } from "lucide-react";
import DarkModeToggle from "../components/DarkModeToggle";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import PodcastCard from "../components/PodcastCard";
import Footer from "../components/Footer";
import DiscordModal from "../components/DiscordModal";
import AuthForm from "../components/ui/AuthForm";
import OAuthButton from "../components/ui/OAuthButton";

export default function Home() {
  // ---- Auth state ----
  const [user, setUser] = useState<{ username: string; guest?: boolean } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // ---- Podcast state ----
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("alphabetical");
  const [visibleCount, setVisibleCount] = useState(3);
  const [showDiscordModal, setShowDiscordModal] = useState(false);

  // ---- Check if logged in on mount ----
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch {
        setShowAuthModal(true); // show login/signup modal if not logged in
      }
    };
    checkAuth();
  }, []);

  // ---- Favorites + Discord Modal ----
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));

    const hasSeenDiscordModal = localStorage.getItem("hasSeenDiscordModal");
    if (!hasSeenDiscordModal) {
      setTimeout(() => {
        setShowDiscordModal(true);
        localStorage.setItem("hasSeenDiscordModal", "true");
      }, 2000);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // ---- Podcasts data ----
  const podcasts = [
    {
      title: "Syntax",
      category: "Web Development",
      description:
        "A podcast about web development, hosted by Wes Bos and Scott Tolinski.",
      url: "https://syntax.fm",
      image:
        "https://i0.wp.com/www.lemonproductions.ca/wp-content/uploads/2021/11/Syntax-podcast.jpg?fit=1200%2C900&ssl=1",
      timestamp: "2024-09-01",
    },
    {
      title: "Darknet Diaries",
      category: "Cybersecurity",
      description: "True stories from the dark side of the internet.",
      url: "https://darknetdiaries.com",
      image:
        "https://cybersecurityventures.com/wp-content/uploads/2023/11/dd-2.png",
      timestamp: "2024-08-15",
    },
    {
      title: "Shop Talk Show",
      category: "Web Development",
      description:
        "A podcast about front-end web design and development.",
      url: "https://shoptalkshow.com/",
      image:
        "https://images.cdn.kukufm.com/w:1080/f:webp/q:50/https://files.hubhopper.com/podcast/169605/1400x1400/the-reality-talk-show.jpg?v=1588485779",
      timestamp: "2024-09-20",
    },
  ];

  const categories = [
    "All",
    ...new Set(podcasts.map((p) => p.category)),
    "❤️ Favorites",
  ];

  // ---- Filter + Sort ----
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

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    setVisibleCount(8);
  };

  const toggleFavorite = (title: string) => {
    setFavorites((prev) =>
      prev.includes(title) ? prev.filter((f) => f !== title) : [...prev, title]
    );
  };

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
    loadUntilScrollable();
    const interval = setInterval(loadUntilScrollable, 100);

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

        {/* Welcome banner */}
        {user && (
          <div className="my-4 p-4 bg-blue-100 text-blue-800 rounded-md text-center font-medium">
            Welcome, {user.username} {user.guest ? "(Guest)" : ""}
          </div>
        )}

        {/* Auth modal */}
        {showAuthModal && !user && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4 text-center">
                Welcome! Please Login or Signup
              </h2>

              {/* Login Form */}
              <AuthForm mode="login" />

              {/* OAuth */}
              <OAuthButton provider="google" />
              <OAuthButton provider="github" />

              {/* Guest Login */}
              <button
                onClick={async () => {
                  try {
                    const res = await axios.post(
                      `${process.env.NEXT_PUBLIC_API_URL}/auth/guest`,
                      {},
                      { withCredentials: true }
                    );
                    setUser(res.data.user);
                    setShowAuthModal(false);
                  } catch (err: any) {
                    console.error(
                      "Guest login failed:",
                      err.response?.data?.message || err.message
                    );
                  }
                }}
                className="mt-4 w-full bg-gray-200 py-2 rounded hover:bg-gray-300"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto space-y-8">
          <SearchBar
            search={search}
            onSearchChange={setSearch}
            sortOption={sortOption}
            onSortChange={setSortOption}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            categories={categories}
          />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredPodcasts.length === 0
                ? "No podcasts found"
                : `Showing ${visiblePodcasts.length} of ${
                    filteredPodcasts.length
                  } podcast${filteredPodcasts.length === 1 ? "" : "s"}`}
              {selectedCategory !== "All" && (
                <span className="ml-1">in "{selectedCategory}"</span>
              )}
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

        <DarkModeToggle />
      </main>

      <Footer onDiscordClick={() => setShowDiscordModal(true)} />

      <DiscordModal
        isOpen={showDiscordModal}
        onClose={() => setShowDiscordModal(false)}
      />
    </div>
  );
}
