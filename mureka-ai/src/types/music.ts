export interface Track {
  id: string;
  title: string;
  prompt: string;
  duration: number;
  genre: string;
  mood: string;
  audioUrl: string;
  coverUrl: string;
  createdAt: Date;
  isLiked?: boolean;
}

export interface GeneratorOptions {
  genre: string;
  mood: string;
  duration: number;
  instruments: string[];
}

export interface AudioVisualization {
  bars: number[];
  currentTime: number;
  duration: number;
}

export interface PlaylistItem {
  track: Track;
  addedAt: Date;
}

export type MusicGenre = 
  | 'pop'
  | 'rock'
  | 'electronic'
  | 'classical'
  | 'jazz'
  | 'hip-hop'
  | 'country'
  | 'reggae'
  | 'blues'
  | 'folk'
  | 'ambient'
  | 'cinematic';

export type MusicMood = 
  | 'happy'
  | 'sad'
  | 'energetic'
  | 'calm'
  | 'mysterious'
  | 'romantic'
  | 'epic'
  | 'dark'
  | 'uplifting'
  | 'melancholic'
  | 'aggressive'
  | 'peaceful';