import React, { useState } from 'react';
import { Play, Pause, Download, Heart, MoreVertical, Search, Filter } from 'lucide-react';
import type { Track } from '../types/music';

interface MusicLibraryProps {
  tracks: Track[];
  currentTrack: Track | null;
  onPlayTrack: (track: Track) => void;
}

const MusicLibrary: React.FC<MusicLibraryProps> = ({ tracks, currentTrack, onPlayTrack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredTracks = tracks
    .filter(track => {
      const matchesSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           track.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           track.genre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = selectedGenre === 'all' || track.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'duration':
          return b.duration - a.duration;
        default:
          return 0;
      }
    });

  const uniqueGenres = Array.from(new Set(tracks.map(track => track.genre)));

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (tracks.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-slate-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Sua biblioteca está vazia</h3>
        <p className="text-slate-400">Gere sua primeira música usando o gerador acima!</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Sua Biblioteca</h2>
          <p className="text-slate-400">{tracks.length} música{tracks.length !== 1 ? 's' : ''} gerada{tracks.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar músicas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full sm:w-64"
            />
          </div>

          {/* Genre Filter */}
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="input-field"
          >
            <option value="all">Todos os gêneros</option>
            {uniqueGenres.map(genre => (
              <option key={genre} value={genre}>
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="newest">Mais recente</option>
            <option value="oldest">Mais antigo</option>
            <option value="title">Título A-Z</option>
            <option value="duration">Duração</option>
          </select>
        </div>
      </div>

      {/* Tracks List */}
      <div className="space-y-3">
        {filteredTracks.map((track, index) => (
          <div
            key={track.id}
            className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200 hover:bg-slate-800/50 cursor-pointer ${
              currentTrack?.id === track.id 
                ? 'bg-primary-500/10 border-primary-500/30' 
                : 'bg-slate-800/20 border-slate-700 hover:border-slate-600'
            }`}
            onClick={() => onPlayTrack(track)}
          >
            {/* Track Number / Play Button */}
            <div className="flex items-center justify-center w-8">
              {currentTrack?.id === track.id ? (
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-4 bg-primary-500 audio-wave"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              ) : (
                <span className="text-slate-400 text-sm group-hover:hidden">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
              )}
            </div>

            {/* Track Cover */}
            <img
              src={track.coverUrl}
              alt={track.title}
              className="w-12 h-12 rounded-lg object-cover"
            />

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-white truncate">{track.title}</h4>
              <p className="text-sm text-slate-400 truncate">{track.prompt}</p>
            </div>

            {/* Track Metadata */}
            <div className="hidden md:flex items-center space-x-4 text-sm text-slate-400">
              <span className="px-2 py-1 bg-slate-700 rounded-full text-xs">
                {track.genre}
              </span>
              <span className="px-2 py-1 bg-slate-700 rounded-full text-xs">
                {track.mood}
              </span>
              <span>{formatDate(track.createdAt)}</span>
              <span>{formatDuration(track.duration)}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle like
                }}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
              >
                <Heart className="w-4 h-4" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle download
                }}
                className="p-2 text-slate-400 hover:text-primary-400 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle more options
                }}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTracks.length === 0 && tracks.length > 0 && (
        <div className="text-center py-8">
          <p className="text-slate-400">Nenhuma música encontrada com os filtros aplicados.</p>
        </div>
      )}
    </div>
  );
};

export default MusicLibrary;