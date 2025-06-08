"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MovieCard, TVShowCard } from "@/components/lazy";
import {
  Image as ImageIcon,
  ListVideo,
  ChevronLeft,
  Shield,
  Camera,
  Film,
  Tv,
} from "lucide-react";
import Link from "next/link";
import { useProfileStore } from "@/store/profileStore";
import Loading from "@/components/common/Loading";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Settings from "@/components/profile/Settings";
import { fetchMovieDetails, fetchTVShowDetails } from "@/services/tmdb";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user: authUser, loading: authLoading } = useAuth();
  const {
    user,
    isAvatarDialogOpen,
    availableAvatars,
    activeTab,
    watchList,
    formData,
    loading: profileLoading,
    setActiveTab,
    setIsAvatarDialogOpen,
    setFormData,
    updateProfile,
    changePassword,
    updateAvatar,
    fetchUserData,
    fetchAvatars,
    fetchWatchList,
  } = useProfileStore();

  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      return; // Don't do anything while auth is loading
    }

    if (!authUser) {
      router.push("/login");
      return;
    }

    const initializeProfile = async () => {
      try {
        await fetchUserData();
        await fetchAvatars();
        setActiveTab("overview");
      } catch (error) {
        console.error('Error initializing profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        });
      }
    };

    initializeProfile();
  }, [authUser, authLoading, router, fetchUserData, fetchAvatars, setActiveTab, toast]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        if (activeTab === "watchlist") {
          await fetchWatchList();
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
        toast({
          title: "Error",
          description: `Failed to load ${activeTab}. Please try again.`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, router, activeTab, fetchWatchList, toast]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchRatings = async () => {
      const newRatings: Record<string, number> = {};
      
      for (const item of watchList) {
        const key = `${item.mediaType}-${item.id}`;
        try {
          if (item.mediaType === 'movie') {
            const details = await fetchMovieDetails(item.id);
            newRatings[key] = details.vote_average;
          } else {
            const details = await fetchTVShowDetails(item.id);
            newRatings[key] = details.vote_average;
          }
        } catch (error) {
          console.error(`Error fetching rating for ${key}:`, error);
          newRatings[key] = 0;
        }
      }
      
      setRatings(newRatings);
    };

    if (watchList.length > 0) {
      fetchRatings();
    }
  }, [watchList, user, router]);

  const handleAvatarSelect = async (avatarPath: string) => {
    try {
      await updateAvatar(avatarPath);
      setIsAvatarDialogOpen(false);
      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update avatar",
        variant: "destructive",
      });
    }
  };

  const getUserInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  if (authLoading || profileLoading) {
    return <Loading message="Loading profile..." />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      {/* Header */}
      <div className="container mx-auto px-4 lg:px-6 py-4 lg:py-8">
        <div className="flex items-center space-x-4 mb-4 lg:mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:h-10 lg:w-10 rounded-full hover:bg-accent/10"
            asChild
          >
            <Link href="/home">
              <ChevronLeft size={20} className="lg:w-6 lg:h-6" />
            </Link>
          </Button>
          <h1 className="text-xl lg:text-2xl font-bold gradient-text">Profile</h1>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-4 lg:space-y-6">
            {/* Profile Card */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col items-center space-y-3 lg:space-y-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20 lg:h-24 lg:w-24 border-4 border-primary/20">
                      <AvatarImage
                        src={user?.avatar}
                        alt={user?.name || "User"}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl lg:text-2xl">
                        {getUserInitials(user?.name || "User")}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-0 right-0 h-6 w-6 lg:h-8 lg:w-8 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-accent/50"
                      onClick={() => setIsAvatarDialogOpen(true)}
                    >
                      <Camera size={14} className="lg:w-4 lg:h-4" />
                    </Button>
                  </div>

                  <div className="text-center">
                    <h2 className="text-lg lg:text-xl font-semibold">{user?.name}</h2>
                    <p className="text-xs lg:text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                    <Badge
                      variant="secondary"
                      className="mt-2 text-xs px-2 py-0.5 h-5"
                    >
                      <Shield size={8} className="mr-1" />
                      {user?.role}
                    </Badge>
                  </div>

                  <Separator className="my-2" />

                  <div className="w-full space-y-2">
                    <div className="flex items-center justify-between text-xs lg:text-sm">
                      <span className="text-muted-foreground">
                        Member since
                      </span>
                      <span className="font-medium">
                        {new Date(user?.created_at || "").toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs lg:text-sm">
                      <span className="text-muted-foreground">Last login</span>
                      <span className="font-medium">
                        {new Date(
                          user?.last_login_at || ""
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base lg:text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {isLoading ? (
                    <>
                      {[...Array(2)].map((_, index) => (
                        <div key={index} className="flex flex-col items-center p-3 rounded-lg bg-[#1B263B] border border-[#2e3c51] animate-pulse">
                          <div className="w-5 h-5 bg-[#2e3c51] rounded-full mb-2" />
                          <div className="w-24 h-4 bg-[#2e3c51] rounded mb-1" />
                          <div className="w-8 h-6 bg-[#2e3c51] rounded" />
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col items-center p-3 rounded-lg bg-[#1B263B] border border-[#2e3c51] hover:border-[#4fd1c5] transition-colors duration-300 cursor-pointer">
                        <Film size={20} className="mb-2 text-[#4fd1c5]" />
                        <span className="text-[13px] font-medium text-[#e0e6ed]">Movies in Watchlist</span>
                        <span className="text-[15px] font-bold text-[#4fd1c5]">
                          {watchList.filter((item) => item.mediaType === "movie").length}
                        </span>
                      </div>
                      <div className="flex flex-col items-center p-3 rounded-lg bg-[#1B263B] border border-[#2e3c51] hover:border-[#4fd1c5] transition-colors duration-300 cursor-pointer">
                        <Tv size={20} className="mb-2 text-[#4fd1c5]" />
                        <span className="text-[13px] font-medium text-[#e0e6ed]">TV Shows in Watchlist</span>
                        <span className="text-[15px] font-bold text-[#4fd1c5]">
                          {watchList.filter((item) => item.mediaType === "tv").length}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4 lg:space-y-6"
            >
              <TabsList className="w-full justify-center h-auto p-1 bg-accent/50">
                <TabsTrigger
                  value="overview"
                  className="flex items-center space-x-2 px-6"
                >
                  <ImageIcon size={16} className="lg:w-5 lg:h-5" />
                  <span className="text-xs lg:text-sm">Overview</span>
                </TabsTrigger>
                <TabsTrigger
                  value="watchlist"
                  className="flex items-center space-x-2 px-6"
                >
                  <ListVideo size={16} className="lg:w-5 lg:h-5" />
                  <span className="text-xs lg:text-sm">Watchlist</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <Settings />
              </TabsContent>

              <TabsContent value="watchlist" className="mt-4">
                <div className="space-y-8">
                  {/* Movies Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-[var(--text-main)] mb-4 flex items-center gap-2">
                      <Film className="h-5 w-5 text-[var(--cinehub-accent)]" />
                      Movies ({watchList.filter(item => item.mediaType === 'movie').length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                      {watchList
                        .filter((item) => item.mediaType === 'movie')
                        .map((item) => (
                          <div key={`${item.mediaType}-${item.id}-${item.addedAt}`} className="transform scale-90 hover:scale-95 transition-transform duration-200">
                            <MovieCard
                              movie={{
                                id: item.id,
                                title: item.title,
                                poster_path: item.posterPath,
                                vote_average: ratings[`movie-${item.id}`] || 0,
                                release_date: new Date(item.addedAt).toISOString().split('T')[0]
                              }}
                            />
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* TV Shows Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-[var(--text-main)] mb-4 flex items-center gap-2">
                      <Tv className="h-5 w-5 text-[var(--cinehub-accent)]" />
                      TV Shows ({watchList.filter(item => item.mediaType === 'tv').length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                      {watchList
                        .filter((item) => item.mediaType === 'tv')
                        .map((item) => (
                          <div key={`${item.mediaType}-${item.id}-${item.addedAt}`} className="transform scale-90 hover:scale-95 transition-transform duration-200">
                            <TVShowCard
                              show={{
                                id: item.id,
                                name: item.title,
                                original_name: item.title,
                                overview: "",
                                first_air_date: new Date(item.addedAt).toISOString().split('T')[0],
                                poster_path: item.posterPath,
                                backdrop_path: undefined,
                                genre_ids: [],
                                original_language: "en",
                                popularity: 0,
                                vote_count: 0,
                                vote_average: ratings[`tv-${item.id}`] || 0,
                                origin_country: []
                              }}
                            />
                          </div>
                        ))}
                    </div>
                  </div>

                  {watchList.length === 0 && (
                    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
                      <div className="w-16 h-16 bg-[var(--success)]/10 rounded-full flex items-center justify-center">
                        <ListVideo className="h-8 w-8 text-[var(--success)]" />
                      </div>
                      <h3 className="text-lg font-medium text-[var(--text-main)]">
                        No items in your watchlist
                      </h3>
                      <p className="text-[var(--text-sub)] text-center">
                        Start adding movies and shows you want to watch
                      </p>
                      <Button
                        asChild
                        className="bg-[var(--success)] hover:bg-[var(--success)]/80 text-white"
                      >
                        <Link href="/home">Browse Movies</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Avatar Selection Dialog */}
      <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose Avatar</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-3 gap-4">
              {availableAvatars.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => handleAvatarSelect(avatar)}
                  className="relative aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                >
                  <Image
                    src={avatar}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}