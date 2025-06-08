'use client';

import { useEffect, useState } from 'react';
import { useSearchStore, SearchType } from '@/store/searchStore';
import { useSearch } from '@/hooks/useSearch';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { MovieCard } from '@/components/common/MovieCard';
import { TVShowCard } from '@/components/common/TVShowCard';
import { 
  Search as SearchIcon, 
  Clock,
  TrendingUp,
  X,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { TMDBMovie, TMDBTV, TMDBSearchResult } from '@/types/tmdb';
import Header from '@/components/common/Header';
import Image from 'next/image';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { query, type, setQuery, setType, searchHistory, addToHistory, clearHistory } = useSearchStore();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError } = useSearch(currentPage);
  const { user } = useAuth();

  // View and sort state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'date' | 'title'>('popularity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Initialize from URL params
  useEffect(() => {
    const urlQuery = searchParams.get('query');
    const urlType = searchParams.get('type') as SearchType;
    const urlPage = searchParams.get('page');

    if (urlQuery) setQuery(urlQuery);
    if (urlType && ['all', 'movie', 'tv'].includes(urlType)) setType(urlType);
    if (urlPage) setCurrentPage(parseInt(urlPage));
  }, [searchParams, setQuery, setType]);

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (type !== 'all') params.set('type', type);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.push(`/search${newUrl}`, { scroll: false });
  }, [query, type, currentPage, router]);

  useEffect(() => {
    if (query && user) {
      addToHistory(query);
    }
    // Reset page when search changes
    setCurrentPage(1);
  }, [query, user, addToHistory, type]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && user) {
      addToHistory(query.trim());
    }
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setQuery('');
    setCurrentPage(1);
  };

  const removeFromHistory = (itemToRemove: string) => {
    const newHistory = searchHistory.filter(item => item !== itemToRemove);
    clearHistory();
    newHistory.forEach(item => addToHistory(item));
  };

  // Sort and filter results
  const sortedResults = data?.results?.slice().sort((a: TMDBSearchResult, b: TMDBSearchResult) => {
    const aValue = getSortValue(a, sortBy);
    const bValue = getSortValue(b, sortBy);
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  }) || [];

  function getSortValue(item: TMDBSearchResult, sortBy: string) {
    switch (sortBy) {
      case 'popularity':
        return item.popularity;
      case 'rating':
        return item.vote_average || 0;
      case 'date':
        return item.release_date || item.first_air_date || '';
      case 'title':
        return item.title || item.name || '';
      default:
        return 0;
    }
  }

  const renderResults = () => {
    if (!query) {
      return (
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-accent mx-auto mb-4" />
              <div className="text-lg font-medium mb-2">Discover Amazing Content</div>
              <p className="text-muted-foreground">
                Search for movies and TV shows to get started
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (isLoading) {
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="relative">
              {/* Spinner ring outside */}
              <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
              
              {/* Middle Logo*/}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Image
                  src="/logo.png"
                  alt="CineHub Logo"
                  width={40}
                  height={40}
                  className="animate-pulse rounded-full"
                />
              </div>
            </div>
            
            <p className="text-text-sub text-base font-medium animate-pulse">
              Searching for amazing content...
            </p>
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-destructive text-lg font-medium mb-2">
                Search Error
              </div>
              <p className="text-muted-foreground">
                Something went wrong while searching. Please try again.
              </p>
              <Button 
                variant="outline" 
                className="mt-4 cursor-pointer hover:bg-accent/10"
                onClick={() => window.location.reload()}
              >
                Retry Search
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!data?.results?.length) {
      return (
        <Card className="border-muted bg-muted/5">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <div className="text-lg font-medium mb-2">No Results Found</div>
              <p className="text-muted-foreground mb-4">
                No {type === 'all' ? 'content' : type === 'movie' ? 'movies' : 'TV shows'} found for "{query}"
              </p>
              <Button 
                variant="outline" 
                className="cursor-pointer hover:bg-accent/10"
                onClick={clearSearch}
              >
                Clear Search
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {/* Results header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              {data?.total_results?.toLocaleString() || 0} results
            </Badge>
            <Badge variant="outline" className="text-sm">
              Page {currentPage} of {data?.total_pages || 1}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {/* Sort options */}
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[140px] cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity" className="cursor-pointer">Popularity</SelectItem>
                <SelectItem value="rating" className="cursor-pointer">Rating</SelectItem>
                <SelectItem value="date" className="cursor-pointer">Release Date</SelectItem>
                <SelectItem value="title" className="cursor-pointer">Title</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline" 
              size="sm"
              className="cursor-pointer hover:bg-accent/10"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
            
            {/* View mode toggle */}
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                className="cursor-pointer"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                className="cursor-pointer"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results grid */}
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
            : "space-y-4"
        }>
          {sortedResults.map((item: TMDBSearchResult) => {
            // Handle movie results
            if (type === 'movie' || (item.media_type === 'movie' && type === 'all')) {
              const movie = item as TMDBMovie;
              return (
                <div key={movie.id} className="transform scale-95 hover:scale-100 transition-transform duration-200">
                  <MovieCard movie={movie} />
                </div>
              );
            }
            
            // Handle TV show results
            if (type === 'tv' || (item.media_type === 'tv' && type === 'all')) {
              const tvShow: TMDBTV = {
                id: item.id,
                name: item.name || '',
                original_name: item.original_name || '',
                overview: item.overview || '',
                first_air_date: item.first_air_date || '',
                poster_path: item.poster_path,
                backdrop_path: item.backdrop_path,
                genre_ids: item.genre_ids || [],
                original_language: item.original_language || '',
                popularity: item.popularity,
                vote_count: item.vote_count || 0,
                vote_average: item.vote_average || 0,
                origin_country: []
              };
              return (
                <div key={tvShow.id} className="transform scale-95 hover:scale-100 transition-transform duration-200">
                  <TVShowCard show={tvShow} />
                </div>
              );
            }
            
            return null;
          })}
        </div>
      </div>
    );
  };

  const generatePaginationItems = (totalPages: number, currentPage: number) => {
    const items = [];
    const maxVisiblePages = window.innerWidth < 640 ? 3 : 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Calculate start and end of visible pages
    let startPage = Math.max(2, currentPage - halfVisible);
    let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

    // Adjust if we're near the start
    if (currentPage <= halfVisible + 1) {
      endPage = Math.min(totalPages - 1, maxVisiblePages);
    }
    // Adjust if we're near the end
    if (currentPage >= totalPages - halfVisible) {
      startPage = Math.max(2, totalPages - maxVisiblePages + 1);
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(i);
            }}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(totalPages);
            }}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Search section */}
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          {/* Search form */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur">
            <CardContent className="p-4 md:p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search for movies, TV shows, actors..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-10 pr-10 h-12 text-base md:text-lg border-muted focus:border-accent cursor-text"
                    />
                    {query && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 cursor-pointer hover:bg-accent/10"
                        onClick={clearSearch}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="h-12 px-6 md:px-8 cursor-pointer bg-accent hover:bg-accent/90"
                    disabled={!query.trim()}
                  >
                    <SearchIcon className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>

                {/* Search type tabs */}
                <Tabs
                  value={type}
                  onValueChange={(value: any) => setType(value)}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                    <TabsTrigger value="all" className="cursor-pointer hover:bg-accent/10 text-sm md:text-base">
                      All Content
                    </TabsTrigger>
                    <TabsTrigger value="movie" className="cursor-pointer hover:bg-accent/10 text-sm md:text-base">
                      Movies
                    </TabsTrigger>
                    <TabsTrigger value="tv" className="cursor-pointer hover:bg-accent/10 text-sm md:text-base">
                      TV Shows
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </form>
            </CardContent>
          </Card>

          {/* Recent searches */}
          {user && searchHistory.length > 0 && (
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium text-sm md:text-base">Recent Searches</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs md:text-sm text-muted-foreground hover:text-destructive"
                    onClick={clearHistory}
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.slice(0, 8).map((item, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="group relative cursor-pointer hover:bg-accent/20 transition-colors text-xs md:text-sm pr-8"
                      onClick={() => setQuery(item)}
                    >
                      {item}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromHistory(item);
                        }}
                      >
                        <X className="h-3 w-3 text-destructive" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results section */}
        <div className="space-y-6">
          {renderResults()}

          {/* Pagination */}
          {!isLoading && data?.total_pages && data.total_pages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* First page */}
                <Button
                  variant={currentPage === 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  className="h-8 w-8 p-0 hidden sm:flex"
                >
                  1
                </Button>

                {/* Ellipsis if needed */}
                {currentPage > 3 && (
                  <span className="hidden sm:flex items-center justify-center h-8 w-8">
                    ...
                  </span>
                )}

                {/* Current page and neighbors */}
                {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                  .filter(page => {
                    // Filter out pages that are already shown (1 and last page)
                    if (page === 1 || page === data.total_pages) return false;
                    // Only show pages that exist
                    return page > 0 && page <= data.total_pages;
                  })
                  .map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="h-8 w-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}

                {/* Ellipsis if needed */}
                {currentPage < data.total_pages - 2 && (
                  <span className="hidden sm:flex items-center justify-center h-8 w-8">
                    ...
                  </span>
                )}

                {/* Last page */}
                {data.total_pages > 1 && (
                  <Button
                    variant={currentPage === data.total_pages ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(data.total_pages)}
                    className="h-8 w-8 p-0 hidden sm:flex"
                  >
                    {data.total_pages}
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === data.total_pages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}