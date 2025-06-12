import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export async function GET() {
  try {
    const avatarsRef = db.collection('avatars');
    const snapshot = await avatarsRef.get();
    
    const avatars = snapshot.docs.map(doc => ({
      id: doc.id,
      path: doc.data().path,
      name: doc.data().name
    }));

    return NextResponse.json({ avatars });
  } catch (error) {
    console.error('Error in GET /api/profile/avatars:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 