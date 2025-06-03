import axios from 'axios';
import { TMDBMovie, TMDBResponse } from '@/types/tmdb';

export type TMDBMovieListType = 'popular' | 'top_rated' | 'now_playing' | 'upcoming';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL;

// Create axios instance
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'en-US',
  },
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export const TMDB_ENDPOINTS = {
  MOVIES: {
    POPULAR: 'popular',
    TOP_RATED: 'top_rated',
    NOW_PLAYING: 'now_playing',
    UPCOMING: 'upcoming',
  },
  TV: {
    POPULAR: 'popular',
    TOP_RATED: 'top_rated',
    ON_THE_AIR: 'on_the_air',
  },
};

// API functions
export const fetchMovies = async (listType: TMDBMovieListType = 'popular', page: number = 1): Promise<TMDBResponse<TMDBMovie>> => {
  try {
    const { data } = await tmdbApi.get(`/movie/${listType}`, {
      params: { page },
    });
    return data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return { results: [], page: 1, total_pages: 1, total_results: 0 };
  }
};

export const fetchTVShows = async (listType: string = 'popular', page: number = 1) => {
  try {
    const { data } = await tmdbApi.get(`/tv/${listType}`, {
      params: { page },
    });
    return data;
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    return { results: [], page: 1, total_pages: 1, total_results: 0 };
  }
};

export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500'): string => {
  if (!path) return '/images/no-poster.jpg';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}; 