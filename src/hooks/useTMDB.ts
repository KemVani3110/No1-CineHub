import { useQuery } from '@tanstack/react-query';
import { fetchMovies, fetchTVShows, TMDBMovieListType } from '@/services/tmdb';

export const useMovies = (listType: TMDBMovieListType = 'popular', page: number = 1) => {
  return useQuery({
    queryKey: ['movies', listType, page],
    queryFn: () => fetchMovies(listType, page),
    staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new data
  });
};

export const useTVShows = (listType: string = 'popular', page: number = 1) => {
  return useQuery({
    queryKey: ['tvShows', listType, page],
    queryFn: () => fetchTVShows(listType, page),
    staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new data
  });
}; 