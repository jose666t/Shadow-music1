
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AudiusTrack } from './components/types';
import { searchAudius } from './services/audiusService';
import SearchView from './components/SearchView';
import Player from './components/Player.tsx';
import HomeView from './components/HomeView';
import BottomNav from './components/BottomNav';
import TopHeader from './components/TopHeader';
import FullScreenPlayer from './components/FullScreenPlayer';
import MusicView from './components/MusicView';

type ActiveView = 'home' | 'search' | 'library' | 'create';
type HomeViewType = 'all' | 'music';

const App: React.FC = () => {
  // Estado de la vista
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [activeHomeView, setActiveHomeView] = useState<HomeViewType>('all');
  const [isFullScreenPlayerOpen, setIsFullScreenPlayerOpen] = useState(false);

  // Estado de Audius
  const [currentPlaylist, setCurrentPlaylist] = useState<AudiusTrack[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isStreamLoading, setIsStreamLoading] = useState(false);
  
  // Estado del reproductor de audio
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Web Audio API
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Estado común
  const [error, setError] = useState<string | null>(null);
  
  const mainContentRef = useRef<HTMLElement>(null);
  
  const currentTrack = currentTrackIndex !== null ? currentPlaylist[currentTrackIndex] : null;

  useEffect(() => {
    if (audioRef.current && !audioContextRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const context = new AudioContext();
        audioContextRef.current = context;
        
        const analyser = context.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const source = context.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(context.destination);
    }
  }, []);

  useEffect(() => {
    if (currentTrack?.streamUrl && audioRef.current) {
        setIsStreamLoading(true);
        const audio = audioRef.current;
        
        // Resume AudioContext if it's suspended
        if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume();
        }

        audio.src = currentTrack.streamUrl;
        audio.play().then(() => setIsPlaying(true)).catch(e => {
          console.error("Autoplay failed:", e);
          setIsPlaying(false);
        }).finally(() => {
            setIsStreamLoading(false);
        });
    } else if (!currentTrack) {
        setIsPlaying(false);
    }
  }, [currentTrack]);


  const handleSearch = useCallback(async (query: string) => {
    setIsSearching(true);
    setCurrentPlaylist([]);
    setCurrentTrackIndex(null);
    setError(null);
    mainContentRef.current?.scrollTo(0, 0);
    setActiveView('search');
    
    try {
        const results = await searchAudius(query);
        setCurrentPlaylist(results);
        if (results.length === 0) {
          setError(`No se encontraron resultados para "${query}" en Audius.`);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido";
        console.error("Audius search failed", error);
        setError(`Error al buscar en Audius: ${errorMessage}`);
    } finally {
        setIsSearching(false);
    }
  }, []);

  const handlePlaybackControl = (action: 'PLAY' | 'PAUSE' | 'STOP' | 'NEXT' | 'PREVIOUS') => {
    if (action === 'PLAY') {
      if (currentTrack && !isPlaying) {
        handlePlayPause();
      }
      return;
    }
    if (action === 'PAUSE') {
      if (isPlaying) {
        handlePlayPause();
      }
      return;
    }
    if (action === 'STOP') {
      if (currentTrack) {
        handleClosePlayer();
      }
      return;
    }
    
    if(currentTrackIndex === null) {
        return;
    }
    const nextIndex = action === 'NEXT' ? currentTrackIndex + 1 : currentTrackIndex - 1;

    if (nextIndex >= 0 && nextIndex < currentPlaylist.length) {
        setCurrentTrackIndex(nextIndex);
        return;
    }
    
    handleClosePlayer();
  }
  
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
       if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume();
        }
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const handleTrackSelect = (track: AudiusTrack, playlist: AudiusTrack[]) => {
      setCurrentPlaylist(playlist);
      const index = playlist.findIndex(t => t.id === track.id);
      if (index !== -1) {
          setCurrentTrackIndex(index);
          setIsFullScreenPlayerOpen(true);
      }
  };
  
  const handleClosePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setCurrentTrackIndex(null);
    setIsPlaying(false);
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    setProgress(e.currentTarget.currentTime);
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
      setDuration(e.currentTarget.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!audioRef.current) return;
      audioRef.current.currentTime = Number(e.target.value);
  };

  const renderView = () => {
    switch(activeView) {
      case 'home':
        if (activeHomeView === 'music') {
          return <MusicView onTrackSelect={handleTrackSelect} />;
        }
        return <HomeView onTrackSelect={handleTrackSelect} />;
      case 'search':
        return <SearchView
          onSearch={handleSearch}
          isLoading={isSearching}
          isStreamLoading={isStreamLoading}
          results={currentPlaylist}
          onTrackSelect={(track) => handleTrackSelect(track, currentPlaylist)}
          error={error}
          currentTrackId={currentTrack?.id}
        />;
      case 'library':
      case 'create':
        return <div className="p-6 text-center text-neutral-400">
            <h2 className="text-2xl font-bold text-white mb-2">Página en construcción</h2>
            <p>Esta sección estará disponible próximamente.</p>
          </div>
      default:
        return <HomeView onTrackSelect={handleTrackSelect} />;
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-neutral-950 text-white overflow-hidden">
        <main ref={mainContentRef} className="flex-1 overflow-y-auto" style={{ paddingBottom: currentTrack ? '144px' : '80px' }}>
            {activeView === 'home' && (
              <TopHeader activeHomeView={activeHomeView} setActiveHomeView={setActiveHomeView} />
            )}
            {renderView()}
        </main>
        
        <audio ref={audioRef} crossOrigin="anonymous" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={() => handlePlaybackControl('NEXT')} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} />

        {currentTrack && !isFullScreenPlayerOpen && (
          <Player
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onOpenFullScreen={() => setIsFullScreenPlayerOpen(true)}
          />
        )}

        {currentTrack && (
          <FullScreenPlayer
            isOpen={isFullScreenPlayerOpen}
            onClose={() => setIsFullScreenPlayerOpen(false)}
            track={currentTrack}
            analyser={analyserRef.current}
            isPlaying={isPlaying}
            progress={progress}
            duration={duration}
            onPlayPause={handlePlayPause}
            onNext={() => handlePlaybackControl('NEXT')}
            onPrevious={() => handlePlaybackControl('PREVIOUS')}
            onSeek={handleSeek}
          />
        )}
        
        <BottomNav activeView={activeView} setActiveView={setActiveView} />

    </div>
  );
};

export default App;
