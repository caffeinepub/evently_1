import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  FileText,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import {
  formatEventDate,
  useGetAllBookings,
  useGetDashboardStats,
} from "../../hooks/useQueries";

type AdminPage = "dashboard" | "events" | "users" | "bookings";

interface Props {
  onNavigate: (page: AdminPage) => void;
}

export default function DashboardPage({ onNavigate }: Props) {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: bookings, isLoading: bookingsLoading } = useGetAllBookings();

  const statCards = [
    {
      label: "Total Events",
      value: stats?.totalEvents ?? 0n,
      icon: CalendarDays,
      color: "bg-blue-50 text-blue-600",
      ocid: "dashboard.total_events_card",
    },
    {
      label: "Published Events",
      value: stats?.publishedEvents ?? 0n,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
      ocid: "dashboard.published_events_card",
    },
    {
      label: "Draft Events",
      value: stats?.draftEvents ?? 0n,
      icon: FileText,
      color: "bg-amber-50 text-amber-600",
      ocid: "dashboard.draft_events_card",
    },
    {
      label: "Total Bookings",
      value: stats?.totalBookings ?? 0n,
      icon: BookOpen,
      color: "bg-purple-50 text-purple-600",
      ocid: "dashboard.total_bookings_card",
    },
  ];

  const recentBookings = bookings?.slice(0, 8) ?? [];

  return (
    <div className="space-y-6" data-ocid="dashboard.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Welcome back! Here's an overview of your events.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
          >
            <Card className="card-shadow border-0" data-ocid={card.ocid}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {card.label}
                    </p>
                    {statsLoading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <p className="text-3xl font-bold text-foreground">
                        {String(card.value)}
                      </p>
                    )}
                  </div>
                  <div className={`p-2.5 rounded-xl ${card.color}`}>
                    <card.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bookings Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Confirmed vs Cancelled */}
        <Card className="card-shadow border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Confirmed</span>
              </div>
              <span className="font-bold text-green-700">
                {statsLoading ? "..." : String(stats?.confirmedBookings ?? 0n)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Cancelled</span>
              </div>
              <span className="font-bold text-red-600">
                {statsLoading ? "..." : String(stats?.cancelledBookings ?? 0n)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Total</span>
              </div>
              <span className="font-bold text-blue-700">
                {statsLoading ? "..." : String(stats?.totalBookings ?? 0n)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="card-shadow border-0 lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Bookings</CardTitle>
              <button
                type="button"
                onClick={() => onNavigate("bookings")}
                className="text-xs text-primary hover:underline"
                data-ocid="dashboard.view_all_bookings_link"
              >
                View all
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {bookingsLoading ? (
              <div className="px-6 space-y-2 pb-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : recentBookings.length === 0 ? (
              <div
                className="px-6 pb-4 text-center py-8"
                data-ocid="dashboard.bookings.empty_state"
              >
                <p className="text-muted-foreground text-sm">No bookings yet</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentBookings.map((booking, i) => (
                  <div
                    key={String(booking.id)}
                    className="flex items-center gap-3 px-5 py-3"
                    data-ocid={`dashboard.bookings.item.${i + 1}`}
                  >
                    <div className="w-7 h-7 rounded-full gradient-header flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-semibold">
                        {booking.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {booking.userName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {booking.eventTitle}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {formatEventDate(booking.eventDate)}
                      </span>
                      <Badge
                        variant="secondary"
                        className={
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-red-100 text-red-600 hover:bg-red-100"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
