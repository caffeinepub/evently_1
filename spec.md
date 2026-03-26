# Evently - Online Event Management System

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- User authentication (register, login, logout) with role-based access (user / admin)
- Events list page: browse all published events with title, description, date, location
- Event detail page: view full event info and book it
- User bookings page: view my bookings and cancel
- Admin dashboard: stats (total events, active events, registered users, bookings)
- Admin event management: create, update, delete events (title, description, date, location, capacity, status)
- Admin user management: view all registered users
- Admin bookings management: view all bookings with user info
- Seed sample events and an admin account on first deploy

### Modify
N/A (new project)

### Remove
N/A

## Implementation Plan
1. Backend (Motoko):
   - Integrate authorization component for user roles (user, admin)
   - Events: CRUD with fields (id, title, description, date, location, capacity, status, createdAt)
   - Bookings: create/cancel/list by user and by admin with event+user info
   - Admin seeding: promote first registered user to admin or seed admin on init
   - Expose query/update calls: getEvents, getEvent, createEvent, updateEvent, deleteEvent, bookEvent, cancelBooking, getMyBookings, getAllBookings, getAllUsers, getDashboardStats
2. Frontend (React + TypeScript + Tailwind):
   - App shell: sidebar nav (admin) or top nav (user), responsive
   - Auth pages: Login, Register
   - User pages: EventsList, EventDetail + BookModal, MyBookings
   - Admin pages: Dashboard (stat cards + charts), EventManagement (table + create/edit modal), UserManagement, BookingsManagement
   - Role-aware routing: redirect based on role after login
