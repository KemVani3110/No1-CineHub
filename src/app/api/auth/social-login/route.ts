import { NextResponse } from 'next/server';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  
  if (!process.env.FIREBASE_ADMIN_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
    console.error('Missing Firebase Admin configuration');
  } else {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  }
}

const db = getFirestore();

export async function POST(request: Request) {
  try {
    const { provider, token, user } = await request.json();

    if (!token || !provider || !user) {
      console.error('Missing required fields:', { provider, token: !!token, user: !!user });
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the Firebase token
    let decodedToken;
    try {
      decodedToken = await auth().verifyIdToken(token);
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    if (!decodedToken.email) {
      console.error('No email in decoded token');
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Lưu user vào Firestore (nếu chưa có)
    const userRef = db.collection('users').doc(decodedToken.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set({
        email: decodedToken.email,
        name: user.name || decodedToken.name || '',
        avatar: user.avatar || decodedToken.picture || '',
        provider,
        providerId: user.providerId,
        createdAt: new Date(),
        role: 'user',
        isActive: true,
      });
    }

    // Lấy lại user từ Firestore
    const savedUser = (await userRef.get()).data();

    return NextResponse.json({
      user: {
        id: decodedToken.uid,
        name: savedUser?.name,
        email: savedUser?.email,
        avatar: savedUser?.avatar,
        role: savedUser?.role,
      },
    });
  } catch (error) {
    console.error('Social login error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Authentication failed' },
      { status: 401 }
    );
  }
} 