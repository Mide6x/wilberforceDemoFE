// API utility functions for frontend

import { CreateRoomResponse, RoomInfo } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://wilberforcedemobe.onrender.com';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(response.status, errorText || 'An error occurred');
  }

  return response.json();
}

export const api = {
  // Create a new room
  createRoom: (): Promise<CreateRoomResponse> => {
    return apiRequest<CreateRoomResponse>('/rooms/create', {
      method: 'POST',
    });
  },

  // Get room information
  getRoomInfo: (roomCode: string): Promise<RoomInfo> => {
    return apiRequest<RoomInfo>(`/rooms/${roomCode}`);
  },

  // End a room
  endRoom: (roomCode: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/rooms/${roomCode}/end`, {
      method: 'POST',
    });
  },
};

export { ApiError };