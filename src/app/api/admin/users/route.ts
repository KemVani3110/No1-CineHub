import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

interface UserData {
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  avatar?: string;
  createdAt?: Date;
  lastLoginAt?: Date;
  updatedAt?: Date;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role) {
      console.log("API - No session");
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      console.log("API - Not admin");
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
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
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