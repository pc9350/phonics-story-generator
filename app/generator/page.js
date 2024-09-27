"use client";

import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { Book, Sparkles, Save, Copy, RefreshCw } from "lucide-react";
import { useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import Navbar from "../components/Navbar";

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

const PhonicsMatchingGame = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const phonicsPairs = [
    { sound: "sh", word: "🐚 shell" },
    { sound: "ch", word: "🪑 chair" },
    { sound: "th", word: "👍 thumb" },
    { sound: "wh", word: "🐳 whale" },
  ];

  useEffect(() => {
    const shuffledCards = [...phonicsPairs, ...phonicsPairs]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, id: index }));
    setCards(shuffledCards);
  }, []);

  useEffect(() => {
    if (flipped.length === 2) {
      setDisabled(true);
      const [first, second] = flipped;
      if (cards[first].sound === cards[second].sound) {
        setSolved((prev) => [...prev, cards[first].sound]);
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  }, [flipped, cards]);

  const handleClick = (index) => {
    if (
      disabled ||
      flipped.includes(index) ||
      solved.includes(cards[index].sound)
    )
      return;
    setFlipped((prev) => [...prev, index]);
  };

  return (
    <div className="bg-purple-100 dark:bg-purple-900 rounded-3xl shadow-lg p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold mb-4 text-purple-800 dark:text-purple-200">
        Phonics Matching Game
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`h-16 sm:h-20 flex items-center justify-center rounded-lg cursor-pointer text-xl sm:text-2xl font-bold transition-all duration-300 ${
              flipped.includes(index) || solved.includes(card.sound)
                ? "bg-green-300 dark:bg-green-700"
                : "bg-purple-300 dark:bg-purple-700"
            }`}
            onClick={() => handleClick(index)}
          >
            {flipped.includes(index) || solved.includes(card.sound)
              ? card.sound || card.word
              : "?"}
          </div>
        ))}
      </div>
    </div>
  );
};

// New game: Word Scramble
const WordScrambleGame = () => {
  const [word, setWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [userGuess, setUserGuess] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const words = ["cat", "dog", "fish", "bird", "frog"];
    const selectedWord = words[Math.floor(Math.random() * words.length)];
    setWord(selectedWord);
    setScrambledWord(scrambleWord(selectedWord));
  }, []);

  const scrambleWord = (w) => {
    return w.split('').sort(() => Math.random() - 0.5).join('');
  };

  const handleGuess = () => {
    if (userGuess.toLowerCase() === word) {
      setMessage("Correct! Well done!");
    } else {
      setMessage("Try again!");
    }
  };

  return (
    <div className="bg-yellow-100 dark:bg-yellow-900 rounded-3xl shadow-lg p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold mb-4 text-yellow-800 dark:text-yellow-200">
        Word Scramble
      </h3>
      <p className="mb-4">Unscramble this word: <strong>{scrambledWord}</strong></p>
      <input
        type="text"
        value={userGuess}
        onChange={(e) => setUserGuess(e.target.value)}
        className="w-full px-3 py-2 mb-4 rounded-lg"
      />
      <button
        onClick={handleGuess}
        className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
      >
        Guess
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

// New game: Rhyming Words
const RhymingWordsGame = () => {
  const [word, setWord] = useState("");
  const [userGuess, setUserGuess] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const words = ["cat", "dog", "hat", "log", "mat"];
    setWord(words[Math.floor(Math.random() * words.length)]);
  }, []);

  const handleGuess = () => {
    const rhymes = {
      cat: ["bat", "hat", "mat", "rat"],
      dog: ["fog", "log", "bog", "cog"],
      hat: ["cat", "bat", "mat", "rat"],
      log: ["dog", "fog", "bog", "cog"],
      mat: ["cat", "hat", "bat", "rat"],
    };

    if (rhymes[word].includes(userGuess.toLowerCase())) {
      setMessage("Great job! That rhymes!");
    } else {
      setMessage("Try again! Find a word that rhymes.");
    }
  };

  return (
    <div className="bg-green-100 dark:bg-green-900 rounded-3xl shadow-lg p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold mb-4 text-green-800 dark:text-green-200">
        Rhyming Words
      </h3>
      <p className="mb-4">Find a word that rhymes with: <strong>{word}</strong></p>
      <input
        type="text"
        value={userGuess}
        onChange={(e) => setUserGuess(e.target.value)}
        className="w-full px-3 py-2 mb-4 rounded-lg"
      />
      <button
        onClick={handleGuess}
        className="bg-green-500 text-white px-4 py-2 rounded-lg"
      >
        Check
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

// New game: Letter Sound Match
const LetterSoundMatchGame = () => {
  const [letter, setLetter] = useState("");
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const letters = ["A", "B", "C", "D", "E"];
    const selectedLetter = letters[Math.floor(Math.random() * letters.length)];
    setLetter(selectedLetter);
    setOptions(generateOptions(selectedLetter));
  }, []);

  const generateOptions = (l) => {
    const sounds = {
      A: "apple", B: "ball", C: "cat", D: "dog", E: "elephant"
    };
    const correctSound = sounds[l];
    const allSounds = Object.values(sounds);
    const wrongSounds = allSounds.filter(sound => sound !== correctSound);
    const selectedWrongSounds = wrongSounds.sort(() => 0.5 - Math.random()).slice(0, 2);
    return [correctSound, ...selectedWrongSounds].sort(() => 0.5 - Math.random());
  };

  const handleGuess = (guess) => {
    const sounds = {
      A: "apple", B: "ball", C: "cat", D: "dog", E: "elephant"
    };
    if (guess === sounds[letter]) {
      setMessage("Correct! Well done!");
    } else {
      setMessage("Try again!");
    }
  };

  return (
    <div className="bg-blue-100 dark:bg-blue-900 rounded-3xl shadow-lg p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold mb-4 text-blue-800 dark:text-blue-200">
        Letter Sound Match
      </h3>
      <p className="mb-4">What sound does the letter <strong>{letter}</strong> make?</p>
      <div className="grid grid-cols-1 gap-2">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleGuess(option)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            {option}
          </button>
        ))}
      </div>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

