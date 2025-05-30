import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Create response with success message
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    )

    // Expire the session cookie by setting it to expire in the past
    response.cookies.set({
      name: "session",
      value: "",
      expires: new Date(0),
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    )
  }
} 