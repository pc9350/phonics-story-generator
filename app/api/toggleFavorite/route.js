import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const { userId } = auth();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch the current story
    let { data: story, error } = await supabase
      .from('stories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    if (story.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Toggle the isFavorite status
    const { data: updatedStory, error: updateError } = await supabase
      .from('stories')
      .update({ is_favorite: !story.is_favorite })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, story: updatedStory });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}