import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { profileService } from "@/services/profile/profileService";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { avatar } = await request.json();
    if (!avatar) {
      return NextResponse.json({ error: "Avatar path is required" }, { status: 400 });
    }

    const updatedUser = await profileService.updateAvatar(session.user.id, avatar);
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error in PUT /api/profile/avatar:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 