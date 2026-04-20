import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Track } from "./api";

interface Playlist {
  id: string;
  name: string;
  trackIds: number[];
  tracks: Track[];
  createdAt: number;
}

interface PlayerState {
  // Playback
  currentTrack: Track | null;
  queue: Track[];
  history: Track[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  shuffle: boolean;
  repeat: "off" | "all" | "one";

  // Persistent
  favorites: Track[];
  recents: Track[];
  playlists: Playlist[];

  // Actions
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  setIsPlaying: (b: boolean) => void;
  next: () => void;
  prev: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (idx: number) => void;
  clearQueue: () => void;
  reorderQueue: (from: number, to: number) => void;
  setVolume: (v: number) => void;
  setProgress: (p: number) => void;
  setDuration: (d: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;

  toggleFavorite: (track: Track) => void;
  isFavorite: (id: number) => boolean;
  addRecent: (track: Track) => void;

  createPlaylist: (name: string) => string;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (playlistId: string, track: Track) => void;
  removeFromPlaylist: (playlistId: string, trackId: number) => void;
  renamePlaylist: (id: string, name: string) => void;
}

export const usePlayer = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      queue: [],
      history: [],
      isPlaying: false,
      volume: 0.8,
      progress: 0,
      duration: 0,
      shuffle: false,
      repeat: "off",

      favorites: [],
      recents: [],
      playlists: [],

      playTrack: (track, queue) => {
        const cur = get().currentTrack;
        if (cur) set({ history: [cur, ...get().history.filter(t => t.id !== cur.id)].slice(0, 50) });
        set({
          currentTrack: track,
          isPlaying: true,
          progress: 0,
          queue: queue ? queue.filter(t => t.id !== track.id) : get().queue,
        });
        get().addRecent(track);
      },

      togglePlay: () => set({ isPlaying: !get().isPlaying }),
      setIsPlaying: (b) => set({ isPlaying: b }),

      next: () => {
        const { queue, currentTrack, repeat, history, shuffle } = get();
        if (repeat === "one" && currentTrack) {
          set({ progress: 0, isPlaying: true });
          return;
        }
        if (queue.length === 0) {
          if (repeat === "all" && history.length && currentTrack) {
            const all = [currentTrack, ...history].reverse();
            set({ currentTrack: all[0], queue: all.slice(1), progress: 0, isPlaying: true, history: [] });
          } else {
            set({ isPlaying: false });
          }
          return;
        }
        const idx = shuffle ? Math.floor(Math.random() * queue.length) : 0;
        const nextTrack = queue[idx];
        const newQueue = queue.filter((_, i) => i !== idx);
        if (currentTrack) set({ history: [currentTrack, ...history].slice(0, 50) });
        set({ currentTrack: nextTrack, queue: newQueue, progress: 0, isPlaying: true });
        get().addRecent(nextTrack);
      },

      prev: () => {
        const { progress, history, currentTrack, queue } = get();
        if (progress > 3) {
          set({ progress: 0 });
          return;
        }
        if (history.length === 0) {
          set({ progress: 0 });
          return;
        }
        const [prev, ...rest] = history;
        set({
          currentTrack: prev,
          history: rest,
          queue: currentTrack ? [currentTrack, ...queue] : queue,
          progress: 0,
          isPlaying: true,
        });
      },

      addToQueue: (track) => set({ queue: [...get().queue, track] }),
      removeFromQueue: (idx) => set({ queue: get().queue.filter((_, i) => i !== idx) }),
      clearQueue: () => set({ queue: [] }),
      reorderQueue: (from, to) => {
        const q = [...get().queue];
        const [m] = q.splice(from, 1);
        q.splice(to, 0, m);
        set({ queue: q });
      },

      setVolume: (v) => set({ volume: v }),
      setProgress: (p) => set({ progress: p }),
      setDuration: (d) => set({ duration: d }),
      toggleShuffle: () => set({ shuffle: !get().shuffle }),
      toggleRepeat: () => {
        const r = get().repeat;
        set({ repeat: r === "off" ? "all" : r === "all" ? "one" : "off" });
      },

      toggleFavorite: (track) => {
        const favs = get().favorites;
        if (favs.find(f => f.id === track.id)) {
          set({ favorites: favs.filter(f => f.id !== track.id) });
        } else {
          set({ favorites: [track, ...favs] });
        }
      },
      isFavorite: (id) => !!get().favorites.find(f => f.id === id),
      addRecent: (track) => {
        const r = get().recents.filter(t => t.id !== track.id);
        set({ recents: [track, ...r].slice(0, 30) });
      },

      createPlaylist: (name) => {
        const id = `pl_${Date.now()}`;
        set({ playlists: [{ id, name, trackIds: [], tracks: [], createdAt: Date.now() }, ...get().playlists] });
        return id;
      },
      deletePlaylist: (id) => set({ playlists: get().playlists.filter(p => p.id !== id) }),
      addToPlaylist: (playlistId, track) => {
        set({
          playlists: get().playlists.map(p =>
            p.id === playlistId && !p.tracks.find(t => t.id === track.id)
              ? { ...p, tracks: [...p.tracks, track], trackIds: [...p.trackIds, track.id] }
              : p
          ),
        });
      },
      removeFromPlaylist: (playlistId, trackId) => {
        set({
          playlists: get().playlists.map(p =>
            p.id === playlistId
              ? { ...p, tracks: p.tracks.filter(t => t.id !== trackId), trackIds: p.trackIds.filter(id => id !== trackId) }
              : p
          ),
        });
      },
      renamePlaylist: (id, name) =>
        set({ playlists: get().playlists.map(p => (p.id === id ? { ...p, name } : p)) }),
    }),
    {
      name: "pulse-storage",
      partialize: (s) => ({
        favorites: s.favorites,
        recents: s.recents,
        playlists: s.playlists,
        volume: s.volume,
      }),
    }
  )
);
