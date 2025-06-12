import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { Admin, AdminPermission } from '@/types/admin';

const adminDb = getFirestore();

// PATCH /api/admin/permissions
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user document to check admin role
    const userDoc = await adminDb.collection('users').doc(session.user.id).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    // Only super admin can update permissions
    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // Get permissions from request body
    const { permissions } = await request.json();

    // Validate permissions
    const validPermissions: AdminPermission[] = [
      'view_analytics',
      'view_activity_logs',
      'manage_users',
      'manage_avatars',
      'manage_settings',
      'manage_content'
    ];

    const invalidPermissions = permissions.filter(
      (p: string) => !validPermissions.includes(p as AdminPermission)
    );

    if (invalidPermissions.length > 0) {
      return NextResponse.json(
        { error: `Invalid permissions: ${invalidPermissions.join(', ')}` },
        { status: 400 }
      );
    }

    // Update admin permissions
    await adminDb.collection('users').doc(session.user.id).update({
      permissions,
      updatedAt: new Date()
    });

    // Get updated admin data
    const updatedDoc = await adminDb.collection('users').doc(session.user.id).get();
    const updatedData = updatedDoc.data();

    const admin: Admin = {
      id: updatedDoc.id,
      email: updatedData?.email,
      name: updatedData?.name,
      role: updatedData?.role,
      permissions: updatedData?.permissions || [],
      settings: updatedData?.settings,
      createdAt: updatedData?.createdAt?.toDate(),
      updatedAt: updatedData?.updatedAt?.toDate(),
      lastActivityAt: new Date(),
      isActive: updatedData?.isActive ?? true,
      emailVerified: updatedData?.emailVerified ?? false,
      provider: updatedData?.provider ?? 'local'
    };

    // Log the activity
    await adminDb.collection('activity_logs').add({
      adminId: session.user.id,
      action: 'update_permissions',
      targetType: 'admin',
      targetId: session.user.id,
      details: {
        oldPermissions: userData?.permissions || [],
        newPermissions: permissions
      },
      timestamp: new Date()
    });

    return NextResponse.json({ admin });
  } catch (error) {
    console.error('Error in PATCH /api/admin/permissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 