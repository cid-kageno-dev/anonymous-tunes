import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { usePlayer } from "@/lib/store";
import { api, Album, Artist } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface AlbumCardProps { album: Album }
export const AlbumCard = ({ album }: AlbumCardProps) => {
  const playTrack = usePlayer(s => s.playTrack);

  const handlePlay = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const full = await api.album(album.id);
    if (full.tracks?.data?.length) {
      const tracks = full.tracks.data.map(t => ({ ...t, album: { id: full.id, title: full.title, cover_medium: full.cover_medium, cover_big: full.cover_big, cover_xl: full.cover_xl } }));
      playTrack(tracks[0], tracks.slice(1));
    }
  };

  return (
    <Link to={`/album/${album.id}`} className="group block animate-fade-in">
      <div className="relative aspect-square rounded-xl overflow-hidden bg-card shadow-card mb-3">
        <img
          src={album.cover_big}
          alt={album.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <Button
          size="icon"
          onClick={handlePlay}
          className="absolute bottom-3 right-3 h-11 w-11 rounded-full bg-primary text-primary-foreground shadow-glow opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:scale-105"
        >
          <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
        </Button>
      </div>
      <div className="px-1">
        <div className="font-semibold text-sm truncate">{album.title}</div>
        <div className="text-xs text-muted-foreground truncate">{album.artist.name}</div>
      </div>
    </Link>
  );
};

interface ArtistCardProps { artist: Artist }
export const ArtistCard = ({ artist }: ArtistCardProps) => (
  <Link to={`/artist/${artist.id}`} className="group block animate-fade-in">
    <div className="relative aspect-square rounded-full overflow-hidden bg-card shadow-card mb-3 mx-auto max-w-[200px]">
      <img
        src={artist.picture_xl || artist.picture_medium}
        alt={artist.name}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>
    <div className="text-center px-1">
      <div className="font-semibold text-sm truncate">{artist.name}</div>
      <div className="text-xs text-muted-foreground">Artist</div>
    </div>
  </Link>
);

interface RowProps { title: string; subtitle?: string; children: React.ReactNode; }
export const Row = ({ title, subtitle, children }: RowProps) => (
  <section className="space-y-4">
    <div>
      <h2 className="text-2xl font-display font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
      {children}
    </div>
  </section>
);
