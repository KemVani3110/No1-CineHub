import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hash } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const { email, token, newPassword } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // If token and newPassword are provided, this is a password reset request
    if (token && newPassword) {
      // Verify token and update password
      const users = await query(
        "SELECT * FROM users WHERE email = ? AND reset_token = ? AND reset_token_expires > NOW()",
        [email, token]
      );

      if (users.length === 0) {
        return NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 400 }
        );
      }

      const hashedPassword = await hash(newPassword);

      await query(
        `UPDATE users 
         SET password = ?, reset_token = NULL, reset_token_expires = NULL 
         WHERE email = ?`,
        [hashedPassword, email]
      );

      return NextResponse.json(
        { message: "Password updated successfully" },
        { status: 200 }
      );
    }

    // This is a forgot password request
    const users = await query(
      "SELECT * FROM users WHERE email = ? AND provider = 'local'",
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15);
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 1); // Token expires in 1 hour

    await query(
      `UPDATE users 
       SET reset_token = ?, reset_token_expires = ? 
       WHERE email = ?`,
      [resetToken, tokenExpiry, email]
    );

    // TODO: Send email with reset token
    // For now, we'll just return the token in the response
    return NextResponse.json(
      { 
        message: "Password reset instructions sent to your email",
        token: resetToken // Remove this in production
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 