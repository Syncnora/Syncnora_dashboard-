import { CheckCircle2, ListTodo, Clock, Receipt, ArrowUpRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  delta: string;
  icon: React.ElementType;
  variant: "primary" | "accent" | "cream" | "muted";
  trend?: "up" | "down";
}

const variantStyles = {
  primary: { iconBg: "bg-gradient-primary text-primary-foreground shadow-glow", accent: "text-primary" },
  accent: { iconBg: "bg-accent text-accent-foreground shadow-accent-glow", accent: "text-accent" },
  cream: { iconBg: "bg-secondary text-secondary-foreground", accent: "text-secondary-foreground" },
  muted: { iconBg: "bg-muted text-foreground", accent: "text-foreground" },
};

function StatCard({ label, value, delta, icon: Icon, variant, trend = "up" }: StatCardProps) {
  const styles = variantStyles[variant];
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card p-5 shadow-card border border-border/60 hover:shadow-elegant transition-smooth gradient-border">
      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-soft opacity-50 blur-2xl group-hover:opacity-80 transition-smooth" />
      <div className="relative flex items-start justify-between mb-4">
        <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center transition-bounce group-hover:scale-110", styles.iconBg)}>
          <Icon className="h-5 w-5" strokeWidth={2.5} />
        </div>
        <div className={cn("flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-lg",
          trend === "up" ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
        )}>
          <TrendingUp className={cn("h-3 w-3", trend === "down" && "rotate-180")} />
          {delta}
        </div>
      </div>
      <div className="relative">
        <p className="text-sm text-muted-foreground font-medium mb-1">{label}</p>
        <div className="flex items-end justify-between">
          <h3 className="font-display text-3xl font-black text-foreground tracking-tight">{value}</h3>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-smooth" />
        </div>
      </div>
    </div>
  );
}

interface StatsGridProps {
  total?: number;
  completed?: number;
  pending?: number;
  outstanding?: number;
}

export function StatsGrid({ total = 48, completed = 32, pending = 16, outstanding = 1240 }: StatsGridProps) {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard label="Total Tasks" value={String(total)} delta="+12%" icon={ListTodo} variant="primary" />
      <StatCard label="Completed" value={String(completed)} delta={`${completionRate}%`} icon={CheckCircle2} variant="accent" />
      <StatCard label="Pending" value={String(pending)} delta="-5%" icon={Clock} variant="cream" trend="down" />
      <StatCard label="Outstanding Bills" value={`$${outstanding.toFixed(0)}`} delta="+2%" icon={Receipt} variant="muted" />
    </div>
  );
}
