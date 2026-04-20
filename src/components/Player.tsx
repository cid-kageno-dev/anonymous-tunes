import { useEffect, useRef, useState } from "react";
import { usePlayer } from "@/lib/store";
import { formatDuration } from "@/lib/api";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Heart, Shuffle, Repeat, Repeat1, ListMusic, X, GripVertical
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const Player = () => {
  const {
    currentTrack, isPlaying, togglePlay, next, prev, setIsPlaying,
    volume, setVolume, progress, setProgress, duration, setDuration,
    shuffle, toggleShuffle, repeat, toggleRepeat,
    toggleFavorite, isFavorite, queue, removeFromQueue, clearQueue, playTrack,
  } = usePlayer();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);

  // Load new track
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !currentTrack) return;
    a.src = currentTrack.preview;
    a.load();
    if (isPlaying) a.play().catch(() => setIsPlaying(false));
  }, [currentTrack?.id]);

  // Play/pause sync
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) a.play().catch(() => setIsPlaying(false));
    else a.pause();
  }, [isPlaying]);

  // Volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  // Media Session API
  useEffect(() => {
    if (!currentTrack || !("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: currentTrack.artist.name,
      album: currentTrack.album.title,
      artwork: [{ src: currentTrack.album.cover_xl, sizes: "512x512", type: "image/jpeg" }],
    });
    navigator.mediaSession.setActionHandler("play", () => setIsPlaying(true));
    navigator.mediaSession.setActionHandler("pause", () => setIsPlaying(false));
    navigator.mediaSession.setActionHandler("nexttrack", next);
    navigator.mediaSession.setActionHandler("previoustrack", prev);
  }, [currentTrack?.id]);

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-glass-border h-[88px] flex items-center justify-center text-sm text-muted-foreground">
        Select a track to start listening
      </div>
    );
  }

  const fav = isFavorite(currentTrack.id);

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setProgress((e.target as HTMLAudioElement).currentTime)}
        onLoadedMetadata={(e) => setDuration((e.target as HTMLAudioElement).duration)}
        onEnded={next}
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-glass-border shadow-player animate-slide-up">
        <div className="grid grid-cols-3 items-center gap-4 px-4 lg:px-6 h-[88px]">
          {/* Track info */}
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={currentTrack.album.cover_medium}
              alt={currentTrack.title}
              className="w-14 h-14 rounded-md shadow-card object-cover"
            />
            <div className="min-w-0 hidden sm:block">
              <div className="font-semibold truncate text-sm">{currentTrack.title}</div>
              <div className="text-xs text-muted-foreground truncate">{currentTrack.artist.name}</div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="hidden sm:flex shrink-0"
              onClick={() => toggleFavorite(currentTrack)}
            >
              <Heart className={`w-4 h-4 ${fav ? "fill-primary text-primary" : ""}`} />
            </Button>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button size="icon" variant="ghost" className="hidden sm:flex h-8 w-8" onClick={toggleShuffle}>
                <Shuffle className={`w-4 h-4 ${shuffle ? "text-primary" : ""}`} />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={prev}>
                <SkipBack className="w-5 h-5" fill="currentColor" />
              </Button>
              <Button
                size="icon"
                onClick={togglePlay}
                className="h-10 w-10 rounded-full bg-foreground text-background hover:bg-foreground/90 hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause className="w-5 h-5" fill="currentColor" /> : <Play className="w-5 h-5 ml-0.5" fill="currentColor" />}
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={next}>
                <SkipForward className="w-5 h-5" fill="currentColor" />
              </Button>
              <Button size="icon" variant="ghost" className="hidden sm:flex h-8 w-8" onClick={toggleRepeat}>
                {repeat === "one" ? <Repeat1 className="w-4 h-4 text-primary" /> :
                  <Repeat className={`w-4 h-4 ${repeat === "all" ? "text-primary" : ""}`} />}
              </Button>
            </div>
            <div className="hidden sm:flex items-center gap-2 w-full max-w-md">
              <span className="text-[10px] text-muted-foreground tabular-nums w-8 text-right">
                {formatDuration(progress)}
              </span>
              <Slider
                value={[progress]}
                max={duration || 30}
                step={0.1}
                onValueChange={(v) => {
                  if (audioRef.current) audioRef.current.currentTime = v[0];
                  setProgress(v[0]);
                }}
                className="flex-1"
              />
              <span className="text-[10px] text-muted-foreground tabular-nums w-8">
                {formatDuration(duration || 30)}
              </span>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center justify-end gap-1 sm:gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="relative">
                  <ListMusic className="w-4 h-4" />
                  {queue.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {queue.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-between">
                    Up Next
                    {queue.length > 0 && (
                      <Button size="sm" variant="ghost" onClick={clearQueue}>Clear</Button>
                    )}
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-1 overflow-y-auto scrollbar-thin max-h-[calc(100vh-120px)]">
                  {queue.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-12">Queue is empty</p>
                  ) : queue.map((t, i) => (
                    <div
                      key={`${t.id}-${i}`}
                      className="group flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab opacity-50" />
                      <img src={t.album.cover_medium} className="w-10 h-10 rounded object-cover" alt="" />
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => playTrack(t, queue.slice(i + 1))}
                      >
                        <div className="font-medium text-sm truncate">{t.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{t.artist.name}</div>
                      </div>
                      <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100" onClick={() => removeFromQueue(i)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            <div className="hidden md:flex items-center gap-2 w-32">
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setMuted(!muted)}>
                {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <Slider
                value={[muted ? 0 : volume * 100]}
                max={100}
                step={1}
                onValueChange={(v) => { setVolume(v[0] / 100); setMuted(false); }}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
