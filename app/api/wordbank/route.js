import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sound = searchParams.get('sound');

  if (!sound) {
    return NextResponse.json({ error: 'Sound parameter is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('phonics')
    .select('*')
    .eq('sound', sound);

  if (error || data.length === 0) {
    return NextResponse.json({ error: 'No data found for this sound' }, { status: 404 });
  }

  return NextResponse.json(data, { status: 200 });
}