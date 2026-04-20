import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, Track } from "@/lib/api";
import { AlbumCard, ArtistCard, Row } from "@/components/Cards";
import { SkeletonGrid } from "@/components/Skeleton";
import { TrackRow } from "@/components/TrackRow";
import { usePlayer } from "@/lib/store";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { data: tracks, isLoading: tracksLoading } = useQuery({ queryKey: ["chartTracks"], queryFn: () => api.chartTracks(12) });
  const { data: albums, isLoading: albumsLoading } = useQuery({ queryKey: ["chartAlbums"], queryFn: () => api.chartAlbums(12) });
  const { data: artists, isLoading: artistsLoading } = useQuery({ queryKey: ["chartArtists"], queryFn: () => api.chartArtists(12) });

  const playTrack = usePlayer(s => s.playTrack);
  const recents = usePlayer(s => s.recents);

  const hero = tracks?.[0];

  return (
    <div className="min-h-full">
      {/* Hero */}
      {hero && (
        <div className="relative h-[420px] overflow-hidden">
          <div className="absolute inset-0">
            <img src={hero.album.cover_xl} alt="" className="w-full h-full object-cover scale-110 blur-3xl opacity-40" />
            <div className="absolute inset-0 bg-gradient-fade" />
          </div>
          <div className="relative h-full flex items-end px-6 lg:px-10 pb-10 animate-fade-in">
            <div className="flex items-end gap-6 max-w-4xl">
              <img src={hero.album.cover_xl} alt={hero.title} className="hidden sm:block w-48 h-48 rounded-2xl shadow-glow object-cover" />
              <div>
                <div className="text-xs uppercase tracking-widest text-primary font-bold mb-3">#1 Trending</div>
                <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight mb-2">{hero.title}</h1>
                <p className="text-lg text-muted-foreground mb-6">{hero.artist.name} · {hero.album.title}</p>
                <Button
                  size="lg"
                  onClick={() => playTrack(hero, tracks!.slice(1))}
                  className="rounded-full bg-primary hover:bg-primary/90 shadow-glow font-semibold"
                >
                  <Play className="w-5 h-5 mr-2" fill="currentColor" /> Play Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 lg:px-10 py-8 space-y-12">
        {/* Recently played */}
        {recents.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-display font-bold tracking-tight">Recently Played</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recents.slice(0, 8).map((t, i) => (
                <TrackRow key={`r-${t.id}-${i}`} track={t} index={i} queue={recents.slice(i + 1)} />
              ))}
            </div>
          </section>
        )}

        {/* Trending tracks */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-display font-bold tracking-tight">Trending Now</h2>
            <p className="text-sm text-muted-foreground mt-0.5">The most-played tracks right now</p>
          </div>
          {tracksLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-14 bg-muted/50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {tracks?.slice(0, 10).map((t, i) => (
                <TrackRow key={t.id} track={t} index={i} queue={tracks.slice(i + 1)} />
              ))}
            </div>
          )}
        </section>

        {/* Top albums */}
        <Row title="Top Albums" subtitle="Most popular albums this week">
          {albumsLoading ? <SkeletonGrid count={6} /> : albums?.slice(0, 12).map(a => <AlbumCard key={a.id} album={a} />)}
        </Row>

        {/* Top artists */}
        <Row title="Top Artists" subtitle="Discover today's biggest names">
          {artistsLoading ? <SkeletonGrid count={6} /> : artists?.slice(0, 12).map(a => <ArtistCard key={a.id} artist={a} />)}
        </Row>
      </div>
    </div>
  );
};

export default Index;
