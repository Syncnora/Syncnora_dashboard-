import { ReactNode } from "react";
import { SyncnoraLogo } from "@/components/syncnora/Logo";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

export function AuthLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-background">
      {/* Left: form */}
      <div className="flex flex-col px-6 py-8 md:px-12 lg:px-16">
        <div className="mb-10">
           <a href="https://syncnora.com">
          <img
            src="/logo.png"   // put your image path here
            alt="Syncnora Logo"
            className="h-16 w-auto"
          />
          </a>
        </div>
        <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-black text-foreground tracking-tight">
            {title}
          </h1>
          <p className="text-muted-foreground mt-2 mb-8">{subtitle}</p>
          {children}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-6">
          Syncnora © 2026 — Smart Daily Task & Reminder App
        </p>
      </div>

      {/* Right: brand panel */}
      <div className="hidden lg:flex relative overflow-hidden bg-sidebar items-center justify-center p-12">
        <div className="absolute inset-0 ambient-glow opacity-50" />
        <div className="absolute -top-32 -right-20 h-[400px] w-[400px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-[400px] w-[400px] rounded-full bg-accent/20 blur-3xl" />

        <div className="relative max-w-md text-sidebar-foreground">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sidebar-accent text-accent text-xs font-semibold mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Productivity
          </div>
          <h2 className="font-display text-4xl font-black leading-tight mb-4">
            Your day, <span className="text-gradient">intelligently</span> organized.
          </h2>
          <p className="text-sidebar-foreground/70 text-base mb-8 leading-relaxed">
            Manage tasks, routines, bills, and smart reminders — all in one calm, beautiful workspace.
          </p>
          <div className="space-y-4">
            {[
              { icon: Zap, title: "Smart Reminders", desc: "AI rescheduling for better focus" },
              { icon: ShieldCheck, title: "Privacy First", desc: "Your data stays on your device" },
              { icon: Sparkles, title: "Daily Insights", desc: "Track streaks & productivity" },
            ].map((f) => (
              <div key={f.title} className="flex gap-3 items-start">
                <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0 shadow-glow">
                  <f.icon className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-display font-bold">{f.title}</p>
                  <p className="text-sm text-sidebar-foreground/60">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
