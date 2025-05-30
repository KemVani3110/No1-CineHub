import { NextResponse } from 'next/server';
import { AuthService } from '@/services/auth/authService';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const user = await AuthService.signInWithEmail(email, password);
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 401 }
    );
  }
} 