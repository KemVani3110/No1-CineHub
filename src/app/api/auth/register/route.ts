import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hash } from "@/lib/password";

export async function POST(request: Request) {
  try {
    console.log("Registration request received");
    const { email, password, name } = await request.json();
    console.log("Registration data:", { email, name });

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password and name are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    console.log("Checking if user exists...");
    const existingUsers = await query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    console.log("Existing users:", existingUsers);

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password);

    // Create new user
    console.log("Creating new user...");
    await query(
      `INSERT INTO users (
        email,
        name,
        password_hash,
        provider,
        provider_id,
        role,
        is_active,
        email_verified
      ) VALUES (?, ?, ?, 'local', NULL, 'user', true, true)`,
      [email, name, hashedPassword]
    );

    // Get created user
    const users = await query(
      "SELECT id, email, name, role FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      throw new Error("Failed to create user");
    }

    // Create default preferences for user
    await query(
      `INSERT INTO user_preferences (user_id) VALUES (?)`,
      [users[0].id]
    );

    return NextResponse.json(
      { message: "User registered successfully", user: users[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
} 