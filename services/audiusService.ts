import { AudiusTrack } from '../components/types';

const API_HOST = 'https://discoveryprovider.audius.co/v1';

// This is a public App Name required by Audius API, can be anything.
const APP_NAME = 'GeminiMusicPlayer';

const hashCode = (s: string) => s.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);

const createImageFallback = (id: string): string => {
    const H = hashCode(id);
    const h = H % 360;
    const s = 40 + (Math.abs(H) % 30);
    const l = 50 + (Math.abs(H >> 8) % 20);
    const color = `hsl(${h}, ${s}%, ${l}%)`;
    const color2 = `hsl(${h}, ${s}%, ${l-10}%)`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="480" height="480"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop stop-color="${color}" offset="0%"/><stop stop-color="${color2}" offset="100%"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/></svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
};


const mapAudiusTrack = (track: any): AudiusTrack => ({
    id: track.id,
    title: track.title,
    artist: track.user.name,
    artwork: track.artwork?.['480x480'] || track.user?.artwork?.['480x480'] || track.artwork?.['150x150'] || track.user?.artwork?.['150x150'] || createImageFallback(track.id),
    duration: track.duration,
    streamUrl: `${API_HOST}/tracks/${track.id}/stream?app_name=${APP_NAME}`,
});

export const searchAudius = async (query: string): Promise<AudiusTrack[]> => {
  if (!query) return [];
  // Exclude remixes and stems to get more official tracks first.
  const endpoint = `${API_HOST}/tracks/search?query=${encodeURIComponent(query)}&app_name=${APP_NAME}`;
  
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Audius API responded with status: ${response.status}`);
  }
  const json = await response.json();

  if (!json.data || !Array.isArray(json.data)) {
    throw new Error('Invalid response from Audius API');
  }
  
  return json.data.map(mapAudiusTrack);
};

export const getTrending = async (options?: { genre?: string }): Promise<AudiusTrack[]> => {
    let endpoint = `${API_HOST}/tracks/trending?app_name=${APP_NAME}`;
    if (options?.genre) {
        endpoint += `&genre=${encodeURIComponent(options.genre)}`;
    }
    const response = await fetch(endpoint);
    if (!response.ok) {
        throw new Error(`Audius API responded with status: ${response.status}`);
    }
    const json = await response.json();
    if (!json.data || !Array.isArray(json.data)) {
        throw new Error('Invalid response from Audius API');
    }

    return json.data.map(mapAudiusTrack);
};