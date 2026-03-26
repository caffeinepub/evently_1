import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, CalendarDays, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  formatEventDate,
  useCancelBooking,
  useGetMyBookings,
} from "../../hooks/useQueries";

export default function MyBookingsPage() {
  const { data: bookings, isLoading } = useGetMyBookings();
  const cancelBooking = useCancelBooking();
  const [cancelId, setCancelId] = useState<bigint | null>(null);

  const handleCancel = async () => {
    if (cancelId === null) return;
    try {
      await cancelBooking.mutateAsync(cancelId);
      toast.success("Booking cancelled");
      setCancelId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Cancellation failed");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" data-ocid="mybookings.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manage your event reservations
        </p>
      </div>

      <div className="bg-card rounded-xl card-shadow border border-border/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-sm">Booking History</span>
          {!isLoading && bookings && (
            <Badge variant="secondary" className="ml-auto">
              {bookings.length} bookings
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16"
            data-ocid="mybookings.empty_state"
          >
            <div className="w-14 h-14 rounded-2xl gradient-header flex items-center justify-center mb-3">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">
              No bookings yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Browse events and book your first one!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {bookings.map((booking, i) => (
              <div
                key={String(booking.id)}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-5"
                data-ocid={`mybookings.item.${i + 1}`}
              >
                <div className="w-10 h-10 rounded-xl gradient-header flex items-center justify-center flex-shrink-0">
                  <CalendarDays className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">
                    {booking.eventTitle}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatEventDate(booking.eventDate)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Booked on {formatEventDate(booking.bookedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
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
                  {booking.status === "confirmed" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCancelId(booking.id)}
                      data-ocid={`mybookings.cancel_button.${i + 1}`}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
                    >
                      <XCircle className="mr-1 h-3.5 w-3.5" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertDialog
        open={cancelId !== null}
        onOpenChange={(open) => !open && setCancelId(null)}
      >
        <AlertDialogContent data-ocid="mybookings.cancel_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="mybookings.cancel_dialog_cancel_button">
              Keep Booking
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              data-ocid="mybookings.cancel_dialog_confirm_button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={cancelBooking.isPending}
            >
              {cancelBooking.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
