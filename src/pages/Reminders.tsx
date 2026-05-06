import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserStore, defaultReminders, Reminder } from "@/lib/store";
import { Plus, Bell, Trash2, Video, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/syncnora/PageHeader";
import { toast } from "sonner";

const TYPE_ICON = { meeting: Video, errand: MapPin, personal: Calendar } as const;

export default function Reminders() {
  const { user } = useAuth();
  const [reminders, setReminders] = useUserStore<Reminder[]>(user?.id, "reminders", defaultReminders);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", at: "", date: new Date().toISOString().slice(0,10), urgent: false, type: "personal" as Reminder["type"] });

  const remove = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    toast.success("Reminder removed");
  };

  const add = () => {
    if (!form.title.trim()) return toast.error("Title required");
    setReminders((prev) => [...prev, { id: crypto.randomUUID(), ...form }]);
    setForm({ title: "", at: "", date: new Date().toISOString().slice(0,10), urgent: false, type: "personal" });
    setOpen(false);
    toast.success("Reminder added");
  };

  const today = reminders.filter(r => r.date === new Date().toISOString().slice(0,10));
  const upcoming = reminders.filter(r => r.date > new Date().toISOString().slice(0,10));

  const Section = ({ title, items }: { title: string; items: Reminder[] }) => (
    <div className="rounded-2xl bg-card border border-border/60 shadow-card overflow-hidden">
      <div className="p-5 border-b border-border/60">
        <h3 className="font-display text-lg font-bold">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{items.length} reminders</p>
      </div>
      <div className="divide-y divide-border/50">
        {items.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">Nothing here.</div>}
        {items.map((r) => {
          const Icon = TYPE_ICON[r.type];
          return (
            <div key={r.id} className="group flex items-center gap-3 p-4 hover:bg-muted/40 transition-smooth">
              <div className="relative h-10 w-10 rounded-xl bg-gradient-soft flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-primary" strokeWidth={2.5} />
                {r.urgent && <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-card animate-pulse" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{r.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{r.date} • {r.at}</p>
              </div>
              {r.urgent && <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-accent/15 text-accent">Urgent</span>}
              <button onClick={() => remove(r.id)} className="opacity-0 group-hover:opacity-100 p-2 rounded-md hover:bg-destructive/10 text-destructive transition-smooth">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Smart Reminders"
        subtitle="Stay ahead — let Syncnora ping you at the perfect moment."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="h-10 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow gap-2">
                <Plus className="h-4 w-4" /> Add Reminder
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader><DialogTitle>New Reminder</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Doctor appointment" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Date</Label>
                    <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Time</Label>
                    <Input value={form.at} onChange={(e) => setForm({ ...form, at: e.target.value })} placeholder="2:00 PM" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="errand">Errand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-border p-3">
                  <Label htmlFor="urgent" className="cursor-pointer">Mark as urgent</Label>
                  <Switch id="urgent" checked={form.urgent} onCheckedChange={(v) => setForm({ ...form, urgent: v })} />
                </div>
              </div>
              <DialogFooter><Button onClick={add} className="bg-gradient-primary text-primary-foreground">Create</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Section title="Today" items={today} />
        <Section title="Upcoming" items={upcoming} />
      </div>
    </div>
  );
}
