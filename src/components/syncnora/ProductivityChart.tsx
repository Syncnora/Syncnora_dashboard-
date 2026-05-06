import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
  { day: "Mon", tasks: 8, focus: 65 },
  { day: "Tue", tasks: 12, focus: 78 },
  { day: "Wed", tasks: 6, focus: 55 },
  { day: "Thu", tasks: 14, focus: 88 },
  { day: "Fri", tasks: 10, focus: 72 },
  { day: "Sat", tasks: 5, focus: 45 },
  { day: "Sun", tasks: 9, focus: 68 },
];

export function ProductivityChart() {
  return (
    <div className="rounded-2xl bg-card border border-border/60 shadow-card p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">Productivity Insights</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Weekly task completion & focus score</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-success/10 text-success text-xs font-bold">
          <TrendingUp className="h-3 w-3" />
          +18%
        </div>
      </div>

      <div className="flex gap-6 mb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
            <span className="text-xs text-muted-foreground">Tasks Completed</span>
          </div>
          <p className="font-display text-2xl font-black text-foreground mt-1">64</p>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-accent" />
            <span className="text-xs text-muted-foreground">Avg Focus Score</span>
          </div>
          <p className="font-display text-2xl font-black text-foreground mt-1">68%</p>
        </div>
      </div>

      <div className="h-[220px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="taskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.35} />
                <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={28} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "var(--shadow-card)",
                fontFamily: "EB Garamond, serif",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
            />
            <Area type="monotone" dataKey="focus" stroke="hsl(var(--accent))" strokeWidth={2.5} fill="url(#focusGrad)" />
            <Area type="monotone" dataKey="tasks" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#taskGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
