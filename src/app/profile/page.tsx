"use client";

import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { MovieCard } from "@/components/common/MovieCard";
import { TVShowCard } from "@/components/common/TVShowCard";
import {
  User as UserIcon,
  Lock,
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

export default function ProfilePage() {
  const { toast } = useToast();
  const {
    user,
    isEditing,
    isAvatarDialogOpen,
    availableAvatars,
    activeTab,
    watchList,
    watchHistory,
    formData,
    loading,
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
    fetchUserData();
    fetchAvatars();
  }, [fetchUserData, fetchAvatars]);

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

  if (loading) {
    return <Loading message="Loading profile..." />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-card)]/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hover:bg-[var(--bg-card)]/80 text-[var(--text-main)] hover:text-[var(--cinehub-accent)] cursor-pointer transition-all duration-200"
              >
                <Link href="/home">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <Separator
                orientation="vertical"
                className="h-6 border-[var(--border)]"
              />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[var(--cinehub-accent)] to-[var(--cinehub-accent)]/70 bg-clip-text text-transparent">
                Profile Settings
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {/* Profile Overview Card */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="sticky top-24 border-[var(--border)] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-card)]/50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group">
                    <Avatar className="h-20 sm:h-24 w-20 sm:w-24 border-4 border-[var(--cinehub-accent)]/20 ring-2 ring-[var(--bg-main)] shadow-lg cursor-pointer transition-transform hover:scale-105">
                      <AvatarImage
                        src={formData.avatar || user?.avatar}
                        alt={user?.name || "User"}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-[var(--cinehub-accent)]/10 text-[var(--cinehub-accent)] font-semibold text-xl sm:text-2xl">
                        {getUserInitials(user?.name || "User")}
                      </AvatarFallback>
                    </Avatar>
                    <Dialog
                      open={isAvatarDialogOpen}
                      onOpenChange={setIsAvatarDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 shadow-lg bg-[var(--cinehub-accent)] hover:bg-[var(--cinehub-accent-hover)] text-[var(--bg-main)] cursor-pointer transition-all hover:scale-110"
                        >
                          <Camera className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl bg-[var(--bg-card)] border-[var(--border)]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 text-[var(--text-main)]">
                            <ImageIcon className="h-5 w-5 text-[var(--cinehub-accent)]" />
                            Choose Your Avatar
                          </DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-4">
                          {availableAvatars.map((avatar, index) => (
                            <div
                              key={index}
                              className="cursor-pointer group relative transition-all hover:scale-105"
                              onClick={() => handleAvatarSelect(avatar)}
                            >
                              <Avatar className="h-16 sm:h-20 w-16 sm:w-20 border-2 border-transparent group-hover:border-[var(--cinehub-accent)] transition-all">
                                <AvatarImage
                                  src={avatar}
                                  alt={`Avatar option ${index + 1}`}
                                />
                              </Avatar>
                              <div className="absolute inset-0 bg-[var(--cinehub-accent)]/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                                <div className="bg-[var(--cinehub-accent)] text-[var(--bg-main)] rounded-full p-1">
                                  <UserIcon className="h-3 w-3" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="text-center space-y-2">
                    <h2 className="text-lg sm:text-xl font-semibold text-[var(--text-main)]">
                      {user?.name || "User"}
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-sub)]">
                      {user?.email}
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-[var(--cinehub-accent)]/10 text-[var(--cinehub-accent)] border-[var(--cinehub-accent)]/20"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      {user?.role || "User"}
                    </Badge>
                  </div>

                  <Separator className="w-full border-[var(--border)]" />

                  {/* Quick Stats */}
                  <div className="w-full space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-[var(--text-sub)]">
                        <ListVideo className="h-4 w-4" />
                        Watchlist
                      </div>
                      <span className="font-medium text-[var(--text-main)]">
                        {watchList.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-[var(--text-sub)]">
                        <History className="h-4 w-4" />
                        Watch History
                      </div>
                      <span className="font-medium text-[var(--text-main)]">
                        {watchHistory.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-[var(--text-sub)]">
                        <Calendar className="h-4 w-4" />
                        Member Since
                      </div>
                      <span className="font-medium text-[var(--text-main)]">
                        2024
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-8"
            >
              <TabsList className="grid w-full grid-cols-4 bg-[var(--bg-card)]/50 backdrop-blur-sm p-2 h-auto rounded-lg gap-2 border border-[var(--border)]/30">
                <TabsTrigger
                  value="overview"
                  className="flex flex-col items-center gap-2 py-3 px-4 text-xs sm:text-sm cursor-pointer transition-all duration-200 rounded-md
                    data-[state=active]:bg-[var(--cinehub-accent)]/15 data-[state=active]:text-[var(--cinehub-accent)] data-[state=active]:border data-[state=active]:border-[var(--cinehub-accent)]/30
                    hover:bg-[var(--bg-main)]/80 hover:text-[var(--text-main)] text-[var(--text-sub)]"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="flex flex-col items-center gap-2 py-3 px-4 text-xs sm:text-sm cursor-pointer transition-all duration-200 rounded-md
                    data-[state=active]:bg-[var(--warning)]/15 data-[state=active]:text-[var(--warning)] data-[state=active]:border data-[state=active]:border-[var(--warning)]/30
                    hover:bg-[var(--bg-main)]/80 hover:text-[var(--text-main)] text-[var(--text-sub)]"
                >
                  <Lock className="h-4 w-4" />
                  <span>Security</span>
                </TabsTrigger>
                <TabsTrigger
                  value="watchlist"
                  className="flex flex-col items-center gap-2 py-3 px-4 text-xs sm:text-sm cursor-pointer transition-all duration-200 rounded-md
                    data-[state=active]:bg-[var(--success)]/15 data-[state=active]:text-[var(--success)] data-[state=active]:border data-[state=active]:border-[var(--success)]/30
                    hover:bg-[var(--bg-main)]/80 hover:text-[var(--text-main)] text-[var(--text-sub)]"
                >
                  <ListVideo className="h-4 w-4" />
                  <span>Watchlist</span>
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="flex flex-col items-center gap-2 py-3 px-4 text-xs sm:text-sm cursor-pointer transition-all duration-200 rounded-md
                    data-[state=active]:bg-[var(--danger)]/15 data-[state=active]:text-[var(--danger)] data-[state=active]:border data-[state=active]:border-[var(--danger)]/30
                    hover:bg-[var(--bg-main)]/80 hover:text-[var(--text-main)] text-[var(--text-sub)]"
                >
                  <History className="h-4 w-4" />
                  <span>History</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-8">
                <div className="bg-gradient-to-br from-[var(--bg-card)]/80 to-[var(--bg-card)]/30 backdrop-blur-sm border border-[var(--border)] rounded-lg">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-[var(--border)]/30">
                    <div className="mb-4 sm:mb-0">
                      <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-3 text-[var(--text-main)]">
                        <div className="p-2 bg-[var(--cinehub-accent)]/10 rounded-lg">
                          <UserIcon className="h-5 w-5 text-[var(--cinehub-accent)]" />
                        </div>
                        Personal Information
                      </h3>
                      <p className="text-sm text-[var(--text-sub)] mt-2">
                        Manage your personal details and preferences
                      </p>
                    </div>
                    <Button
                      variant={isEditing ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className={`shrink-0 cursor-pointer transition-all duration-200 ${
                        isEditing
                          ? "bg-[var(--danger)] hover:bg-[var(--danger)]/80 text-white border-[var(--danger)]"
                          : "border-[var(--border)] text-[var(--text-main)] hover:bg-[var(--bg-main)]/80 hover:border-[var(--cinehub-accent)]/50"
                      }`}
                    >
                      {isEditing ? (
                        <>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="p-4 sm:p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-medium text-[var(--text-main)]"
                        >
                          Display Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="bg-[var(--bg-main)]/50 border-[var(--border)] focus:border-[var(--cinehub-accent)] text-[var(--text-main)] placeholder:text-[var(--text-sub)] transition-colors cursor-text"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium text-[var(--text-main)]"
                        >
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="bg-[var(--bg-main)]/50 border-[var(--border)] focus:border-[var(--cinehub-accent)] text-[var(--text-main)] placeholder:text-[var(--text-sub)] transition-colors cursor-text"
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end space-x-3 pt-4 border-t border-[var(--border)]/30">
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="border-[var(--border)] text-[var(--text-main)] hover:bg-[var(--bg-main)]/80 cursor-pointer transition-colors"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleUpdateProfile}
                          className="bg-[var(--cinehub-accent)] hover:bg-[var(--cinehub-accent-hover)] text-[var(--bg-main)] cursor-pointer transition-colors"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-6 mt-8">
                <div className="bg-gradient-to-br from-[var(--bg-card)]/80 to-[var(--bg-card)]/30 backdrop-blur-sm border border-[var(--border)] rounded-lg">
                  <div className="p-4 sm:p-6 border-b border-[var(--border)]/30">
                    <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-3 text-[var(--text-main)]">
                      <div className="p-2 bg-[var(--warning)]/10 rounded-lg">
                        <Lock className="h-5 w-5 text-[var(--warning)]" />
                      </div>
                      Password & Security
                    </h3>
                    <p className="text-sm text-[var(--text-sub)] mt-2">
                      Keep your account secure with a strong password
                    </p>
                  </div>
                  <div className="p-4 sm:p-6 space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="currentPassword"
                        className="text-[var(--text-main)]"
                      >
                        Current Password
                      </Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="bg-[var(--bg-main)]/50 border-[var(--border)] focus:border-[var(--warning)] text-[var(--text-main)] placeholder:text-[var(--text-sub)] transition-colors cursor-text"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="newPassword"
                          className="text-[var(--text-main)]"
                        >
                          New Password
                        </Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="bg-[var(--bg-main)]/50 border-[var(--border)] focus:border-[var(--warning)] text-[var(--text-main)] placeholder:text-[var(--text-sub)] transition-colors cursor-text"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="confirmPassword"
                          className="text-[var(--text-main)]"
                        >
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="bg-[var(--bg-main)]/50 border-[var(--border)] focus:border-[var(--warning)] text-[var(--text-main)] placeholder:text-[var(--text-sub)] transition-colors cursor-text"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-[var(--border)]/30">
                      <Button
                        onClick={handleChangePassword}
                        className="bg-[var(--warning)] hover:bg-[var(--warning)]/80 text-[var(--bg-main)] cursor-pointer transition-colors"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Update Password
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="watchlist" className="space-y-6 mt-8">
                <div className="bg-gradient-to-br from-[var(--bg-card)]/80 to-[var(--bg-card)]/30 backdrop-blur-sm border border-[var(--border)] rounded-lg">
                  <div className="p-4 sm:p-6 border-b border-[var(--border)]/30">
                    <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-3 text-[var(--text-main)]">
                      <div className="p-2 bg-[var(--success)]/10 rounded-lg">
                        <ListVideo className="h-5 w-5 text-[var(--success)]" />
                      </div>
                      My Watchlist
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20"
                      >
                        {watchList.length}
                      </Badge>
                    </h3>
                    <p className="text-sm text-[var(--text-sub)] mt-2">
                      Movies and shows you want to watch
                    </p>
                  </div>
                  <div className="p-4 sm:p-6">
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
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-6 mt-8">
                <div className="bg-gradient-to-br from-[var(--bg-card)]/80 to-[var(--bg-card)]/30 backdrop-blur-sm border border-[var(--border)] rounded-lg">
                  <div className="p-4 sm:p-6 border-b border-[var(--border)]/30">
                    <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-3 text-[var(--text-main)]">
                      <div className="p-2 bg-[var(--danger)]/10 rounded-lg">
                        <History className="h-5 w-5 text-[var(--danger)]" />
                      </div>
                      Watch History
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20"
                      >
                        {watchHistory.length}
                      </Badge>
                    </h3>
                    <p className="text-sm text-[var(--text-sub)] mt-2">
                      Movies and shows you've watched
                    </p>
                  </div>
                  <div className="p-4 sm:p-6">
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
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
