'use client';

import { useState } from 'react';

interface RoomCodeDisplayProps {
  roomCode: string;
  className?: string;
}

export default function RoomCodeDisplay({ roomCode, className = '' }: RoomCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy room code:', err);
    }
  };

  return (
    <div className={`bg-blue-50 rounded-lg p-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Room Code
        </h3>
        <div className="bg-white rounded-lg border-2 border-blue-200 p-4 mb-4">
          <div className="text-3xl font-mono font-bold text-blue-600 tracking-wider">
            {roomCode}
          </div>
        </div>
        
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy Code</span>
            </>
          )}
        </button>
        
        <p className="text-sm text-gray-600 mt-3">
          Share this code with listeners so they can join your sermon
        </p>
      </div>
    </div>
  );
}