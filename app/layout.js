

import './globals.css'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { DarkModeProvider } from './context/DarkModeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Phonics Story Generator',
  description: 'Generate engaging phonics stories for children',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <DarkModeProvider>
          <body className={inter.className}>{children}</body>
        </DarkModeProvider>
      </html>
    </ClerkProvider>
  )
}