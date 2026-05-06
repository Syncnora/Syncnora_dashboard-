import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  useUserStore,
  defaultTasks,
  defaultReminders,
  defaultBills,
  defaultRoutines,
  Task,
  Reminder,
  Bill,
  Routine,
} from "@/lib/store";
import { StatsGrid } from "@/components/syncnora/StatsGrid";
import { ProductivityChart } from "@/components/syncnora/ProductivityChart";
import { Sun, CheckCircle2, Bell, Receipt } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();

  const [tasks] = useUserStore<Task[]>(
    user?.id,
    "tasks",
    defaultTasks
  );
  const [reminders] = useUserStore<Reminder[]>(
    user?.id,
    "reminders",
    defaultReminders
  );
  const [bills] = useUserStore<Bill[]>(
    user?.id,
    "bills",
    defaultBills
  );
  const [routines] = useUserStore<Routine[]>(
    user?.id,
    "routines",
    defaultRoutines
  );

  // ✅ TOP useEffect (initial dashboard setup)
  useEffect(() => {
    document.title = "Dashboard | Syncnora";

    // optional debug / tracking
    if (user?.id) {
      console.log("Dashboard loaded for user:", user.id);
    }

    // future place: API sync, analytics, cache refresh
  }, [user?.id]);

  const pending = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);
  const upcomingBill = bills.find((b) => b.status !== "paid");
  const completedRoutines = routines.filter((r) => r.progress === 100).length;

  const focusScore = Math.round(
    ((done.length + completedRoutines) /
      Math.max(1, tasks.length + routines.length)) *
      100
  );

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 animate-fade-in">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-cream text-secondary-foreground text-xs font-semibold mb-3">
            <Sun className="h-3.5 w-3.5" />
            {today}
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight text-foreground">
            Good day,{" "}
            <span className="text-gradient">
              {user?.name?.split(" ")[0]}
            </span>{" "}
            ✨
          </h1>

          <p className="text-muted-foreground mt-2 text-base">
            You've got {pending.length} pending tasks,{" "}
            {reminders.length} reminders, and{" "}
            {bills.filter((b) => b.status !== "paid").length} bills upcoming.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Focus Score
            </p>
            <p className="font-display text-2xl font-black text-gradient">
              {focusScore}%
            </p>
          </div>

          <div className="h-12 w-px bg-border" />

          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Completed
            </p>
            <p className="font-display text-2xl font-black text-foreground">
              {done.length}
              <span className="text-sm text-muted-foreground font-normal">
                /{tasks.length}
              </span>
            </p>
          </div>
        </div>
      </section>

      <StatsGrid
        total={tasks.length}
        completed={done.length}
        pending={pending.length}
        outstanding={bills
          .filter((b) => b.status !== "paid")
          .reduce((s, b) => s + b.amount, 0)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductivityChart />
        </div>

        <div className="rounded-2xl bg-card border border-border/60 shadow-card overflow-hidden">
          <div className="p-5 border-b border-border/60">
            <h3 className="font-display text-lg font-bold">Quick links</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Jump to any workspace
            </p>
          </div>

          <div className="divide-y divide-border/50">
            <Link
              to="/app/tasks"
              className="flex items-center gap-3 p-4 hover:bg-muted/40 transition-smooth"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Tasks & To-Do</p>
                <p className="text-xs text-muted-foreground">
                  {pending.length} pending
                </p>
              </div>
            </Link>

            <Link
              to="/app/reminders"
              className="flex items-center gap-3 p-4 hover:bg-muted/40 transition-smooth"
            >
              <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <Bell className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Smart Reminders</p>
                <p className="text-xs text-muted-foreground">
                  {reminders.length} scheduled
                </p>
              </div>
            </Link>

            <Link
              to="/app/bills"
              className="flex items-center gap-3 p-4 hover:bg-muted/40 transition-smooth"
            >
              <div className="h-10 w-10 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center">
                <Receipt className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Bills</p>
                <p className="text-xs text-muted-foreground">
                  {upcomingBill
                    ? `${upcomingBill.name} due ${upcomingBill.due}`
                    : "All paid"}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}