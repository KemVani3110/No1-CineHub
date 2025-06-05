"use client";

import { useEffect } from "react";
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
  History,
  ListVideo,
  ChevronLeft,
  Shield,
  Edit3,
  Camera,
  Save,
  X,
  Calendar,
  Mail,
  Film,
  Tv,
} from "lucide-react";
import Link from "next/link";
import { useProfileStore } from "@/store/profileStore";
import Loading from "@/components/common/Loading";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Settings } from "@/components/lazy";



export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user: authUser, loading: authLoading } = useAuth();
  const {
    user,
    isEditing,
    isAvatarDialogOpen,
    availableAvatars,
    activeTab,
    watchList,
    watchHistory,
    formData,
    loading: profileLoading,
    setActiveTab,
    setIsEditing,
    setIsAvatarDialogOpen,
    setFormData,
    updateProfile,
    changePassword,
    updateAvatar,
    fetchUserData,
    fetchAvatars,
    fetchWatchList,
    fetchWatchHistory,
  } = useProfileStore();

  useEffect(() => {
    if (authLoading) return; // Don't do anything while auth is loading

    if (!authUser) {
      router.push("/login");
      return;
    }

    fetchUserData();
    fetchAvatars();
    // Set Overview tab as default
    setActiveTab("overview");
  }, [authUser, authLoading, router, fetchUserData, fetchAvatars, setActiveTab]);

  useEffect(() => {
    if (activeTab === "watchlist") {
      fetchWatchList();
    } else if (activeTab === "history") {
      fetchWatchHistory();
    }
  }, [activeTab, fetchWatchList, fetchWatchHistory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile();
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = async () => {
    try {
      await changePassword();
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to change password",
        variant: "destructive",
      });
    }
  };

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
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-accent/10"
            asChild
          >
            <Link href="/home">
              <ChevronLeft size={24} />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold gradient-text">Profile</h1>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-primary/20">
                      <AvatarImage
                        src={user?.avatar}
                        alt={user?.name || "User"}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                        {getUserInitials(user?.name || "User")}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-accent/50"
                      onClick={() => setIsAvatarDialogOpen(true)}
                    >
                      <Camera size={16} />
                    </Button>
                  </div>

                  <div className="text-center">
                    <h2 className="text-xl font-semibold">{user?.name}</h2>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
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
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Member since</span>
                      <span className="font-medium">
                        {new Date(user?.created_at || "").toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last login</span>
                      <span className="font-medium">
                        {new Date(user?.last_login_at || "").toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-3 rounded-lg bg-accent/50">
                    <Film size={20} className="mb-1 text-primary" />
                    <span className="text-sm font-medium">Movies</span>
                    <span className="text-lg font-bold">{watchList.filter(item => item.media_type === 'movie').length}</span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-lg bg-accent/50">
                    <Tv size={20} className="mb-1 text-primary" />
                    <span className="text-sm font-medium">TV Shows</span>
                    <span className="text-lg font-bold">{watchList.filter(item => item.media_type === 'tv').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="w-full justify-start h-auto p-1 bg-accent/50">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-background data-[state=active]:text-foreground rounded-lg px-4 py-2"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="watchlist"
                  className="data-[state=active]:bg-background data-[state=active]:text-foreground rounded-lg px-4 py-2"
                >
                  Watchlist
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:bg-background data-[state=active]:text-foreground rounded-lg px-4 py-2"
                >
                  History
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-background data-[state=active]:text-foreground rounded-lg px-4 py-2"
                >
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {watchHistory.slice(0, 5).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4 p-3 rounded-lg bg-accent/50"
                        >
                          <div className="relative h-16 w-12 flex-shrink-0">
                            <Image
                              src={item.poster_path}
                              alt={item.title}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(item.watched_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {watchHistory.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          No recent activity
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle>Watchlist Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {watchList.slice(0, 5).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4 p-3 rounded-lg bg-accent/50"
                        >
                          <div className="relative h-16 w-12 flex-shrink-0">
                            <Image
                              src={item.poster_path}
                              alt={item.title}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Added {new Date(item.added_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {watchList.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          No items in watchlist
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Watchlist Tab */}
              <TabsContent value="watchlist" className="space-y-6">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle>Watchlist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {watchList.length > 0 ? (
                      <ScrollArea className="h-[600px] pr-4">
                        <div className="space-y-8">
                          {/* Movies Section */}
                          <div>
                            <h4 className="text-lg font-semibold text-[var(--text-main)] mb-4 flex items-center gap-2">
                              <Film className="h-5 w-5 text-[var(--cinehub-accent)]" />
                              Movies
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                              {watchList
                                .filter((item) => item.media_type === "movie")
                                .map((item) => (
                                  <div
                                    key={item.id}
                                    className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                  >
                                    <MovieCard movie={item} />
                                  </div>
                                ))}
                            </div>
                          </div>

                          {/* TV Shows Section */}
                          <div>
                            <h4 className="text-lg font-semibold text-[var(--text-main)] mb-4 flex items-center gap-2">
                              <Tv className="h-5 w-5 text-[var(--cinehub-accent)]" />
                              TV Shows
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                              {watchList
                                .filter((item) => item.media_type === "tv")
                                .map((item) => (
                                  <div
                                    key={item.id}
                                    className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                  >
                                    <TVShowCard show={item} />
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="text-center py-8 sm:py-12">
                        <div className="mx-auto w-16 h-16 bg-[var(--success)]/10 rounded-full flex items-center justify-center mb-4">
                          <ListVideo className="h-8 w-8 text-[var(--success)]" />
                        </div>
                        <h3 className="text-lg font-medium mb-2 text-[var(--text-main)]">
                          No items in your watchlist
                        </h3>
                        <p className="text-[var(--text-sub)] mb-4">
                          Start adding movies and shows you want to watch
                        </p>
                        <Button
                          asChild
                          className="bg-[var(--success)] hover:bg-[var(--success)]/80 text-white cursor-pointer transition-colors"
                        >
                          <Link href="/home">Browse Movies</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="space-y-6">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle>Watch History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {watchHistory.length > 0 ? (
                      <ScrollArea className="h-[600px] pr-4">
                        <div className="space-y-8">
                          {/* Movies Section */}
                          <div>
                            <h4 className="text-lg font-semibold text-[var(--text-main)] mb-4 flex items-center gap-2">
                              <Film className="h-5 w-5 text-[var(--cinehub-accent)]" />
                              Movies
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                              {watchHistory
                                .filter((item) => item.media_type === "movie")
                                .map((item) => (
                                  <div
                                    key={item.id}
                                    className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                  >
                                    <MovieCard movie={item} />
                                  </div>
                                ))}
                            </div>
                          </div>

                          {/* TV Shows Section */}
                          <div>
                            <h4 className="text-lg font-semibold text-[var(--text-main)] mb-4 flex items-center gap-2">
                              <Tv className="h-5 w-5 text-[var(--cinehub-accent)]" />
                              TV Shows
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                              {watchHistory
                                .filter((item) => item.media_type === "tv")
                                .map((item) => (
                                  <div
                                    key={item.id}
                                    className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                  >
                                    <TVShowCard show={item} />
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="text-center py-8 sm:py-12">
                        <div className="mx-auto w-16 h-16 bg-[var(--danger)]/10 rounded-full flex items-center justify-center mb-4">
                          <History className="h-8 w-8 text-[var(--danger)]" />
                        </div>
                        <h3 className="text-lg font-medium mb-2 text-[var(--text-main)]">
                          No watch history yet
                        </h3>
                        <p className="text-[var(--text-sub)] mb-4">
                          Start watching movies and shows to build your history
                        </p>
                        <Button
                          asChild
                          className="bg-[var(--danger)] hover:bg-[var(--danger)]/80 text-white cursor-pointer transition-colors"
                        >
                          <Link href="/home">Browse Movies</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Settings />
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
          <div className="grid grid-cols-4 gap-4 py-4">
            {availableAvatars.length === 0 ? (
              <div className="col-span-full text-center py-8 text-[var(--text-sub)]">
                No avatars available
              </div>
            ) : (
              availableAvatars.map((avatar) => (
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
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
