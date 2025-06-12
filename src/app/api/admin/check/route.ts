import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { UserRole } from '@/types/auth';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    // Get private key and replace literal \n with actual newlines
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    if (!process.env.FIREBASE_ADMIN_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
      throw new Error('Missing Firebase Admin configuration');
    }

    console.log('Initializing Firebase Admin with project:', process.env.FIREBASE_ADMIN_PROJECT_ID);
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
}

const adminDb = getFirestore();

export async function GET(request: Request) {
  try {
    // Get token from session
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token?.sub) {
      return NextResponse.json(
        { 
          isAdmin: false, 
          message: 'Not authenticated',
          error: 'AUTH_REQUIRED'
        },
        { status: 401 }
      );
    }

    // Get user from Firestore
    const userDoc = await adminDb.collection('users').doc(token.sub).get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { 
          isAdmin: false, 
          message: 'User not found',
          error: 'USER_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    
    // Validate user status
    if (!userData?.isActive) {
      return NextResponse.json(
        { 
          isAdmin: false, 
          message: 'Account is inactive',
          error: 'ACCOUNT_INACTIVE'
        },
        { status: 403 }
      );
    }

    // Check admin role
    const role = userData?.role as UserRole;
    const isAdmin = role === 'admin' || role === 'moderator';

    if (!isAdmin) {
      return NextResponse.json(
        { 
          isAdmin: false, 
          message: 'Insufficient permissions',
          error: 'INSUFFICIENT_PERMISSIONS'
        },
        { status: 403 }
      );
    }

    // Return admin data
    return NextResponse.json({
      isAdmin: true,
      role,
      permissions: userData?.permissions || [],
      user: {
        id: token.sub,
        email: userData.email,
        name: userData.name,
        role,
        isActive: userData.isActive,
        lastLoginAt: userData.lastLoginAt?.toDate(),
        createdAt: userData.createdAt?.toDate()
      }
    });

  } catch (error) {
    console.error('Admin check error:', error);
    return NextResponse.json(
      { 
        isAdmin: false, 
        message: 'Internal server error',
        error: 'SERVER_ERROR'
      },
      { status: 500 }
    );
  }
} 