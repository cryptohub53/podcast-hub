export const PODCASTS_ENDPOINTS = {
    LIST: '/podcasts/',
    DETAIL: (id: string) => `/podcasts/${id}`,
    SEARCH: '/podcasts/search/filter'
}