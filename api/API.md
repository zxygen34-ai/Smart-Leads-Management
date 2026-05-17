# Smart Leads API Documentation

Base URL (local): http://localhost:4000/api

## Response Format
Successful responses:
```
{
  "success": true,
  "data": { ... },
  "meta": { ... }
}
```
Error responses:
```
{
  "success": false,
  "error": {
    "message": "...",
    "code": "...",
    "details": { ... }
  }
}
```

## Authentication
JWT is required for all lead endpoints. Send as:
```
Authorization: Bearer <token>
```

### POST /auth/register
Registers a sales user.

Body:
```
{
  "name": "Riya Sharma",
  "email": "riya@company.com",
  "password": "StrongPass123"
}
```

### POST /auth/login
Body:
```
{
  "email": "riya@company.com",
  "password": "StrongPass123"
}
```

### POST /auth/seed-admin
Creates the first admin user. Requires header:
```
x-admin-seed-key: <ADMIN_SEED_KEY>
```
Body:
```
{
  "name": "Admin User",
  "email": "admin@company.com",
  "password": "StrongPass123"
}
```
Also available via the frontend at /seed-admin.

## Leads

### GET /leads
Query params:
- status: New | Contacted | Qualified | Lost
- source: Website | Instagram | Referral
- search: string (name or email)
- sort: latest | oldest
- page: number

Example:
```
GET /leads?status=Qualified&source=Instagram&search=Rahul&sort=latest&page=2
```

Response meta:
```
{
  "page": 2,
  "limit": 10,
  "total": 125,
  "totalPages": 13
}
```

### GET /leads/export
Admin only. Returns CSV. Supports the same filters as GET /leads.

### GET /leads/:id
Returns a single lead.

### POST /leads
Admin and Sales.

Body:
```
{
  "name": "Aarav Sharma",
  "email": "aarav@company.com",
  "status": "New",
  "source": "Website"
}
```

### PUT /leads/:id
Admin and Sales.

Body:
```
{
  "name": "Aarav Sharma",
  "email": "aarav@company.com",
  "status": "Contacted",
  "source": "Website"
}
```

### DELETE /leads/:id
Admin only.

## Errors
- DUPLICATE_EMAIL: lead email already exists
- LEAD_NOT_FOUND: lead does not exist
- UNAUTHORIZED / FORBIDDEN: auth or role failures
