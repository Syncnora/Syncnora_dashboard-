import { useEffect, useState } from "react";
import { listAllUsers, deleteUserById, useAuth, User } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/syncnora/PageHeader";
import { ShieldCheck, Trash2, Users, UserCheck, Activity } from "lucide-react";
import { toast } from "sonner";

export default function Admin() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  const refresh = () => setUsers(listAllUsers());
  useEffect(refresh, []);

  const remove = (id: string) => {
    if (id === me?.id) return toast.error("You can't delete your own account here");
    deleteUserById(id);
    refresh();
    toast.success("User removed");
  };

  const stats = [
    { label: "Total users", value: users.length, icon: Users, color: "text-primary bg-primary/10" },
    { label: "Admins", value: users.filter(u => u.role === "admin").length, icon: ShieldCheck, color: "text-accent bg-accent/10" },
    { label: "Active members", value: users.filter(u => u.role === "user").length, icon: UserCheck, color: "text-success bg-success/10" },
    { label: "Sessions today", value: 1, icon: Activity, color: "text-secondary-foreground bg-secondary" },
  ];

  return (
    <div>
      <PageHeader
        title="Admin Console"
        subtitle="Manage users, roles, and platform-wide settings."
        badge={
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" /> Admin only
          </span>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-card border border-border/60 shadow-card p-5">
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
            <p className="font-display text-2xl font-black text-foreground mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-card border border-border/60 shadow-card overflow-hidden">
        <div className="p-5 border-b border-border/60 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold">Users</h3>
            <p className="text-xs text-muted-foreground mt-0.5">All registered Syncnora accounts</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/40">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-semibold">User</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Joined</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30 transition-smooth">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold text-xs">{u.avatarInitials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{u.name}</p>
                        {u.id === me?.id && <p className="text-[10px] text-primary font-bold uppercase">You</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      u.role === "admin" ? "bg-accent/15 text-accent" : "bg-primary/10 text-primary"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(u.id)}
                      disabled={u.id === me?.id}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
