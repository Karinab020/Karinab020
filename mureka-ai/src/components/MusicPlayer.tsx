import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Download, Heart, Share } from 'lucide-react';
import type { Track } from '../types/music';

interface MusicPlayerProps {
  track: Track;
  isPlaying: boolean;
  onPlayPause: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ track, isPlaying, onPlayPause }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isLiked, setIsLiked] = useState(track.isLiked || false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleDownload = () => {
    // Simular download
    alert('Download iniciado! (Funcionalidade simulada)');
  };

  const handleShare = () => {
    // Simular compartilhamento
    alert('Link copiado para área de transferência! (Funcionalidade simulada)');
  };

  return (
    <div className="card">
      <audio ref={audioRef} src={track.audioUrl} />
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Track Info */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={track.coverUrl}
              alt={track.title}
              className="w-20 h-20 rounded-lg object-cover"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                <div className="flex space-x-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-white audio-wave"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{track.title}</h3>
            <p className="text-sm text-slate-400 truncate">{track.prompt}</p>
            <div className="flex items-center space-x-4 text-xs text-slate-500 mt-1">
              <span>{track.genre}</span>
              <span>•</span>
              <span>{track.mood}</span>
              <span>•</span>
              <span>{formatTime(track.duration)}</span>
            </div>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex-1 space-y-4">
          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button
              onClick={onPlayPause}
              className="p-3 bg-primary-500 hover:bg-primary-600 rounded-full text-white transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>
            
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max={track.duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(track.duration)}</span>
            </div>
          </div>
        </div>

        {/* Additional Controls */}
        <div className="flex items-center space-x-2">
          {/* Volume */}
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-slate-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleLike}
            className={`p-2 transition-colors ${
              isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleDownload}
            className="p-2 text-slate-400 hover:text-primary-400 transition-colors"
          >
            <Download className="w-5 h-5" />
          </button>

          <button
            onClick={handleShare}
            className="p-2 text-slate-400 hover:text-primary-400 transition-colors"
          >
            <Share className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;