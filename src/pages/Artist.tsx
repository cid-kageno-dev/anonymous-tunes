import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TrackRow } from "@/components/TrackRow";
import { AlbumCard } from "@/components/Cards";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { usePlayer } from "@/lib/store";

const ArtistPage = () => {
  const { id } = useParams();
  const aid = Number(id);
  const { data: artist } = useQuery({ queryKey: ["artist", aid], queryFn: () => api.artist(aid) });
  const { data: top } = useQuery({ queryKey: ["artistTop", aid], queryFn: () => api.artistTop(aid, 10) });
  const { data: albums } = useQuery({ queryKey: ["artistAlbums", aid], queryFn: () => api.artistAlbums(aid) });
  const playTrack = usePlayer(s => s.playTrack);

  if (!artist) return <div className="p-10 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="min-h-full">
      <div className="relative h-[440px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={artist.picture_xl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        </div>
        <div className="relative h-full flex items-end px-6 lg:px-10 pb-10 animate-fade-in">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-bold mb-3">Artist</div>
            <h1 className="text-5xl sm:text-7xl font-display font-extrabold tracking-tight mb-3">{artist.name}</h1>
            {artist.nb_fan && (
              <p className="text-muted-foreground">{artist.nb_fan.toLocaleString()} fans</p>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-10 py-6 space-y-10">
        <div>
          <Button
            size="lg"
            onClick={() => top?.[0] && playTrack(top[0], top.slice(1))}
            className="rounded-full bg-primary hover:bg-primary/90 shadow-glow"
          >
            <Play className="w-5 h-5 mr-2" fill="currentColor" /> Play
          </Button>
        </div>

        {top && (
          <section>
            <h2 className="text-2xl font-display font-bold mb-4">Popular</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              {top.slice(0, 10).map((t, i) => <TrackRow key={t.id} track={t} index={i} queue={top.slice(i + 1)} />)}
            </div>
          </section>
        )}

        {albums && albums.length > 0 && (
          <section>
            <h2 className="text-2xl font-display font-bold mb-4">Albums</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {albums.slice(0, 12).map(a => (
                <AlbumCard key={a.id} album={{ ...a, artist: { id: artist.id, name: artist.name } }} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ArtistPage;
