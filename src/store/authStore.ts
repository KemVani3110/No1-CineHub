//Zustand auth store
import { create } from "zustand";
import { AuthStore, AuthUser } from "@/types/auth";
import { auth } from "@/lib/firebase";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  setUser: (user: AuthUser | null) => set({ 
    user, 
    isAuthenticated: !!user 
  }),

  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      set({ 
        user: {
          id: user.uid,
          email: user.email!,
          name: user.displayName || '',
          image: user.photoURL,
          role: 'user'
        },
        isAuthenticated: true,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to login',
        isLoading: false 
      });
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      set({ isLoading: true, error: null });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with name
      await updateProfile(user, { displayName: name });
      
      set({ 
        user: {
          id: user.uid,
          email: user.email!,
          name: name,
          image: user.photoURL,
          role: 'user'
        },
        isAuthenticated: true,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to register',
        isLoading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      await signOut(auth);
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to logout',
        isLoading: false 
      });
      throw error;
    }
  },

  updateProfile: async (data: Partial<AuthUser>) => {
    try {
      set({ isLoading: true, error: null });
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      if (data.name) {
        await updateProfile(user, { displayName: data.name });
      }

      set(state => ({
        user: state.user ? { ...state.user, ...data } : null,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update profile',
        isLoading: false 
      });
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    try {
      set({ isLoading: true, error: null });
      await sendPasswordResetEmail(auth, email);
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to reset password',
        isLoading: false 
      });
      throw error;
    }
  },
}));