"use client";

import { useState, useEffect, useCallback } from 'react';
import { useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, RefreshCw, Copy, Folder, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';

const AnimatedTitle = ({ text }) => (
  <motion.h1 
    className="text-4xl font-bold mb-8 text-center text-indigo-600 dark:text-indigo-400"
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
  >
    {text.split('').map((char, index) => (
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
      >
        {char}
      </motion.span>
    ))}
  </motion.h1>
);

const StoryCard = ({ story, onDelete, onRegenerate, onCopy }) => (
  <motion.div
    className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transform transition duration-500 hover:scale-105 flex flex-col h-full relative"
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
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Created: {new Date(story.createdAt).toLocaleString()}
        </p>
        <div className="flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(story.id)}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 transition duration-300"
            aria-label="Delete story"
          >
            <Trash2 size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onRegenerate(story.id)}
            className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-600 transition duration-300"
            aria-label="Regenerate story"
          >
            <RefreshCw size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onCopy(story.story)}
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600 transition duration-300"
            aria-label="Copy story to clipboard"
          >
            <Copy size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function MyStories() {
  const { user } = useUser();
  const [storyGroups, setStoryGroups] = useState({});
  const [selectedGroup, setSelectedGroup] = useState(null);

  const fetchStories = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    if (user) {
      fetchStories();
    }
  }, [fetchStories, user]);

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
      const data = await response.json();
      console.log('Story deleted successfully!', data);
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
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900">
      <Navbar isLanding={false} />
      <div className="container mx-auto px-4 py-8">
        <SignedIn>
          <AnimatedTitle text="My Phonics Stories" />
          {!selectedGroup ? (
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
            >
              {Object.entries(storyGroups).map(([sound, stories]) => (
                <motion.div
                  key={sound}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedGroup(sound)}
                >
                  <Folder className="w-12 h-12 mb-2 text-indigo-500 dark:text-indigo-400" />
                  <h2 className="text-lg font-semibold">{sound}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stories.length} stories</p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedGroup(null)}
                  className="mb-4 text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
                >
                  <BookOpen className="mr-2" /> Back to all sounds
                </motion.button>
                <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">{selectedGroup} Stories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {storyGroups[selectedGroup].map((story) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      onDelete={deleteStory}
                      onRegenerate={regenerateStory}
                      onCopy={copyToClipboard}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </SignedIn>
        <SignedOut>
          <div className="text-center text-xl text-gray-700 dark:text-gray-300">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Please sign in to view your stories.
            </motion.div>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}