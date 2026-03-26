import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";
import { formatEventDate, useGetAllBookings } from "../../hooks/useQueries";

export default function BookingsPage() {
  const { data: bookings, isLoading } = useGetAllBookings();

  return (
    <div className="space-y-5" data-ocid="bookings.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          All event bookings across the platform
        </p>
      </div>

      <div className="bg-card rounded-lg card-shadow border-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-sm text-foreground">
            All Bookings
          </span>
          {!isLoading && bookings && (
            <Badge variant="secondary" className="ml-auto">
              {bookings.length} total
            </Badge>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-ocid="bookings.table">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground">
                  User
                </th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground">
                  Event
                </th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground hidden md:table-cell">
                  Event Date
                </th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground hidden sm:table-cell">
                  Booked On
                </th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                ["a", "b", "c", "d", "e"].map((i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={5} className="px-5 py-3">
                      <Skeleton className="h-5 w-full" />
                    </td>
                  </tr>
                ))
              ) : !bookings || bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-muted-foreground"
                    data-ocid="bookings.empty_state"
                  >
                    No bookings yet.
                  </td>
                </tr>
              ) : (
                bookings.map((booking, i) => (
                  <tr
                    key={String(booking.id)}
                    className="border-b border-border hover:bg-muted/20 transition-colors"
                    data-ocid={`bookings.item.${i + 1}`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full gradient-header flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-semibold">
                            {booking.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">
                          {booking.userName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-foreground truncate max-w-[160px]">
                      {booking.eventTitle}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">
                      {formatEventDate(booking.eventDate)}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">
                      {formatEventDate(booking.bookedAt)}
                    </td>
                    <td className="px-5 py-3">
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
