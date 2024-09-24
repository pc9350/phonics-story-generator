"use client";

import Link from 'next/link';
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Sun, Moon, BookOpen, Menu, X } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ isLanding = false }) => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const bgColor = isLanding
    ? "bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-800 dark:to-purple-900"
    : "bg-gradient-to-r from-blue-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900";

  const textColor = isLanding
    ? "text-white"
    : "text-indigo-600 dark:text-white";

  return (
    <nav className={`${bgColor} p-4 transition-all duration-300 shadow-lg`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className={`${textColor} text-2xl font-bold flex items-center`}>
          <BookOpen className="mr-2" size={32} />
          <span>Phonicsville</span>
        </Link>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className={`${textColor} hover:text-yellow-300 transition-all duration-300`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <div className="hidden md:flex items-center space-x-4">
            <NavItems textColor={textColor} isLanding={isLanding} />
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden ${textColor} hover:text-yellow-300`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4"
          >
            <NavItems textColor={textColor} isLanding={isLanding} isMobile={true} closeMenu={() => setIsMenuOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavItems = ({ textColor, isLanding, isMobile = false, closeMenu = () => {} }) => (
  <div className={`flex flex-col items-center space-y-4 ${isMobile ? 'py-4' : ''}`}>
    <SignedIn>
      <Link 
        href="/my-stories" 
        className={`${textColor} hover:text-yellow-300 transition-colors duration-300 font-semibold text-center`}
        onClick={closeMenu}
      >
        My Stories
      </Link>
      <div>
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "hover:ring-4 hover:ring-yellow-300 transition-all duration-300"
            }
          }}
        />
      </div>
    </SignedIn>
    <SignedOut>
      <SignInButton mode="modal">
        <button 
          className={`${isLanding ? "bg-white text-indigo-600" : "bg-indigo-600 text-white"} 
            px-4 py-2 rounded-full hover:bg-yellow-300 hover:text-indigo-600 
            transition-all duration-300 font-semibold text-center`}
          onClick={closeMenu}
        >
          Sign In
        </button>
      </SignInButton>
    </SignedOut>
  </div>
);

export default Navbar;