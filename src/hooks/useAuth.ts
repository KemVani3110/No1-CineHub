import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { AuthUser, ProfileUpdateData } from "@/types/auth";
import { useSession, signIn, signOut } from "next-auth/react";

export function useAuth() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id as string,
        email: session.user.email as string,
        name: session.user.name as string,
        image: session.user.image as string,
        role: session.user.role as string,
      });
    } else {
      setUser(null);
    }
  }, [session, setUser]);

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to register");
      }

      // After successful registration, sign in
      await login(email, password);
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signIn("google", { redirect: false });
    } catch (error) {
      throw error;
    }
  };

  const loginWithFacebook = async () => {
    try {
      await signIn("facebook", { redirect: false });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut({ redirect: false });
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (data: ProfileUpdateData) => {
    const response = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update profile");
    }

    const updatedUser = await response.json();
    setUser(updatedUser);
    return updatedUser;
  };

  const forgotPassword = async (email: string) => {
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to send reset email");
    }
  };

  return {
    user,
    login,
    register,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    updateProfile,
    forgotPassword,
    status,
  };
}
