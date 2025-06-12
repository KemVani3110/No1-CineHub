import { useEffect, useCallback, useRef } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { useAuthStore } from '@/store/authStore';
import { AdminPermission } from '@/types/admin';
import { UserRole } from '@/types/auth';

export function useAdmin() {
  const { user } = useAuthStore();
  const {
    admin,
    dashboardData,
    activityLogs,
    isLoading,
    error,
    fetchAdminData: fetchAdminDataFromStore,
    fetchDashboardData: fetchDashboardDataFromStore,
    fetchActivityLogs: fetchActivityLogsFromStore,
    updateAdminSettings,
    updateAdminPermissions,
    logActivity,
    clearError
  } = useAdminStore();

  // Use refs to track if initial fetch has been done
  const adminDataFetched = useRef(false);
  const dashboardDataFetched = useRef(false);

  // Memoize fetchAdminData to prevent infinite loops
  const fetchAdminData = useCallback(async () => {
    if (user?.id && !adminDataFetched.current) {
      adminDataFetched.current = true;
      await fetchAdminDataFromStore();
    }
  }, [user?.id, fetchAdminDataFromStore, adminDataFetched]);

  // Memoize fetchDashboardData
  const fetchDashboardData = useCallback(async () => {
    if (!dashboardDataFetched.current) {
      dashboardDataFetched.current = true;
      await fetchDashboardDataFromStore();
    }
  }, [fetchDashboardDataFromStore, dashboardDataFetched]);

  // Memoize fetchActivityLogs
  const fetchActivityLogs = useCallback(async (limit?: number) => {
    await fetchActivityLogsFromStore(limit);
  }, [fetchActivityLogsFromStore]);

  // Only fetch admin data once when user is available
  useEffect(() => {
    if (user?.id && !adminDataFetched.current) {
      fetchAdminData();
    }
  }, [user?.id, fetchAdminData]);

  // Reset fetch flags when user changes
  useEffect(() => {
    if (!user?.id) {
      adminDataFetched.current = false;
      dashboardDataFetched.current = false;
    }
  }, [user?.id]);

  const hasPermission = (permission: AdminPermission): boolean => {
    if (!admin) return false;
    return admin.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: AdminPermission[]): boolean => {
    if (!admin) return false;
    return permissions.some(permission => admin.permissions.includes(permission));
  };

  const hasAllPermissions = (permissions: AdminPermission[]): boolean => {
    if (!admin) return false;
    return permissions.every(permission => admin.permissions.includes(permission));
  };

  const isSuperAdmin = (): boolean => {
    return admin?.role === 'admin' as UserRole;
  };

  const canManageUsers = (): boolean => {
    return hasPermission('manage_users');
  };

  const canManageAvatars = (): boolean => {
    return hasPermission('manage_avatars');
  };

  const canViewAnalytics = (): boolean => {
    return hasPermission('view_analytics');
  };

  const canManageSettings = (): boolean => {
    return hasPermission('manage_settings');
  };

  const canViewActivityLogs = (): boolean => {
    return hasPermission('view_activity_logs');
  };

  const canManageContent = (): boolean => {
    return hasPermission('manage_content');
  };

  return {
    admin,
    dashboardData,
    activityLogs,
    isLoading,
    error,
    fetchAdminData,
    fetchDashboardData,
    fetchActivityLogs,
    updateAdminSettings,
    updateAdminPermissions,
    logActivity,
    clearError,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isSuperAdmin,
    canManageUsers,
    canManageAvatars,
    canViewAnalytics,
    canManageSettings,
    canViewActivityLogs,
    canManageContent
  };
} 