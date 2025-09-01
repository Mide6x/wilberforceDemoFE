// Frontend TypeScript interfaces for the sermon transcription app

export interface SermonRoom {
  id: number;
  room_code: string;
  created_at: string;
  is_active: boolean;
}

export interface Transcript {
  id: number;
  room_id: number;
  original_text: string;
  translated_text?: string;
  language: string;
  created_at: string;
}

export interface Listener {
  id: number;
  room_id: number;
  preferred_language: string;
  joined_at: string;
}

export interface CreateRoomResponse {
  roomCode: string;
  room: SermonRoom;
}

export interface RoomInfo {
  room: SermonRoom;
  listeners: Listener[];
}

// WebSocket event types for frontend
export interface WebSocketEvents {
  // Client to server
  'join-room': { roomCode: string; language: string };
  'leave-room': { roomCode: string };
  'audio-chunk': { roomCode: string; audioData: ArrayBuffer };
  'start-transcription': { roomCode: string };
  'stop-transcription': { roomCode: string };
  
  // Server to client
  'room-joined': { success: boolean; message?: string };
  'new-transcript': Transcript;
  'transcription-started': { roomCode: string };
  'transcription-stopped': { roomCode: string };
  'error': { message: string };
}

// Language options for translation
export const SUPPORTED_LANGUAGES = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh': 'Chinese',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'yo': 'Yoruba',
  'st': 'Sesotho (Lesotho)'
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;