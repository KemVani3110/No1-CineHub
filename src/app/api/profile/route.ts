import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFirestore } from "firebase-admin/firestore";
import { auth } from "firebase-admin";
import { User, AuthProvider } from "@/types/auth";

const db = getFirestore();

async function createUserDocument(userId: string, userData: any): Promise<User> {
  const userRef = db.collection('users').doc(userId);
  const defaultUserData = {
    name: userData.name || '',
    email: userData.email || '',
    avatar: userData.avatar || '/uploads/avatars/default.png',
    role: 'user',
    isActive: true,
    emailVerified: userData.emailVerified || false,
    provider: userData.provider || 'local',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
    stats: {
      watchlistCount: 0,
      reviewCount: 0,
      ratingCount: 0
    },
    recentActivity: []
  };

  await userRef.set(defaultUserData);
  return {
    id: userId,
    ...defaultUserData
  } as User;
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
      // Get user from Firebase Auth
      const firebaseUser = await auth().getUser(session.user.id);
      
      // Create new user document
      const user = await createUserDocument(session.user.id, {
        name: firebaseUser.displayName || '',
        email: firebaseUser.email || '',
        avatar: firebaseUser.photoURL || '/uploads/avatars/default.png',
        provider: firebaseUser.providerData[0]?.providerId || 'local',
        emailVerified: firebaseUser.emailVerified
      });

      return NextResponse.json({ user });
    }

    const userData = userDoc.data();
    const user: User = {
      id: userDoc.id,
      name: userData?.name || '',
      email: userData?.email || '',
      avatar: userData?.avatar,
      role: userData?.role || 'user',
      isActive: userData?.isActive ?? true,
      emailVerified: userData?.emailVerified ?? false,
      provider: userData?.provider || 'local',
      createdAt: userData?.createdAt?.toDate(),
      lastLoginAt: userData?.lastLoginAt?.toDate(),
      updatedAt: userData?.updatedAt?.toDate(),
      stats: userData?.stats || {
        watchlistCount: 0,
        reviewCount: 0,
        ratingCount: 0
      },
      recentActivity: userData?.recentActivity || []
    };

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error in GET /api/profile:', error);
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

    const data = await request.json();
    const userRef = db.collection('users').doc(session.user.id);
    
    const updateData: any = {
      updatedAt: new Date()
    };

    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.avatar) updateData.avatar = data.avatar;

    await userRef.update(updateData);
    
    const updatedDoc = await userRef.get();
    const userData = updatedDoc.data();
    const user: User = {
      id: updatedDoc.id,
      name: userData?.name || '',
      email: userData?.email || '',
      avatar: userData?.avatar,
      role: userData?.role || 'user',
      isActive: userData?.isActive ?? true,
      emailVerified: userData?.emailVerified ?? false,
      provider: userData?.provider || 'local',
      createdAt: userData?.createdAt?.toDate(),
      lastLoginAt: userData?.lastLoginAt?.toDate(),
      updatedAt: userData?.updatedAt?.toDate(),
      stats: userData?.stats || {
        watchlistCount: 0,
        reviewCount: 0,
        ratingCount: 0
      },
      recentActivity: userData?.recentActivity || []
    };

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error in PUT /api/profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 