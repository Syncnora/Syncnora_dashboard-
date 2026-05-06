import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/syncnora/AppSidebar";
import { TopBar } from "@/components/syncnora/TopBar";

export function AppLayout() {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-background relative overflow-hidden">
        {/* Ambient background */}
        <div className="pointer-events-none fixed inset-0 ambient-glow opacity-60" />
        <div className="pointer-events-none fixed top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none fixed bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-accent/5 blur-3xl" />

        <AppSidebar />

        <SidebarInset className="relative z-10 bg-transparent">
          <TopBar />
          <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 md:py-8 max-w-[1600px] w-full mx-auto">
            <Outlet />
          </main>
          <footer className="pt-2 pb-4 text-center text-xs text-muted-foreground">
            Syncnora © 2026 — Designed for calm, intelligent productivity.
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
