import { useState } from "react";
import { Link } from "react-router-dom";
import { usePlayer } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Plus, Heart, ListMusic, Clock, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const Library = () => {
  const { favorites, recents, playlists, createPlaylist, deletePlaylist } = usePlayer();
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  const handleCreate = () => {
    if (!name.trim()) return;
    createPlaylist(name.trim());
    toast.success("Playlist created");
    setName("");
    setOpen(false);
  };

  return (
    <div className="px-6 lg:px-10 py-8 space-y-10">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <h1 className="text-4xl font-display font-extrabold tracking-tight">Your Library</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full"><Plus className="w-4 h-4 mr-2" /> New Playlist</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Playlist</DialogTitle>
              <DialogDescription>Give your playlist a name. It's saved locally on this device.</DialogDescription>
            </DialogHeader>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="My Awesome Mix" onKeyDown={(e) => e.key === "Enter" && handleCreate()} />
            <DialogFooter>
              <Button onClick={handleCreate}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/favorites" className="group p-5 rounded-xl bg-gradient-card hover:shadow-glow transition-all border border-border">
          <div className="w-14 h-14 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 shadow-glow">
            <Heart className="w-7 h-7 text-primary-foreground" fill="currentColor" />
          </div>
          <h3 className="font-display font-bold text-lg">Favorites</h3>
          <p className="text-sm text-muted-foreground">{favorites.length} songs</p>
        </Link>

        <div className="p-5 rounded-xl bg-gradient-card border border-border">
          <div className="w-14 h-14 rounded-lg bg-accent flex items-center justify-center mb-4">
            <Clock className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-lg">Recently Played</h3>
          <p className="text-sm text-muted-foreground">{recents.length} tracks</p>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-display font-bold mb-4">Your Playlists</h2>
        {playlists.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <ListMusic className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">No playlists yet — create your first one!</p>
            <Button variant="outline" onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-2" /> New Playlist</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {playlists.map(p => (
              <div key={p.id} className="group flex items-center justify-between p-4 rounded-xl bg-card hover:bg-accent transition-colors">
                <Link to={`/playlist/${p.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
                    <ListMusic className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.tracks.length} songs</div>
                  </div>
                </Link>
                <Button size="icon" variant="ghost" onClick={() => { deletePlaylist(p.id); toast.success("Playlist deleted"); }} className="opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Library;
