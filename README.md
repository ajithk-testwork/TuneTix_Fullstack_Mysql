# 🎟️ TuneTix — Event Ticket Booking Platform

A full-stack **Event Ticket Booking Platform** built with **React.js, TypeScript, Node.js, Express.js, Prisma ORM, PostgreSQL, Stripe, Cloudinary, and JWT Authentication**.

TuneTix allows users to discover events, select seats, book tickets, make secure online payments, receive digital tickets with QR codes, and manage their booking history.

The platform also provides powerful **Admin and Super Admin dashboards** for event management, seat management, booking management, attendee check-in, payment tracking, and event analytics.

---

## 🚀 Key Features

### 👤 User Features

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Browse Published Events
- Event Details
- Event Banner Images
- Seat Category Selection
- Seat Availability
- Ticket Booking
- Stripe Checkout
- Payment Status Tracking
- Booking Confirmation
- Digital Ticket Generation
- QR Code Ticket
- Booking History
- Booking Details
- User Profile
- Ticket Check-in Status

---

## 🛠️ Admin Features

### 📊 Admin Dashboard

- Total Events
- Published Events
- Total Bookings
- Total Tickets Sold
- Available Seats
- Total Revenue
- Payment Status
- Attendee Information
- Event-level Analytics
- Near Sold-out Event Tracking
- Check-in Tracking

### 🎫 Event Management

- Create Event
- Update Event
- Delete Event
- Publish Event
- Unpublish Event
- Event Details
- Event Banner Upload
- Cloudinary Image Management

### 💺 Seat Management

- Create Seat Categories
- Define Seat Category Price
- Define Total Seats
- Generate Seats
- Track Available Seats
- Track Booked Seats
- Seat Category Management
- Event-specific Seat Configuration

### 📋 Booking Management

- View All Bookings
- View Booking Details
- User Booking Information
- Ticket Information
- Payment Status
- Booking Status
- Check-in Status
- QR Code Verification

### 📷 Attendee Management

- QR Code Ticket Verification
- Scan Ticket QR Code
- Check-in Attendee
- Track Check-in Time
- Prevent Duplicate Check-in

---

## 👑 Super Admin

The Super Admin provides higher-level platform management.

- Super Admin Login
- Admin Management
- Create Admin
- Manage Admin Users
- Role-Based Access Control
- Admin-only Routes
- Event Management Access Control

---

# 🔐 Authentication & Authorization

TuneTix uses **JWT-based authentication** with role-based authorization.

### Authentication

- User Registration
- User Login
- Password Hashing with bcrypt
- JWT Access Token
- Protected API Routes
- Token-based Authorization

### Role-Based Access

```text
SUPER_ADMIN
     │
     ├── Manage Admins
     ├── Manage Platform
     └── Access Admin Features
             │
             ▼
          ADMIN
             │
             ├── Create Events
             ├── Manage Events
             ├── Manage Seats
             ├── Manage Bookings
             └── Check-in Attendees
             
USER
 │
 ├── Browse Events
 ├── Select Seats
 ├── Book Tickets
 ├── Make Payment
 └── View Tickets