import React, { useState, useEffect } from 'react';
import { AudiusTrack } from './types';
import { getTrending } from '../services/audiusService';

interface MusicViewProps {
    onTrackSelect: (track: AudiusTrack, playlist: AudiusTrack[]) => void;
}

const PlaylistCard = ({ title, description, artwork, onClick }: { title: string, description: string, artwork: string, onClick?: () => void }) => (
    <div className="w-40 flex-shrink-0 cursor-pointer group" onClick={onClick} role={onClick ? 'button' : undefined}>
        <img src={artwork} alt={title} className="w-full h-40 object-cover rounded-lg bg-neutral-800 mb-2 transition-transform group-hover:scale-105" />
        <h4 className="font-bold text-white truncate">{title}</h4>
        <p className="text-xs text-neutral-400 truncate">{description}</p>
    </div>
);

const PlaylistSection = ({ title, tracks, isLoading, onTrackSelect }: { title: string, tracks: AudiusTrack[], isLoading: boolean, onTrackSelect: (track: AudiusTrack, playlist: AudiusTrack[]) => void }) => {
    const renderSkeleton = () => (
        <div className="flex space-x-4">
            {Array.from({ length: 5 }).map((_, i) => (
                 <div key={i} className="w-40 flex-shrink-0 animate-pulse">
                    <div className="w-full h-40 bg-neutral-800 rounded-lg mb-2"></div>
                    <div className="h-4 bg-neutral-800 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-neutral-800 rounded w-1/2"></div>
                </div>
            ))}
        </div>
    );

    return (
         <section>
            <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
            <div className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar">
                {isLoading ? renderSkeleton() : tracks.map(track => (
                    <PlaylistCard 
                        key={track.id}
                        title={track.title}
                        description={track.artist}
                        artwork={track.artwork}
                        onClick={() => onTrackSelect(track, tracks)}
                    />
                ))}
            </div>
        </section>
    );
};


const MusicView: React.FC<MusicViewProps> = ({ onTrackSelect }) => {
    const [popTracks, setPopTracks] = useState<AudiusTrack[]>([]);
    const [hipHopTracks, setHipHopTracks] = useState<AudiusTrack[]>([]);
    const [latinTracks, setLatinTracks] = useState<AudiusTrack[]>([]);
    const [isLoadingPop, setIsLoadingPop] = useState(true);
    const [isLoadingHipHop, setIsLoadingHipHop] = useState(true);
    const [isLoadingLatin, setIsLoadingLatin] = useState(true);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                setIsLoadingPop(true);
                const tracks = await getTrending({ genre: 'Pop' });
                setPopTracks(tracks);
            } catch (error) {
                console.error("Failed to fetch Pop tracks", error);
            } finally {
                setIsLoadingPop(false);
            }
            
            try {
                setIsLoadingHipHop(true);
                const tracks = await getTrending({ genre: 'Hip-Hop/Rap' }); 
                setHipHopTracks(tracks);
            } catch (error) {
                console.error("Failed to fetch Hip-Hop/Rap tracks", error);
            } finally {
                setIsLoadingHipHop(false);
            }

             try {
                setIsLoadingLatin(true);
                const tracks = await getTrending({ genre: 'Latin' }); 
                setLatinTracks(tracks);
            } catch (error) {
                console.error("Failed to fetch Latin tracks", error);
            } finally {
                setIsLoadingLatin(false);
            }
        };
        fetchPlaylists();
    }, []);

    return (
        <div className="space-y-8 p-4 sm:p-6">
            <PlaylistSection 
                title="Top Pop"
                tracks={popTracks}
                isLoading={isLoadingPop}
                onTrackSelect={onTrackSelect}
            />
            <PlaylistSection 
                title="Hip-Hop Hits"
                tracks={hipHopTracks}
                isLoading={isLoadingHipHop}
                onTrackSelect={onTrackSelect}
            />
             <PlaylistSection 
                title="Ritmos Latinos"
                tracks={latinTracks}
                isLoading={isLoadingLatin}
                onTrackSelect={onTrackSelect}
            />
        </div>
    );
};

export default MusicView;
