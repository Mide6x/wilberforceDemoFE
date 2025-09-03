'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../types';
import SearchableDropdown from '../../components/SearchableDropdown';

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Redirect to the room page with the entered code and selected language
      router.push(`/room/${roomCode.toUpperCase()}?role=listener&language=${selectedLanguage}`);
    } catch {
      setError('Failed to join room. Please check the room code and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen wilberforce-gradient flex items-center justify-center px-4 py-6 sm:p-4">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="wilberforce-card rounded-2xl p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <Link href="/" className="inline-block mb-4 p-2 rounded-full hover:bg-gray-100 transition-colors touch-manipulation">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 rounded-full flex items-center justify-center shadow-lg" style={{background: 'linear-gradient(135deg, #f98355 0%, #9ca4c3 100%)'}}>
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mb-2" style={{color: '#ffffff'}}>
              Join a Room
            </h1>
            <p className="text-sm sm:text-base px-2" style={{color: '#ffffff'}}>
              Enter the room code to listen to the sermon
            </p>
          </div>
          <form onSubmit={handleJoinRoom} className="space-y-5 sm:space-y-6">
              <div>
                <label htmlFor="roomCode" className="block text-sm font-medium mb-2" style={{color: '#ffffff'}}>
                  Room Code
                </label>
                <input
                  type="text"
                  id="roomCode"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-4 py-3 sm:py-4 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors touch-manipulation"
                  placeholder="Enter room code"
                  required
                  maxLength={8}
                  autoComplete="off"
                  autoCapitalize="characters"
                />
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium mb-2" style={{color: '#ffffff'}}>
                  Preferred Language
                </label>
                <SearchableDropdown
                  options={Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => ({
                    value: code,
                    label: name
                  }))}
                  value={selectedLanguage}
                  onChange={(value) => setSelectedLanguage(value as SupportedLanguage)}
                  placeholder="Search and select your language..."
                  className="w-full"
                />
                <p className="text-xs mt-2 px-1" style={{color: '#ffffff'}}>
                  The sermon will be translated to your selected language
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-800 text-sm leading-relaxed">{error}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !roomCode.trim()}
                className="wilberforce-btn-primary w-full py-4 sm:py-4 px-4 rounded-lg font-semibold text-base flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Joining...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Join Room</span>
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-6 pt-5 border-t">
              <div className="text-center text-xs sm:text-sm" style={{color: '#ffffff'}}>
                <p className="font-medium mb-2">Need help?</p>
                <ul className="text-xs space-y-1 px-2">
                  <li>• Ask the preacher for the room code</li>
                  <li>• Room codes are usually 8 characters long</li>
                  <li>• Make sure you&apos;re connected to the internet</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}