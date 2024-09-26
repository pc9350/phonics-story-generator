"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Users, Zap } from "lucide-react";
import Navbar from "./components/Navbar";
import { useUser, SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Spline from "@splinetool/react-spline";

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl p-6 border border-white border-opacity-20">
    <div className="flex items-center justify-center w-12 h-12 bg-indigo-500 bg-opacity-30 text-indigo-300 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
    <p className="text-indigo-200">{description}</p>
  </div>
);

export default function Home() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [splineLoaded, setSplineLoaded] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      router.push("/generator");
    }
  }, [isSignedIn, router]);

  if (isSignedIn) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <Navbar isLanding={false} />
      <main className="relative overflow-hidden">
        {/* Hero Section */}
        <div className="relative text-white">
          <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-filter backdrop-blur-sm"></div>
          <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 p-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400 transform " style={{ textShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.3), 0 0 60px rgba(255,255,255,0.2)' }}>
                  Unlock the Magic of Reading
                </h1>
                <p className="text-xl max-w-3xl mb-6 text-indigo-200" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  Generate engaging phonics stories tailored to your child's
                  learning needs. Make reading fun and interactive!
                </p>
                <SignUpButton mode="modal">
                  <button className="inline-flex items-center px-6 py-4 border-2 border-indigo-400 text-lg font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 transform hover:scale-105">
                    Get Started
                  </button>
                </SignUpButton>
              </div>
              <div className="lg:w-1/2 w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative">
                {!splineLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-400"></div>
                  </div>
                )}
                <Spline
                  scene="https://prod.spline.design/gyUMMuv8-kVVYKyK/scene.splinecode"
                  onLoad={() => setSplineLoaded(true)}
                  className={`w-full h-full ${splineLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-extrabold text-center justify-center items-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400" style={{ textShadow: '0 0 10px rgba(255,255,255,0.3), 0 0 20px rgba(255,255,255,0.2)' }}>
            Features that Empower Learning
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Sparkles className="w-6 h-6 " />}
              title="Custom Stories"
              description="Generate unique stories based on specific phonics sounds your child is learning."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Instant Generation"
              description="Create new stories in seconds, keeping your child engaged and excited to read."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Progress Tracking"
              description="Monitor your child's reading progress and see which phonics sounds they've mastered."
            />
          </div>
        </div>
      </main>

      <footer className="bg-black bg-opacity-50 text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-indigo-200">
            &copy; 2024 Phonicsjoy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
