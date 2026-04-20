import { NavLink } from "react-router-dom";
import { Home, Search, Library, Heart, Music2, ListMusic } from "lucide-react";
import { usePlayer } from "@/lib/store";

const links = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/library", icon: Library, label: "Library" },
];

export const Sidebar = () => {
  const playlists = usePlayer(s => s.playlists);
  const favorites = usePlayer(s => s.favorites);

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-sidebar border-r border-sidebar-border h-full">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Music2 className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-display font-bold tracking-tight">Pulse</h1>
        </div>
      </div>

      <nav className="px-3 space-y-1">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/60"
              }`
            }
          >
            <l.icon className="w-5 h-5" />
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 pt-8 pb-3 text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
        Your Library
      </div>
      <div className="px-3 space-y-1 overflow-y-auto scrollbar-thin flex-1 pb-4">
        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive ? "bg-sidebar-accent text-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/60"
            }`
          }
        >
          <div className="w-8 h-8 rounded-md bg-gradient-primary flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary-foreground" fill="currentColor" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate">Favorites</div>
            <div className="text-xs text-muted-foreground">{favorites.length} songs</div>
          </div>
        </NavLink>

        {playlists.map(p => (
          <NavLink
            key={p.id}
            to={`/playlist/${p.id}`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive ? "bg-sidebar-accent text-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/60"
              }`
            }
          >
            <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center shrink-0">
              <ListMusic className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.tracks.length} songs</div>
            </div>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};
