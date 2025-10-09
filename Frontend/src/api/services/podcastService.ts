import { PaginatedPodcast, Podcasts } from "@/types/podcast";
import axiosClient from "../clients/axiosClient";
import { PODCASTS_ENDPOINTS } from "../endpoints/podcasts";

export async function getPodcasts(): Promise<PaginatedPodcast> {
    const {data} = await axiosClient.get(PODCASTS_ENDPOINTS.LIST);
    return data;
}

export async function getPodcastsById(id: string): Promise<Podcasts> {
    const {data} = await axiosClient.get(`${PODCASTS_ENDPOINTS.DETAIL(id)}`);
    return data;
}

export async function searchAndFilterPodcasts(
    query: string = "",
    category: string = "All",
    page: number = 1,
    limit: number = 10
): Promise<PaginatedPodcast> {
    const {data} = await axiosClient.get(PODCASTS_ENDPOINTS.SEARCH, {
        params : {query, category, page,limit},
    });
    return data;
}