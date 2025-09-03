'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';
import { Transcript, SUPPORTED_LANGUAGES, SupportedLanguage } from '../../../types';
import { api, ApiError } from '@/lib/api';
import jsPDF from 'jspdf';

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const roomCode = params.code as string;
  const role = searchParams.get('role') as 'preacher' | 'listener';
  const language = (searchParams.get('language') as SupportedLanguage) || 'en';
  
  const [socket, setSocket] = useState<Socket | null>(null);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomExists, setRoomExists] = useState<boolean | null>(null);
  const [roomEnded, setRoomEnded] = useState<boolean | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const transcriptsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new transcripts arrive
  const scrollToBottom = () => {
    transcriptsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [transcripts]);

  // Verify room exists
  useEffect(() => {
    const verifyRoom = async () => {
      try {
        await api.getRoomInfo(roomCode);
        setRoomExists(true);
      } catch (err) {
        setRoomExists(false);
        if (err instanceof ApiError && err.status === 404) {
          setError('Room not found. Please check the room code.');
        } else {
          setError('Failed to connect to room.');
        }
      }
    };

    if (roomCode) {
      verifyRoom();
    }
  }, [roomCode]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!roomExists) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://wilberforcedemobe.onrender.com';
    const newSocket = io(socketUrl);

    newSocket.on('connect', () => {
      setIsConnected(true);
      // Join the room
      newSocket.emit('join-room', { roomCode, language });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('room-joined', (data) => {
      if (!data.success) {
        setError(data.message || 'Failed to join room');
      }
    });

    newSocket.on('new-transcript', (transcript: Transcript) => {
      setTranscripts(prev => [...prev, transcript]);
    });

    newSocket.on('error', (data) => {
      setError(data.message);
    });

    newSocket.on('room-ended', () => {
      setRoomEnded(true);
      setIsRecording(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [roomCode, language, roomExists]);

  // Audio recording with fallback for iOS/Safari compatibility
  const startRecording = async () => {
    try {
      // Try Web Speech API first (Chrome/Edge)
      if (('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
          setIsRecording(true);
          if (socket) {
            socket.emit('start-transcription', { roomCode });
          }
        };
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          
          if (finalTranscript && socket) {
            socket.emit('transcript-text', { roomCode, text: finalTranscript });
          }
        };
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setError(`Speech recognition error: ${event.error}`);
        };
        
        recognition.onend = () => {
          setIsRecording(false);
        };
        
        mediaRecorderRef.current = recognition;
        recognition.start();
        return;
      }
      
      // Fallback to MediaRecorder for iOS/Safari and other browsers
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : MediaRecorder.isTypeSupported('audio/mp4') 
          ? 'audio/mp4' 
          : 'audio/webm'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && socket) {
          // Convert blob to array buffer and send to server
          event.data.arrayBuffer().then(buffer => {
            socket.emit('audio-chunk', { roomCode, audioData: buffer });
          });
        }
      };
      
      mediaRecorder.onstart = () => {
        setIsRecording(true);
        if (socket) {
          socket.emit('start-transcription', { roomCode });
        }
      };
      
      mediaRecorder.onstop = () => {
        setIsRecording(false);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start(1000); // Send chunks every second
      
    } catch (error) {
      console.error('Recording error:', error);
      setError('Failed to access microphone. Please check permissions and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    setIsRecording(false);
    
    if (socket) {
      socket.emit('stop-transcription', { roomCode });
    }
  };

  const endRoom = async () => {
    try {
      await api.endRoom(roomCode);
      if (socket) {
        socket.emit('room-ended', { roomCode });
      }
      setRoomEnded(true);
    } catch {
      setError('Failed to end room');
    }
  };

  const downloadTranscript = () => {
    const transcriptText = transcripts
      .map(t => {
        const text = role === 'listener' && t.translated_text ? t.translated_text : t.original_text;
        const timestamp = new Date(t.created_at).toLocaleTimeString();
        return `[${timestamp}] ${text}`;
      })
      .join('\n\n');
    
    const blob = new Blob([transcriptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sermon-transcript-${roomCode}-${language}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadTranscriptJSON = () => {
    const transcriptData = {
      roomCode,
      language: role === 'listener' ? language : 'en',
      role,
      downloadedAt: new Date().toISOString(),
      transcripts: transcripts.map(t => ({
        id: t.id,
        originalText: t.original_text,
        translatedText: t.translated_text,
        language: t.language,
        timestamp: t.created_at
      }))
    };
    
    const blob = new Blob([JSON.stringify(transcriptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sermon-transcript-${roomCode}-${language}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadTranscriptPDF = () => {
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: `Sermon Transcript - Room ${roomCode}`,
      subject: 'Wilberforce Academy Creative Night Transcript',
      author: 'Wilberforce Academy',
      creator: 'Wilberforce Academy Transcription System'
    });
    
    // Add header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Wilberforce Academy Creative Night', 20, 20);
    
    doc.setFontSize(16);
    doc.text('Sermon Transcript', 20, 30);
    
    // Add metadata
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Room Code: ${roomCode}`, 20, 45);
    doc.text(`Language: ${SUPPORTED_LANGUAGES[role === 'listener' ? language : 'en']}`, 20, 52);
    doc.text(`Downloaded: ${new Date().toLocaleString()}`, 20, 59);
    
    // Add separator line
    doc.line(20, 65, 190, 65);
    
    // Add transcripts
    let yPosition = 75;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;
    
    transcripts.forEach((transcript, index) => {
      const text = role === 'listener' && transcript.translated_text ? transcript.translated_text : transcript.original_text;
      const timestamp = new Date(transcript.created_at).toLocaleTimeString();
      
      // Check if we need a new page
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Add timestamp on its own line
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`[${timestamp}]`, margin, yPosition);
      yPosition += 12; // Move down for transcript text
      
      // Add transcript text with word wrapping
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const splitText = doc.splitTextToSize(text, 150);
      
      splitText.forEach((line: string) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
      
      yPosition += 8; // Extra space between transcripts
    });
    
    // Save the PDF
    doc.save(`sermon-transcript-${roomCode}-${language}.pdf`);
  };

  if (roomExists === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <svg className="w-16 h-16 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Room Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (roomExists === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <svg className="animate-spin w-8 h-8 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Connecting to room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Room: {roomCode}
                </h1>
                <p className="text-sm text-gray-600">
                  {role === 'preacher' ? 'Preacher Mode' : `Listener Mode (${SUPPORTED_LANGUAGES[language]})`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Preacher Controls */}
        {role === 'preacher' && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Recording Controls</h2>
                <p className="text-sm text-gray-600">
                  {isRecording ? 'Recording in progress...' : 'Click to start recording your sermon'}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 sm:px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 touch-manipulation"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                    </svg>
                    <span className="text-sm sm:text-base">Start Recording</span>
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 sm:px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 touch-manipulation"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 6h12v12H6z"/>
                    </svg>
                    <span className="text-sm sm:text-base">Stop Recording</span>
                  </button>
                )}
                
                <button
                  onClick={endRoom}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 sm:px-6 rounded-lg transition-colors touch-manipulation text-sm sm:text-base"
                >
                  End Room
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transcript Display */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Live Transcript
                {role === 'listener' && ` (${SUPPORTED_LANGUAGES[language]})`}
              </h2>
              
              {/* Download buttons - show when room ended or for listeners with transcripts */}
              {(roomEnded || (role === 'listener' && transcripts.length > 0)) && (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={downloadTranscriptPDF}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 touch-manipulation"
                    title="Download as PDF file"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download PDF</span>
                  </button>
                  
                  <button
                    onClick={downloadTranscriptJSON}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 touch-manipulation"
                    title="Download as JSON file with metadata"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Download JSON</span>
                  </button>
                </div>
              )}
            </div>
            
            {roomEnded && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-yellow-800 text-sm">
                    This session has ended. You can download the transcript using the buttons above.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="h-96 overflow-y-auto p-6">
            {transcripts.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <p>Waiting for transcription to begin...</p>
                {role === 'preacher' && (
                  <p className="text-sm mt-2">Click &quot;Start Recording&quot; to begin</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {transcripts.map((transcript) => (
                  <div key={transcript.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="text-gray-900 leading-relaxed">
                      {role === 'listener' && transcript.translated_text 
                        ? transcript.translated_text 
                        : transcript.original_text}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(transcript.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
                <div ref={transcriptsEndRef} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}