import { Podcast, Episode } from './types';

// Create some mock episodes
const episodes: Episode[] = [
  { id: 'ep1', podcastId: '1', title: 'The Beginning', description: 'Our first episode!', duration: 1800, releaseDate: '2023-10-01' },
  { id: 'ep2', podcastId: '1', title: 'The Middle', description: 'Things are heating up.', duration: 2200, releaseDate: '2023-10-08' },
  { id: 'ep3', podcastId: '2', title: 'Another Show Begins', description: 'Welcome to a different podcast.', duration: 1500, releaseDate: '2023-10-05' },
];

// Create some mock podcasts and establish the "relationship"
export const podcasts: Podcast[] = [
  {
    id: '1',
    title: 'The Main Podcast',
    author: 'Host One',
    episodes: episodes.filter(ep => ep.podcastId === '1'),
  },
  {
    id: '2',
    title: 'The Second Show',
    author: 'Host Two',
    episodes: episodes.filter(ep => ep.podcastId === '2'),
  },
];

