"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Edit3, 
  Save, 
  X, 
  User, 
  Lock, 
  Shield, 
  Mail,
  Activity,
  Check
} from "lucide-react";
import { useProfileStore } from "@/store/profileStore";

export default function Settings() {
  const {
    user,
    isEditing,
    formData,
    setIsEditing,
    setFormData,
    updateProfile,
    changePassword,
  } = useProfileStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  const handleSaveProfile = () => {
    updateProfile();
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name,
      email: user?.email,
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card className="bg-[var(--bg-card)]/80 backdrop-blur-md border-[var(--border)] shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-[var(--text-main)] flex items-center gap-3">
            <div className="p-2 bg-[var(--cinehub-accent)]/10 rounded-lg">
              <User className="w-5 h-5 text-[var(--cinehub-accent)]" />
            </div>
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[var(--text-main)] font-medium">
                Full Name
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="name"
                  name="name"
                  value={formData.name || user?.name || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="flex-1 bg-[var(--bg-main)]/50 border-[var(--border)] text-[var(--text-main)] focus:border-[var(--cinehub-accent)] transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[var(--text-main)] font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                value={formData.email || user?.email || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-[var(--bg-main)]/50 border-[var(--border)] text-[var(--text-main)] focus:border-[var(--cinehub-accent)] transition-colors"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-[var(--cinehub-accent)] hover:bg-[var(--cinehub-accent-hover)] text-[var(--bg-main)] font-medium"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="border-[var(--border)] text-[var(--text-sub)] hover:bg-[var(--bg-main)]/50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  className="bg-[var(--success)] hover:bg-[var(--success)]/80 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Password Settings */}
      <Card className="bg-[var(--bg-card)]/80 backdrop-blur-md border-[var(--border)] shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-[var(--text-main)] flex items-center gap-3">
            <div className="p-2 bg-[var(--warning)]/10 rounded-lg">
              <Lock className="w-5 h-5 text-[var(--warning)]" />
            </div>
            Security & Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-[var(--text-main)] font-medium">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={formData.currentPassword || ""}
                onChange={handleInputChange}
                className="bg-[var(--bg-main)]/50 border-[var(--border)] text-[var(--text-main)] focus:border-[var(--cinehub-accent)]"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-[var(--text-main)] font-medium">
                New Password
              </Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword || ""}
                onChange={handleInputChange}
                className="bg-[var(--bg-main)]/50 border-[var(--border)] text-[var(--text-main)] focus:border-[var(--cinehub-accent)]"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[var(--text-main)] font-medium">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword || ""}
                onChange={handleInputChange}
                className="bg-[var(--bg-main)]/50 border-[var(--border)] text-[var(--text-main)] focus:border-[var(--cinehub-accent)]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            onClick={changePassword}
            disabled={
              !formData.currentPassword ||
              !formData.newPassword ||
              !formData.confirmPassword
            }
            className="w-full bg-[var(--warning)] hover:bg-[var(--warning)]/80 text-[var(--bg-main)] font-medium disabled:opacity-50"
          >
            <Lock className="w-4 h-4 mr-2" />
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card className="bg-[var(--bg-card)]/80 backdrop-blur-md border-[var(--border)] shadow-xl">
        <CardHeader>
          <CardTitle className="text-[var(--text-main)] flex items-center gap-3">
            <div className="p-2 bg-[var(--success)]/10 rounded-lg">
              <Activity className="w-5 h-5 text-[var(--success)]" />
            </div>
            Account Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-sub)]">Profile Complete</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-[var(--bg-main)] rounded-full overflow-hidden">
                <div className="w-4/5 h-full bg-gradient-to-r from-[var(--cinehub-accent)] to-[var(--success)]"></div>
              </div>
              <span className="text-[var(--success)] text-sm">80%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-sub)]">Security Level</span>
            <Badge variant="secondary" className="bg-[var(--success)]/10 text-[var(--success)]">
              High
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}