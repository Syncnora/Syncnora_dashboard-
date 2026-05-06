import { useState } from "react";
import { Bell, Search, ChevronDown, LogOut, User as UserIcon, Settings as SettingsIcon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GlobalSearch, useGlobalSearchHotkey } from "./GlobalSearch";

export function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  useGlobalSearchHotkey(setSearchOpen);

  return (
    <header className="h-16 border-b border-topbar-border bg-topbar/95 backdrop-blur-xl sticky top-0 z-40">
      <div className="h-full flex items-center gap-3 px-4 md:px-6">
        <SidebarTrigger className="h-9 w-9 rounded-lg text-topbar-foreground hover:bg-topbar-muted transition-smooth" />

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="hidden md:flex relative flex-1 max-w-md items-center h-10 pl-10 pr-3 rounded-xl bg-topbar-muted border border-transparent hover:border-primary/30 transition-smooth text-left"
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-topbar-muted-foreground" />
          <span className="font-body text-sm text-topbar-muted-foreground">
            Search tasks, reminders, bills...
          </span>
          <kbd className="ml-auto hidden lg:inline-flex h-6 items-center gap-1 rounded-md border border-topbar-border bg-topbar px-1.5 text-[10px] font-mono text-topbar-muted-foreground">
            ⌘K
          </kbd>
        </button>

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="md:hidden h-10 w-10 rounded-xl flex items-center justify-center text-topbar-foreground hover:bg-topbar-muted transition-smooth"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>

        <div className="flex-1" />

        

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 h-10 pl-1 pr-3 rounded-xl hover:bg-topbar-muted transition-smooth">
              <Avatar className="h-8 w-8 ring-2 ring-primary/30">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground font-display font-bold text-sm">
                  {user?.avatarInitials || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left leading-tight">
                <div className="text-sm font-semibold text-topbar-foreground">{user?.name}</div>
                <div className="text-[11px] text-topbar-muted-foreground capitalize">
                  {user?.role === "admin" ? "Admin" : "Member"}
                </div>
              </div>
              <ChevronDown className="hidden md:block h-4 w-4 text-topbar-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl">
            <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/app/settings")}>
              <UserIcon className="h-4 w-4 mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/app/settings")}>
              <SettingsIcon className="h-4 w-4 mr-2" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
