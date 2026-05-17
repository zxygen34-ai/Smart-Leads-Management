# Setup Instructions

This guide covers local setup, seeding, and Docker usage for the Smart Leads Dashboard.

## Prerequisites
- Node.js 20+
- npm 10+
- MongoDB (local) or Docker

## Local Setup

### 1) Backend API
1. Copy [api/.env.example](api/.env.example) to api/.env
2. Update values, especially JWT_SECRET and ADMIN_SEED_KEY
3. Install dependencies and start the API:
   - cd api
   - npm install
   - npm run dev

API will run on http://localhost:4000

### 2) Frontend App
1. Copy [app/.env.example](app/.env.example) to app/.env
2. Install dependencies and start the app:
   - cd app
   - npm install
   - npm run dev

App will run on http://localhost:5173

### 3) Seed Admin User (One-Time)
You must create the first admin user before logging in.

Option A (UI)
- Open http://localhost:5173/seed-admin
- Enter ADMIN_SEED_KEY and admin details

Option B (API)
- POST http://localhost:4000/api/auth/seed-admin
- Header: x-admin-seed-key: <ADMIN_SEED_KEY>
- Body: { name, email, password }

### 4) Seed Sample Leads
Insert 25 Indian sample leads:
- cd api
- npm run seed:leads

## Docker Setup
This project includes Dockerfiles for api and app plus a root docker-compose file.

### Build and Run
- From the project root:
  - docker compose up --build

### Services
- mongo: MongoDB at localhost:27017
- api: API at http://localhost:4000
- app: Web app at http://localhost:4173

Seed admin in Docker
- Open http://localhost:4173/seed-admin and use ADMIN_SEED_KEY

## Troubleshooting
- If the API fails to start, verify api/.env is complete
- If the UI cannot reach the API in Docker, ensure VITE_API_URL is correct
