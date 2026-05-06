import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserStore, defaultBills, Bill } from "@/lib/store";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/syncnora/PageHeader";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusStyles = {
  paid: "bg-success/10 text-success",
  pending: "bg-accent/10 text-accent",
  overdue: "bg-destructive/10 text-destructive",
};

export default function Bills() {
  const { user } = useAuth();
  const [bills, setBills] = useUserStore<Bill[]>(user?.id, "bills", defaultBills);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", amount: 0, due: new Date().toISOString().slice(0,10), category: "Utilities", status: "pending" as Bill["status"] });

  const total = bills.filter((b) => b.status !== "paid").reduce((s, b) => s + b.amount, 0);
  const paidCount = bills.filter((b) => b.status === "paid").length;
  const overdue = bills.filter((b) => b.status === "overdue").length;

  const markPaid = (id: string) =>
    setBills((prev) => prev.map((b) => (b.id === id ? { ...b, status: "paid" } : b)));

  const remove = (id: string) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
    toast.success("Bill removed");
  };

  const add = () => {
    if (!form.name.trim() || form.amount <= 0) return toast.error("Name and amount required");
    setBills((prev) => [...prev, { id: crypto.randomUUID(), ...form }]);
    setForm({ name: "", amount: 0, due: new Date().toISOString().slice(0,10), category: "Utilities", status: "pending" });
    setOpen(false);
    toast.success("Bill added");
  };

  return (
    <div>
      <PageHeader
        title="Bill Tracking"
        subtitle="Keep tabs on every payment — no missed dues."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="h-10 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow gap-2">
                <Plus className="h-4 w-4" /> Add Bill
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader><DialogTitle>New Bill</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Rent" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Amount</Label>
                    <Input type="number" step="0.01" value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Due date</Label>
                    <Input type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Status</Label>
                    <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter><Button onClick={add} className="bg-gradient-primary text-primary-foreground">Create</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl bg-card border border-border/60 shadow-card p-5">
          <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Outstanding</p>
          <p className="font-display text-3xl font-black text-gradient mt-1">${total.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl bg-card border border-border/60 shadow-card p-5">
          <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Paid this period</p>
          <p className="font-display text-3xl font-black text-foreground mt-1">{paidCount}</p>
        </div>
        <div className="rounded-2xl bg-card border border-border/60 shadow-card p-5">
          <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Overdue</p>
          <p className="font-display text-3xl font-black text-destructive mt-1">{overdue}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border/60 shadow-card overflow-hidden">
        <div className="divide-y divide-border/50">
          {bills.map((b) => (
            <div key={b.id} className="group flex items-center gap-3 p-4 hover:bg-muted/30 transition-smooth">
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <span className="font-display font-bold text-sm">{b.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{b.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{b.category} • Due {b.due}</p>
              </div>
              <div className="text-right">
                <p className="font-display font-bold">${b.amount.toFixed(2)}</p>
                <span className={cn("inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mt-1", statusStyles[b.status])}>
                  {b.status}
                </span>
              </div>
              <div className="flex items-center gap-1 ml-2">
                {b.status !== "paid" && (
                  <button onClick={() => markPaid(b.id)} className="p-2 rounded-md hover:bg-success/10 text-success transition-smooth" title="Mark as paid">
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                )}
                <button onClick={() => remove(b.id)} className="opacity-0 group-hover:opacity-100 p-2 rounded-md hover:bg-destructive/10 text-destructive transition-smooth">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
