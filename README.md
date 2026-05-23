# Lumenor — SaaS Dashboard

A full-stack multi-tenant SaaS Dashboard with React, TypeScript, Redux Toolkit, Node.js, MongoDB, and JWT authentication.

## Tech Stack
- **Frontend:** React + TypeScript, Redux Toolkit + RTK Query, Tailwind CSS
- **Backend:** Node.js + Express.js, MongoDB + Mongoose, JWT (Access + Refresh tokens)
- **Deployment:** Vercel (frontend), Render (backend)

## Folder Structure

```
frontend/src/
├── app/          # Redux store & RTK Query base API
├── features/     # auth, companies, users, dashboard API slices
├── components/   # Reusable UI components and layout
├── pages/        # Page-level components
├── guards/       # AuthGuard & RoleGuard
├── hooks/        # Typed Redux hooks
└── types/        # TypeScript interfaces

backend/
├── controllers/  # Business logic per resource
├── middleware/   # JWT auth + role authorization
├── models/       # Mongoose schemas (User, Company)
├── routes/       # Express route definitions
└── utils/        # DB connection, JWT helpers
```

## Running Locally

### Backend
```bash
cd backend
npm install
cp .env.example .env   # Fill in your values
npm run dev            # Runs on port 5000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env   # Set VITE_API_URL=http://localhost:5000/api
npm run dev            # Runs on port 5173
```

## Architecture Decisions

- **Access token in memory only** — never stored in localStorage to prevent XSS attacks
- **Refresh token in HTTP-only cookie** — cannot be accessed by JavaScript
- **Silent token refresh** — RTK Query base query automatically retries with new access token on 401
- **Backend role enforcement** — every protected route uses `authorize()` middleware; frontend guards are secondary
- **Company deactivation** — middleware checks `company.isActive` on every request, invalidating all company users instantly
- **RTK Query only for data fetching** — no `useEffect` for API calls
- **No `any` types** — all data is fully typed via TypeScript interfaces
