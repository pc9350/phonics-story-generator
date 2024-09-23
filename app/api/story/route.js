import { NextResponse } from 'next/server';
import { generateStoryFromAI } from '../../../lib/openai';
import { supabase } from '../../../lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { sounds } = await req.json();

    // Fetch words from Supabase based on the sounds
    const wordsPromises = sounds.map(async (sound) => {
      const { data, error } = await supabase
        .from('phonics')
        .select('*')
        .eq('sound', sound);

      if (error) {
        console.error(`Error fetching words for sound ${sound}:`, error);
        return [];
      }

      return data.map(item => item.word);
    });

    const wordsArrays = await Promise.all(wordsPromises);
    const wordList = wordsArrays.flat();

    // Generate story using OpenAI
    const story = await generateStoryFromAI(sounds, wordList);

    return NextResponse.json({ story });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 });
  }
}