import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { provider, token, user } = await request.json();

    if (!token || !provider || !user) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the Firebase token
    const decodedToken = await adminAuth.verifyIdToken(token);

    if (!decodedToken.email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists by provider_id
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE provider_id = ? AND provider = ?',
      [user.providerId, provider]
    );
    const existingUser = (rows as any[])[0];

    if (existingUser) {
      // Update last login time
      await pool.execute(
        'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?',
        [existingUser.id]
      );

      return NextResponse.json({
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role,
          image: existingUser.avatar,
        },
      });
    }

    // Create new user
    const [result] = await pool.execute(
      `INSERT INTO users (
        email, name, avatar, provider, provider_id, role, is_active, email_verified
      ) VALUES (?, ?, ?, ?, ?, 'user', 1, 1)`,
      [user.email, user.name, user.avatar, provider, user.providerId]
    );

    const newUserId = (result as any).insertId;

    return NextResponse.json({
      user: {
        id: newUserId,
        email: user.email,
        name: user.name,
        role: 'user',
        image: user.avatar,
      },
    });
  } catch (error) {
    console.error('Social login error:', error);
    return NextResponse.json(
      { message: 'Authentication failed' },
      { status: 401 }
    );
  }
} 