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

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { userId } = await getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [files] = await bucket.getFiles({ prefix: `users/${userId}/stories/` });
    const stories = await Promise.all(files.map(async (file) => {
      const [content] = await file.download();
      let parsedContent;
      try {
        parsedContent = JSON.parse(content.toString('utf-8'));
      } catch (error) {
        console.error('Error parsing file content:', error);
        parsedContent = { story: content.toString('utf-8'), sounds: [], createdAt: file.metadata.timeCreated };
      }
      return {
        id: file.name,
        story: parsedContent.story,
        sounds: parsedContent.sounds || [],
        createdAt: parsedContent.createdAt || file.metadata.timeCreated,
      };
    }));

    stories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ stories });
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}