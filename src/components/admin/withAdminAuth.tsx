import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuthStore } from '@/store/authStore';
import Loading from '@/components/common/Loading';

interface WithAdminAuthProps {
  requiredPermissions?: string[];
  requireSuperAdmin?: boolean;
}

export function withAdminAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { requiredPermissions = [], requireSuperAdmin = false }: WithAdminAuthProps = {}
) {
  return function WithAdminAuthComponent(props: P) {
    const router = useRouter();
    const { user } = useAuthStore();
    const {
      admin,
      isLoading,
      hasAllPermissions,
      isSuperAdmin
    } = useAdmin();

    useEffect(() => {
      if (!isLoading) {
        if (!user) {
          // Not logged in, redirect to login
          router.push('/login');
        } else if (!admin) {
          // Not an admin, redirect to home
          router.push('/home');
        } else if (requireSuperAdmin && !isSuperAdmin()) {
          // Requires super admin but user is not
          router.push('/admin/dashboard');
        } else if (requiredPermissions.length > 0 && !hasAllPermissions(requiredPermissions as any)) {
          // Missing required permissions
          router.push('/admin/dashboard');
        }
      }
    }, [user, admin, isLoading, router, requireSuperAdmin, requiredPermissions, hasAllPermissions, isSuperAdmin]);

    if (isLoading) {
      return <Loading message="Loading admin data..." />;
    }

    if (!user || !admin) {
      return null;
    }

    if (requireSuperAdmin && !isSuperAdmin()) {
      return null;
    }

    if (requiredPermissions.length > 0 && !hasAllPermissions(requiredPermissions as any)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
} 