import React, { useState } from 'react';
import { Wand2, Music, Loader2, Sparkles } from 'lucide-react';
import type { Track, MusicGenre, MusicMood } from '../types/music';

interface MusicGeneratorProps {
  onGenerate: (track: Track) => void;
}

const MusicGenerator: React.FC<MusicGeneratorProps> = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState<MusicGenre>('pop');
  const [mood, setMood] = useState<MusicMood>('happy');
  const [duration, setDuration] = useState(60);
  const [isGenerating, setIsGenerating] = useState(false);

  const genres: MusicGenre[] = ['pop', 'rock', 'electronic', 'classical', 'jazz', 'hip-hop', 'country', 'reggae'];
  const moods: MusicMood[] = ['happy', 'sad', 'energetic', 'calm', 'mysterious', 'romantic', 'epic', 'dark'];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    // Simular geração de música (em um app real, isso seria uma chamada para API)
    setTimeout(() => {
      const newTrack: Track = {
        id: Date.now().toString(),
        title: generateTitle(prompt, genre, mood),
        prompt,
        duration,
        genre,
        mood,
        audioUrl: generateMockAudioUrl(),
        coverUrl: generateMockCoverUrl(),
        createdAt: new Date(),
      };

      onGenerate(newTrack);
      setIsGenerating(false);
      setPrompt('');
    }, 3000);
  };

  const generateTitle = (prompt: string, genre: string, mood: string): string => {
    const words = prompt.split(' ').slice(0, 3);
    return `${words.join(' ')} (${genre} ${mood})`;
  };

  const generateMockAudioUrl = (): string => {
    // URLs de exemplo de músicas (em um app real, seria gerado pela IA)
    const mockUrls = [
      'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      'https://sample-audio-files.s3.amazonaws.com/sample.mp3'
    ];
    return mockUrls[Math.floor(Math.random() * mockUrls.length)];
  };

  const generateMockCoverUrl = (): string => {
    return `https://picsum.photos/400/400?random=${Date.now()}`;
  };

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-primary-500/10 text-primary-400 px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Gerador de Música IA</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Descreva sua música ideal
        </h2>
        <p className="text-slate-400">
          Digite uma descrição e nossa IA criará uma música única para você
        </p>
      </div>

      <div className="space-y-6">
        {/* Prompt Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Descreva sua música
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: Uma música alegre e energética para um dia ensolarado, com guitarra e bateria marcante..."
            className="input-field w-full h-32 resize-none"
            disabled={isGenerating}
          />
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Genre Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Gênero
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value as MusicGenre)}
              className="input-field w-full"
              disabled={isGenerating}
            >
              {genres.map((g) => (
                <option key={g} value={g} className="bg-slate-800">
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Humor
            </label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value as MusicMood)}
              className="input-field w-full"
              disabled={isGenerating}
            >
              {moods.map((m) => (
                <option key={m} value={m} className="bg-slate-800">
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Duração (segundos)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min="15"
              max="180"
              step="15"
              className="input-field w-full"
              disabled={isGenerating}
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="button-primary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Gerando música...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>Gerar Música</span>
              </>
            )}
          </button>
        </div>

        {/* Generation Progress */}
        {isGenerating && (
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
              <span>Processando...</span>
              <span>Aproximadamente 3 segundos</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-primary-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicGenerator;