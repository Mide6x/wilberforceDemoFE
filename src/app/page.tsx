'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SplashScreen from '../components/SplashScreen';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen wilberforce-gradient flex items-center justify-center px-4 py-6 sm:p-4">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 tracking-tight leading-tight">
            Wilberforce Academy
          </h1>
          <p className="text-base sm:text-lg text-gray-600 font-medium">
            Creative Night
          </p>
          <div className="h-1 w-12 bg-gradient-to-r from-green-400 to-blue-500 mx-auto rounded-full"></div>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed px-2">
            Real-time sermon transcription and translation for global ministry
          </p>
        </div>

        {/* Main Card */}
        <div className="wilberforce-card rounded-2xl p-6 sm:p-8 space-y-6 sm:space-y-8">
          <div className="space-y-4 sm:space-y-5">
            <Link
              href="/create"
              className="wilberforce-btn-primary w-full py-4 sm:py-5 px-6 sm:px-8 rounded-xl font-semibold text-base sm:text-lg flex items-center justify-center space-x-3 group shadow-lg touch-manipulation"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create a Room</span>
            </Link>

            <div className="relative py-3 sm:py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 sm:px-4 bg-white text-gray-500 font-medium">or</span>
              </div>
            </div>

            <Link
              href="/join"
              className="w-full bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-800 font-semibold py-4 sm:py-5 px-6 sm:px-8 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 group border border-gray-200 hover:border-gray-300 hover:shadow-md touch-manipulation"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Join a Room</span>
            </Link>
          </div>

          <div className="text-center border-t pt-5 sm:pt-6">
            <p className="text-gray-600 font-medium mb-2 text-sm sm:text-base">How it works</p>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed px-2">
              Preachers create rooms and share codes with listeners for real-time transcription in multiple languages
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-500 text-xs sm:text-sm font-medium">
            Powered by OpenAI Whisper & Advanced Translation
          </p>
        </div>
      </div>
    </div>
  );
}
