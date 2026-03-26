import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Loader2, MapPin, Ticket, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Event } from "../../backend";
import {
  formatEventDate,
  useBookEvent,
  useGetEvents,
} from "../../hooks/useQueries";

export default function EventsPage() {
  const { data: events, isLoading } = useGetEvents();
  const bookEvent = useBookEvent();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  const openBooking = (event: Event) => {
    setSelectedEvent(event);
    setBookingDialogOpen(true);
  };

  const handleBook = async () => {
    if (!selectedEvent) return;
    try {
      await bookEvent.mutateAsync(selectedEvent.id);
      toast.success(`Successfully booked "${selectedEvent.title}"!`);
      setBookingDialogOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Booking failed");
    }
  };

  const isFullyBooked = (event: Event) => event.bookedCount >= event.capacity;
  const spotsLeft = (event: Event) =>
    Number(event.capacity - event.bookedCount);

  return (
    <div className="space-y-6 max-w-6xl mx-auto" data-ocid="events.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upcoming Events</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Discover and book events happening near you
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }, (_, i) => i).map((i) => (
            <div
              key={`sk-${i}`}
              className="bg-card rounded-lg card-shadow p-5 space-y-3"
            >
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-9 w-full mt-4" />
            </div>
          ))}
        </div>
      ) : !events || events.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="events.empty_state"
        >
          <div className="w-16 h-16 rounded-2xl gradient-header flex items-center justify-center mb-4">
            <CalendarDays className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            No events yet
          </h3>
          <p className="text-muted-foreground text-sm">
            Check back soon for upcoming events.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event, i) => {
            const fullyBooked = isFullyBooked(event);
            const spots = spotsLeft(event);
            return (
              <motion.div
                key={String(event.id)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                data-ocid={`events.item.${i + 1}`}
                className="bg-card rounded-xl card-shadow-md border border-border/60 flex flex-col overflow-hidden hover:card-shadow transition-shadow"
              >
                {/* Color strip */}
                <div className="h-2 gradient-header" />
                <div className="p-5 flex-1 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground leading-snug">
                      {event.title}
                    </h3>
                    {fullyBooked ? (
                      <Badge
                        variant="secondary"
                        className="bg-red-100 text-red-600 hover:bg-red-100 flex-shrink-0 text-xs"
                      >
                        Full
                      </Badge>
                    ) : spots <= 5 ? (
                      <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-700 hover:bg-amber-100 flex-shrink-0 text-xs"
                      >
                        {spots} left
                      </Badge>
                    ) : null}
                  </div>

                  {event.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  <div className="space-y-1.5 mt-auto">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{formatEventDate(event.eventDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>
                        {String(event.bookedCount)}/{String(event.capacity)}{" "}
                        booked
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => openBooking(event)}
                    disabled={fullyBooked}
                    data-ocid={`events.book_button.${i + 1}`}
                    className={
                      fullyBooked
                        ? "w-full mt-1 bg-muted text-muted-foreground cursor-not-allowed"
                        : "w-full mt-1 gradient-header text-white border-0"
                    }
                  >
                    <Ticket className="mr-2 h-4 w-4" />
                    {fullyBooked ? "Fully Booked" : "Book Now"}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Booking Confirmation Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent data-ocid="events.booking_dialog">
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>
              You're about to book a spot for this event.
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-3 py-2">
              <div className="bg-muted/40 rounded-lg p-4 space-y-2">
                <p className="font-semibold text-foreground">
                  {selectedEvent.title}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>{formatEventDate(selectedEvent.eventDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{selectedEvent.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>{spotsLeft(selectedEvent)} spots remaining</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setBookingDialogOpen(false)}
              data-ocid="events.booking_cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBook}
              disabled={bookEvent.isPending}
              data-ocid="events.booking_confirm_button"
              className="gradient-header text-white border-0"
            >
              {bookEvent.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {bookEvent.isPending ? "Booking..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
