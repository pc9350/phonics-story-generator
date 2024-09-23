"use client";

import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Trash2, RefreshCw, Copy, Folder } from 'lucide-react';

export default function MyStories() {
  const { user } = useUser();
  const [storyGroups, setStoryGroups] = useState({});
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    if (user) {
      fetchStories();
    }
  }, [user]);

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/getStories');
      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }
      const data = await response.json();
      groupStoriesBySound(data.stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      setStoryGroups({ error: [{ id: "error", story: "An error occurred while fetching your stories. Please try again later." }] });
    }
  };

  const groupStoriesBySound = (stories) => {
    const groups = stories.reduce((acc, story) => {
      if (story.sounds && story.sounds.length > 0) {
        story.sounds.forEach(sound => {
          if (!acc[sound]) {
            acc[sound] = [];
          }
          acc[sound].push(story);
        });
      } else {
        if (!acc['Uncategorized']) {
          acc['Uncategorized'] = [];
        }
        acc['Uncategorized'].push(story);
      }
      return acc;
    }, {});
    setStoryGroups(groups);
  };

  const deleteStory = async (storyId) => {
    try {
      const response = await fetch(`/api/deleteStory?id=${storyId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete story');
      }
      fetchStories(); // Refresh the stories after deletion
    } catch (error) {
      console.error("Error deleting story:", error);
      alert('Failed to delete the story. Please try again.');
    }
  };

  const regenerateStory = async (storyId) => {
    // Implement the regeneration logic here
    alert('Story regeneration feature coming soon!');
  };

  const copyToClipboard = (story) => {
    navigator.clipboard.writeText(story)
      .then(() => alert('Story copied to clipboard!'))
      .catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy story to clipboard');
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SignedIn>
        <h1 className="text-4xl font-bold mb-8 text-center text-indigo-600 dark:text-indigo-400">My Phonics Stories</h1>
        {!selectedGroup ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(storyGroups).map(([sound, stories]) => (
              <motion.div
                key={sound}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedGroup(sound)}
              >
                <Folder className="w-12 h-12 mb-2 text-indigo-500 dark:text-indigo-400" />
                <h2 className="text-lg font-semibold">{sound}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stories.length} stories</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <>
            <button
              onClick={() => setSelectedGroup(null)}
              className="mb-4 text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              ← Back to all sounds
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedGroup} Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {storyGroups[selectedGroup].map((story) => (
                <motion.div
                  key={story.id}
                  className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transform transition duration-500 hover:scale-105 flex flex-col h-full"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex-grow">
                      <p className="text-lg mb-4 text-gray-800 dark:text-gray-200 line-clamp-4">{story.story}</p>
                    </div>
                    <div className="mt-auto">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Created: {new Date(story.createdAt).toLocaleString()}</p>
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => deleteStory(story.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 transition duration-300"
                          aria-label="Delete story"
                        >
                          <Trash2 size={20} />
                        </button>
                        <button
                          onClick={() => regenerateStory(story.id)}
                          className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-600 transition duration-300"
                          aria-label="Regenerate story"
                        >
                          <RefreshCw size={20} />
                        </button>
                        <button
                          onClick={() => copyToClipboard(story.story)}
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600 transition duration-300"
                          aria-label="Copy story to clipboard"
                        >
                          <Copy size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </SignedIn>
      <SignedOut>
        <div className="text-center text-xl text-gray-700 dark:text-gray-300">Please sign in to view your stories.</div>
      </SignedOut>
    </div>
  );
}