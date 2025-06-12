import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { Admin, AdminPermission, AdminSettings } from '@/types/admin';
import { User, UserRole } from '@/types/auth';

const db = getFirestore();

function convertTimestampToDate(timestamp: any): Date {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date(timestamp);
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user document
    const userRef = db.collection('users').doc(session.user.id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data() as User;
    if (!['admin', 'moderator'].includes(userData.role)) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 });
    }

    // Convert user to admin format
    const admin: Admin = {
      id: userDoc.id,
      email: userData.email,
      name: userData.name,
      avatar: userData.avatar,
      role: userData.role,
      isActive: userData.isActive,
      emailVerified: userData.emailVerified,
      provider: userData.provider,
      providerId: userData.providerId,
      createdAt: convertTimestampToDate(userData.createdAt),
      updatedAt: convertTimestampToDate(userData.updatedAt),
      lastLoginAt: userData.lastLoginAt ? convertTimestampToDate(userData.lastLoginAt) : undefined,
      stats: userData.stats,
      recentActivity: userData.recentActivity,
      permissions: getDefaultPermissions(userData.role),
      lastActivityAt: new Date(),
      settings: getDefaultSettings()
    };

    return NextResponse.json({ admin });
  } catch (error) {
    console.error('Error in GET /api/admin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user document
    const userRef = db.collection('users').doc(session.user.id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data() as User;
    if (!['admin', 'moderator'].includes(userData.role)) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 });
    }

    const data = await request.json();
    const updateData: Partial<Admin> = {
      updatedAt: new Date()
    };

    if (data.settings) updateData.settings = data.settings as AdminSettings;
    if (data.permissions) updateData.permissions = data.permissions as AdminPermission[];
    if (data.lastActivityAt) updateData.lastActivityAt = new Date(data.lastActivityAt);

    await userRef.update(updateData);
    
    const updatedDoc = await userRef.get();
    const updatedData = updatedDoc.data() as User;
    const admin: Admin = {
      id: updatedDoc.id,
      email: updatedData.email,
      name: updatedData.name,
      avatar: updatedData.avatar,
      role: updatedData.role,
      isActive: updatedData.isActive,
      emailVerified: updatedData.emailVerified,
      provider: updatedData.provider,
      providerId: updatedData.providerId,
      createdAt: convertTimestampToDate(updatedData.createdAt),
      updatedAt: convertTimestampToDate(updatedData.updatedAt),
      lastLoginAt: updatedData.lastLoginAt ? convertTimestampToDate(updatedData.lastLoginAt) : undefined,
      stats: updatedData.stats,
      recentActivity: updatedData.recentActivity,
      permissions: getDefaultPermissions(updatedData.role),
      lastActivityAt: updateData.lastActivityAt,
      settings: updateData.settings || getDefaultSettings()
    };

    return NextResponse.json({ admin });
  } catch (error) {
    console.error('Error in PUT /api/admin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getDefaultPermissions(role: UserRole): AdminPermission[] {
  const basePermissions: AdminPermission[] = [
    'view_analytics',
    'view_activity_logs'
  ];

  if (role === 'admin') {
    return [
      ...basePermissions,
      'manage_users',
      'manage_avatars',
      'manage_settings',
      'manage_content'
    ];
  }

  if (role === 'moderator') {
    return [
      ...basePermissions,
      'manage_content'
    ];
  }

  return basePermissions;
}

function getDefaultSettings(): AdminSettings {
  return {
    theme: 'system',
    notifications: {
      email: true,
      push: true
    },
    dashboard: {
      defaultView: 'overview',
      refreshInterval: 30
    }
  };
} 