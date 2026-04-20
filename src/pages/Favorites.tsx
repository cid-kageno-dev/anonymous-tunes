import { usePlayer } from "@/lib/store";
import { TrackRow } from "@/components/TrackRow";
import { Heart, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const Favorites = () => {
  const { favorites, playTrack } = usePlayer();

  return (
    <div className="min-h-full">
      <div className="relative px-6 lg:px-10 pt-12 pb-8 bg-gradient-hero">
        <div className="flex items-end gap-6">
          <div className="hidden sm:flex w-48 h-48 rounded-2xl bg-background/20 items-center justify-center shadow-glow backdrop-blur-sm">
            <Heart className="w-20 h-20 text-primary-foreground" fill="currentColor" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest font-bold mb-2 text-primary-foreground/80">Playlist</div>
            <h1 className="text-5xl sm:text-7xl font-display font-extrabold tracking-tight text-primary-foreground mb-3">Favorites</h1>
            <p className="text-primary-foreground/80">{favorites.length} songs</p>
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-10 py-6">
        {favorites.length > 0 ? (
          <>
            <Button
              size="lg"
              onClick={() => playTrack(favorites[0], favorites.slice(1))}
              className="rounded-full bg-primary hover:bg-primary/90 shadow-glow mb-6"
            >
              <Play className="w-5 h-5 mr-2" fill="currentColor" /> Play
            </Button>
            <div className="space-y-1">
              {favorites.map((t, i) => <TrackRow key={t.id} track={t} index={i} queue={favorites.slice(i + 1)} />)}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <Heart className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>No favorites yet. Tap the heart on any track to save it here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
