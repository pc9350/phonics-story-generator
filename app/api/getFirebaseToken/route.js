import { getAuth } from 'firebase-admin/auth';
import { getAuth as getClerkAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
// import '../../lib/firebase-admin';

export async function GET(request) {
  try {
    const { userId } = getClerkAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const firebaseToken = await getAuth().createCustomToken(userId);
    return NextResponse.json({ firebaseToken });
  } catch (error) {
    console.error('Error in getFirebaseToken:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}