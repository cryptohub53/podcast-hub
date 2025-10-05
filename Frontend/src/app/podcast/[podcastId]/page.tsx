"use client";

import { useEffect, useState, use } from "react";
import { ArrowLeft, Heart, Clock, ExternalLink, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/share-button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PodcastData {
  title: string;
  category: string;
  description: string;
  url: string;
  image: string;
  timestamp: string;
  episodes?: Array<{
    title: string;
    duration: string;
    date: string;
    description: string;
  }>;
}

export default function PodcastDetailsPage({
  params,
}: {
  params: Promise<{ podcastId: string }>;
}) {
  const resolvedParams = use(params);
  const [podcast, setPodcast] = useState<PodcastData | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Simulated data - In a real app, this would come from your API
  useEffect(() => {
    // Decode the podcast title from the URL
    const decodedTitle = decodeURIComponent(resolvedParams.podcastId);
    
    // Simulated API call
    setPodcast({
      title: "Syntax",
      category: "Web Development",
      description: "A podcast about web development, hosted by Wes Bos and Scott Tolinski. They cover everything from JavaScript frameworks to career advice. Join them for in-depth discussions about web development, from the basics to the advanced topics that will help you level up your skills.",
      url: "https://syntax.fm",
      image: "https://i0.wp.com/www.lemonproductions.ca/wp-content/uploads/2021/11/Syntax-podcast.jpg?fit=1200%2C900&ssl=1",
      timestamp: "2024-09-01",
      episodes: [
        {
          title: "TypeScript Best Practices",
          duration: "1:15:00",
          date: "2024-09-01",
          description: "Deep dive into TypeScript best practices and common pitfalls to avoid."
        },
        {
          title: "Modern CSS Techniques",
          duration: "1:02:30",
          date: "2024-08-25",
          description: "Exploring the latest CSS features and how to use them effectively."
        },
        {
          title: "React Performance Optimization",
          duration: "58:45",
          date: "2024-08-18",
          description: "Tips and tricks for optimizing React applications for better performance."
        }
      ]
    });

    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      const favorites = JSON.parse(savedFavorites);
      setIsFavorite(favorites.includes(decodedTitle));
    }
    
    setMounted(true);
  }, [resolvedParams.podcastId]);

  // Put this inside your component (client component) so it can access `podcast`
const handleShare = async () => {
  try {
    const url = typeof window !== "undefined" ? window.location.href : podcast?.url ?? "";
    const shareData: ShareData = {
      title: podcast?.title ?? "Podcast",
      text: podcast ? `Check out ${podcast.title}` : "Check out this podcast",
      url,
    };

    // Check if navigator.share is available
    if (navigator.share) {
      console.log("Attempting native share...");
      await navigator.share(shareData);
      console.log("Share successful");
      return;
    }

    // Fallback to clipboard copy
    console.log("navigator.share not available, copying to clipboard...");
    await navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!"); // Temporary feedback
  } catch (err) {
    console.error("Share error:", err);
    // Final fallback: try clipboard if native share failed
    try {
      const url = typeof window !== "undefined" ? window.location.href : podcast?.url ?? "";
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } catch (clipErr) {
      console.error("Clipboard error:", clipErr);
      alert("Share not supported on this browser");
    }
  }
};


  const toggleFavorite = () => {
    if (!podcast) return;
    
    const savedFavorites = localStorage.getItem("favorites");
    let favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    
    if (isFavorite) {
      favorites = favorites.filter((f: string) => f !== podcast.title);
    } else {
      favorites.push(podcast.title);
    }
    
    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  if (!mounted || !podcast) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted rounded"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 bg-fixed">
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      
      <main className="relative container mx-auto px-4 py-8 md:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center mb-8 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Podcasts
        </Link>

        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-12">
          <div className="absolute inset-0">
            <img
              src={podcast.image}
              alt={podcast.title}
              className="w-full h-full object-cover filter blur-sm opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20"></div>
          </div>

          <div className="relative px-6 py-12 md:px-12 lg:px-16 flex flex-col md:flex-row gap-8 items-center">
            {/* Podcast Image */}
            <div className="w-64 h-64 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <img
                src={podcast.image}
                alt={podcast.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Podcast Info */}
            <div className="flex-1 text-center md:text-left">
              <Badge className="mb-4 bg-purple-500/20 text-purple-500 hover:bg-purple-500/30 transition-colors">
                🎧 {podcast.category}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{podcast.title}</h1>
              
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
                {podcast.description}
              </p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Button
                  onClick={toggleFavorite}
                  variant="outline"
                  className={cn(
                    "bg-background/50 transition-all duration-200",
                    isFavorite
                      ? "border-red-500 text-red-500 hover:bg-red-500/10"
                      : "border-muted-foreground/30 hover:border-muted-foreground/50"
                  )}
                >
                  <Heart
                    className={cn(
                      "mr-2 h-4 w-4 transition-all duration-200",
                      isFavorite && "fill-current"
                    )}
                  />
                  {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </Button>

                <Button
                  asChild
                  className="bg-purple-500 hover:bg-purple-600  min-w-[160px]"
                  onClick={() => window.open(podcast.url, '_blank')}
                >
                    Listen Now
                    <ExternalLink className="ml-2 h-4 w-4" />
                </Button>

                {/* <Button
                  variant="outline"
                  className="bg-background/50 border-muted-foreground/30 hover:border-muted-foreground/50 transition-all duration-200"
                  onClick={handleShare}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button> */}
                <ShareButton
                url={typeof window !== "undefined" ? window.location.href : ""}
                title={podcast.title}
                description="Share this podcast with your friends"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Episodes Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-6">Recent Episodes</h2>
          
          <div className="grid gap-4">
            {podcast.episodes?.map((episode, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-200 bg-card/50 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold group-hover:text-purple-500 transition-colors">
                        {episode.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2">
                        {episode.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {episode.duration}
                      </span>
                      <span>{formatDate(episode.date)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 hover:text-purple-500"
                      >
                        Play
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
