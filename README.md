# Mankind George Portfolio

Retro newspaper-themed personal portfolio and blog.

## Tech Stack

- **Frontend:** Nuxt 3, Vue 3, Tailwind CSS
- **Backend:** NestJS, Prisma, PostgreSQL
- **Production:** Docker Compose

## Local Development (Windows)

### Prerequisites
- Node.js 20+
- PostgreSQL running locally on port 5432

### Setup

```bash
# 1. Create database
psql -U postgres -c "CREATE DATABASE mankind_george;"

# 2. Backend
cd backend
cp .env.example .env    # edit DATABASE_URL if needed
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev       # http://localhost:3001

# 3. Frontend (new terminal)
cd frontend
npm install
npm run dev             # http://localhost:3000
```

## Docker Production

```bash
cp .env.example .env    # configure secrets
docker-compose up -d    # frontend:3000, backend:3001, db:5433
```

## Admin Dashboard

Navigate to `/admin`, login with credentials from seed data.

## Environment Variables

See `.env.example` for all configuration options.
