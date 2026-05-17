# Smart Leads Dashboard (Frontend)

Polished React + TypeScript UI for lead management, authentication, and role-based access.

## Features
- JWT auth with admin/sales roles
- Leads list with filters, debounced search, sorting, and pagination
- Create/edit lead modal with validation
- Admin-only delete and CSV export
- Seed admin UI at /seed-admin (one-time)

## Setup
1. Install dependencies
2. Configure environment
3. Start the dev server

## Environment
Create a `.env` file based on `.env.example`.

Required:
- VITE_API_URL (example: http://localhost:4000/api)

## Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
