import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Search as SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TrackRow } from "@/components/TrackRow";
import { AlbumCard, ArtistCard } from "@/components/Cards";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Search = () => {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 350);
    return () => clearTimeout(t);
  }, [q]);

  const { data: tracks, isLoading: lt } = useQuery({
    queryKey: ["search-tracks", debounced],
    queryFn: () => api.searchTracks(debounced),
    enabled: debounced.length > 1,
  });
  const { data: albums } = useQuery({
    queryKey: ["search-albums", debounced],
    queryFn: () => api.searchAlbums(debounced),
    enabled: debounced.length > 1,
  });
  const { data: artists } = useQuery({
    queryKey: ["search-artists", debounced],
    queryFn: () => api.searchArtists(debounced),
    enabled: debounced.length > 1,
  });

  return (
    <div className="px-6 lg:px-10 py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-display font-extrabold tracking-tight mb-6">Search</h1>
        <div className="relative max-w-2xl">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Songs, albums, artists..."
            className="h-14 pl-12 pr-12 text-base bg-card border-0 rounded-xl"
          />
          {q && (
            <button onClick={() => setQ("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {!debounced && (
        <div className="text-center py-20 text-muted-foreground animate-fade-in">
          <SearchIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">Search for your favorite songs, albums, and artists</p>
        </div>
      )}

      {debounced && (
        <Tabs defaultValue="all" className="animate-fade-in">
          <TabsList className="bg-card">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="songs">Songs</TabsTrigger>
            <TabsTrigger value="albums">Albums</TabsTrigger>
            <TabsTrigger value="artists">Artists</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-10 mt-6">
            {tracks && tracks.length > 0 && (
              <section>
                <h2 className="text-xl font-display font-bold mb-4">Top Songs</h2>
                <div className="space-y-1">
                  {tracks.slice(0, 5).map((t, i) => <TrackRow key={t.id} track={t} index={i} queue={tracks.slice(i + 1)} />)}
                </div>
              </section>
            )}
            {artists && artists.length > 0 && (
              <section>
                <h2 className="text-xl font-display font-bold mb-4">Artists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                  {artists.slice(0, 6).map(a => <ArtistCard key={a.id} artist={a} />)}
                </div>
              </section>
            )}
            {albums && albums.length > 0 && (
              <section>
                <h2 className="text-xl font-display font-bold mb-4">Albums</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                  {albums.slice(0, 6).map(a => <AlbumCard key={a.id} album={a} />)}
                </div>
              </section>
            )}
            {!lt && tracks?.length === 0 && (
              <p className="text-center text-muted-foreground py-10">No results found for "{debounced}"</p>
            )}
          </TabsContent>

          <TabsContent value="songs" className="mt-6 space-y-1">
            {tracks?.map((t, i) => <TrackRow key={t.id} track={t} index={i} queue={tracks.slice(i + 1)} />)}
          </TabsContent>
          <TabsContent value="albums" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {albums?.map(a => <AlbumCard key={a.id} album={a} />)}
            </div>
          </TabsContent>
          <TabsContent value="artists" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {artists?.map(a => <ArtistCard key={a.id} artist={a} />)}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Search;
