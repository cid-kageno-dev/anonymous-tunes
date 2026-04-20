import { NavLink } from "react-router-dom";
import { Home, Search, Library } from "lucide-react";

export const MobileNav = () => {
  const items = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/search", icon: Search, label: "Search" },
    { to: "/library", icon: Library, label: "Library" },
  ];
  return (
    <nav className="lg:hidden fixed bottom-[88px] left-0 right-0 z-40 glass border-t border-glass-border">
      <div className="flex items-center justify-around px-4 py-2">
        {items.map(i => (
          <NavLink
            key={i.to}
            to={i.to}
            end={i.to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-1.5 text-[11px] font-medium transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            <i.icon className="w-5 h-5" />
            {i.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
