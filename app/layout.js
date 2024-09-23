"use client";

import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from './components/Navbar'
import { DarkModeProvider } from './context/DarkModeContext'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <DarkModeProvider>
        <html lang="en">
          <body className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Navbar />
            {children}
          </body>
        </html>
      </DarkModeProvider>
    </ClerkProvider>
  )
}