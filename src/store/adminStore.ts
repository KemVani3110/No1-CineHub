import { create } from 'zustand';
import { Admin, ActivityLog, AdminDashboardData } from '@/types/admin';
import { adminService } from '@/services/admin/adminService';
import { useAuthStore } from './authStore';

interface AdminState {
  admin: Admin | null;
  dashboardData: AdminDashboardData | null;
  activityLogs: ActivityLog[];
  isLoading: boolean;
  error: string | null;
  fetchAdminData: () => Promise<void>;
  fetchDashboardData: () => Promise<void>;
  fetchActivityLogs: (limit?: number) => Promise<void>;
  updateAdminSettings: (settings: Partial<Admin['settings']>) => Promise<void>;
  updateAdminPermissions: (permissions: Admin['permissions']) => Promise<void>;
  logActivity: (activity: Omit<ActivityLog, 'id' | 'timestamp'>) => Promise<void>;
  clearError: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  admin: null,
  dashboardData: null,
  activityLogs: [],
  isLoading: false,
  error: null,

  fetchAdminData: async () => {
    const authUser = useAuthStore.getState().user;
    console.log('AdminStore - Fetching admin data for user:', authUser);
    
    if (!authUser?.id) {
      console.log('AdminStore - No auth user found');
      set({ error: 'Not authenticated' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      console.log('AdminStore - Calling adminService.getAdminById');
      const admin = await adminService.getAdminById(authUser.id);
      console.log('AdminStore - Admin data received:', admin);
      
      if (!admin) {
        console.log('AdminStore - Admin not found');
        set({ error: 'Admin not found' });
        return;
      }
      set({ admin, isLoading: false });
    } catch (error) {
      console.error('AdminStore - Error fetching admin data:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch admin data',
        isLoading: false 
      });
    }
  },

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const dashboardData = await adminService.getAdminDashboardData();
      set({ dashboardData, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
        isLoading: false 
      });
    }
  },

  fetchActivityLogs: async (limit = 50) => {
    set({ isLoading: true, error: null });
    try {
      const activityLogs = await adminService.getActivityLogs(limit);
      set({ activityLogs, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch activity logs',
        isLoading: false 
      });
    }
  },

  updateAdminSettings: async (settings) => {
    const { admin } = get();
    if (!admin?.id) {
      set({ error: 'Admin not found' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      await adminService.updateAdminSettings(admin.id, settings);
      set({ 
        // admin: { ...admin, settings: { ...admin.settings, ...settings } },
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update settings',
        isLoading: false 
      });
    }
  },

  updateAdminPermissions: async (permissions) => {
    const { admin } = get();
    if (!admin?.id) {
      set({ error: 'Admin not found' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      await adminService.updateAdminPermissions(admin.id, permissions);
      set({ 
        admin: { ...admin, permissions },
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update permissions',
        isLoading: false 
      });
    }
  },

  logActivity: async (activity) => {
    const { admin } = get();
    if (!admin?.id) {
      set({ error: 'Admin not found' });
      return;
    }

    try {
      await adminService.logActivity(activity);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to log activity'
      });
    }
  },

  clearError: () => set({ error: null })
})); 