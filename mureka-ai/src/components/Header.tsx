import React from 'react';
import { Music, Menu, User, Settings } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Music className="w-8 h-8 text-primary-500" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl font-bold text-white">Mureka AI</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-300 hover:text-primary-400 transition-colors">
              Gerar
            </a>
            <a href="#" className="text-slate-300 hover:text-primary-400 transition-colors">
              Biblioteca
            </a>
            <a href="#" className="text-slate-300 hover:text-primary-400 transition-colors">
              Trending
            </a>
            <a href="#" className="text-slate-300 hover:text-primary-400 transition-colors">
              Comunidade
            </a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <button className="p-2 text-slate-400 hover:text-primary-400 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-primary-400 transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button className="md:hidden p-2 text-slate-400 hover:text-primary-400 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;