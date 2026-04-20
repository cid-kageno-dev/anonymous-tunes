// Deezer public API via CORS proxy. 30-second previews, no auth required.
const PROXY = "https://corsproxy.io/?url=";
const API = "https://api.deezer.com";

export interface Track {
  id: number;
  title: string;
  duration: number;
  preview: string;
  artist: { id: number; name: string; picture_medium?: string; picture_xl?: string };
  album: { id: number; title: string; cover_medium: string; cover_big: string; cover_xl: string };
  rank?: number;
}

export interface Album {
  id: number;
  title: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  artist: { id: number; name: string; picture_medium?: string };
  release_date?: string;
  nb_tracks?: number;
  tracks?: { data: Track[] };
}

export interface Artist {
  id: number;
  name: string;
  picture_medium: string;
  picture_xl: string;
  nb_fan?: number;
}

async function fetchAPI<T>(path: string): Promise<T> {
  const url = encodeURIComponent(`${API}${path}`);
  const res = await fetch(`${PROXY}${url}`);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export const api = {
  chartTracks: (limit = 20) => fetchAPI<{ data: Track[] }>(`/chart/0/tracks?limit=${limit}`).then(r => r.data),
  chartAlbums: (limit = 20) => fetchAPI<{ data: Album[] }>(`/chart/0/albums?limit=${limit}`).then(r => r.data),
  chartArtists: (limit = 20) => fetchAPI<{ data: Artist[] }>(`/chart/0/artists?limit=${limit}`).then(r => r.data),
  chartPlaylists: (limit = 10) => fetchAPI<{ data: any[] }>(`/chart/0/playlists?limit=${limit}`).then(r => r.data),
  genres: () => fetchAPI<{ data: any[] }>(`/genre`).then(r => r.data),
  genreArtists: (id: number) => fetchAPI<{ data: Artist[] }>(`/genre/${id}/artists`).then(r => r.data),
  album: (id: number) => fetchAPI<Album>(`/album/${id}`),
  artist: (id: number) => fetchAPI<Artist>(`/artist/${id}`),
  artistTop: (id: number, limit = 20) => fetchAPI<{ data: Track[] }>(`/artist/${id}/top?limit=${limit}`).then(r => r.data),
  artistAlbums: (id: number) => fetchAPI<{ data: Album[] }>(`/artist/${id}/albums`).then(r => r.data),
  searchTracks: (q: string) => fetchAPI<{ data: Track[] }>(`/search/track?q=${encodeURIComponent(q)}&limit=25`).then(r => r.data),
  searchAlbums: (q: string) => fetchAPI<{ data: Album[] }>(`/search/album?q=${encodeURIComponent(q)}&limit=15`).then(r => r.data),
  searchArtists: (q: string) => fetchAPI<{ data: Artist[] }>(`/search/artist?q=${encodeURIComponent(q)}&limit=15`).then(r => r.data),
};

export const formatDuration = (s: number) => {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};
