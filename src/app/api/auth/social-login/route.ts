import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { db } from '@/lib/db';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(req: Request) {
  try {
    const { provider, token, user } = await req.json();

    // Verify Firebase token
    const decodedToken = await auth().verifyIdToken(token);

    // Check if user exists
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [user.email]
    );

    let userId: number;

    if (users.length === 0) {
      // Create new user
      const [result] = await db.query(
        'INSERT INTO users (email, name, avatar, provider, provider_id, is_active, email_verified) VALUES (?, ?, ?, ?, ?, true, true)',
        [user.email, user.name, user.avatar, provider, decodedToken.uid]
      );

      userId = result.insertId;
    } else {
      // Update existing user
      const existingUser = users[0];
      userId = existingUser.id;

      await db.query(
        'UPDATE users SET name = ?, avatar = ?, provider = ?, provider_id = ?, last_login_at = CURRENT_TIMESTAMP WHERE id = ?',
        [user.name, user.avatar, provider, decodedToken.uid, userId]
      );
    }

    // Generate JWT token
    const jwtToken = sign(
      {
        id: userId,
        email: user.email,
        role: 'user',
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Create session
    await db.query(
      'INSERT INTO sessions (user_id, token_id, refresh_token, expires_at) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
      [userId, jwtToken, jwtToken]
    );

    // Set cookie
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: userId,
          email: user.email,
          name: user.name,
          role: 'user',
        },
      },
      { status: 200 }
    );

    response.cookies.set('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Social login error:', error);
    return NextResponse.json(
      { message: 'Authentication failed' },
      { status: 401 }
    );
  }
} 