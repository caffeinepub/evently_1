import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // TYPES
  module Event {
    public func compareByDate(event1 : Event, event2 : Event) : Order.Order {
      Int.compare(event1.eventDate, event2.eventDate);
    };

    public func compareByCreatedAt(event1 : Event, event2 : Event) : Order.Order {
      Int.compare(event1.createdAt, event2.createdAt);
    };
  };

  type Event = {
    id : Nat;
    title : Text;
    description : Text;
    eventDate : Int;
    location : Text;
    capacity : Nat;
    bookedCount : Nat;
    status : Text; // "published" | "draft"
    createdAt : Int;
  };

  type Booking = {
    id : Nat;
    eventId : Nat;
    userId : Principal;
    userName : Text;
    eventTitle : Text;
    eventDate : Int;
    bookedAt : Int;
    status : Text; // "confirmed" | "cancelled"
  };

  type UserProfile = {
    userId : Principal;
    userName : Text;
  };

  type DashboardStats = {
    totalEvents : Nat;
    publishedEvents : Nat;
    draftEvents : Nat;
    totalBookings : Nat;
    confirmedBookings : Nat;
    cancelledBookings : Nat;
  };

  // STATE
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let events = Map.empty<Nat, Event>();
  let bookings = Map.empty<Nat, Booking>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextEventId = 1;
  var nextBookingId = 1;

  // ADMIN FUNCTIONS
  public shared ({ caller }) func createEvent(title : Text, description : Text, eventDate : Int, location : Text, capacity : Nat, status : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create events");
    };

    let event : Event = {
      id = nextEventId;
      title;
      description;
      eventDate;
      location;
      capacity;
      bookedCount = 0;
      status;
      createdAt = Time.now();
    };

    events.add(nextEventId, event);
    nextEventId += 1;
    event.id;
  };

  public shared ({ caller }) func updateEvent(id : Nat, title : Text, description : Text, eventDate : Int, location : Text, capacity : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update events");
    };

    switch (events.get(id)) {
      case (null) { Runtime.trap("Event not found") };
      case (?existing) {
        let updated : Event = {
          existing with
          title;
          description;
          eventDate;
          location;
          capacity;
          status;
        };
        events.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteEvent(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete events");
    };
    if (not (events.containsKey(id))) {
      Runtime.trap("Event does not exist, cannot be deleted");
    };
    events.remove(id);
  };

  // USER PROFILE FUNCTIONS
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(userName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    userProfiles.add(caller, {
      userId = caller;
      userName;
    });
  };

  // USER BOOKING FUNCTIONS
  public shared ({ caller }) func bookEvent(eventId : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can book events");
    };

    let userProfile = switch (userProfiles.get(caller)) {
      case (null) {
        let user = {
          userId = caller;
          userName = "Anonymous";
        };
        userProfiles.add(caller, user);
        user;
      };
      case (?profile) { profile };
    };

    let event = switch (events.get(eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?event) { event };
    };

    if (event.status != "published") {
      Runtime.trap("Event is not published");
    };
    if (event.bookedCount >= event.capacity) {
      Runtime.trap("Event is fully booked");
    };

    let bookingId = nextBookingId;
    let newBooking : Booking = {
      id = bookingId;
      eventId;
      userId = caller;
      userName = userProfile.userName;
      eventTitle = event.title;
      eventDate = event.eventDate;
      bookedAt = Time.now();
      status = "confirmed";
    };

    bookings.add(bookingId, newBooking);
    nextBookingId += 1;

    let updatedEvent : Event = {
      event with bookedCount = event.bookedCount + 1;
    };

    events.add(eventId, updatedEvent);
    bookingId;
  };

  public shared ({ caller }) func cancelBooking(bookingId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can cancel bookings");
    };

    let booking = switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) { booking };
    };

    if (booking.userId != caller) {
      Runtime.trap("Unauthorized: Only booking owner can cancel");
    };

    if (booking.status == "cancelled") {
      Runtime.trap("Booking is already cancelled");
    };

    bookings.add(bookingId, {
      booking with status = "cancelled";
    });

    let event = switch (events.get(booking.eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?event) { event };
    };
    events.add(booking.eventId, {
      event with bookedCount = if (event.bookedCount > 0) { event.bookedCount - 1 } else { 0 };
    });
  };

  // GET REQUESTS
  public query ({ caller }) func getEvents() : async [Event] {
    events.values().toArray().filter(func(event) { event.status == "published" }).sort(Event.compareByDate);
  };

  public query ({ caller }) func getAllEvents() : async [Event] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    events.values().toArray().sort(Event.compareByCreatedAt);
  };

  public query ({ caller }) func getEvent(id : Nat) : async Event {
    switch (events.get(id)) {
      case (null) { Runtime.trap("Event not found") };
      case (?event) {
        // Only published events are visible to non-admins
        if (event.status != "published" and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Event not found");
        };
        event;
      };
    };
  };

  public query ({ caller }) func getMyBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bookings");
    };
    bookings.values().toArray().filter(func(b) { b.userId == caller });
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    bookings.values().toArray();
  };

  public query ({ caller }) func getAllUsers() : async [UserProfile] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    userProfiles.values().toArray();
  };

  public query ({ caller }) func getDashboardStats() : async DashboardStats {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    let eventsArray = events.values().toArray();
    let bookingsArray = bookings.values().toArray();

    {
      totalEvents = eventsArray.size();
      publishedEvents = eventsArray.filter(func(e) { e.status == "published" }).size();
      draftEvents = eventsArray.filter(func(e) { e.status == "draft" }).size();
      totalBookings = bookingsArray.size();
      confirmedBookings = bookingsArray.filter(func(b) { b.status == "confirmed" }).size();
      cancelledBookings = bookingsArray.filter(func(b) { b.status == "cancelled" }).size();
    };
  };
};
