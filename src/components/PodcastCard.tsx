"use client";

import { Heart, ExternalLink, Clock } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface PodcastCardProps {
  podcast: {
    title: string;
    category: string;
    description: string;
    url: string;
    image: string;
    timestamp: string;
  };
  isFavorite: boolean;
  onToggleFavorite: (title: string) => void;
}

export default function PodcastCard({ podcast, isFavorite, onToggleFavorite }: PodcastCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in bg-card/50 backdrop-blur-sm border-border/50">
      <div className="relative overflow-hidden">
        <img
          src={podcast.image}
          alt={podcast.title}
          className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Favorite Button */}
        <Button
          onClick={() => onToggleFavorite(podcast.title)}
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-2 h-8 w-8 backdrop-blur-md transition-all duration-200",
            isFavorite 
              ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" 
              : "bg-black/20 text-white hover:bg-black/40"
          )}
        >
          <Heart 
            className={cn(
              "h-4 w-4 transition-all duration-200",
              isFavorite && "fill-current"
            )}
          />
        </Button>

        {/* Category Badge */}
        <Badge 
          variant="secondary" 
          className="absolute bottom-2 left-2 bg-primary/90 text-white/80 backdrop-blur-sm dark"
        >
          {podcast.category}
        </Badge>

        {/* Date */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-white/80 bg-black/20 backdrop-blur-sm rounded-md px-2 py-1">
          <Clock className="h-3 w-3" />
          {formatDate(podcast.timestamp)}
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {podcast.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
          {podcast.description}
        </p>

        <Button
          asChild
          variant="outline"
          className="group bg-background/50 border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all duration-200"
        >
          <a 
            href={podcast.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            Listen Now
            <ExternalLink className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}