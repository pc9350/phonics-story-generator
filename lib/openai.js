import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function generateStoryFromAI(words) {
  const prompt = `Create a short children's story that only uses CVC (Consonant-Vowel-Consonant) words like "cat", "bat", "hat", etc. 
    Use the following CVC words in the story: ${words.join(', ')}.
    Keep the story simple, fun, and engaging for young kids learning phonics. Keep the length of the satory to 4 sentences.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.8,
    });

    console.log('OpenAI Response:', response); // Log the response
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API Error:', error); // Log the error
    throw new Error('OpenAI API request failed');
  }
}