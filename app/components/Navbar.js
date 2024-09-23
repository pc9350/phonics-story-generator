"use client";

import Link from 'next/link';
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <nav className="bg-indigo-600 dark:bg-indigo-900 p-4 transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          Phonicsville
        </Link>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="text-white hover:text-yellow-300 transition-colors duration-300"
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <SignedIn>
            <Link href="/my-stories" className="text-white hover:text-indigo-200">
              My Stories
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors duration-300">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;