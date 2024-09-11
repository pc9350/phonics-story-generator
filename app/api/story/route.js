import { supabase } from '@/lib/supabaseClient';
import { generateStoryFromAI } from '@/lib/openai';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { sound } = await request.json();

  if (!sound || sound.length === 0) {
    return NextResponse.json({ error: 'No sound provided' }, { status: 400 });
  }

  try {
    // Fetch CVC words from Supabase based on the sound
    const { data, error } = await supabase
      .from('phonics')
      .select('words')
      .eq('sound', sound.trim().toLowerCase());

    if (error || !data.length) {
      return NextResponse.json({ error: 'No CVC words found for this sound' }, { status: 404 });
    }

    console.log('CVC Words:', data[0].words); // Log the CVC words

    const cvcWords = data[0].words; // Extract the CVC words from the fetched data

    // Pass the CVC words to the OpenAI function to generate the story
    const story = await generateStoryFromAI(cvcWords);

    return NextResponse.json({ story }, { status: 200 });
  } catch (error) {
    console.error('Error generating story:', error);
    return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 });
  }
}