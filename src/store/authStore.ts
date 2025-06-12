import { create } from 'zustand';
import { User } from '@/types/auth';
import { authService } from '@/services/auth/authService';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { signOut as nextAuthSignOut } from 'next-auth/react';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => Promise<void>;
  socialLogin: (provider: 'google' | 'facebook', token: string, userData: { email: string; name: string; avatar?: string; providerId: string; }) => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ email, password });
      set({ user: response.user, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false 
      });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(userData);
      set({ user: response.user, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      // Sign out from Firebase
      await signOut(auth);
      // Sign out from NextAuth
      await nextAuthSignOut({ redirect: false });
      // Clear the store
      set({ user: null, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Logout failed',
        isLoading: false 
      });
      throw error;
    }
  },

  socialLogin: async (provider, token, userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.socialLogin({ provider, token, user: userData });
      set({ user: response.user, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Social login failed',
        isLoading: false 
      });
      throw error;
    }
  },

  getCurrentUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.getCurrentUser();
      console.log('Current user from authService:', user); // Debug log
      if (!user) {
        console.log('No user found'); // Debug log
        set({ user: null, isLoading: false });
        return;
      }
      console.log('Setting user in store:', user); // Debug log
      set({ user, isLoading: false });
    } catch (error) {
      console.error('Error getting current user:', error); // Debug log
      set({ 
        user: null,
        error: error instanceof Error ? error.message : 'Failed to get current user',
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
}));