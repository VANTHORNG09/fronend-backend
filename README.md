# Learning Management System

Full-stack LMS scaffold built with Spring Boot, PostgreSQL/Flyway, JWT RBAC, Next.js App Router, TypeScript, TailwindCSS, shadcn-style UI primitives, Redux Toolkit, RTK Query, React Hook Form, and Zod.

## Structure

- `backend/` - Spring Boot REST API with JWT authentication and role-based access control.
- `frontend/` - Next.js application with TypeScript, TailwindCSS, and Redux Toolkit.
- `docker/` - Docker Compose configuration for PostgreSQL and backend services.

## Requirements

- Java 17+
- Maven 3.9+
- Node.js 18+
- Docker & Docker Compose

## Quick Start

### 1. Start Database Services

```bash
docker compose -f docker/docker-compose.yml up -d db
```

### 2. Run Backend

```bash
cd backend
mvn spring-boot:run
```

The API will be available at `http://localhost:8080/api`.

### 3. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## Configuration

### Backend Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `DATABASE_USERNAME` | Database username |
| `DATABASE_PASSWORD` | Database password |
| `JWT_SECRET` | Secret key for JWT token generation |
| `JWT_ACCESS_TOKEN_MINUTES` | Access token expiration time |
| `JWT_REFRESH_TOKEN_DAYS` | Refresh token expiration time |
| `CORS_ALLOWED_ORIGINS` | Allowed origins for CORS |

### Frontend Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Demo Users

Flyway migrations seed the following test users. All users have the password: `Password123!`

- `admin@lms.local` - Administrator role
- `teacher@lms.local` - Teacher role
- `student@lms.local` - Student role

## Tech Stack

### Backend
- Spring Boot
- PostgreSQL with Flyway migrations
- JWT authentication with RBAC
- Maven

### Frontend
- Next.js App Router
- TypeScript
- TailwindCSS
- shadcn-style UI components
- Redux Toolkit & RTK Query
- React Hook Form
- Zod validation
- Recharts

## Development

### Running with Docker

To run the full stack with Docker:

```bash
docker compose -f docker/docker-compose.yml up -d
```

### Database Migrations

Backend database migrations are managed by Flyway and located in:
`backend/src/main/resources/db/migration`

## Project Info

Suggested commit conventions:

1. `chore: scaffold lms monorepo`
2. `feat: add spring boot api with jwt rbac`
3. `feat: add next dashboard app`
