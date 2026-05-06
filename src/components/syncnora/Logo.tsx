import { Sparkles } from "lucide-react";

export const SyncnoraLogo = ({ collapsed = false, dark = false }: { collapsed?: boolean; dark?: boolean }) => (
  <div className="flex items-center gap-2.5">
    <div className="relative h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
      <Sparkles className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
      <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-accent animate-pulse-glow" />
    </div>
    {!collapsed && (
      <div className="flex flex-col leading-none">
        <span className={`font-display font-black text-lg tracking-tight ${dark ? "text-sidebar-foreground" : "text-foreground"}`}>
          Syncnora
        </span>
        <span className={`text-[10px] uppercase tracking-[0.2em] font-semibold ${dark ? "text-sidebar-foreground/50" : "text-muted-foreground"}`}>
          AI Productivity
        </span>
      </div>
    )}
  </div>
);
