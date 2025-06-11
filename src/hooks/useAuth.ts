import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth/authService';
import { useToast } from '@/components/ui/use-toast';
import { User, UserRole, AuthProvider } from '@/types/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => Promise<void>;
  socialLogin: (provider: AuthProvider, token: string, userData: { email: string; name: string; avatar?: string; providerId: string; }) => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      setUser(response.user);
      return response;
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error instanceof Error ? error.message : 'An error occurred during login',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const socialLogin = async (provider: 'google' | 'facebook', token: string, userData: any) => {
    try {
      setLoading(true);
      const response = await authService.socialLogin({
        provider,
        token,
        user: {
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar,
          providerId: userData.providerId,
        },
      });
      setUser(response.user);
      return response;
    } catch (error) {
      toast({
        title: 'Social Login Failed',
        description: error instanceof Error ? error.message : 'An error occurred during social login',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authService.register({ name, email, password });
      return response;
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: error instanceof Error ? error.message : 'An error occurred during registration',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      router.push('/login');
    } catch (error) {
      toast({
        title: 'Logout Failed',
        description: error instanceof Error ? error.message : 'An error occurred during logout',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    socialLogin,
  };
}
