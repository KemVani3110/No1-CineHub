import { create } from 'zustand';
import { User } from '@/types/auth';
import { profileService } from '@/services/profile/profileService';
import { useAuthStore } from './authStore';
import debounce from 'lodash/debounce';

interface Avatar {
  id: string;
  path: string;
  name: string;
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
  availableAvatars: Avatar[];
  activeTab: string;
  formData: FormData;
  loading: boolean;
  setActiveTab: (tab: string) => void;
  setIsEditing: (isEditing: boolean) => void;
  setIsAvatarDialogOpen: (isOpen: boolean) => void;
  setFormData: (data: Partial<FormData>) => void;
  updateProfile: () => Promise<void>;
  changePassword: () => Promise<void>;
  updateAvatar: (avatarPath: string) => Promise<void>;
  fetchUserData: (() => Promise<void> | undefined);
  fetchAvatars: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  user: null,
  isEditing: false,
  isAvatarDialogOpen: false,
  availableAvatars: [],
  activeTab: "overview",
  formData: {},
  loading: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setIsEditing: (isEditing) => set({ isEditing }),
  setIsAvatarDialogOpen: (isOpen) => set({ isAvatarDialogOpen: isOpen }),
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),

  updateProfile: async () => {
    const { formData } = get();
    const authUser = useAuthStore.getState().user;
    
    if (!authUser?.id) {
      throw new Error('User not authenticated');
    }

    try {
      const updatedUser = await profileService.updateProfile(authUser.id, formData);
      set({ 
        user: updatedUser, 
        isEditing: false,
        formData: {
          name: updatedUser.name,
          email: updatedUser.email,
          avatar: updatedUser.avatar
        }
      });
    } catch (error) {
      throw error;
    }
  },

  changePassword: async () => {
    const { formData } = get();
    const authUser = useAuthStore.getState().user;
    
    if (!authUser?.id) {
      throw new Error('User not authenticated');
    }

    try {
      // Note: Password change should be handled by Firebase Auth
      // This is just a placeholder for now
      set({ 
        isEditing: false,
        formData: {
          name: get().user?.name || "",
          email: get().user?.email || "",
          avatar: get().user?.avatar || ""
        }
      });
    } catch (error) {
      throw error;
    }
  },

  updateAvatar: async (avatarPath: string) => {
    const authUser = useAuthStore.getState().user;
    
    if (!authUser?.id) {
      throw new Error('User not authenticated');
    }

    try {
      const updatedUser = await profileService.updateAvatar(authUser.id, avatarPath);
      set({ user: updatedUser });
    } catch (error) {
      throw error;
    }
  },

  fetchUserData: debounce(async () => {
    const authUser = useAuthStore.getState().user;
    
    if (!authUser?.id) {
      set({ loading: false, user: null });
      return;
    }

    if (get().user?.id === authUser.id) {
      set({ loading: false });
      return;
    }

    set({ loading: true });
    try {
      const userData = await profileService.getProfile(authUser.id);
      if (userData) {
        set({ 
          user: userData, 
          formData: {
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar
          },
          loading: false 
        });
      } else {
        set({ loading: false, user: null });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      set({ loading: false, user: null });
    }
  }, 300),

  fetchAvatars: async () => {
    try {
      const avatars = await profileService.getAvailableAvatars();
      set({ availableAvatars: avatars });
    } catch (error) {
      console.error("Error fetching avatars:", error);
      set({ availableAvatars: [] });
    }
  },
})); 