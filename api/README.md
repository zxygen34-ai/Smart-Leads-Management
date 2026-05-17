# Smart Leads API

See [API.md](API.md) for full API documentation.

## Quick Start
1. Copy [api/.env.example](.env.example) to api/.env
2. Install dependencies
3. Start the API

Commands:
- npm install
- npm run dev

## Seed Sample Leads
- npm run seed:leads

## Seed Admin (One-Time)
Create the first admin user before logging in:
- API: POST /api/auth/seed-admin with header x-admin-seed-key: <ADMIN_SEED_KEY>
