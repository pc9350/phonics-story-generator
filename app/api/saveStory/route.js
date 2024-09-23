import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const bucket = getStorage().bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);

export async function POST(request) {
  try {
    const { userId } = await getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { story, sounds } = await request.json();
    if (!story || !sounds || sounds.length === 0) {
      return NextResponse.json({ error: 'No story or sounds provided' }, { status: 400 });
    }

    const fileName = `users/${userId}/stories/${sounds.join('_')}/${Date.now()}.json`;
    const file = bucket.file(fileName);
    await file.save(JSON.stringify({ story, sounds }), {
      metadata: {
        contentType: 'application/json',
      },
    });

    return NextResponse.json({ message: 'Story saved successfully' });
  } catch (error) {
    console.error('Error saving story:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}