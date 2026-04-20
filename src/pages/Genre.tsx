import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ArtistCard, AlbumCard, Row } from "@/components/Cards";
import { ChevronLeft } from "lucide-react";

const Genre = () => {
  const { id } = useParams();
  const gid = Number(id);

  const { data: genres } = useQuery({ queryKey: ["genres"], queryFn: () => api.genres() });
  const { data: artists } = useQuery({ queryKey: ["genreArtists", gid], queryFn: () => api.genreArtists(gid) });
  const { data: releases } = useQuery({ queryKey: ["editorialReleases", gid], queryFn: () => api.editorialReleases(gid) });
  const { data: selection } = useQuery({ queryKey: ["editorialSelection", gid], queryFn: () => api.editorialSelection(gid) });

  const genre = genres?.find(g => g.id === gid);

  return (
    <div className="min-h-full">
      <div
        className="relative h-[280px] overflow-hidden"
        style={{
          background: genre?.picture_xl
            ? `url(${genre.picture_xl}) center/cover`
            : "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="relative h-full flex items-end px-6 lg:px-10 pb-8 animate-fade-in">
          <div>
            <Link to="/genres" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
              <ChevronLeft className="w-4 h-4" /> All genres
            </Link>
            <div className="text-xs uppercase tracking-widest text-primary font-bold mb-2">Genre</div>
            <h1 className="text-5xl sm:text-7xl font-display font-extrabold tracking-tight">{genre?.name || "Loading..."}</h1>
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-10 py-8 space-y-10">
        {artists && artists.length > 0 && (
          <Row title="Top Artists" subtitle={`Most popular in ${genre?.name || "this genre"}`}>
            {artists.slice(0, 12).map(a => <ArtistCard key={a.id} artist={a} />)}
          </Row>
        )}

        {selection && selection.length > 0 && (
          <Row title="Editor's Picks">
            {selection.slice(0, 12).map(a => <AlbumCard key={a.id} album={a} />)}
          </Row>
        )}

        {releases && releases.length > 0 && (
          <Row title="New Releases">
            {releases.slice(0, 12).map(a => <AlbumCard key={a.id} album={a} />)}
          </Row>
        )}
      </div>
    </div>
  );
};

export default Genre;
