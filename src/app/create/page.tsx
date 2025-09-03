'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, ApiError } from '@/lib/api';

export default function CreateRoom() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateRoom = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.createRoom();
      // Redirect to the room page with the generated code
      router.push(`/room/${response.roomCode}?role=preacher`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to create room. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-white/90 hover:text-white mb-6 font-medium transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Create a <span className="gradient-text bg-white bg-clip-text text-transparent">Room</span>
          </h1>
          <p className="text-xl text-white/90 leading-relaxed">
            Start a new sermon transcription session
          </p>
        </div>

        <div className="card rounded-2xl p-10 space-y-8 backdrop-blur-sm bg-white/95">
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Ready to Begin?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Generate a unique room code that listeners can use to join your sermon and receive real-time transcription.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleCreateRoom}
              disabled={isLoading}
              className="btn-primary w-full py-5 px-8 rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed border border-[#2d2c2a]"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Room...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="#2d2c2a" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-[#2d2c2a]">Create Room</span>
                </>
              )}
            </button>
          </div>

          <div className="border-t pt-8">
            <div className="text-center space-y-4">
              <p className="font-semibold text-gray-900 text-lg">What happens next?</p>
              <div className="grid gap-4 max-w-md mx-auto">
                <div className="flex items-center text-left">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-semibold text-sm mr-4 flex-shrink-0">
                    1
                  </div>
                  <span className="text-gray-700 font-medium">A unique room code will be generated</span>
                </div>
                <div className="flex items-center text-left">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-semibold text-sm mr-4 flex-shrink-0">
                    2
                  </div>
                  <span className="text-gray-700 font-medium">Share the code with your listeners</span>
                </div>
                <div className="flex items-center text-left">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-semibold text-sm mr-4 flex-shrink-0">
                    3
                  </div>
                  <span className="text-gray-700 font-medium">Start speaking to begin transcription</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}