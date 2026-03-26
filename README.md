# Swasthya Care - Full MERN Hospital Management System

A role-based hospital platform with:
- React + Tailwind frontend
- Node.js + Express backend
- MongoDB + Mongoose data layer
- JWT access/refresh authentication
- bcrypt password hashing (salt rounds: 12)

## Architecture
- `client/` - Frontend (React + React Router + React Query + React Hook Form)
- `server/` - Backend API (Express + Mongoose + security middleware + Socket.IO)

## Implemented Feature Set

### Authentication and Security
- Role-aware registration/login (`patient`, `doctor`, `admin`)
- JWT access + refresh token flow
- bcrypt password hashing with 12 rounds
- Forgot/reset password flow with token expiry
- Frontend protected routes by role
- API middleware: Helmet, rate limiting, CORS, input sanitization, HPP
- Joi request validation on auth/profile/appointments/admin routes

### Core Modules
- Public pages: Home, About, Departments, Doctors, Contact, Help
- Patient: Dashboard, Booking, Symptom Checker, Appointments, Health Record, Pharmacy, Billing
- Doctor: Dashboard, consultation room, provider onboarding
- Admin: Dashboard, analytics, user and appointment management endpoints

### Backend API Routes
- Auth: `/api/auth/*`
- Users: `/api/users/*`
- Appointments: `/api/appointments/*`
- Admin: `/api/admin/*`
- Health: `/api/health`

### Real-time Hooks
- Socket.IO server initialized
- Appointment create/update/cancel emits socket events (`appointment:*`)

## Setup

### 1. Install Everything
```bash
cd /Users/mdfaizan/Desktop/Projects/SwasthyaCare
npm install
```

### 2. Start Backend
```bash
npm run dev:server
```
Backend runs on `http://localhost:5001` by default.

### 3. Start Frontend
```bash
npm run dev:client
```
Frontend runs on `http://localhost:5173` by default.

### 4. Start Both Together
```bash
npm run dev
```

## Environment Variables (Backend)
Use `/Users/mdfaizan/Desktop/Projects/SwasthyaCare/.env.example` as template.
Key values:
- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CORS_ORIGINS`
- Mail settings for reset-password email

## Frontend API Base URL
The shared root `.env` is used by both client and server:
```bash
VITE_API_BASE_URL=http://localhost:5001/api
```

## Notes
- Fallback doctor data is shown on frontend if API is unavailable.
- Booking, appointments, provider schedule, and admin analytics are wired to backend endpoints.
- Email/SMS notifications are scaffolded through service placeholders and logging.
