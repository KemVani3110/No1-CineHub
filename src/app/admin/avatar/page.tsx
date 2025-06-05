"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Trash2, Loader2 } from "lucide-react";
import Loading from "@/components/common/Loading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAvatarStore } from "@/store/avatarStore";

export default function AvatarManagementPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    avatars,
    loading,
    uploading,
    selectedFile,
    setSelectedFile,
    fetchAvatars,
    uploadAvatar,
    deleteAvatar,
  } = useAvatarStore();

  useEffect(() => {
    fetchAvatars();
  }, [fetchAvatars]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        // 20MB limit
        toast({
          title: "Error",
          description: "File size should be less than 20MB",
          variant: "destructive",
        });
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Only image files are allowed",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadAvatar(selectedFile);
      toast({
        title: "Success",
        description: "Avatar uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload avatar",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (avatarId: number) => {
    try {
      await deleteAvatar(avatarId);
      toast({
        title: "Success",
        description: "Avatar deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete avatar",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      return <Loading message="Loading avatars..." />;
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border-[var(--border)] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-card)]/50">
        <CardHeader>
          <CardTitle className="text-[var(--text-main)]">
            Avatar Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Upload Section */}
          <div className="mb-8 p-4 border border-dashed border-[var(--border)] rounded-lg">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="max-w-xs"
                />
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="bg-[var(--cinehub-accent)] hover:bg-[var(--cinehub-accent-hover)]"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  <span className="ml-2">Upload</span>
                </Button>
              </div>
              {selectedFile && (
                <p className="text-sm text-[var(--text-sub)]">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>

          {/* Avatars Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {avatars.map((avatar) => (
              <div
                key={avatar.id}
                className="group relative aspect-square rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--bg-card)]"
              >
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage
                    src={avatar.file_path}
                    alt={avatar.original_name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-[var(--cinehub-accent)]/10 text-[var(--cinehub-accent)]">
                    {avatar.original_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[var(--bg-card)] border-[var(--border)]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Avatar</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this avatar? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-[var(--border)]">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(avatar.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
