import React, { useState, useEffect } from 'react';
import { AudiusTrack } from './types';
import { getTrending } from '../services/audiusService';

interface HomeViewProps {
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


const HomeView: React.FC<HomeViewProps> = ({ onTrackSelect }) => {
    const [trendingTracks, setTrendingTracks] = useState<AudiusTrack[]>([]);
    const [rockTracks, setRockTracks] = useState<AudiusTrack[]>([]);
    const [electronicTracks, setElectronicTracks] = useState<AudiusTrack[]>([]);
    const [isLoadingTrending, setIsLoadingTrending] = useState(true);
    const [isLoadingRock, setIsLoadingRock] = useState(true);
    const [isLoadingElectronic, setIsLoadingElectronic] = useState(true);

    useEffect(() => {
        const fetchPlaylists = async () => {
            // Fetch trending tracks (all genres)
            try {
                setIsLoadingTrending(true);
                const trending = await getTrending();
                setTrendingTracks(trending);
            } catch (error) {
                console.error("Failed to fetch trending tracks", error);
            } finally {
                setIsLoadingTrending(false);
            }
            
            // Fetch tracks for a specific genre
            try {
                setIsLoadingRock(true);
                const rock = await getTrending({ genre: 'Rock' }); 
                setRockTracks(rock);
            } catch (error) {
                console.error("Failed to fetch rock tracks", error);
            } finally {
                setIsLoadingRock(false);
            }

            // Fetch tracks for electronic genre
             try {
                setIsLoadingElectronic(true);
                const electronic = await getTrending({ genre: 'Electronic' }); 
                setElectronicTracks(electronic);
            } catch (error) {
                console.error("Failed to fetch electronic tracks", error);
            } finally {
                setIsLoadingElectronic(false);
            }
        };
        fetchPlaylists();
    }, []);

    return (
        <div className="space-y-8 p-4 sm:p-6">
            <PlaylistSection 
                title="Top Rock"
                tracks={rockTracks}
                isLoading={isLoadingRock}
                onTrackSelect={onTrackSelect}
            />
            <PlaylistSection 
                title="Los éxitos del momento"
                tracks={trendingTracks}
                isLoading={isLoadingTrending}
                onTrackSelect={onTrackSelect}
            />
             <PlaylistSection 
                title="Electrónica"
                tracks={electronicTracks}
                isLoading={isLoadingElectronic}
                onTrackSelect={onTrackSelect}
            />
        </div>
    );
};

export default HomeView;