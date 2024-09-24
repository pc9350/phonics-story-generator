"use client";

import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import { Book, Sparkles, Save, Copy, RefreshCw } from "lucide-react";
import { useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import Navbar from '../components/Navbar';

const AnimatedButton = ({ children, onClick, disabled, className }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`group relative w-full px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-bold text-white rounded-full shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

const BouncingCharacter = ({ character, color, delay }) => (
  <div 
    className={`text-4xl sm:text-5xl md:text-6xl animate-bounce ${color}`}
    style={{ animationDelay: `${delay}s` }}
  >
    {character}
  </div>
);

export default function Generator() {
  const [soundInput, setSoundInput] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const handleInputChange = (e) => {
    setSoundInput(e.target.value);
  };

  const generateStory = async () => {
    // ... (generateStory function remains unchanged)
  };

  const saveStory = async () => {
    // ... (saveStory function remains unchanged)
  };

  const copyToClipboard = () => {
    // ... (copyToClipboard function remains unchanged)
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 transition-colors duration-300">
      <Navbar isLanding={true} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-10 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-center font-extrabold mb-4 sm:mb-6 text-indigo-600 dark:text-indigo-400 animate-bounce">
              Phonics Story Generator
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-center text-gray-700 dark:text-gray-300">
              Unlock the magic of reading! Enter phonics sounds and let&apos;s create a magical story together!
            </p>
            <div className="flex flex-col gap-4 mb-6 sm:mb-8 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Enter sounds (comma separated)"
                value={soundInput}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <AnimatedButton onClick={generateStory} disabled={loading} className="bg-gradient-to-r from-indigo-500 to-purple-500">
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <div className="flex items-center justify-center">
                    <Sparkles className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Generate Story</span>
                  </div>
                )}
              </AnimatedButton>
            </div>
          </div>
          <SignedIn>
            {story && (
              <div className="w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-10">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 flex items-center text-indigo-600 dark:text-indigo-400">
                  <Book className="mr-2 w-7 h-7 sm:w-10 sm:h-10" />
                  <p className="text-xl sm:text-2xl font-bold">Your Magical Phonics Story</p>
                </h2>
                <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4 sm:mb-6">{story}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <AnimatedButton onClick={saveStory} className="flex items-center justify-center bg-green-500 hover:bg-green-600">
                    <Save className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                    Save Story
                  </AnimatedButton>
                  <AnimatedButton onClick={copyToClipboard} className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-600">
                    <Copy className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                    Copy to Clipboard
                  </AnimatedButton>
                  <AnimatedButton onClick={generateStory} className="flex items-center justify-center bg-purple-500 hover:bg-purple-600">
                    <RefreshCw className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                    Generate Another
                  </AnimatedButton>
                </div>
              </div>
            )}
          </SignedIn>
          <SignedOut>
            {story && (
              <div className="w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-10">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 flex items-center text-indigo-600 dark:text-indigo-400">
                  <Book className="mr-2 w-7 h-7 sm:w-8 sm:h-8" />
                  Your Magical Phonics Story
                </h2>
                <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4 sm:mb-6">{story}</p>
                <p className="text-sm sm:text-md text-gray-600 dark:text-gray-400">Sign in to save and manage your stories!</p>
              </div>
            )}
          </SignedOut>
        </div>
      </div>
    </div>
  );
}