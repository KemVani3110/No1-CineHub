import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth/authService";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();
    const user = await AuthService.registerWithEmail(email, password, name);
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 400 }
    );
  }
} 