import { Sidebar } from "./Sidebar";
import { Player } from "./Player";
import { MobileNav } from "./MobileNav";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto scrollbar-thin pb-[180px] lg:pb-[100px]">
          <Outlet />
        </main>
      </div>
      <MobileNav />
      <Player />
    </div>
  );
};
