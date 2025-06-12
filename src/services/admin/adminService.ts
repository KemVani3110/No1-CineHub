import { Admin, ActivityLog, AdminDashboardData } from '@/types/admin';

class AdminService {
  async getAdminById(userId: string): Promise<Admin | null> {
    console.log('AdminService - Getting admin by ID:', userId);
    
    try {
      const response = await fetch('/api/admin');
      if (!response.ok) {
        console.log('AdminService - API error:', response.status);
        return null;
      }
      
      const data = await response.json();
      console.log('AdminService - Admin data received:', data);
      
      if (!data.admin) {
        console.log('AdminService - Admin not found in response');
        return null;
      }
      
      return data.admin;
    } catch (error) {
      console.error('AdminService - Error fetching admin:', error);
      return null;
    }
  }

  async getAdminDashboardData(): Promise<AdminDashboardData> {
    const response = await fetch('/api/admin/dashboard');
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }
    const data = await response.json();
    return data;
  }

  async getActivityLogs(limit: number = 50): Promise<ActivityLog[]> {
    const response = await fetch(`/api/admin/activity-logs?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch activity logs');
    }
    const data = await response.json();
    return data.logs;
  }

  async updateAdminSettings(userId: string, settings: Partial<Admin['settings']>): Promise<void> {
    const response = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ settings }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update settings');
    }
  }

  async updateAdminPermissions(userId: string, permissions: Admin['permissions']): Promise<void> {
    const response = await fetch('/api/admin/permissions', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ permissions }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update permissions');
    }
  }

  async logActivity(activity: Omit<ActivityLog, 'id' | 'timestamp' | 'adminId'>): Promise<void> {
    const response = await fetch('/api/admin/activity-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activity),
    });
    
    if (!response.ok) {
      throw new Error('Failed to log activity');
    }
  }
}

export const adminService = new AdminService(); 