import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import AdminLayout from "./pages/admin/AdminLayout";
import UserLayout from "./pages/user/UserLayout";

type AppState = "loading" | "unauthenticated" | "register" | "admin" | "user";

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const [appState, setAppState] = useState<AppState>("loading");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (isInitializing || isFetching) {
      setAppState("loading");
      return;
    }
    if (!identity) {
      setAppState("unauthenticated");
      return;
    }
    if (!actor) {
      setAppState("loading");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const [profile, isAdmin] = await Promise.all([
          actor.getCallerUserProfile(),
          actor.isCallerAdmin(),
        ]);
        if (cancelled) return;
        if (!profile) {
          setAppState("register");
          return;
        }
        setUserName(profile.userName);
        setAppState(isAdmin ? "admin" : "user");
      } catch {
        if (!cancelled) setAppState("unauthenticated");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [identity, actor, isInitializing, isFetching]);

  const handleRegistered = (name: string) => {
    setUserName(name);
    setAppState("user");
  };

  if (appState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-header flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading Evently...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {appState === "unauthenticated" && <LandingPage />}
      {appState === "register" && (
        <RegisterPage onRegistered={handleRegistered} />
      )}
      {appState === "admin" && <AdminLayout userName={userName} />}
      {appState === "user" && <UserLayout userName={userName} />}
      <Toaster richColors position="top-right" />
    </>
  );
}
