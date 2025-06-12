import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { profileService } from '@/services/profile/profileService';
import { auth } from 'firebase-admin';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, email, currentPassword, newPassword } = await req.json();

    try {
      // Update basic info if provided
      if (name || email) {
        await profileService.updateProfile(session.user.id, { name, email });
      }

      // Update password if provided
      if (currentPassword && newPassword) {
        // Get user from Firebase Auth
        const user = await auth().getUser(session.user.id);
        
        // Update password in Firebase Auth
        await auth().updateUser(session.user.id, {
          password: newPassword
        });
      }

      return NextResponse.json({
        message: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to update profile' },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await profileService.getProfile(session.user.id);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { message: 'Failed to get profile' },
      { status: 500 }
    );
  }
} 