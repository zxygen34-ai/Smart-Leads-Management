# Smart Leads Dashboard

A full-stack lead management dashboard built with the MERN stack. The project delivers JWT-based auth, role-based access control, lead CRUD, advanced filtering, debounced search, pagination, and CSV export, wrapped in a polished, responsive UI.

## Highlights
- JWT auth with admin and sales roles
- Lead lifecycle management with strict validation
- Combined filters (status, source, search) and pagination (limit 10)
- CSV export (admin-only)
- One-time admin seeding via UI or API
- Professional UI with clear empty/error/loading states
- Docker-ready setup

## Tech Stack
- Frontend: React, TypeScript, TailwindCSS, Vite
- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose
- State: React Query + Context

## Project Structure
- app: frontend application
- api: backend API

## Quick Start (Local)
1) Configure environment files
- Copy [api/.env.example](api/.env.example) to api/.env and fill values
- Copy [app/.env.example](app/.env.example) to app/.env

2) Start the API
- Install dependencies and run:
  - cd api
  - npm install
  - npm run dev

3) Start the frontend
- Install dependencies and run:
  - cd app
  - npm install
  - npm run dev

The UI will be available at http://localhost:5173 and the API at http://localhost:4000.

## Seed Admin User (One-Time)
Create the first admin user using either option:
- UI: open http://localhost:5173/seed-admin and provide the ADMIN_SEED_KEY + admin details
- API: POST /api/auth/seed-admin with header x-admin-seed-key: <ADMIN_SEED_KEY>

## Seed Sample Leads
Use the seed script to insert 25 Indian sample leads:
- cd api
- npm run seed:leads

## API Documentation
See [api/API.md](api/API.md) for detailed endpoints, payloads, and responses.

## Docker
See [Setup Instructions.md](Setup%20Instructions.md) for Docker setup and usage.

## Notes
- Admin can create, update, delete, and export
- Sales can create and update but cannot delete or export
