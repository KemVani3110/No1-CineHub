import { create } from 'zustand';
import { authService } from '@/services/auth/authService';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
  created_at: string;
  last_login_at: string;
}

interface FormData {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  avatar?: string;
}

interface ProfileState {
  user: User | null;
  isEditing: boolean;
  isAvatarDialogOpen: boolean;
  availableAvatars: string[];
  activeTab: string;
  watchList: any[];
  watchHistory: any[];
  formData: FormData;
  loading: boolean;
  setActiveTab: (tab: string) => void;
  setIsEditing: (isEditing: boolean) => void;
  setIsAvatarDialogOpen: (isOpen: boolean) => void;
  setFormData: (data: Partial<FormData>) => void;
  updateProfile: () => Promise<void>;
  changePassword: () => Promise<void>;
  updateAvatar: (avatarPath: string) => Promise<void>;
  fetchUserData: () => Promise<void>;
  fetchAvatars: () => Promise<void>;
  fetchWatchList: () => Promise<void>;
  fetchWatchHistory: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  user: null,
  isEditing: false,
  isAvatarDialogOpen: false,
  availableAvatars: [],
  activeTab: "overview",
  watchList: [],
  watchHistory: [],
  formData: {},
  loading: true,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setIsEditing: (isEditing) => set({ isEditing }),
  setIsAvatarDialogOpen: (isOpen) => set({ isAvatarDialogOpen: isOpen }),
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),

  updateProfile: async () => {
    const { formData } = get();
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile");
      }

      const data = await response.json();
      set({ 
        user: data.user, 
        isEditing: false,
        formData: {
          name: data.user.name,
          email: data.user.email,
          avatar: data.user.avatar
        }
      });
    } catch (error) {
      throw error;
    }
  },

  changePassword: async () => {
    const { formData } = get();
    try {
      const response = await fetch("/api/profile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to change password");
      }

      set({ 
        formData: {
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      });
    } catch (error) {
      throw error;
    }
  },

  updateAvatar: async (avatarPath: string) => {
    try {
      const response = await fetch("/api/profile/avatar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatar: avatarPath }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update avatar");
      }

      const data = await response.json();
      set((state) => ({
        user: state.user ? { ...state.user, avatar: avatarPath } : null,
        formData: { ...state.formData, avatar: avatarPath },
        isAvatarDialogOpen: false,
      }));
    } catch (error) {
      throw error;
    }
  },

  fetchUserData: async () => {
    try {
      const response = await fetch("/api/profile");
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      set({ 
        user: data.user, 
        formData: {
          name: data.user.name,
          email: data.user.email,
          avatar: data.user.avatar
        },
        loading: false 
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchAvatars: async () => {
    try {
      const response = await fetch("/api/profile/avatars");
      if (!response.ok) {
        throw new Error("Failed to fetch avatars");
      }
      const data = await response.json();
      set({ availableAvatars: data.avatars.map((avatar: any) => avatar.file_path) });
    } catch (error) {
      console.error("Error fetching avatars:", error);
      set({ availableAvatars: [] });
    }
  },

  fetchWatchList: async () => {
    try {
      const response = await fetch("/api/profile/watchlist");
      if (!response.ok) {
        throw new Error("Failed to fetch watchlist");
      }
      const data = await response.json();
      set({ watchList: data.watchlist });
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      set({ watchList: [] });
    }
  },

  fetchWatchHistory: async () => {
    try {
      const response = await fetch("/api/profile/history");
      if (!response.ok) {
        throw new Error("Failed to fetch watch history");
      }
      const data = await response.json();
      set({ watchHistory: data.history });
    } catch (error) {
      console.error("Error fetching watch history:", error);
      set({ watchHistory: [] });
    }
  },
})); 