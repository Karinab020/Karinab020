import React, { useState } from 'react';
import Header from './components/Header';
import MusicGenerator from './components/MusicGenerator';
import MusicPlayer from './components/MusicPlayer';
import MusicLibrary from './components/MusicLibrary';
import type { Track } from './types/music';

function App() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGenerateMusic = (newTrack: Track) => {
    setTracks(prev => [newTrack, ...prev]);
    setCurrentTrack(newTrack);
  };

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-purple-900/20"></div>
      
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-8 space-y-8">
          {/* Hero Section */}
          <div className="text-center py-12">
            <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6">
              Mureka AI
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Transforme suas ideias em música com o poder da Inteligência Artificial. 
              Crie trilhas sonoras únicas em segundos.
            </p>
          </div>

          {/* Music Generator */}
          <MusicGenerator onGenerate={handleGenerateMusic} />

          {/* Music Player */}
          {currentTrack && (
            <MusicPlayer 
              track={currentTrack}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
            />
          )}

          {/* Music Library */}
          <MusicLibrary 
            tracks={tracks}
            currentTrack={currentTrack}
            onPlayTrack={handlePlayTrack}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
