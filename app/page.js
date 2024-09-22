"use client";

import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { Book, Sparkles, Sun, Moon, Save, Copy, RefreshCw } from "lucide-react";
import { useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import { ref, uploadString } from "firebase/storage";
import { storage } from "../lib/firebase";

const AnimatedButton = ({ children, onClick, disabled, className }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`group relative w-full sm:w-auto px-6 py-3 text-lg font-bold text-white rounded-full shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

export default function Home() {
  const [sound, setSound] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDarkMode);
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

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
      setStory(data.error || "Sorry, we couldn't generate a story this time.");
    }
  };

  const saveStory = async () => {
    if (!user || !story) return;

    try {
      const storyRef = ref(storage, `users/${user.id}/stories/${Date.now()}.txt`);
      await uploadString(storyRef, story);
      alert('Story saved successfully!');
    } catch (error) {
      console.error("Error saving story: ", error);
      alert('Failed to save the story. Please try again.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(story)
      .then(() => alert('Story copied to clipboard!'))
      .catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy story to clipboard');
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-purple-200 dark:from-indigo-900 dark:to-purple-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <AnimatedButton onClick={toggleDarkMode} className="bg-yellow-400 dark:bg-indigo-600 text-gray-900 dark:text-white">
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </AnimatedButton>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-10">
            <h1 className="text-4xl sm:text-5xl text-center font-extrabold mb-6 text-indigo-600 dark:text-indigo-400 animate-bounce">
              Phonics Story Generator
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-center text-gray-700 dark:text-gray-300">
              Enter phonics sounds and let's create a magical story together!
            </p>
            <div className="flex flex-col gap-4 mb-8">
              <input
                type="text"
                placeholder="Enter sounds (comma separated)"
                value={sound}
                onChange={handleInputChange}
                className="w-full px-4 py-2 text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <AnimatedButton onClick={generateStory} disabled={loading} className="bg-gradient-to-r from-indigo-500 to-purple-500">
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
          <SignedIn>
            {story && (
              <div className="w-full lg:w-1/2 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-10">
                <h2 className="text-3xl font-bold mb-4 flex items-center text-indigo-600 dark:text-indigo-400">
                  <Book className="mr-2" size={32} />
                  Your Magical Phonics Story
                </h2>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">{story}</p>
                <div className="flex flex-wrap gap-4">
                  <AnimatedButton onClick={saveStory} className="bg-green-500 hover:bg-green-600">
                    <Save className="mr-2" size={20} />
                    Save Story
                  </AnimatedButton>
                  <AnimatedButton onClick={copyToClipboard} className="bg-yellow-500 hover:bg-yellow-600">
                    <Copy className="mr-2" size={20} />
                    Copy to Clipboard
                  </AnimatedButton>
                  <AnimatedButton onClick={generateStory} className="bg-purple-500 hover:bg-purple-600">
                    <RefreshCw className="mr-2" size={20} />
                    Generate Another
                  </AnimatedButton>
                </div>
              </div>
            )}
          </SignedIn>
          <SignedOut>
            {story && (
              <div className="w-full lg:w-1/2 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-10">
                <h2 className="text-3xl font-bold mb-4 flex items-center text-indigo-600 dark:text-indigo-400">
                  <Book className="mr-2" size={32} />
                  Your Magical Phonics Story
                </h2>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">{story}</p>
                <p className="text-md text-gray-600 dark:text-gray-400">Sign in to save and manage your stories!</p>
              </div>
            )}
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
