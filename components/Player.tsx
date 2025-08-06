
import React from 'react';
import { AudiusTrack } from './types';
import { PlayIcon, PauseIcon, PlusIcon } from './IconComponents';

interface PlayerProps {
  currentTrack: AudiusTrack;
  isPlaying: boolean;
  onPlayPause: () => void;
  onOpenFullScreen: () => void;
}

const Player: React.FC<PlayerProps> = ({ currentTrack, isPlaying, onPlayPause, onOpenFullScreen }) => {
  return (
    <div 
      className="fixed bottom-20 left-2 right-2 h-16 bg-green-600 rounded-lg z-40 text-white p-2 shadow-lg cursor-pointer"
      style={{ transform: 'translateZ(0)' }} // Promotes to its own layer to prevent jitter
      onClick={onOpenFullScreen}
      aria-label="Abrir reproductor a pantalla completa"
      role="button"
    >
      <div className="w-full h-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <img 
            src={currentTrack.artwork} 
            alt={currentTrack.title} 
            className="w-12 h-12 rounded object-cover flex-shrink-0 bg-green-700" 
          />
          <div className="truncate flex-grow">
            <p className="font-bold truncate text-sm">{currentTrack.title}</p>
            <p className="text-xs text-green-100 truncate">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 pr-2">
           <button className="text-white hover:text-white/80 transition-colors" aria-label="Add to library" onClick={(e) => e.stopPropagation()}>
              <PlusIcon className="w-6 h-6" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onPlayPause(); }} className="text-white hover:text-white/80 transition-colors" aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Player;