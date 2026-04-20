import { Track, formatDuration } from "@/lib/api";
import { usePlayer } from "@/lib/store";
import { Play, Pause, Heart, MoreHorizontal, Plus, ListPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Props {
  track: Track;
  index?: number;
  queue?: Track[];
  showAlbum?: boolean;
}

export const TrackRow = ({ track, index, queue, showAlbum = true }: Props) => {
  const { currentTrack, isPlaying, playTrack, togglePlay, addToQueue, toggleFavorite, isFavorite, playlists, addToPlaylist } = usePlayer();
  const isCurrent = currentTrack?.id === track.id;
  const fav = isFavorite(track.id);

  const handlePlay = () => {
    if (isCurrent) togglePlay();
    else playTrack(track, queue);
  };

  return (
    <div
      onDoubleClick={handlePlay}
      className={`group grid grid-cols-[24px_1fr_auto] sm:grid-cols-[24px_1fr_1fr_auto_auto] gap-3 sm:gap-4 items-center px-3 py-2 rounded-lg hover:bg-accent/60 transition-colors ${isCurrent ? "bg-accent/40" : ""}`}
    >
      <div className="text-sm text-muted-foreground tabular-nums text-center relative">
        <span className="group-hover:hidden">
          {isCurrent && isPlaying ? (
            <div className="flex items-end gap-0.5 justify-center h-3">
              <div className="w-0.5 bg-primary animate-bar" style={{ animationDelay: "0ms" }} />
              <div className="w-0.5 bg-primary animate-bar" style={{ animationDelay: "150ms" }} />
              <div className="w-0.5 bg-primary animate-bar" style={{ animationDelay: "300ms" }} />
            </div>
          ) : (index !== undefined ? index + 1 : "")}
        </span>
        <button onClick={handlePlay} className="hidden group-hover:block w-full text-foreground">
          {isCurrent && isPlaying ? <Pause className="w-3.5 h-3.5 mx-auto" fill="currentColor" /> : <Play className="w-3.5 h-3.5 mx-auto" fill="currentColor" />}
        </button>
      </div>

      <div className="flex items-center gap-3 min-w-0">
        <img src={track.album.cover_medium} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
        <div className="min-w-0">
          <div className={`font-medium text-sm truncate ${isCurrent ? "text-primary" : ""}`}>{track.title}</div>
          <div className="text-xs text-muted-foreground truncate">{track.artist.name}</div>
        </div>
      </div>

      {showAlbum && (
        <div className="hidden sm:block text-sm text-muted-foreground truncate">{track.album.title}</div>
      )}

      <div className="hidden sm:block text-xs text-muted-foreground tabular-nums">{formatDuration(track.duration)}</div>

      <div className="flex items-center gap-1">
        <Button
          size="icon" variant="ghost"
          className={`h-8 w-8 ${fav ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
          onClick={() => { toggleFavorite(track); toast.success(fav ? "Removed from favorites" : "Added to favorites"); }}
        >
          <Heart className={`w-4 h-4 ${fav ? "fill-primary text-primary" : ""}`} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8 opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => { addToQueue(track); toast.success("Added to queue"); }}>
              <ListPlus className="w-4 h-4 mr-2" /> Add to Queue
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger><Plus className="w-4 h-4 mr-2" /> Add to Playlist</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {playlists.length === 0 ? (
                  <DropdownMenuItem disabled>No playlists yet</DropdownMenuItem>
                ) : playlists.map(p => (
                  <DropdownMenuItem key={p.id} onClick={() => { addToPlaylist(p.id, track); toast.success(`Added to ${p.name}`); }}>
                    {p.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toggleFavorite(track)}>
              <Heart className="w-4 h-4 mr-2" /> {fav ? "Remove from" : "Add to"} Favorites
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
