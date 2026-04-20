import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TrackRow } from "@/components/TrackRow";
import { Button } from "@/components/ui/button";
import { Play, Clock } from "lucide-react";
import { usePlayer } from "@/lib/store";

const AlbumPage = () => {
  const { id } = useParams();
  const { data: album, isLoading } = useQuery({
    queryKey: ["album", id],
    queryFn: () => api.album(Number(id)),
  });
  const playTrack = usePlayer(s => s.playTrack);

  if (isLoading || !album) return <div className="p-10 text-center text-muted-foreground">Loading...</div>;

  const tracks = album.tracks?.data.map(t => ({
    ...t,
    album: { id: album.id, title: album.title, cover_medium: album.cover_medium, cover_big: album.cover_big, cover_xl: album.cover_xl }
  })) || [];

  return (
    <div className="min-h-full">
      <div className="relative h-[380px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={album.cover_xl} alt="" className="w-full h-full object-cover scale-110 blur-3xl opacity-50" />
          <div className="absolute inset-0 bg-gradient-fade" />
        </div>
        <div className="relative h-full flex items-end gap-6 px-6 lg:px-10 pb-10 animate-fade-in">
          <img src={album.cover_xl} alt={album.title} className="w-44 h-44 sm:w-56 sm:h-56 rounded-2xl shadow-glow object-cover" />
          <div className="pb-2">
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2">Album</div>
            <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight mb-3">{album.title}</h1>
            <div className="text-muted-foreground">
              <span className="text-foreground font-semibold">{album.artist.name}</span> · {album.nb_tracks} songs
              {album.release_date && ` · ${new Date(album.release_date).getFullYear()}`}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-10 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Button
            size="lg"
            onClick={() => tracks[0] && playTrack(tracks[0], tracks.slice(1))}
            className="rounded-full bg-primary hover:bg-primary/90 shadow-glow"
          >
            <Play className="w-5 h-5 mr-2" fill="currentColor" /> Play
          </Button>
        </div>

        <div className="grid grid-cols-[24px_1fr_auto] sm:grid-cols-[24px_1fr_1fr_auto_auto] gap-3 sm:gap-4 px-3 py-2 text-xs uppercase tracking-wider text-muted-foreground border-b border-border mb-2">
          <div className="text-center">#</div>
          <div>Title</div>
          <div className="hidden sm:block">Album</div>
          <div className="hidden sm:block"><Clock className="w-3.5 h-3.5" /></div>
          <div />
        </div>

        <div className="space-y-1">
          {tracks.map((t, i) => <TrackRow key={t.id} track={t} index={i} queue={tracks.slice(i + 1)} showAlbum={false} />)}
        </div>
      </div>
    </div>
  );
};

export default AlbumPage;
