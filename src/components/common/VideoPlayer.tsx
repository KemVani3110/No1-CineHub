"use client";

import { useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useVideoPlayerStore } from "@/store/videoPlayer";

interface VideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  title: string;
  duration?: number; // Duration in minutes from TMDB
}

export function VideoPlayer({ videoUrl, posterUrl, title, duration }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    isPlaying,
    isMuted,
    currentTime,
    videoDuration,
    volume,
    showControls,
    quality,
    setPlaying,
    setMuted,
    setCurrentTime,
    setVideoDuration,
    setVolume,
    setShowControls,
    setQuality,
    reset,
  } = useVideoPlayerStore();

  // Initialize video duration from TMDB
  useEffect(() => {
    if (duration) {
      setVideoDuration(duration * 60); // Convert minutes to seconds
    }
  }, [duration, setVideoDuration]);

  // Reset state when component unmounts
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (!duration) {
        setVideoDuration(video.duration);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [duration, setCurrentTime, setVideoDuration]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0];
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setMuted(newVolume === 0);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      const newTime = value[0];
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  return (
    <div
      className="relative w-full aspect-video bg-black group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        className="w-full h-full object-contain"
        onClick={togglePlay}
      />

      {/* Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300",
          showControls && "opacity-100"
        )}
      />

      {/* Controls */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 p-4 space-y-2 transition-transform duration-300",
          !showControls && "translate-y-full"
        )}
      >
        {/* Progress Bar */}
        <div className="relative">
          <Slider
            value={[currentTime]}
            max={videoDuration}
            step={1}
            onValueChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-white/80 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(videoDuration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-[#4fd1c5] hover:bg-white/10"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-[#4fd1c5] hover:bg-white/10"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <Slider
                value={[volume]}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
                className="w-24"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-[#4fd1c5] hover:bg-white/10"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-900 border-slate-800">
                <DropdownMenuItem
                  className={cn(
                    "text-white hover:bg-slate-800 cursor-pointer",
                    quality === "1080p" && "text-[#4fd1c5]"
                  )}
                  onClick={() => setQuality("1080p")}
                >
                  1080p
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={cn(
                    "text-white hover:bg-slate-800 cursor-pointer",
                    quality === "720p" && "text-[#4fd1c5]"
                  )}
                  onClick={() => setQuality("720p")}
                >
                  720p
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={cn(
                    "text-white hover:bg-slate-800 cursor-pointer",
                    quality === "480p" && "text-[#4fd1c5]"
                  )}
                  onClick={() => setQuality("480p")}
                >
                  480p
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-[#4fd1c5] hover:bg-white/10"
              onClick={toggleFullscreen}
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Title Overlay */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 p-4 transition-opacity duration-300",
          !showControls && "opacity-0"
        )}
      >
        <h1 className="text-xl font-semibold text-white">{title}</h1>
      </div>
    </div>
  );
} 