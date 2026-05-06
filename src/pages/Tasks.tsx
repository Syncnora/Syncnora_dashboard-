import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserStore, defaultTasks, Task } from "@/lib/store";
import { Plus, Flag, Trash2, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/syncnora/PageHeader";
import { toast } from "sonner";

const priorityStyles = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-accent/10 text-accent border-accent/20",
  low: "bg-primary/10 text-primary border-primary/20",
};

export default function Tasks() {
  const { user } = useAuth();

  const [tasks, setTasks] = useUserStore<Task[]>(
    user?.id,
    "tasks",
    defaultTasks
  );

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");

  const [form, setForm] = useState({
    title: "",
    time: "",
    priority: "medium" as Task["priority"],
    category: "Work",
  });

  // ✅ TOP useEffect
  useEffect(() => {
    document.title = "Tasks | Syncnora";

    if (user?.id) {
      console.log("Tasks page loaded for user:", user.id);
    }

    // future: sync tasks, analytics, auto-save, reminders refresh
  }, [user?.id]);

  const filtered = tasks.filter((t) => {
    if (filter === "pending" && t.done) return false;
    if (filter === "done" && !t.done) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const toggle = (id: string) =>
    setTasks((prev) =>
      prev.map((x) => (x.id === id ? { ...x, done: !x.done } : x))
    );

  const remove = (id: string) => {
    setTasks((prev) => prev.filter((x) => x.id !== id));
    toast.success("Task deleted");
  };

  const add = () => {
    if (!form.title.trim()) return toast.error("Title required");

    setTasks((prev) => [
      {
        id: crypto.randomUUID(),
        ...form,
        done: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    setForm({
      title: "",
      time: "",
      priority: "medium",
      category: "Work",
    });

    setOpen(false);
    toast.success("Task added");
  };

  return (
    <div>
      <PageHeader
        title="Tasks & To-Do"
        subtitle="Organize, prioritize, and complete your day's work."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="h-10 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow gap-2">
                <Plus className="h-4 w-4" /> Add Task
              </Button>
            </DialogTrigger>

            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle>New Task</DialogTitle>
              </DialogHeader>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Title</Label>
                  <Input
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="What needs doing?"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Time</Label>
                    <Input
                      value={form.time}
                      onChange={(e) =>
                        setForm({ ...form, time: e.target.value })
                      }
                      placeholder="9:00 AM"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Input
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      placeholder="Work"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Priority</Label>
                  <Select
                    value={form.priority}
                    onValueChange={(v: any) =>
                      setForm({ ...form, priority: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={add}
                  className="bg-gradient-primary text-primary-foreground"
                >
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="pl-10 h-10 rounded-xl"
          />
        </div>

        <Tabs value={filter} onValueChange={(v: any) => setFilter(v)}>
          <TabsList>
            <TabsTrigger value="all">
              All ({tasks.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({tasks.filter((t) => !t.done).length})
            </TabsTrigger>
            <TabsTrigger value="done">
              Done ({tasks.filter((t) => t.done).length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Task List */}
      <div className="rounded-2xl bg-card border border-border/60 shadow-card overflow-hidden">
        <div className="divide-y divide-border/50">
          {filtered.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              No tasks here. Add one to get started.
            </div>
          )}

          {filtered.map((t) => (
            <div
              key={t.id}
              className={cn(
                "group flex items-center gap-3 p-4 hover:bg-muted/40 transition-smooth",
                t.done && "opacity-60"
              )}
            >
              <Checkbox
                checked={t.done}
                onCheckedChange={() => toggle(t.id)}
                className="h-5 w-5 rounded-md data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />

              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "font-body text-[15px] text-foreground truncate",
                    t.done && "line-through text-muted-foreground"
                  )}
                >
                  {t.title}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  {t.time && (
                    <>
                      <span className="text-xs text-muted-foreground">
                        {t.time}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                    </>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {t.category}
                  </span>
                </div>
              </div>

              <span
                className={cn(
                  "hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md border capitalize",
                  priorityStyles[t.priority]
                )}
              >
                <Flag className="h-2.5 w-2.5" /> {t.priority}
              </span>

              <button
                onClick={() => remove(t.id)}
                className="opacity-0 group-hover:opacity-100 transition-smooth p-2 rounded-md hover:bg-destructive/10 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}