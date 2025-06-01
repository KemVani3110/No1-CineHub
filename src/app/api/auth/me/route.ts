import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar: string | null;
}

export async function GET(req: Request) {
  try {
    // Get token from cookie using cookies() helper
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
      role: string;
    };

    // Get user from database
    const [rows] = await db.query<User[]>(
      'SELECT id, email, name, role, avatar FROM users WHERE id = ?',
      [decoded.id]
    );

    const user = rows[0];

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { message: 'Not authenticated' },
      { status: 401 }
    );
  }
} 