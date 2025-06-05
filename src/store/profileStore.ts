import { create } from 'zustand';
import { authService } from '@/services/auth/authService';
import { useToast } from '@/components/ui/use-toast';

interface ProfileState {
  // User data
  user: any | null;
  loading: boolean;
  isEditing: boolean;
  isAvatarDialogOpen: boolean;
  activeTab: string;
  
  // Lists
  watchList: any[];
  watchHistory: any[];
  availableAvatars: string[];
  
  // Form data
  formData: {
    name: string;
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    avatar: string;
  };

  // Actions
  setUser: (user: any) => void;
  setLoading: (loading: boolean) => void;
  setIsEditing: (isEditing: boolean) => void;
  setIsAvatarDialogOpen: (isOpen: boolean) => void;
  setActiveTab: (tab: string) => void;
  setWatchList: (list: any[]) => void;
  setWatchHistory: (history: any[]) => void;
  setAvailableAvatars: (avatars: string[]) => void;
  setFormData: (data: Partial<ProfileState['formData']>) => void;
  
  // Async actions
  fetchUserData: () => Promise<void>;
  fetchWatchList: () => Promise<void>;
  fetchWatchHistory: () => Promise<void>;
  fetchAvatars: () => Promise<void>;
  updateProfile: () => Promise<void>;
  changePassword: () => Promise<void>;
  updateAvatar: (avatarPath: string) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  // Initial state
  user: null,
  loading: true,
  isEditing: false,
  isAvatarDialogOpen: false,
  activeTab: 'overview',
  watchList: [],
  watchHistory: [],
  availableAvatars: [],
  formData: {
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatar: '',
  },

  // Setters
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setIsEditing: (isEditing) => set({ isEditing }),
  setIsAvatarDialogOpen: (isOpen) => set({ isAvatarDialogOpen: isOpen }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setWatchList: (list) => set({ watchList: list }),
  setWatchHistory: (history) => set({ watchHistory: history }),
  setAvailableAvatars: (avatars) => set({ availableAvatars: avatars }),
  setFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),

  // Async actions
  fetchUserData: async () => {
    try {
      set({ loading: true });
      const user = await authService.getCurrentUser();
      if (!user) return;
      
      set({ 
        user,
        formData: {
          name: user.name,
          email: user.email,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          avatar: user.avatar || '',
        }
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchWatchList: async () => {
    try {
      const response = await fetch('/api/user/watchlist');
      const data = await response.json();
      if (response.ok) {
        set({ watchList: data.items });
      }
    } catch (error) {
      console.error('Failed to fetch watch list:', error);
    }
  },

  fetchWatchHistory: async () => {
    try {
      const response = await fetch('/api/user/history');
      const data = await response.json();
      if (response.ok) {
        set({ watchHistory: data.items });
      }
    } catch (error) {
      console.error('Failed to fetch watch history:', error);
    }
  },

  fetchAvatars: async () => {
    try {
      const response = await fetch('/api/avatars');
      const data = await response.json();
      if (response.ok) {
        set({ availableAvatars: data.avatars.map((avatar: any) => avatar.path) });
      }
    } catch (error) {
      console.error('Failed to fetch avatars:', error);
    }
  },

  updateProfile: async () => {
    const { formData, user } = get();
    try {
      const updatedUser = await authService.updateProfile({
        name: formData.name,
        email: formData.email,
      });
      set({ user: updatedUser, isEditing: false });
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  },

  changePassword: async () => {
    const { formData } = get();
    if (formData.newPassword !== formData.confirmPassword) {
      throw new Error('New passwords do not match');
    }

    try {
      await authService.updateProfile({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      set({
        formData: {
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }
      });
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  },

  updateAvatar: async (avatarPath: string) => {
    try {
      await authService.updateProfile({
        avatar: avatarPath,
      });
      set((state) => ({
        user: { ...state.user, avatar: avatarPath },
        formData: { ...state.formData, avatar: avatarPath },
        isAvatarDialogOpen: false,
      }));
    } catch (error) {
      console.error('Failed to update avatar:', error);
      throw error;
    }
  },
})); 