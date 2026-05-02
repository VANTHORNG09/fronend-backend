<<<<<<< HEAD
# fronend-backend
=======
# Learning Management System

Full-stack LMS scaffold built with Spring Boot, PostgreSQL/Flyway, JWT RBAC, Next.js App Router, TypeScript, TailwindCSS, shadcn-style UI primitives, Redux Toolkit, RTK Query, React Hook Form, and Zod.

## Structure

- `backend/` - Spring Boot REST API.
- `frontend/` - Next.js application.
- `docker/` - PostgreSQL + pgAdmin local services.

## Local Setup

1. Start PostgreSQL:

   ```powershell
   docker compose -f docker/docker-compose.yml up -d
   ```

2. Backend:

   ```powershell
   cd backend
   mvn spring-boot:run
   ```

3. Frontend:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

Default API URL: `http://localhost:8080/api`.

## Demo Users

Flyway seeds these users with password `Password123!`:

- `admin@lms.local`
- `teacher@lms.local`
- `student@lms.local`

## Version Control

Suggested initial commits:

1. `chore: scaffold lms monorepo`
2. `feat: add spring boot api with jwt rbac`
3. `feat: add next dashboard app`

>>>>>>> c0d1aa0 (chore: scaffold lms monorepo)
