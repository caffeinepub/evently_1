import { Button } from "@/components/ui/button";
import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import BookingsPage from "./BookingsPage";
import DashboardPage from "./DashboardPage";
import EventManagementPage from "./EventManagementPage";
import UserManagementPage from "./UserManagementPage";

type AdminPage = "dashboard" | "events" | "users" | "bookings";

const NAV_ITEMS: { id: AdminPage; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "events", label: "Event Management", icon: CalendarDays },
  { id: "users", label: "User Management", icon: Users },
  { id: "bookings", label: "Bookings", icon: BookOpen },
];

interface Props {
  userName: string;
}

export default function AdminLayout({ userName }: Props) {
  const [activePage, setActivePage] = useState<AdminPage>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { clear } = useInternetIdentity();

  const activeItem = NAV_ITEMS.find((n) => n.id === activePage);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top App Bar */}
      <header className="gradient-header h-16 flex items-center px-4 md:px-6 gap-4 flex-shrink-0 z-30 sticky top-0">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          data-ocid="admin.sidebar_toggle"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="text-white font-bold text-xl tracking-wide hidden sm:block">
            EVENTLY
          </span>
        </div>

        <div className="flex-1" />

        {/* Search pill */}
        <div className="hidden md:flex items-center bg-white/15 rounded-full px-4 py-1.5 text-white/70 text-sm gap-2 cursor-pointer hover:bg-white/25 transition-colors">
          <span>Search events...</span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 bg-white/15 rounded-full px-3 py-1.5">
            <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-white text-sm font-medium hidden sm:block">
              {userName}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={clear}
            data-ocid="admin.logout_button"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
            role="button"
            tabIndex={0}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            w-60 gradient-sidebar flex-shrink-0 flex flex-col
            fixed md:sticky top-16 bottom-0 z-20
            transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
          style={{ height: "calc(100vh - 4rem)" }}
        >
          <nav className="flex-1 px-3 py-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  data-ocid={`admin.nav.${item.id}_link`}
                  onClick={() => {
                    setActivePage(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${
                      isActive
                        ? "bg-primary/80 text-white"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white"
                    }
                  `}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && <ChevronRight className="h-3 w-3 opacity-60" />}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <p className="text-sidebar-foreground/40 text-xs text-center">
              © {new Date().getFullYear()} Evently Admin
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Breadcrumb */}
          <div className="px-6 py-3 border-b border-border bg-card flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Admin</span>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium text-foreground">
              {activeItem?.label}
            </span>
          </div>

          <div className="p-6">
            {activePage === "dashboard" && (
              <DashboardPage onNavigate={setActivePage} />
            )}
            {activePage === "events" && <EventManagementPage />}
            {activePage === "users" && <UserManagementPage />}
            {activePage === "bookings" && <BookingsPage />}
          </div>
        </main>
      </div>
    </div>
  );
}
