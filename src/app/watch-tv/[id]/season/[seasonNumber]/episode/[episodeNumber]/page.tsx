"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchTVShowDetails, fetchSeasonDetails } from "@/services/tmdb";
import { TMDBTVDetails, TMDBSeasonDetails } from "@/types/tmdb";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { VideoPlayer } from "@/components/common/VideoPlayer";
import { EpisodesList } from "@/components/watch/EpisodesList";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Comments } from "@/components/watch/Comments";
import { WatchlistButton } from "@/components/common/WatchlistButton";

export default function WatchTVEpisode() {
  const { id, seasonNumber, episodeNumber } = useParams();
  const router = useRouter();
  const [show, setShow] = useState<TMDBTVDetails | null>(null);
  const [season, setSeason] = useState<TMDBSeasonDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [showData, seasonData] = await Promise.all([
          fetchTVShowDetails(Number(id)),
          fetchSeasonDetails(Number(id), Number(seasonNumber)),
        ]);
        setShow(showData);
        setSeason(seasonData);
      } catch (error) {
        console.error("Error loading TV show:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, seasonNumber]);

  if (loading) {
    return <WatchTVEpisodeSkeleton />;
  }

  if (!show || !season) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-red-500">
            Error loading TV show
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  const currentEpisode = season.episodes.find(
    (ep) => ep.episode_number === Number(episodeNumber)
  );

  if (!currentEpisode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-red-500">
            Episode not found
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            The episode you're looking for doesn't exist
          </p>
        </div>
      </div>
    );
  }

  const currentEpisodeIndex = season.episodes.findIndex(
    (ep) => ep.episode_number === Number(episodeNumber)
  );

  const nextEpisode = season.episodes[currentEpisodeIndex + 1];
  const prevEpisode = season.episodes[currentEpisodeIndex - 1];

  const handleSeasonChange = (newSeasonNumber: string) => {
    router.push(`/watch-tv/${id}/season/${newSeasonNumber}/episode/1`);
  };

  const handleEpisodeChange = (direction: "next" | "prev") => {
    if (direction === "next" && nextEpisode) {
      router.push(
        `/watch-tv/${id}/season/${seasonNumber}/episode/${nextEpisode.episode_number}`
      );
    } else if (direction === "prev" && prevEpisode) {
      router.push(
        `/watch-tv/${id}/season/${seasonNumber}/episode/${prevEpisode.episode_number}`
      );
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${show.name} - S${seasonNumber}E${episodeNumber}: ${currentEpisode.name}`,
        text: `Watch ${show.name} - S${seasonNumber}E${episodeNumber}: ${currentEpisode.name} on CineHub!`,
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-[#4fd1c5] hover:bg-white/10 cursor-pointer"
          onClick={() => router.push(`/tv/${id}`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 pb-16">
        <div className="max-w-[1600px] mx-auto space-y-6 sm:space-y-8">
          {/* Video Player */}
          <div className="w-full">
            <VideoPlayer
              videoUrl={`/api/stream/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}`}
              posterUrl={
                currentEpisode.still_path
                  ? `https://image.tmdb.org/t/p/original${currentEpisode.still_path}`
                  : undefined
              }
              title={`${show.name} - S${seasonNumber}E${episodeNumber}: ${currentEpisode.name}`}
              duration={currentEpisode.runtime}
            />
          </div>

          {/* Episode Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Title and Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  {currentEpisode.name}
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-slate-400">
                  Season {seasonNumber} • Episode {episodeNumber}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <Select
                  value={(seasonNumber as string).toString()}
                  onValueChange={handleSeasonChange}
                >
                  <SelectTrigger className="w-full sm:w-[120px] bg-slate-900 border-slate-800 cursor-pointer">
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800">
                    {show.seasons.map((s) => (
                      <SelectItem
                        key={s.season_number}
                        value={s.season_number.toString()}
                        className="text-white hover:bg-slate-800 cursor-pointer"
                      >
                        Season {s.season_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-[#4fd1c5] hover:bg-white/10 cursor-pointer"
                    onClick={() => handleEpisodeChange("prev")}
                    disabled={!prevEpisode}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-[#4fd1c5] hover:bg-white/10 cursor-pointer"
                    onClick={() => handleEpisodeChange("next")}
                    disabled={!nextEpisode}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Overview */}
            <div className="space-y-2">
              <h2 className="text-base sm:text-lg font-semibold text-white">Overview</h2>
              <p className="text-xs sm:text-sm lg:text-base text-slate-400">
                {currentEpisode.overview}
              </p>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {show.genres.map((genre) => (
                <Badge
                  key={genre.id}
                  variant="outline"
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium bg-[#1b263b] border-[#4fd1c5]/30 text-[#4fd1c5] hover:bg-[#4fd1c5]/10 cursor-pointer"
                >
                  {genre.name.toUpperCase()}
                </Badge>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Button
                variant="outline"
                size="default"
                className="border-[#2e3c51] text-[#e0e6ed] hover:bg-[#1b263b] hover:border-[#4fd1c5] hover:text-[#4fd1c5] px-3 sm:px-4 py-2 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 text-xs sm:text-sm lg:text-base"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Share
              </Button>
              <WatchlistButton
                id={show.id}
                mediaType="tv"
                title={show.name}
                posterPath={show.poster_path || ""}
              />
            </div>
          </div>

          {/* Episodes List */}
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white">Episodes</h2>
            <EpisodesList
              episodes={season.episodes}
              showId={Number(id)}
              seasonNumber={Number(seasonNumber)}
              currentEpisodeNumber={Number(episodeNumber)}
            />
          </div>

          {/* Comments */}
          <div className="space-y-4 sm:space-y-6">
            <Comments
              mediaId={currentEpisode.id}
              mediaType="tv"
              mediaTitle={`${show.name} - S${seasonNumber}E${episodeNumber}: ${currentEpisode.name}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function WatchTVEpisodeSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-4">
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-[1600px] mx-auto space-y-8">
          <Skeleton className="w-full aspect-video" />
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Skeleton className="h-10 w-[120px]" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-20" />
              ))}
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[100px] w-full" />
            ))}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
} 