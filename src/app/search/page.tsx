"use client";

import { useEffect, useState } from "react";
import { useSearchStore, SearchType } from "@/store/searchStore";
import { useSearch } from "@/hooks/useSearch";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MovieCard } from "@/components/common/MovieCard";
import { TVShowCard } from "@/components/common/TVShowCard";
import {
  Search as SearchIcon,
  Clock,
  X,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Film,
  Tv,
  Filter,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { TMDBMovie, TMDBTV, TMDBSearchResult } from "@/types/tmdb";
import Header from "@/components/common/Header";
import Image from "next/image";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    query,
    type,
    setQuery,
    setType,
    searchHistory,
    addToHistory,
    clearHistory,
  } = useSearchStore();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError } = useSearch(currentPage);
  const { user } = useAuth();

  // View and sort state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<
    "popularity" | "rating" | "date" | "title"
  >("popularity");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Initialize from URL params
  useEffect(() => {
    const urlQuery = searchParams.get("query");
    const urlType = searchParams.get("type") as SearchType;
    const urlPage = searchParams.get("page");

    if (urlQuery) setQuery(urlQuery);
    if (urlType && ["all", "movie", "tv"].includes(urlType)) setType(urlType);
    if (urlPage) setCurrentPage(parseInt(urlPage));
  }, [searchParams, setQuery, setType]);

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (type !== "all") params.set("type", type);
    if (currentPage > 1) params.set("page", currentPage.toString());

    const newUrl = params.toString() ? `?${params.toString()}` : "";
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
    setQuery("");
    setCurrentPage(1);
  };

  const removeFromHistory = (itemToRemove: string) => {
    const newHistory = searchHistory.filter((item) => item !== itemToRemove);
    clearHistory();
    newHistory.forEach((item) => addToHistory(item));
  };

  // Sort and filter results
  const sortedResults =
    data?.results?.slice().sort((a: TMDBSearchResult, b: TMDBSearchResult) => {
      const aValue = getSortValue(a, sortBy);
      const bValue = getSortValue(b, sortBy);

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    }) || [];

  function getSortValue(item: TMDBSearchResult, sortBy: string) {
    switch (sortBy) {
      case "popularity":
        return item.popularity;
      case "rating":
        return item.vote_average || 0;
      case "date":
        return item.release_date || item.first_air_date || "";
      case "title":
        return item.title || item.name || "";
      default:
        return 0;
    }
  }

  const renderResults = () => {
    if (!query) {
      return (
        <Card className="border-2 border-accent/20 bg-gradient-to-br from-bg-card via-bg-card to-accent/5 backdrop-blur-sm shadow-xl">
          <CardContent className="flex items-center justify-center py-16 px-8">
            <div className="text-center max-w-md mx-auto">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-accent/20 to-accent/10 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                  <Sparkles className="h-12 w-12 text-accent animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 gradient-text">
                Discover Amazing Content
              </h2>
              <p className="text-text-sub text-lg leading-relaxed mb-6">
                Search through thousands of movies and TV shows to find your
                next favorite entertainment
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-text-sub">
                <div className="flex items-center gap-2">
                  <Film className="h-4 w-4 text-accent" />
                  <span>Movies</span>
                </div>
                <div className="w-1 h-1 bg-accent/50 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Tv className="h-4 w-4 text-accent" />
                  <span>TV Shows</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (isLoading) {
      return (
        <div className="min-h-[500px] flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-8">
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 w-20 h-20 rounded-full bg-accent/20 blur-md animate-ping"></div>

              {/* Spinner ring */}
              <div className="relative w-20 h-20 rounded-full border-4 border-accent/30 border-t-accent animate-spin shadow-lg"></div>

              {/* Logo in center */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Image
                    src="/logo.png"
                    alt="CineHub Logo"
                    width={32}
                    height={32}
                    className="animate-pulse rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">
                Searching the cinema universe...
              </h3>
              <p className="text-text-sub text-base animate-pulse">
                Finding the best content for you
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <Card className="border-2 border-danger/30 bg-gradient-to-br from-bg-card to-danger/5">
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-danger/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <X className="h-8 w-8 text-danger" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Oops! Something went wrong
              </h3>
              <p className="text-text-sub mb-6">
                We couldn't complete your search. Please check your connection
                and try again.
              </p>
              <Button
                variant="outline"
                className="cursor-pointer hover:bg-accent/10 hover:border-accent transition-all duration-300"
                onClick={() => window.location.reload()}
              >
                <SearchIcon className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!data?.results?.length) {
      return (
        <Card className="border-2 border-muted/30 bg-gradient-to-br from-bg-card to-muted/5">
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                No Results Found
              </h3>
              <p className="text-text-sub mb-6">
                We couldn't find any{" "}
                {type === "all"
                  ? "content"
                  : type === "movie"
                  ? "movies"
                  : "TV shows"}{" "}
                matching{" "}
                <span className="text-accent font-medium">"{query}"</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  className="cursor-pointer hover:bg-accent/10 hover:border-accent transition-all duration-300"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Search
                </Button>
                <Button
                  variant="ghost"
                  className="cursor-pointer hover:bg-accent/10 text-accent"
                  onClick={() => setType("all")}
                >
                  Search All Content
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-8">
        {/* Enhanced Results Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-accent/10">
          {/* Results Info */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="secondary"
              className="text-sm bg-accent/10 text-accent border-accent/20 px-3 py-1"
            >
              <SearchIcon className="h-3 w-3 mr-1" />
              {data?.total_results?.toLocaleString() || 0} results
            </Badge>
            <Badge
              variant="outline"
              className="text-sm border-muted/30 px-3 py-1"
            >
              Page {currentPage} of {data?.total_pages || 1}
            </Badge>
            <Badge
              variant="outline"
              className="text-sm border-accent/20 text-accent px-3 py-1"
            >
              {type === "all"
                ? "All Content"
                : type === "movie"
                ? "Movies"
                : "TV Shows"}
            </Badge>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Sort & Filter */}
            <div className="flex items-center gap-2 bg-bg-main/50 rounded-lg p-1 border border-muted/20">
              <Filter className="h-4 w-4 text-muted-foreground ml-2" />
              <Select
                value={sortBy}
                onValueChange={(value: any) => setSortBy(value)}
              >
                <SelectTrigger className="w-[140px] cursor-pointer border-none bg-transparent hover:bg-accent/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-accent/20">
                  <SelectItem
                    value="popularity"
                    className="cursor-pointer hover:bg-accent/10"
                  >
                    Popularity
                  </SelectItem>
                  <SelectItem
                    value="rating"
                    className="cursor-pointer hover:bg-accent/10"
                  >
                    Rating
                  </SelectItem>
                  <SelectItem
                    value="date"
                    className="cursor-pointer hover:bg-accent/10"
                  >
                    Release Date
                  </SelectItem>
                  <SelectItem
                    value="title"
                    className="cursor-pointer hover:bg-accent/10"
                  >
                    Title
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer hover:bg-accent/10 transition-all duration-200"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                {sortOrder === "asc" ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-accent/20 rounded-lg overflow-hidden bg-bg-main/30">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className={`cursor-pointer transition-all duration-200 rounded-none ${
                  viewMode === "grid"
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "hover:bg-accent/10 text-muted-foreground"
                }`}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className={`cursor-pointer transition-all duration-200 rounded-none ${
                  viewMode === "list"
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "hover:bg-accent/10 text-muted-foreground"
                }`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Results Grid */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
              : "space-y-4"
          }
        >
          {sortedResults.map((item: TMDBSearchResult, index) => {
            // Handle movie results
            if (
              type === "movie" ||
              (item.media_type === "movie" && type === "all")
            ) {
              const movie = item as TMDBMovie;
              return (
                <div
                  key={movie.id}
                  className="group transform transition-all duration-300 hover:scale-105 hover:z-10 relative"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="absolute inset-0 bg-accent/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  <MovieCard movie={movie} />
                </div>
              );
            }

            // Handle TV show results
            if (type === "tv" || (item.media_type === "tv" && type === "all")) {
              const tvShow: TMDBTV = {
                id: item.id,
                name: item.name || "",
                original_name: item.original_name || "",
                overview: item.overview || "",
                first_air_date: item.first_air_date || "",
                poster_path: item.poster_path,
                backdrop_path: item.backdrop_path,
                genre_ids: item.genre_ids || [],
                original_language: item.original_language || "",
                popularity: item.popularity,
                vote_count: item.vote_count || 0,
                vote_average: item.vote_average || 0,
                origin_country: [],
              };
              return (
                <div
                  key={tvShow.id}
                  className="group transform transition-all duration-300 hover:scale-105 hover:z-10 relative"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="absolute inset-0 bg-accent/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-main via-bg-main to-bg-card/20">
      <Header />

      <main className="container mx-auto px-4 py-8 md:py-12 space-y-8 md:space-y-12">
        {/* Enhanced Search Section */}
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          {/* Main Search Card */}
          <Card className="border-2 border-accent/20 bg-gradient-to-br from-bg-card/80 via-bg-card to-accent/5 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSearch} className="space-y-6">
                {/* Search Input */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent/10 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-accent z-10" />
                      <Input
                        type="text"
                        placeholder="Search for movies, TV shows, actors..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-12 pr-12 h-14 text-base md:text-lg border-2 border-accent/20 bg-bg-main/50 backdrop-blur-sm focus:border-accent focus:bg-bg-main/70 cursor-text transition-all duration-300 rounded-xl shadow-inner"
                      />
                      {query && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 cursor-pointer hover:bg-accent/10 transition-all duration-200 z-10"
                          onClick={clearSearch}
                        >
                          <X className="h-4 w-4 text-muted-foreground hover:text-accent transition-colors" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="h-14 px-8 md:px-10 cursor-pointer bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-semibold transition-all duration-300 rounded-xl shadow-lg hover:shadow-accent/25"
                    disabled={!query.trim()}
                  >
                    <SearchIcon className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Search</span>
                    <span className="sm:hidden">Go</span>
                  </Button>
                </div>

                {/* Enhanced Search Type Tabs - Mobile Responsive */}
                <Tabs
                  value={type}
                  onValueChange={(value: any) => setType(value)}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3 bg-bg-main/50 backdrop-blur-sm border border-accent/10 h-11 sm:h-12 rounded-xl p-1">
                    <TabsTrigger
                      value="all"
                      className="cursor-pointer hover:bg-accent/10 text-xs sm:text-sm md:text-base font-medium data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all duration-200 rounded-lg px-2 py-2 flex items-center justify-center gap-1 sm:gap-2"
                    >
                      <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">All</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="movie"
                      className="cursor-pointer hover:bg-accent/10 text-xs sm:text-sm md:text-base font-medium data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all duration-200 rounded-lg px-2 py-2 flex items-center justify-center gap-1 sm:gap-2"
                    >
                      <Film className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">Movies</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="tv"
                      className="cursor-pointer hover:bg-accent/10 text-xs sm:text-sm md:text-base font-medium data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all duration-200 rounded-lg px-2 py-2 flex items-center justify-center gap-1 sm:gap-2"
                    >
                      <Tv className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">TV</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </form>
            </CardContent>
          </Card>

          {/* Enhanced Recent Searches */}
          {user && searchHistory.length > 0 && (
            <Card className="border border-accent/10 bg-bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Clock className="h-4 w-4 text-accent" />
                    </div>
                    <h3 className="font-semibold text-white text-lg">
                      Recent Searches
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer text-text-sub hover:text-danger hover:bg-danger/10 transition-all duration-200"
                    onClick={clearHistory}
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {searchHistory.slice(0, 8).map((item, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="group relative cursor-pointer bg-bg-main/50 hover:bg-accent/10 border border-accent/20 hover:border-accent/40 transition-all duration-200 text-sm py-2 px-4 pr-8"
                      onClick={() => setQuery(item)}
                    >
                      <SearchIcon className="h-3 w-3 mr-2 text-accent" />
                      {item}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-danger/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromHistory(item);
                        }}
                      >
                        <X className="h-3 w-3 text-danger" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-8">
          {renderResults()}

          {/* Enhanced Pagination */}
          {!isLoading && data?.total_pages && data.total_pages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2 bg-bg-card/50 backdrop-blur-sm rounded-xl p-3 border border-accent/10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-10 w-10 p-0 cursor-pointer hover:bg-accent/10 hover:border-accent/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Enhanced pagination logic */}
                {Array.from(
                  { length: Math.min(5, data.total_pages) },
                  (_, i) => {
                    let pageNum;
                    if (data.total_pages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= data.total_pages - 2) {
                      pageNum = data.total_pages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-10 w-10 p-0 cursor-pointer transition-all duration-200 ${
                          currentPage === pageNum
                            ? "bg-accent text-accent-foreground shadow-lg"
                            : "hover:bg-accent/10 hover:border-accent/40"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === data.total_pages}
                  className="h-10 w-10 p-0 cursor-pointer hover:bg-accent/10 hover:border-accent/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
