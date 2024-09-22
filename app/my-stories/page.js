"use client";

import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { ref, getDownloadURL, listAll, uploadString } from "firebase/storage";
import { storage } from "../../lib/firebase";
import { SignedIn, SignedOut } from '@clerk/nextjs';

export default function MyStories() {
  const { user } = useUser();
  const [stories, setStories] = useState([]);
  const [firebaseToken, setFirebaseToken] = useState(null);

  useEffect(() => {
    const getFirebaseToken = async () => {
      if (user) {
        try {
          const response = await fetch('/api/getFirebaseToken');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setFirebaseToken(data.firebaseToken);
        } catch (error) {
          console.error("Error getting Firebase token:", error);
        }
      }
    };

    getFirebaseToken();
  }, [user]);

  useEffect(() => {
    if (firebaseToken) {
      fetchStories();
    }
  }, [firebaseToken]);

  const fetchStories = async () => {
    if (!user || !firebaseToken) return;

    try {
      const storiesRef = ref(storage, `users/${user.id}/stories`);
      const storyFiles = await listAll(storiesRef);

      const storyPromises = storyFiles.items.map(async (item) => {
        const url = await getDownloadURL(item);
        const response = await fetch(url);
        const text = await response.text();
        return { id: item.name.split('.')[0], story: text };
      });

      const fetchedStories = await Promise.all(storyPromises);
      setStories(fetchedStories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      setStories([{ id: "error", story: "An error occurred while fetching your stories. Please try again later." }]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SignedIn>
        <h1 className="text-3xl font-bold mb-6">My Phonics Stories</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div key={story.id} className="bg-white shadow-md rounded-lg p-6">
              <p className="text-lg mb-4">{story.story}</p>
              <p className="text-sm text-gray-600">Story ID: {story.id}</p>
            </div>
          ))}
        </div>
      </SignedIn>
      <SignedOut>
        <div>Please sign in to view your stories.</div>
      </SignedOut>
    </div>
  );
}