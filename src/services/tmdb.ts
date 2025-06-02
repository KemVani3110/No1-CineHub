import { TMDBMovie, TMDBMovieListType, TMDBResponse } from '@/types/tmdb';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL;

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

export const getMovies = async (listType: TMDBMovieListType = 'popular', page: number = 1): Promise<TMDBResponse<TMDBMovie>> => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${listType}?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching movies:', error);
    return { results: [], page: 1, total_pages: 1, total_results: 0 };
  }
};

export const getTVShows = async (listType: string = 'popular', page: number = 1) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${listType}?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch TV shows');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    return { results: [], page: 1, total_pages: 1, total_results: 0 };
  }
};

export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500'): string => {
  if (!path) return '/images/no-poster.jpg';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}; 