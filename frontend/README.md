# LMS Frontend

Next.js App Router LMS interface with TypeScript, TailwindCSS, shadcn-style UI components, Redux Toolkit, RTK Query, React Hook Form, Zod, Sonner toasts, and Recharts.

## Run

```powershell
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_URL` in `.env.local` if your Spring Boot API is not at `http://localhost:8080/api`.

## Auth

JWT access tokens are stored in localStorage for RTK Query and mirrored into a cookie for route middleware role guards. For hardened production deployment, move access/refresh tokens to secure, HttpOnly cookies issued by the backend.

