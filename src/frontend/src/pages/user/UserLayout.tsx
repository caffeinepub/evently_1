import { Button } from "@/components/ui/button";
import { BookOpen, CalendarDays, LogOut, Menu, User, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import EventsPage from "./EventsPage";
import MyBookingsPage from "./MyBookingsPage";
import ProfilePage from "./ProfilePage";

type UserPage = "events" | "bookings" | "profile";

const NAV_ITEMS: { id: UserPage; label: string; icon: React.ElementType }[] = [
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "bookings", label: "My Bookings", icon: BookOpen },
  { id: "profile", label: "Profile", icon: User },
];

interface Props {
  userName: string;
}

export default function UserLayout({ userName }: Props) {
  const [activePage, setActivePage] = useState<UserPage>("events");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { clear } = useInternetIdentity();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Nav */}
      <header className="gradient-header h-16 flex items-center px-4 md:px-8 gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="text-white font-bold text-xl tracking-wide">
            EVENTLY
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 ml-6">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                type="button"
                key={item.id}
                data-ocid={`user.nav.${item.id}_link`}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white/25 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/15"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
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
            className="text-white hover:bg-white/20 hidden md:flex"
            onClick={clear}
            data-ocid="user.logout_button"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="user.mobile_menu_toggle"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div className="md:hidden gradient-sidebar px-4 py-3 border-b border-sidebar-border z-20">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setMobileOpen(false);
                  }}
                  data-ocid={`user.mobile_nav.${item.id}_link`}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/80 text-white"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={clear}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white transition-all"
              data-ocid="user.mobile_logout_button"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </nav>
        </div>
      )}

      <main className="flex-1 p-6">
        {activePage === "events" && <EventsPage />}
        {activePage === "bookings" && <MyBookingsPage />}
        {activePage === "profile" && <ProfilePage userName={userName} />}
      </main>

      <footer className="py-5 px-6 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
