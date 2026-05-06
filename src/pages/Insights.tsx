import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  useUserStore,
  defaultTasks,
  defaultRoutines,
  Task,
  Routine,
} from "@/lib/store";
import { ProductivityChart } from "@/components/syncnora/ProductivityChart";
import { PageHeader } from "@/components/syncnora/PageHeader";
import {
  TrendingUp,
  Award,
  Target,
  Flame,
} from "lucide-react";

export default function Insights() {
  const { user } = useAuth();

  const [tasks] = useUserStore<Task[]>(
    user?.id,
    "tasks",
    defaultTasks
  );

  const [routines] = useUserStore<Routine[]>(
    user?.id,
    "routines",
    defaultRoutines
  );

  // ✅ TOP useEffect
  useEffect(() => {
    document.title = "Insights | Syncnora";

    if (user?.id) {
      console.log("Insights page loaded for user:", user.id);
    }

    // future: analytics tracking, AI insights refresh, API sync
  }, [user?.id]);

  const completionRate =
    tasks.length > 0
      ? Math.round(
          (tasks.filter((t) => t.done).length / tasks.length) * 100
        )
      : 0;

  const streak = Math.max(0, ...routines.map((r) => r.streak));

  const focusAvg =
    routines.length > 0
      ? Math.round(
          routines.reduce((s, r) => s + r.progress, 0) /
            routines.length
        )
      : 0;

  const stats = [
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      icon: Target,
      color: "text-primary bg-primary/10",
    },
    {
      label: "Best Streak",
      value: `${streak} days`,
      icon: Flame,
      color: "text-accent bg-accent/10",
    },
    {
      label: "Focus Average",
      value: `${focusAvg}%`,
      icon: TrendingUp,
      color: "text-success bg-success/10",
    },
    {
      label: "Achievements",
      value: "12",
      icon: Award,
      color: "text-secondary-foreground bg-secondary",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Productivity Insights"
        subtitle="See how your habits and focus evolve over time."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-card border border-border/60 shadow-card p-5"
          >
            <div
              className={`h-11 w-11 rounded-xl flex items-center justify-center mb-3 ${s.color}`}
            >
              <s.icon className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              {s.label}
            </p>
            <p className="font-display text-2xl font-black text-foreground mt-1">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="mb-6">
        <ProductivityChart />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-card border border-border/60 shadow-card p-5">
          <h3 className="font-display text-lg font-bold mb-4">
            Routine performance
          </h3>

          <div className="space-y-3">
            {routines.map((r) => (
              <div key={r.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold">
                    {r.label}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold">
                    {r.progress}%
                  </span>
                </div>

                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-primary transition-all duration-700"
                    style={{ width: `${r.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-cream border border-accent/20 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-secondary-foreground/70 mb-2">
            AI Insight
          </p>

          <h3 className="font-display text-xl font-black text-secondary-foreground leading-snug mb-2">
            You're {completionRate}% productive this week 🎯
          </h3>

          <p className="text-sm text-secondary-foreground/80 leading-relaxed">
            Your consistency on morning routines is paying off. Keep
            the streak alive by tackling your highest-priority task
            before lunch.
          </p>
        </div>
      </div>
    </div>
  );
}