"use client"
import { ProfileForm } from "@/components/auth/ProfileForm";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <div className="container flex items-center justify-center min-h-screen py-8">
        <ProfileForm />
      </div>
    </AuthGuard>
  );
} 