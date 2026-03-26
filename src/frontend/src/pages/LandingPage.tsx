import { Button } from "@/components/ui/button";
import { BarChart3, Calendar, Loader2, Ticket, Users } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LandingPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  const features = [
    {
      icon: Calendar,
      title: "Manage Events",
      desc: "Create and organize events with ease",
    },
    {
      icon: Users,
      title: "User Management",
      desc: "Track registrations and attendees",
    },
    {
      icon: Ticket,
      title: "Bookings",
      desc: "Seamless event booking experience",
    },
    {
      icon: BarChart3,
      title: "Analytics",
      desc: "Real-time dashboard and insights",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="gradient-header px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-white font-bold text-xl tracking-wide">
              EVENTLY
            </span>
          </div>
          <Button
            data-ocid="landing.login_button"
            onClick={login}
            disabled={isLoggingIn}
            className="bg-white text-primary hover:bg-white/90 font-semibold"
          >
            {isLoggingIn ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoggingIn ? "Signing in..." : "Sign In"}
          </Button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="gradient-header py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Online Event Management
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-white/80 mb-8 max-w-2xl mx-auto"
            >
              Discover, book, and manage events all in one place. A modern
              platform for organizers and attendees.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                data-ocid="landing.get_started_button"
                onClick={login}
                disabled={isLoggingIn}
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold px-8"
              >
                {isLoggingIn ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Get Started Free
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-6 bg-background">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground text-center mb-10">
              Everything you need
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="bg-card rounded-lg p-6 card-shadow text-center"
                >
                  <div className="w-12 h-12 rounded-xl gradient-header flex items-center justify-center mx-auto mb-4">
                    <f.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 px-6 border-t border-border text-center">
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
