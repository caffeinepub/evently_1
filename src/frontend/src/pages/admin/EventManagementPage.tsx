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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Event } from "../../backend";
import {
  dateToNanos,
  formatEventDate,
  nanosToDateInputValue,
  useCreateEvent,
  useDeleteEvent,
  useGetAllEvents,
  useUpdateEvent,
} from "../../hooks/useQueries";

const EMPTY_FORM = {
  title: "",
  description: "",
  eventDate: "",
  location: "",
  capacity: "50",
  status: "draft",
};

export default function EventManagementPage() {
  const { data: events, isLoading } = useGetAllEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const openCreate = () => {
    setEditingEvent(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (event: Event) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      description: event.description,
      eventDate: nanosToDateInputValue(event.eventDate),
      location: event.location,
      capacity: String(event.capacity),
      status: event.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.eventDate || !form.location) {
      toast.error("Please fill in all required fields");
      return;
    }
    const payload = {
      title: form.title,
      description: form.description,
      eventDate: dateToNanos(form.eventDate),
      location: form.location,
      capacity: BigInt(form.capacity || "50"),
      status: form.status,
    };
    try {
      if (editingEvent) {
        await updateEvent.mutateAsync({ id: editingEvent.id, ...payload });
        toast.success("Event updated successfully");
      } else {
        await createEvent.mutateAsync(payload);
        toast.success("Event created successfully");
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteEvent.mutateAsync(deleteId);
      toast.success("Event deleted");
      setDeleteId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const isPending = createEvent.isPending || updateEvent.isPending;

  return (
    <div className="space-y-5" data-ocid="events.page">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Event Management
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Create and manage all events
          </p>
        </div>
        <Button
          onClick={openCreate}
          data-ocid="events.create_button"
          className="gradient-header text-white border-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Event
        </Button>
      </div>

      {/* Events Table */}
      <div className="bg-card rounded-lg card-shadow border-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-ocid="events.table">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground">
                  Title
                </th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground hidden md:table-cell">
                  Date
                </th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground hidden lg:table-cell">
                  Location
                </th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground hidden sm:table-cell">
                  Capacity
                </th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="text-right px-5 py-3 font-semibold text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                ["a", "b", "c", "d"].map((i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={6} className="px-5 py-3">
                      <Skeleton className="h-5 w-full" />
                    </td>
                  </tr>
                ))
              ) : !events || events.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-muted-foreground"
                    data-ocid="events.empty_state"
                  >
                    No events yet. Create your first event!
                  </td>
                </tr>
              ) : (
                events.map((event, i) => (
                  <tr
                    key={String(event.id)}
                    className="border-b border-border hover:bg-muted/20 transition-colors"
                    data-ocid={`events.item.${i + 1}`}
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium text-foreground truncate max-w-[180px]">
                        {event.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {event.description}
                      </p>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-muted-foreground">
                      {formatEventDate(event.eventDate)}
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell text-muted-foreground truncate max-w-[140px]">
                      {event.location}
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell text-muted-foreground">
                      {String(event.bookedCount)}/{String(event.capacity)}
                    </td>
                    <td className="px-5 py-3">
                      <Badge
                        variant="secondary"
                        className={
                          event.status === "published"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                        }
                      >
                        {event.status === "published" ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(event)}
                          data-ocid={`events.edit_button.${i + 1}`}
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(event.id)}
                          data-ocid={`events.delete_button.${i + 1}`}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg" data-ocid="events.dialog">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Edit Event" : "Create New Event"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <Label>Title *</Label>
                <Input
                  data-ocid="events.title_input"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="Conference on AI Trends"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  data-ocid="events.description_input"
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Event details..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Date & Time *</Label>
                  <Input
                    data-ocid="events.date_input"
                    type="datetime-local"
                    value={form.eventDate}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, eventDate: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Capacity *</Label>
                  <Input
                    data-ocid="events.capacity_input"
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, capacity: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Location *</Label>
                <Input
                  data-ocid="events.location_input"
                  value={form.location}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, location: e.target.value }))
                  }
                  placeholder="San Francisco, CA"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}
                >
                  <SelectTrigger data-ocid="events.status_select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                data-ocid="events.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                data-ocid="events.submit_button"
                className="gradient-header text-white border-0"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {editingEvent ? "Save Changes" : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent data-ocid="events.delete_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The event and all associated
              bookings will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="events.delete_cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-ocid="events.delete_confirm_button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteEvent.isPending}
            >
              {deleteEvent.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
