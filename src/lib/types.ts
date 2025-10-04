export interface Episode {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  releaseDate: string;
  podcastId: string;
}

export interface Podcast {
  id: string;
  title: string;
  author: string;
  episodes: Episode[];
}
