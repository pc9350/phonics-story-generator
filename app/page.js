"use client";

import React, { useState } from "react";
import { TextField, CircularProgress } from "@mui/material";
import { Book, Sparkles } from "lucide-react";
import Spline from "@splinetool/react-spline";

const AnimatedButton = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="group relative w-full sm:w-auto px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-pink-400 to-orange-400 rounded-full shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {children}
  </button>
);

export default function Home() {
  const [sound, setSound] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setSound(e.target.value);
  };

  const generateStory = async () => {
    setLoading(true);
    const response = await fetch("/api/story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sound: sound.trim().toLowerCase() }),
    });

    const data = await response.json();
    setLoading(false);

    if (data.story) {
      setStory(data.story);
    } else {
      setStory(
        data.error || "Sorry, we couldn't generate a story this time."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-pink-100 to-yellow-100">
      <div className="max-w-6xl w-full bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-12 flex flex-col sm:flex-row">
        {/* Left Side - Text and Input */}
        <div className="w-full sm:w-1/2 mb-8 sm:mb-0">
          <h1 className="text-5xl text-center align-middle font-extrabold mb-4 text-pink-600 animate-float">
            Phonics Story Generator
          </h1>
          <p className="text-xl mb-8 text-gray-700">
            Enter phonics sounds and let's create a magical story together!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <TextField
              label="Enter sounds (comma separated)"
              variant="filled"
              fullWidth
              value={sound}
              onChange={handleInputChange}
              InputProps={{
                style: { backgroundColor: '#FFF', borderRadius: '8px' },
              }}
              InputLabelProps={{
                style: { color: '#FFA69E' },
              }}
            />
            <AnimatedButton onClick={generateStory} disabled={loading}>
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <>
                  <Sparkles className="mr-2" />
                  Generate Story
                </>
              )}
            </AnimatedButton>
          </div>
        </div>

        {/* Right Side - 3D Model */}
        <div className="w-full sm:w-1/2 flex items-center justify-center">
          <Spline scene="https://prod.spline.design/Erc4GSKNY3MSyfXi/scene.splinecode" />
        </div>
      </div>

      {story && (
        <div className="story-container p-8 rounded-2xl shadow-lg bg-white mt-8">
          <h2 className="text-3xl font-bold mb-4 flex items-center text-pink-600">
            <Book className="mr-2" size={32} />
            Your Magical Phonics Story
          </h2>
          <p className="text-lg leading-relaxed text-gray-700">{story}</p>
        </div>
      )}
    </div>
  );
}
