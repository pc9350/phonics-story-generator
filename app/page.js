'use client';
import { useState } from 'react';
import { Button, TextField } from '@mui/material';

export default function Home() {
  const [sound, setSound] = useState('');
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setSound(e.target.value);
  };

  const generateStory = async () => {
    setLoading(true);
    const response = await fetch('/api/story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sound: sound.trim().toLowerCase() }), // Ensure sound is passed correctly
    });
  
    const data = await response.json();
    setLoading(false);
  
    if (data.story) {
      setStory(data.story); // Display the AI-generated story
    } else {
      setStory(data.error || 'Sorry, we couldn’t generate a story this time.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Phonics Story Generator</h1>

      <TextField
        label="Enter sounds (comma separated)"
        variant="outlined"
        className="mb-4"
        value={sound}
        onChange={handleInputChange}
      />

      <Button
        variant="contained"
        color="primary"
        className="mb-8"
        onClick={generateStory}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Story'}
      </Button>

      {story && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg">{story}</p>
        </div>
      )}
    </div>
  );
}