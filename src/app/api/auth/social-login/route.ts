import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, name, provider, providerId, avatar } = await request.json();

    // Get or create user in database
    const users = await query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    let user;
    if (users.length === 0) {
      // Create new user
      await query(
        `INSERT INTO users (
          email, name, avatar, provider, provider_id, role, is_active, email_verified
        ) VALUES (?, ?, ?, ?, ?, 'user', true, true)`,
        [email, name, avatar, provider, providerId]
      );

      // Get created user
      const newUsers = await query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      user = newUsers[0];

      // Create default preferences
      await query(
        `INSERT INTO user_preferences (user_id) VALUES (?)`,
        [user.id]
      );
    } else {
      user = users[0];
    }

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Social login failed' },
      { status: 400 }
    );
  }
} 