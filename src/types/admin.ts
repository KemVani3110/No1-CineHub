import { User, UserRole } from './auth';

export type AdminPermission = 
  | 'view_analytics'
  | 'view_activity_logs'
  | 'manage_users'
  | 'manage_avatars'
  | 'manage_settings'
  | 'manage_content';

export interface AdminSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
  };
  dashboard: {
    defaultView: 'overview' | 'users' | 'activity' | 'settings';
    refreshInterval: number;
  };
}

export interface Admin extends Omit<User, 'role'> {
  role: UserRole;
  permissions: AdminPermission[];
  lastActivityAt?: Date;
  settings?: AdminSettings;
}

export interface ActivityLog {
  id: string;
  adminId: string;
  action: string;
  targetType: 'user' | 'avatar' | 'setting' | 'content';
  targetId: string;
  details: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalAvatars: number;
  totalActivityLogs: number;
  recentActivity: ActivityLog[];
}

export interface AdminDashboardData {
  stats: AdminStats;
  recentUsers: User[];
  recentActivity: ActivityLog[];
  systemStatus: {
    uptime: number;
    lastBackup: Date;
    activeSessions: number;
  };
} 