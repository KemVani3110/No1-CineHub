"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Edit3, Save, X } from "lucide-react";
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

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="name"
                  name="name"
                  value={formData.name || user?.name || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="flex-1"
                />
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 size={16} />
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user?.name,
                          email: user?.email,
                        });
                      }}
                    >
                      <X size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={updateProfile}
                    >
                      <Save size={16} />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="email"
                  name="email"
                  value={formData.email || user?.email || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Settings */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={formData.currentPassword || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword || ""}
                onChange={handleInputChange}
              />
            </div>

            <Button
              className="w-full"
              onClick={changePassword}
              disabled={
                !formData.currentPassword ||
                !formData.newPassword ||
                !formData.confirmPassword
              }
            >
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications about your account
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications on your devices
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Profile Visibility</Label>
                <p className="text-sm text-muted-foreground">
                  Control who can see your profile
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Activity Privacy</Label>
                <p className="text-sm text-muted-foreground">
                  Control who can see your activity
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 