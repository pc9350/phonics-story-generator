import { OpenAI } from "openai";

const openai = new OpenAI({apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,});

export async function generateStoryFromAI(sounds, words) {
  const prompt = `Create a very simple, 2-3 sentence story for young children learning phonics.
                  Use ONLY the following words: ${words.join(', ')}.
                  These words are associated with these sounds: ${sounds.join(', ')}.
                  Do not use any words that are not in the provided list.
                  The story should be easy for a young child to read and understand.
                  If you can't make a coherent story with only these words, use as many as possible and keep other words extremely simple.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 150,
    temperature: 0.5,
  });

  return response.choices[0].message.content.trim();
}