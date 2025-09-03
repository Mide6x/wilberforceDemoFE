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
      
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight" style={{color: '#2d2c2a'}}>
            Wilberforce Academy
          </h1>
          <p className="text-base sm:text-lg font-medium" style={{color: '#2d2c2a'}}>
            Creative Night
          </p>
          <div className="h-1 w-12 mx-auto rounded-full" style={{background: 'linear-gradient(135deg, #f98355 0%, #9ca4c3 100%)'}}></div>
          <p className="text-sm sm:text-base leading-relaxed px-2" style={{color: '#2d2c2a'}}>
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
              className="w-full bg-gray-50 hover:bg-gray-100 active:bg-gray-200 font-semibold py-4 sm:py-5 px-6 sm:px-8 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 group border border-gray-200 hover:border-gray-300 hover:shadow-md touch-manipulation"
              style={{color: '#2d2c2a'}}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Join a Room</span>
            </Link>
          </div>

          <div className="text-center border-t pt-5 sm:pt-6">
            <p className="font-medium mb-2 text-sm sm:text-base" style={{color: '#ffffff'}}>How it works</p>
            <p className="text-xs sm:text-sm leading-relaxed px-2" style={{color: '#ffffff'}}>
              Preachers create rooms and share codes with listeners for real-time transcription in multiple languages
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs sm:text-sm font-medium" style={{color: '#2d2c2a'}}>
            Built with ❤️ by Olumide Adewole
          </p>
        </div>
      </div>
    </div>
  );
}
