import {
  LayoutDashboard,
  CheckSquare,
  Repeat,
  BellRing,
  Receipt,
  TrendingUp,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const mainItems = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard, end: true },
  { title: "Tasks & To-Do", url: "/app/tasks", icon: CheckSquare },
  { title: "Routines", url: "/app/routines", icon: Repeat },
  { title: "Smart Reminders", url: "/app/reminders", icon: BellRing },
  { title: "Bill Tracking", url: "/app/bills", icon: Receipt },
  { title: "Productivity Insights", url: "/app/insights", icon: TrendingUp },
];

const accountItems = [
  { title: "Settings", url: "/app/settings", icon: Settings },
];

export function AppSidebar() {
  const { state, setOpenMobile } = useSidebar(); // ✅ important fix
  const collapsed = state === "collapsed";

  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";

  // ✅ Close sidebar on mobile after click
  const handleNavClick = () => {
    if (setOpenMobile) {
      setOpenMobile(false);
    }
  };

  const renderItem = (item: {
    title: string;
    url: string;
    icon: any;
    end?: boolean;
  }) => (
    <SidebarMenuItem key={item.url}>
      <SidebarMenuButton
        asChild
        tooltip={item.title}
        className="h-11 rounded-xl p-0"
      >
        <NavLink
          to={item.url}
          end={item.end}
          onClick={handleNavClick} // ✅ auto close mobile sidebar
          className={({ isActive }) =>
            cn(
              "w-full flex items-center gap-3 px-3 transition-smooth font-body text-[15px] group",
              isActive
                ? "bg-gradient-primary text-primary-foreground shadow-glow font-semibold"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0",
                  isActive
                    ? "text-primary-foreground"
                    : "text-sidebar-foreground/60 group-hover:text-sidebar-primary"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {!collapsed && (
                <span className="truncate">{item.title}</span>
              )}
            </>
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar"
    >
      {/* HEADER */}
      <SidebarHeader className="px-4 py-5 border-b border-sidebar-border bg-sidebar">
        <a href="https://syncnora.com">
          <img
            src="/logo.png"
            alt="Syncnora Logo"
            className={`transition-all duration-300 ${
              collapsed ? "h-8 w-8" : "h-10 w-auto"
            }`}
          />
        </a>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="px-2 py-4 bg-sidebar">
        {/* WORKSPACE */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.18em] font-semibold text-sidebar-foreground/40 px-3 mb-2">
              Workspace
            </SidebarGroupLabel>
          )}

          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {mainItems.map(renderItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ACCOUNT */}
        <SidebarGroup className="mt-4">
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.18em] font-semibold text-sidebar-foreground/40 px-3 mb-2">
              Account
            </SidebarGroupLabel>
          )}

          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {accountItems.map(renderItem)}

              {isAdmin &&
                renderItem({
                  title: "Admin",
                  url: "/app/admin",
                  icon: ShieldCheck,
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="border-t border-sidebar-border p-2 bg-sidebar">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              onClick={logout}
              className="h-10 rounded-xl text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <LogOut className="h-[18px] w-[18px]" />
              {!collapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}