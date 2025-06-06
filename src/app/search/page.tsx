'use client';

import { useEffect, useState } from 'react';
import { useSearchStore } from '@/store/searchStore';
import { useSearch } from '@/hooks/useSearch';
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { MovieCard } from '@/components/common/MovieCard';
import { TVShowCard } from '@/components/common/TVShowCard';
import { 
  Search as SearchIcon, 
  Filter,
  Clock,
  TrendingUp,
  X,
  Grid3X3,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { TMDBMovie, TMDBTV, TMDBSearchResult } from '@/types/tmdb';
import Header from '@/components/common/Header';
import Loading from '@/components/common/Loading';
import CompilingOverlay from '@/components/common/CompilingOverlay';

export default function SearchPage() {
  const { query, type, setQuery, setType, searchHistory, addToHistory, clearHistory } = useSearchStore();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError } = useSearch(currentPage);
  const { user } = useAuth();

  // View and sort state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'date' | 'title'>('popularity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (query && user) {
      addToHistory(query);
    }
    // Reset page when search changes
    setCurrentPage(1);
  }, [query, user, addToHistory, type]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query && user) {
      addToHistory(query);
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
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loading message="Searching for amazing content..." showBackdrop={false} />
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

    if (!sortedResults.length && query) {
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
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
            : "space-y-4"
        }>
          {sortedResults.map((item: TMDBSearchResult) => {
            // Handle movie results
            if (type === 'movie' || (item.media_type === 'movie' && type === 'all')) {
              const movie = item as TMDBMovie;
              return <MovieCard key={movie.id} movie={movie} />;
            }
            
            // Handle TV show results
            if (type === 'tv' || (item.media_type === 'tv' && type === 'all')) {
              // Convert TMDBSearchResult to TMDBTV
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
                origin_country: [] // Default empty array since it's not in TMDBSearchResult
              };
              return <TVShowCard key={tvShow.id} show={tvShow} />;
            }
            
            return null;
          })}
        </div>

        {/* Pagination */}
        {data?.total_pages && data.total_pages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    className={`cursor-pointer ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-accent/10'}`}
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  />
                </PaginationItem>
                
                {generatePaginationItems(data.total_pages, currentPage).map((item, index) => (
                  <PaginationItem key={index}>
                    {item === '...' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        className={`cursor-pointer hover:bg-accent/10 ${
                          currentPage === item ? 'bg-accent text-accent-foreground' : ''
                        }`}
                        onClick={() => setCurrentPage(item as number)}
                      >
                        {item}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    className={`cursor-pointer ${currentPage === data.total_pages ? 'pointer-events-none opacity-50' : 'hover:bg-accent/10'}`}
                    onClick={() => currentPage < data.total_pages && setCurrentPage(currentPage + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    );
  };

  const generatePaginationItems = (totalPages: number, currentPage: number) => {
    const items = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      if (currentPage <= 3) {
        items.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        items.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        items.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
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
        {renderResults()}
      </main>
      
      {isLoading && <CompilingOverlay />}
    </div>
  );
}