import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { profileService } from '@/services/profile/profileService';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const avatars = await profileService.getAvailableAvatars();
    return NextResponse.json({ avatars });
  } catch (error) {
    console.error('Get avatars error:', error);
    return NextResponse.json(
      { message: 'Failed to get avatars' },
      { status: 500 }
    );
  }
} 