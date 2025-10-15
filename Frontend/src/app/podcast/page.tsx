"use client";

import { useState, useEffect } from "react";
import { Headphones, Heart } from "lucide-react";
import SearchBar from "../../components/SearchBar";
import PodcastCard from "../../components/PodcastCard";
import Footer from "../../components/Footer";
import DiscordModal from "../../components/DiscordModal";
// import { motion } from "framer-motion";
import { PaginatedPodcast, Podcasts } from "@/types/podcast";
import { getPodcasts, searchAndFilterPodcasts } from "@/api/services/podcastService";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("alphabetical");
  const [visibleCount, setVisibleCount] = useState(3);
  const [showDiscordModal, setShowDiscordModal] = useState(false);
  const [podcasts, setPodcasts] = useState<PaginatedPodcast | null>(null);
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
  useEffect(() => {
    async function fetchPodcasts() {
      try {
        const data = await getPodcasts();
        setPodcasts(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchPodcasts()
  },[])

  const categories = [
    "All",
    ...new Set(podcasts?.podcasts.map((p) => p.category)),
    "❤️ Favorites",
  ];

  // Filter + Sort
  let filteredPodcasts = (podcasts?.podcasts || []).filter((podcast) => {
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

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    setVisibleCount(8); //set this to whatever you need the page size to be
  };

  filteredPodcasts = [...filteredPodcasts].sort((a, b) => {
    if (sortOption === "alphabetical") return a.title.localeCompare(b.title);
    if (sortOption === "category") return a.category.localeCompare(b.category);
    if (sortOption === "recent")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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

   useEffect(() => {
    async function fetchPodcasts() {
      try {
        const data = await searchAndFilterPodcasts(search, selectedCategory);
        setPodcasts(data)
      
      } catch (err) {
        console.error("Error fetching podcasts:", err);
      }
    }

    fetchPodcasts();
  }, [search, selectedCategory]);

  const mapPodcastToCardData = (podcasts: Podcasts) => ({
  id: podcasts.id,
  title: podcasts.title,
  category: podcasts.category,
  description: podcasts.description,
  url: `/podcast/${podcasts.id}`,
  image: podcasts.coverImageUrl || "/placeholder.jpg",
  timestamp: podcasts.createdAt,
});

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background to-muted/20'>
      <div className='fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none'></div>

      <main className='relative container mx-auto px-4 py-8 md:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto space-y-8 pt-8'>
          <SearchBar
            search={search}
            onSearchChange={setSearch}
            sortOption={sortOption}
            onSortChange={setSortOption}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            categories={categories}
          />

          <div className='flex items-center justify-between'>
            <p className='text-sm text-muted-foreground'>
              {filteredPodcasts.length === 0
                ? "No podcasts found"
                : `Showing ${visiblePodcasts.length} of ${filteredPodcasts.length
                } podcast${filteredPodcasts.length === 1 ? "" : "s"}`}
              {selectedCategory !== "All" && (
                <span className='ml-1'>in "{selectedCategory}"</span>
              )}
            </p>
          </div>

          {visiblePodcasts.length > 0 ? (
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {visiblePodcasts.map((podcast, index) => (
                <div
                  key={podcast.title}
                  className='animate-fade-in'
                  style={{ animationDelay: `${index * 0.1}s` }}>
                  <PodcastCard
                    podcast={mapPodcastToCardData(podcast)}
                    isFavorite={favorites.includes(podcast.title)}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-16 animate-fade-in'>
              <div className='mb-6'>
                <Headphones className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
                <h3 className='text-xl font-semibold mb-2'>
                  {selectedCategory === "❤️ Favorites"
                    ? "No favorites yet"
                    : "No podcasts found"}
                </h3>
                <p className='text-muted-foreground max-w-md mx-auto'>
                  {selectedCategory === "❤️ Favorites"
                    ? "Start adding podcasts to your favorites by clicking the heart icon on any podcast card."
                    : "Try adjusting your search terms or browse different categories to find what you're looking for."}
                </p>
              </div>
            </div>
          )}
        </div>

      </main>

      <Footer onDiscordClick={() => setShowDiscordModal(true)} />

      <DiscordModal
        isOpen={showDiscordModal}
        onClose={() => setShowDiscordModal(false)}
      />
    </div>
  );
}
