import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { UserRole, AuthProvider } from '@/types/auth';
import { NextAuthSession } from '@/types/auth';

const db = getFirestore();

interface UserData {
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  avatar?: string;
  createdAt?: Date;
  lastLoginAt?: Date;
  updatedAt?: Date;
  provider: AuthProvider;
  providerId?: string;
  emailVerified: boolean;
  stats?: {
    watchlistCount: number;
    reviewCount: number;
    ratingCount: number;
  };
  recentActivity?: any[];
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as NextAuthSession | null;

    if (!session?.user?.role) {
      console.log("API - No session");
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userRole = session.user.role as UserRole;
    if (!['admin', 'moderator'].includes(userRole)) {
      console.log("API - Not admin/moderator");
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    console.log("API - Fetching users");
    const usersSnapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
    
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      email: doc.data().email,
      role: doc.data().role,
      isActive: doc.data().isActive,
      avatar: doc.data().avatar,
      createdAt: doc.data().createdAt?.toDate(),
      lastLoginAt: doc.data().lastLoginAt?.toDate(),
    }));

    console.log("API - Users fetched:", users);
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions) as NextAuthSession | null;

    if (!session?.user?.role) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userRole = session.user.role as UserRole;
    if (!['admin', 'moderator'].includes(userRole)) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Only admin can change roles
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Only admin can change user roles' }, { status: 403 });
    }

    const { userId, role, isActive } = await request.json();

    // Update user in Firestore
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      role,
      isActive,
      updatedAt: new Date()
    });

    // Get updated user data
    const updatedUserDoc = await userRef.get();
    const updatedUser = {
      id: updatedUserDoc.id,
      ...(updatedUserDoc.data() as UserData)
    };

    // Log the activity
    await db.collection('admin_activity_logs').add({
      adminId: session.user.id,
      action: 'UPDATE_USER',
      targetUserId: userId,
      description: `Updated user ${updatedUser.name} (${updatedUser.email})`,
      metadata: { role, isActive },
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      createdAt: new Date()
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 