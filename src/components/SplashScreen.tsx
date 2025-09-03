'use client';

import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const duration = 10000; // 10 seconds
    const interval = 50; // Update every 50ms
    const increment = (interval / duration) * 100;

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(progressTimer);
          // Start fade out animation
          setFadeOut(true);
          // Complete after fade animation
          setTimeout(onComplete, 500);
          return 100;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(progressTimer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
      fadeOut ? 'opacity-0' : 'opacity-100'
    }`} style={{
      background: 'linear-gradient(135deg, #fbf3e3 0%, #f5ede0 50%, #f0e8dc 100%)'
    }}>
      <div className="text-center px-4 max-w-sm mx-auto">

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight" style={{color: '#2d2c2a'}}>
            Wilberforce Academy
          </h1>
          <p className="text-lg sm:text-xl font-medium" style={{color: '#2d2c2a'}}>
            Creative Night
          </p>
          <div className="mt-4 h-1 w-16 mx-auto rounded-full" style={{background: 'linear-gradient(135deg, #f98355 0%, #9ca4c3 100%)'}}></div>
        </div>

        {/* Subtitle */}
        <p className="text-sm sm:text-base mb-8 leading-relaxed" style={{color: '#2d2c2a'}}>
          Called by Christ to go into all culture.
        </p>

        {/* Progress Bar */}
        <div className="w-full max-w-xs mx-auto">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-100 ease-out"
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(135deg, #f98355 0%, #9ca4c3 100%)'
              }}
            ></div>
          </div>
          <p className="text-xs mt-2 font-medium" style={{color: '#2d2c2a'}}>
            Loading... {Math.round(progress)}%
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex justify-center space-x-1 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor: '#8f5e49',
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}