// Function to select the daily game
const selectDailyGame = () => {
  const games = [PhonicsMatchingGame, WordScrambleGame, RhymingWordsGame, LetterSoundMatchGame];
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return games[(dayOfYear % games.length)];
};

// Add this new array of words with emojis
const wordsOfTheDay = [
  { word: "Cat", emoji: "🐱" },
  { word: "Dog", emoji: "🐶" },
  { word: "Sun", emoji: "☀️" },
  { word: "Moon", emoji: "🌙" },
  { word: "Star", emoji: "⭐" },
  { word: "Fish", emoji: "🐠" },
  { word: "Bird", emoji: "🐦" },
  { word: "Tree", emoji: "🌳" },
  { word: "Book", emoji: "📚" },
  { word: "Ball", emoji: "🏀" },
  { word: "Hat", emoji: "🧢" },
  { word: "Car", emoji: "🚗" },
  { word: "Boat", emoji: "⛵" },
  { word: "Frog", emoji: "🐸" },
  { word: "Cake", emoji: "🍰" }
];

export default function Generator() {
  const [soundInput, setSoundInput] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [currentWord, setCurrentWord] = useState({ word: "", emoji: "" });

  const handleInputChange = (e) => {
    setSoundInput(e.target.value);
  };

  const generateStory = async () => {
    const sounds = soundInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (sounds.length === 0) {
      alert("Please enter at least one sound.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sounds }),
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
    } catch (error) {
      setLoading(false);
      console.error("Error generating story:", error);
      setStory(
        "An error occurred while generating the story. Please try again."
      );
    }
  };

  const saveStory = async () => {
    const sounds = soundInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!user || !story || sounds.length === 0) {
      console.error("Missing user, story, or sounds");
      return;
    }

    try {
      const response = await fetch("/api/saveStory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ story, sounds }),
      });

      if (!response.ok) {
        throw new Error("Failed to save story");
      }

      const data = await response.json();
      console.log("Story saved successfully!", data);
      alert("Story saved successfully!");
    } catch (error) {
      console.error("Error saving story: ", error);
      alert("Failed to save the story. Please try again.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(story)
      .then(() => alert("Story copied to clipboard!"))
      .catch((err) => {
        console.error("Failed to copy: ", err);
        alert("Failed to copy story to clipboard");
      });
  };

  const DailyGame = selectDailyGame();

  useEffect(() => {
    const wordIndex = Math.floor((Date.now() / 86400000) % wordsOfTheDay.length);
    setCurrentWord(wordsOfTheDay[wordIndex]);

    const intervalId = setInterval(() => {
      const newIndex = Math.floor((Date.now() / 86400000) % wordsOfTheDay.length);
      setCurrentWord(wordsOfTheDay[newIndex]);
    }, 86400000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 transition-colors duration-300">
      <Navbar isLanding={true} />
      <div className="container mx-auto px-4 py-8">
        {/* Bouncing characters */}
        <div className="flex justify-around mb-8">
          <BouncingCharacter character="🐸" color="text-green-500" delay={0} />
          <BouncingCharacter
            character="🦉"
            color="text-brown-500"
            delay={0.2}
          />
          <BouncingCharacter
            character="🐝"
            color="text-yellow-500"
            delay={0.4}
          />
          <BouncingCharacter character="🦋" color="text-blue-500" delay={0.6} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Left column: Generator card and Daily Game */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 sm:mb-6 text-center text-indigo-600 dark:text-indigo-400">
                Phonics Story Generator
              </h1>
              <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-center text-gray-700 dark:text-gray-300">
                Enter phonics sounds and let&apos;s create a magical story together!
              </p>
              <div className="flex flex-col gap-4 mb-4 sm:mb-6">
                <input
                  type="text"
                  placeholder="Enter sounds (comma separated)"
                  value={soundInput}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-base sm:text-lg text-gray-700 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <AnimatedButton
                  onClick={generateStory}
                  disabled={loading}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500"
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <div className="flex items-center justify-center">
                      <Sparkles className="mr-2 w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="text-lg sm:text-xl">Generate Story</span>
                    </div>
                  )}
                </AnimatedButton>
              </div>
            </div>
            <DailyGame />
          </div>

          {/* Right column: Generated story and decorative elements */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <SignedIn>
              {story && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Book className="mr-2 w-7 h-7 sm:w-8 sm:h-8" />
                    <p>Your Magical Phonics Story</p>
                  </h2>
                  <p className="text-2xl md:text-2xl leading-relaxed text-gray-700 dark:text-gray-300 mb-6 sm:mb-8">
                    {story}
                  </p>
                  <div className="flex flex-col gap-3">
                    <AnimatedButton
                      onClick={saveStory}
                      className="flex items-center justify-center bg-green-500 hover:bg-green-600"
                    >
                      <Save className="mr-2 w-5 h-5" />
                      <p className="text-lg">Save Story</p>
                    </AnimatedButton>
                    <AnimatedButton
                      onClick={copyToClipboard}
                      className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-600"
                    >
                      <Copy className="mr-2 w-5 h-5" />
                      Copy to Clipboard
                    </AnimatedButton>
                    <AnimatedButton
                      onClick={generateStory}
                      className="flex items-center justify-center bg-purple-500 hover:bg-purple-600"
                    >
                      <RefreshCw className="mr-2 w-5 h-5" />
                      Generate Another
                    </AnimatedButton>
                  </div>
                </div>
              )}
            </SignedIn>
            <SignedOut>
              {story && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Book className="mr-2 w-7 h-7 sm:w-8 sm:h-8" />
                    Your Magical Phonics Story
                  </h2>
                  <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6 sm:mb-8">
                    {story}
                  </p>
                  <p className="text-base text-gray-600 dark:text-gray-400 text-center">
                    Sign in to save and manage your stories!
                  </p>
                </div>
              )}
            </SignedOut>

            {/* Decorative elements */}
            <div className="flex flex-col gap-6">
              <div className="bg-yellow-100 dark:bg-yellow-900 rounded-3xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-3 text-yellow-800 dark:text-yellow-200">
                  Fun Phonics Facts!
                </h3>
                <ul className="list-disc list-inside text-base text-yellow-700 dark:text-yellow-300">
                  <li>Phonics helps us learn to read and spell!</li>
                  <li>There are 44 phonemes in the English language.</li>
                  <li>Blending sounds helps us read words smoothly.</li>
                </ul>
              </div>

              <div className="bg-green-100 dark:bg-green-900 rounded-3xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-3 text-green-800 dark:text-green-200">
                  Reading Tips
                </h3>
                <ul className="list-disc list-inside text-base text-green-700 dark:text-green-300">
                  <li>Read aloud to practice pronunciation.</li>
                  <li>Try to read a little bit every day!</li>
                  <li>Don't be afraid to ask for help with tricky words.</li>
                </ul>
              </div>

              {/* Updated Word of the Day section */}
              <div className="bg-blue-100 dark:bg-blue-900 rounded-3xl shadow-lg p-6 overflow-hidden">
                <h3 className="text-xl font-bold mb-3 text-blue-800 dark:text-blue-200">
                  Word of the Day
                </h3>
                <div className="flex items-center">
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-300 mr-4 animate-pulse">
                    {currentWord.word}
                  </p>
                  <div className="text-5xl animate-wiggle">{currentWord.emoji}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
