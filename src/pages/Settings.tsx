import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  useUserStore,
  defaultSettings,
  UserSettings,
} from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/syncnora/PageHeader";
import { toast } from "sonner";

export default function Settings() {
  const { user, updateProfile, logout } = useAuth();

  const [settings, setSettings] = useUserStore<UserSettings>(
    user?.id,
    "settings",
    defaultSettings
  );

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  // ✅ TOP useEffect
  useEffect(() => {
    document.title = "Settings | Syncnora";

    if (user?.id) {
      console.log("Settings page loaded for user:", user.id);
    }

    // future: sync preferences, load theme, analytics tracking
  }, [user?.id]);

  const saveProfile = () => {
    updateProfile({ name, email });
    toast.success("Profile updated");
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Manage your profile, preferences, and account."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {/* PROFILE */}
          <div className="rounded-2xl bg-card border border-border/60 shadow-card p-6">
            <h3 className="font-display text-lg font-bold mb-1">
              Profile
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              How others see you across Syncnora.
            </p>

            <div className="flex items-center gap-4 mb-5">
              <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground font-display font-black text-xl">
                  {user?.avatarInitials}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="font-display font-bold">
                  {user?.name}
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                  {user?.role}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Full name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <Button
              onClick={saveProfile}
              className="mt-4 bg-gradient-primary text-primary-foreground"
            >
              Save changes
            </Button>
          </div>

          {/* PREFERENCES */}
          <div className="rounded-2xl bg-card border border-border/60 shadow-card p-6">
            <h3 className="font-display text-lg font-bold mb-5">
              Preferences
            </h3>

            <div className="space-y-4">
              {[
                {
                  key: "notifications" as const,
                  label: "Push notifications",
                  desc: "Reminders pop up on your device",
                },
                {
                  key: "emailDigest" as const,
                  label: "Weekly email digest",
                  desc: "Summary of your productivity every Monday",
                },
                {
                  key: "weekStartsMonday" as const,
                  label: "Week starts on Monday",
                  desc: "Use Monday as the first day of week",
                },
              ].map((opt) => (
                <div
                  key={opt.key}
                  className="flex items-center justify-between rounded-xl border border-border p-4"
                >
                  <div>
                    <p className="font-semibold text-sm">
                      {opt.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {opt.desc}
                    </p>
                  </div>

                  <Switch
                    checked={settings[opt.key]}
                    onCheckedChange={(v) =>
                      setSettings({ ...settings, [opt.key]: v })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-card border border-border/60 shadow-card p-6">
            <h3 className="font-display text-lg font-bold mb-1">
              Account
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              Manage session and access.
            </p>

            <Button
              variant="outline"
              onClick={logout}
              className="w-full"
            >
              Sign out
            </Button>
          </div>

          <div className="rounded-2xl bg-gradient-cream border border-accent/20 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-foreground/70 mb-2">
              Pro Tip
            </p>
            <p className="text-sm text-secondary-foreground leading-relaxed">
              Enable email digests to receive AI-generated weekly
              insights about your productivity patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}