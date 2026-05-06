import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserStore, defaultRoutines, Routine } from "@/lib/store";
import { Plus, Flame, Coffee, Dumbbell, BookOpen, Moon, Sparkles, Trash2, Heart, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/syncnora/PageHeader";
import { toast } from "sonner";

const ICONS: Record<string, any> = { Coffee, Dumbbell, BookOpen, Moon, Sparkles, Heart, Music };

export default function Routines() {
  const { user } = useAuth();
  const [routines, setRoutines] = useUserStore<Routine[]>(user?.id, "routines", defaultRoutines);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ label: "", icon: "Coffee" });

  const completed = routines.filter((r) => r.progress === 100).length;
  const totalProgress = routines.length > 0 ? Math.round(routines.reduce((s,r)=>s+r.progress,0) / routines.length) : 0;

  const setProgress = (id: string, p: number) =>
    setRoutines((prev) => prev.map((r) => (r.id === id ? { ...r, progress: p, streak: p === 100 ? r.streak + 1 : r.streak } : r)));

  const remove = (id: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== id));
    toast.success("Routine removed");
  };

  const add = () => {
    if (!form.label.trim()) return toast.error("Label required");
    setRoutines((prev) => [...prev, { id: crypto.randomUUID(), label: form.label, icon: form.icon, progress: 0, streak: 0 }]);
    setForm({ label: "", icon: "Coffee" });
    setOpen(false);
    toast.success("Routine added");
  };

  return (
    <div>
      <PageHeader
        title="Daily Routines"
        subtitle="Build healthy habits with consistent daily check-ins."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="h-10 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow gap-2">
                <Plus className="h-4 w-4" /> Add Routine
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader><DialogTitle>New Routine</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Label</Label>
                  <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. Meditation" />
                </div>
                <div className="space-y-1.5">
                  <Label>Icon</Label>
                  <Select value={form.icon} onValueChange={(v) => setForm({ ...form, icon: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(ICONS).map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter><Button onClick={add} className="bg-gradient-primary text-primary-foreground">Create</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="rounded-2xl bg-card border border-border/60 shadow-card p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Today</p>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-cream">
              <Flame className="h-4 w-4 text-accent" strokeWidth={2.5} />
              <span className="font-display font-bold text-sm text-secondary-foreground">7 day streak</span>
            </div>
          </div>
          <div className="relative h-40 w-40 mx-auto">
            <svg className="h-40 w-40 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
              <circle cx="50" cy="50" r="42" stroke="url(#g)" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={`${(totalProgress/100)*264} 264`} />
              <defs>
                <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-4xl font-black text-foreground">{totalProgress}%</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Complete</span>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">{completed} of {routines.length} routines completed</p>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {routines.map((r) => {
            const Icon = ICONS[r.icon] || Sparkles;
            return (
              <div key={r.id} className="group rounded-2xl bg-card border border-border/60 shadow-card p-5 hover:shadow-elegant transition-smooth">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-11 w-11 rounded-xl bg-gradient-soft flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" strokeWidth={2.5} />
                  </div>
                  <button onClick={() => remove(r.id)} className="opacity-0 group-hover:opacity-100 p-2 rounded-md hover:bg-destructive/10 text-destructive transition-smooth">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="font-display font-bold text-foreground">{r.label}</p>
                <p className="text-xs text-muted-foreground mb-3">🔥 {r.streak} day streak</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <span className="text-xs font-bold text-foreground">{r.progress}%</span>
                </div>
                <Slider value={[r.progress]} onValueChange={(v) => setProgress(r.id, v[0])} max={100} step={5} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
