
import React from 'react';
import { AudiusTrack } from './types';
import {
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
  HeartIcon,
  PlayIcon,
  PauseIcon,
  PreviousIcon,
  NextIcon,
  ShareIcon,
  DevicePhoneMobileIcon,
} from './IconComponents';
import AudioVisualizer from './AudioVisualizer';

interface FullScreenPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  track: AudiusTrack;
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const formatTime = (timeInSeconds: number) => {
  if (isNaN(timeInSeconds) || timeInSeconds === 0) return '0:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const FullScreenPlayer: React.FC<FullScreenPlayerProps> = ({
  isOpen,
  onClose,
  track,
  analyser,
  isPlaying,
  progress,
  duration,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
}) => {
  return (
    <div
      className={`fixed inset-0 bg-neutral-900 text-white flex flex-col transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {/* Background Visualizer */}
      <div className="absolute inset-0 opacity-20">
        <AudioVisualizer analyser={analyser} isPlaying={isPlaying} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-neutral-900/80 to-black/90"></div>
      
      {/* Cabecera */}
      <header className="relative flex items-center justify-between p-4 z-10">
        <button onClick={onClose} aria-label="Cerrar reproductor">
          <ChevronDownIcon className="w-7 h-7" />
        </button>
        {/* Texto central de la cabecera eliminado según la petición del usuario */}
        <button aria-label="Más opciones">
          <EllipsisHorizontalIcon className="w-7 h-7" />
        </button>
      </header>

      {/* Contenido Principal */}
      <main className="relative flex-1 flex flex-col justify-between p-6 space-y-6 z-10">
        {/* Artwork */}
        <div className="flex-1 flex items-center justify-center">
             <img 
                src={track.artwork} 
                alt={track.title} 
                className="w-full max-w-sm aspect-square rounded-lg object-cover shadow-2xl shadow-black/50"
             />
        </div>

        {/* Información de la pista y acciones */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold truncate">{track.title}</h1>
              <p className="text-neutral-300 truncate">{track.artist}</p>
            </div>
            <div className="flex items-center gap-4">
              <button aria-label="Añadir a favoritos">
                <HeartIcon className="w-7 h-7 text-neutral-300 hover:text-white transition-colors" />
              </button>
              <button aria-label="Añadir a playlist">
                <PlusIcon className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>

        {/* Barra de Progreso */}
        <div className="flex-shrink-0 space-y-1.5">
          <input
            type="range"
            min="0"
            max={duration || 1}
            value={progress}
            onChange={onSeek}
            className="w-full"
          />
          <div className="flex justify-between text-xs font-mono text-neutral-300">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controles */}
        <div className="flex-shrink-0 flex items-center justify-between">
          <button onClick={onPrevious} aria-label="Canción anterior" className="text-neutral-300 hover:text-white transition-colors">
            <PreviousIcon className="w-10 h-10" />
          </button>
          <button
            onClick={onPlayPause}
            className="bg-white text-black rounded-full p-4 shadow-lg transform hover:scale-105 transition-transform"
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? <PauseIcon className="w-10 h-10" /> : <PlayIcon className="w-10 h-10" />}
          </button>
          <button onClick={onNext} aria-label="Siguiente canción" className="text-neutral-300 hover:text-white transition-colors">
            <NextIcon className="w-10 h-10" />
          </button>
        </div>

        {/* Acciones del pie de página */}
        <div className="flex-shrink-0 flex items-center justify-between pt-2">
          <button aria-label="Conectar a un dispositivo" className="text-neutral-300 hover:text-white transition-colors">
            <DevicePhoneMobileIcon className="w-6 h-6" />
          </button>
          <button aria-label="Compartir" className="text-neutral-300 hover:text-white transition-colors">
            <ShareIcon className="w-6 h-6" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default FullScreenPlayer;