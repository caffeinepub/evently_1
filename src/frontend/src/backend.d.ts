import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Booking {
    id: bigint;
    status: string;
    eventId: bigint;
    userName: string;
    bookedAt: bigint;
    userId: Principal;
    eventTitle: string;
    eventDate: bigint;
}
export interface DashboardStats {
    publishedEvents: bigint;
    draftEvents: bigint;
    cancelledBookings: bigint;
    totalEvents: bigint;
    totalBookings: bigint;
    confirmedBookings: bigint;
}
export interface UserProfile {
    userName: string;
    userId: Principal;
}
export interface Event {
    id: bigint;
    status: string;
    title: string;
    createdAt: bigint;
    bookedCount: bigint;
    description: string;
    capacity: bigint;
    location: string;
    eventDate: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookEvent(eventId: bigint): Promise<bigint>;
    cancelBooking(bookingId: bigint): Promise<void>;
    createEvent(title: string, description: string, eventDate: bigint, location: string, capacity: bigint, status: string): Promise<bigint>;
    deleteEvent(id: bigint): Promise<void>;
    getAllBookings(): Promise<Array<Booking>>;
    getAllEvents(): Promise<Array<Event>>;
    getAllUsers(): Promise<Array<UserProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardStats(): Promise<DashboardStats>;
    getEvent(id: bigint): Promise<Event>;
    getEvents(): Promise<Array<Event>>;
    getMyBookings(): Promise<Array<Booking>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(userName: string): Promise<void>;
    updateEvent(id: bigint, title: string, description: string, eventDate: bigint, location: string, capacity: bigint, status: string): Promise<void>;
}
