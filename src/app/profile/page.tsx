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
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Image as ImageIcon,
  ChevronLeft,
  Shield,
  Camera,
} from "lucide-react";
import Link from "next/link";
import { useProfileStore } from "@/store/profileStore";
import Loading from "@/components/common/Loading";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Settings from "@/components/profile/Settings";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user: authUser, loading: authLoading } = useAuth();
  const {
    user,
    isAvatarDialogOpen,
    availableAvatars,
    activeTab,
    loading: profileLoading,
    setActiveTab,
    setIsAvatarDialogOpen,
    updateAvatar,
    fetchUserData,
    fetchAvatars,
  } = useProfileStore();

  useEffect(() => {
    if (authLoading) {
      return;
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
                      <span className="text-muted-foreground">
                        Last login
                      </span>
                      <span className="font-medium">
                        {new Date(user?.last_login_at || "").toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Settings */}
          <div className="lg:col-span-3">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 lg:p-6">
                <Settings />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Avatar Selection Dialog */}
      <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose Avatar</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[300px] pr-4">
            <div className="grid grid-cols-3 gap-4">
              {availableAvatars.map((avatar, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="h-auto p-0"
                  onClick={() => handleAvatarSelect(avatar)}
                >
                  <Image
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                </Button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}