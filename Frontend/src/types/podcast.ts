export type Podcasts = {
  _id?: string;
  title: string;
  description: string;
  author: string;
  category: string;
  coverImageUrl?: string;
  episodes?: Episode[];
  followers?: string[];
  __v?: number;
  updatedAt?: string;
  episodeCount: number;
  followerCount: number;
  createdAt: string;
  id: string
}

export type PaginatedPodcast = {
    totalPodcasts: number,
    totalPages: number,
    currentPage: number,
    podcasts: Podcasts[],
}

export type Episode = {
  _id: string,
  title: string,
  description: string,
  audioUrl: string,
  duration: number,
  createdAt: string,
  formattedDuration: string,
  publishedAgo: null,
  id: string
}

