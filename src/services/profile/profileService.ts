import { User } from '@/types/auth';

interface UpdateProfileData {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  avatar?: string;
}

interface Avatar {
  id: string;
  path: string;
  name: string;
}

class ProfileService {
  private static instance: ProfileService;
  private baseUrl: string;

  private constructor() {
    // Use absolute URL for API calls
    this.baseUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/api/profile`
      : '/api/profile';
  }

  public static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  async getProfile(userId: string): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get profile');
      }

      return data.user;
    } catch (error) {
      console.error('Error getting profile:', error);
      throw new Error('Failed to get profile');
    }
  }

  async updateProfile(userId: string, data: UpdateProfileData): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update profile');
      }

      return responseData.user;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  }

  async updateAvatar(userId: string, avatarPath: string): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/avatar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatar: avatarPath }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update avatar');
      }

      return responseData.user;
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw new Error('Failed to update avatar');
    }
  }

  async getAvailableAvatars(): Promise<Avatar[]> {
    try {
      const response = await fetch(`${this.baseUrl}/avatars`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch avatars');
      }

      const data = await response.json();
      return data.avatars || [];
    } catch (error) {
      console.error('Error getting avatars:', error);
      throw error;
    }
  }
}

export const profileService = ProfileService.getInstance(); 