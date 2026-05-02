# LMS Backend

Spring Boot REST API for the LMS.

## Requirements

- Java 17+
- Maven 3.9+
- PostgreSQL 16+

## Run

```powershell
docker compose -f ../docker/docker-compose.yml up -d postgres
mvn spring-boot:run
```

## Configuration

Environment variables:

- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `JWT_SECRET`
- `JWT_ACCESS_TOKEN_MINUTES`
- `JWT_REFRESH_TOKEN_DAYS`
- `CORS_ALLOWED_ORIGINS`

Flyway migrations live in `src/main/resources/db/migration`.

