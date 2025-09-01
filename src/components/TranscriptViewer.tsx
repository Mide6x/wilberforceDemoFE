'use client';

import { useEffect, useRef } from 'react';
import { Transcript, SUPPORTED_LANGUAGES, SupportedLanguage } from '../types';

interface TranscriptViewerProps {
  transcripts: Transcript[];
  language?: SupportedLanguage;
  role: 'preacher' | 'listener';
  className?: string;
}

export default function TranscriptViewer({ 
  transcripts, 
  language = 'en', 
  role, 
  className = '' 
}: TranscriptViewerProps) {
  const transcriptsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new transcripts arrive
  useEffect(() => {
    transcriptsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  const getDisplayText = (transcript: Transcript) => {
    if (role === 'listener' && transcript.translated_text) {
      return transcript.translated_text;
    }
    return transcript.original_text;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Live Transcript
          </h2>
          {role === 'listener' && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span>Translated to {SUPPORTED_LANGUAGES[language]}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="h-96 overflow-y-auto">
        {transcripts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <p className="text-lg font-medium mb-2">Waiting for transcription...</p>
            <p className="text-sm text-center max-w-xs">
              {role === 'preacher' 
                ? 'Click "Start Recording" to begin transcribing your sermon'
                : 'The preacher will start speaking soon'}
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {transcripts.map((transcript) => (
              <div 
                key={transcript.id} 
                className="group hover:bg-gray-50 rounded-lg p-3 transition-colors duration-150"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 leading-relaxed text-base">
                      {getDisplayText(transcript)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">
                        {formatTime(transcript.created_at)}
                      </p>
                      {role === 'listener' && transcript.translated_text && (
                        <div className="flex items-center space-x-1 text-xs text-blue-600">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                          </svg>
                          <span>Translated</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Show original text for listeners if translation exists */}
                {role === 'listener' && transcript.translated_text && (
                  <div className="mt-3 ml-5 p-3 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-700 italic">
                      Original: {transcript.original_text}
                    </p>
                  </div>
                )}
              </div>
            ))}
            <div ref={transcriptsEndRef} />
          </div>
        )}
      </div>
      
      {/* Status bar */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
          <span>{transcripts.length} transcript{transcripts.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
}