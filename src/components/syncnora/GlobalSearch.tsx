import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useAuth } from "@/context/AuthContext";
import {
  useUserStore,
  defaultTasks,
  defaultRoutines,
  defaultReminders,
  defaultBills,
  Task,
  Routine,
  Reminder,
  Bill,
} from "@/lib/store";
import {
  CheckSquare,
  Repeat,
  BellRing,
  Receipt,
  TrendingUp,
  Settings as SettingsIcon,
  ShieldCheck,
  LayoutDashboard,
  Search,
} from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [tasks] = useUserStore<Task[]>(user?.id, "tasks", defaultTasks);
  const [routines] = useUserStore<Routine[]>(user?.id, "routines", defaultRoutines);
  const [reminders] = useUserStore<Reminder[]>(user?.id, "reminders", defaultReminders);
  const [bills] = useUserStore<Bill[]>(user?.id, "bills", defaultBills);

  const go = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  const pages = useMemo(
    () =>
      [
        { name: "Dashboard", path: "/app", icon: LayoutDashboard },
        { name: "Tasks & To-Do", path: "/app/tasks", icon: CheckSquare },
        { name: "Routines", path: "/app/routines", icon: Repeat },
        { name: "Smart Reminders", path: "/app/reminders", icon: BellRing },
        { name: "Bill Tracking", path: "/app/bills", icon: Receipt },
        { name: "Productivity Insights", path: "/app/insights", icon: TrendingUp },
        { name: "Settings", path: "/app/settings", icon: SettingsIcon },
        ...(isAdmin ? [{ name: "Admin", path: "/app/admin", icon: ShieldCheck }] : []),
      ],
    [isAdmin]
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search tasks, routines, reminders, bills, pages..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Pages">
          {pages.map((p) => (
            <CommandItem
              key={p.path}
              value={`page ${p.name}`}
              onSelect={() => go(p.path)}
            >
              <p.icon className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{p.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        {tasks.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Tasks & To-Do">
              {tasks.map((t) => (
                <CommandItem
                  key={t.id}
                  value={`task ${t.title} ${t.category} ${t.priority}`}
                  onSelect={() => go("/app/tasks")}
                >
                  <CheckSquare className="h-4 w-4 mr-2 text-primary" />
                  <span className="flex-1 truncate">{t.title}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground ml-2">
                    {t.priority}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {routines.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Routines">
              {routines.map((r) => (
                <CommandItem
                  key={r.id}
                  value={`routine ${r.label}`}
                  onSelect={() => go("/app/routines")}
                >
                  <Repeat className="h-4 w-4 mr-2 text-primary" />
                  <span className="flex-1 truncate">{r.label}</span>
                  <span className="text-[10px] text-muted-foreground ml-2">
                    🔥 {r.streak}d
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {reminders.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Smart Reminders">
              {reminders.map((r) => (
                <CommandItem
                  key={r.id}
                  value={`reminder ${r.title} ${r.type}`}
                  onSelect={() => go("/app/reminders")}
                >
                  <BellRing className="h-4 w-4 mr-2 text-accent" />
                  <span className="flex-1 truncate">{r.title}</span>
                  <span className="text-[10px] text-muted-foreground ml-2">
                    {r.date} • {r.at}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {bills.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Bill Tracking">
              {bills.map((b) => (
                <CommandItem
                  key={b.id}
                  value={`bill ${b.name} ${b.category} ${b.status}`}
                  onSelect={() => go("/app/bills")}
                >
                  <Receipt className="h-4 w-4 mr-2 text-primary" />
                  <span className="flex-1 truncate">{b.name}</span>
                  <span className="text-[10px] text-muted-foreground ml-2">
                    ${b.amount.toFixed(2)} • {b.status}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}

// Hook to open with ⌘K / Ctrl+K
export function useGlobalSearchHotkey(setOpen: (v: boolean) => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setOpen]);
}

export { Search };
