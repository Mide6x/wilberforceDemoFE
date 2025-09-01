'use client';

import Link from 'next/link';

export default function Home() {

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Sermon <span className="gradient-text bg-white bg-clip-text text-transparent">Transcription</span>
          </h1>
          <p className="text-xl text-white/90 leading-relaxed max-w-md mx-auto">
            Real-time sermon transcription and translation for global ministry
          </p>
        </div>

        <div className="card rounded-2xl p-10 space-y-8 backdrop-blur-sm bg-white/95">
          <div className="space-y-5">
            <Link
              href="/create"
              className="btn-primary w-full py-5 px-8 rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 group shadow-lg"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create a Room</span>
            </Link>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">or</span>
              </div>
            </div>

            <Link
              href="/join"
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold py-5 px-8 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 group border border-gray-200 hover:border-gray-300 hover:shadow-md"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Join a Room</span>
            </Link>
          </div>

          <div className="text-center border-t pt-6">
            <p className="text-gray-600 font-medium mb-2">How it works</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Preachers create rooms and share codes with listeners for real-time transcription in multiple languages
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-white/70 text-sm font-medium">
            Powered by OpenAI Whisper & Advanced Translation
          </p>
        </div>
      </div>
    </div>
  );
}
