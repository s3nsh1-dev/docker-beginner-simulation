# Todo App — Dockerized Full-Stack (React + Express + PostgreSQL)

> **Purpose:** A learning project for Docker, Docker Compose, and production-grade containerization patterns. The application itself is a full-featured Todo CRUD app; the focus is on the infrastructure layer.

---

## Quick Reference

| Layer    | Tech                        | Port (container) | Port (host)       |
| -------- | --------------------------- | ----------------- | ----------------- |
| Client   | React 19 + Vite → Nginx    | 80                | 3000 (dev) / 80 (prod) |
| Server   | Express 5 + Node 24        | 5000              | **Internal only** (`expose`, not `ports`) |
| Database | Neon PostgreSQL (external)  | —                 | —                 |

**Package manager:** pnpm 12.4.2 (via corepack)  
**Module system:** ESM (`"type": "module"`) in both client and server

---

## Directory Structure

```
.
├── docker-compose.yml          # Full-stack orchestration (production config)
├── labA-docker-compose.yml     # Standalone client container (learning lab)
├── labB-docker-compose.yml     # Standalone server container (learning lab)
│
├── client/
│   ├── Dockerfile              # Multi-stage: node:24-slim → nginx:stable-alpine
│   ├── .dockerignore
│   ├── nginx.conf              # Serves /dist + reverse proxies /api/ → server:5000
│   ├── src/
│   │   ├── App.tsx             # Root component
│   │   ├── main.tsx            # React entry point
│   │   ├── services/api.ts     # API client — uses relative URL "/api/todos"
│   │   ├── hooks/useTodos.ts   # Data fetching hook
│   │   ├── types/todo.ts       # Shared types (Todo, CreateTodoInput, etc.)
│   │   └── components/
│   │       ├── Header.tsx
│   │       ├── QuickAdd.tsx
│   │       ├── TodoCard.tsx
│   │       ├── TodoModal.tsx
│   │       ├── FilterBar.tsx
│   │       ├── StatsDashboard.tsx
│   │       └── EmptyState.tsx
│   ├── e2e/todos.spec.ts       # Playwright E2E tests
│   └── package.json
│
├── server/
│   ├── Dockerfile              # Multi-stage: node:24-slim (build) → node:24-slim (runtime)
│   ├── .dockerignore
│   ├── .env.example            # PORT, DATABASE_URL
│   ├── src/
│   │   ├── index.ts            # Express app entry — cors, health endpoint, routes, error handler
│   │   ├── config/db.ts        # pg.Pool, auto-creates "todos" table on startup (initDb)
│   │   ├── routes/todoRoutes.ts
│   │   ├── controllers/todoController.ts
│   │   ├── models/todoModel.ts # Raw SQL queries via pg (parameterized)
│   │   ├── middleware/
│   │   │   ├── validator.ts    # Zod schemas for create/update
│   │   │   └── errorHandler.ts
│   │   ├── types/todo.ts       # PriorityLevel, Category, Todo, TodoStats, etc.
│   │   └── tests/api.test.ts
│   └── package.json
│
└── README.md
```

---

## Docker Architecture

### How Requests Flow (Production)

```
Browser → :80 (Nginx container)
              ├── Static assets (React /dist)  →  served directly
              └── /api/*  →  proxy_pass http://server:5000  →  Express container  →  Neon PostgreSQL
```

- **Only the client container publishes a host port.** The server is reachable only via Docker's internal bridge network (`expose: "5000"`).
- The client's `api.ts` uses a relative URL (`/api/todos`), so all API requests route through Nginx's reverse proxy — no hardcoded `localhost` or CORS issues.

### Client Dockerfile (Multi-Stage)

| Stage | Base Image | Purpose |
|-------|-----------|---------|
| 1 (`client-build`) | `node:24-bookworm-slim` | `pnpm install` → `pnpm run build` (Vite produces `/app/dist`) |
| 2 (final) | `nginx:stable-alpine` | Copies `nginx.conf` + `/dist` into Nginx's html root |

### Server Dockerfile (Multi-Stage)

| Stage | Base Image | Purpose |
|-------|-----------|---------|
| 1 (`build`) | `node:24-bookworm-slim` | `pnpm install` → `tsc` (TypeScript compiles to `/app/dist`) |
| 2 (final) | `node:24-bookworm-slim` | `pnpm install --prod` + copies compiled `dist/`. Runs `node dist/index.js` |

### docker-compose.yml Key Decisions

| Feature | Implementation |
|---------|---------------|
| Startup ordering | `depends_on: server: condition: service_healthy` |
| Healthcheck | `node -e "fetch('http://localhost:5000/api/health')..."` (runs inside server container) |
| Secrets | `env_file: ./server/.env` (contains `PORT` and `DATABASE_URL`) |
| Signal handling | `init: true` on client (Tini as PID 1) |
| Log rotation | `json-file` driver, `max-size: 10m`, `max-file: 3` |
| Restart policy | `unless-stopped` on both services |

---

## Environment Variables

Managed via `server/.env` (not committed; see `.env.example`):

| Variable | Example | Used By |
|----------|---------|---------|
| `PORT` | `5000` | `server/src/index.ts` — Express listen port |
| `DATABASE_URL` | `postgresql://user:pass@host/db?sslmode=require` | `server/src/config/db.ts` — pg.Pool connection string |

SSL is auto-enabled when the connection string contains `neon.tech` or `sslmode=require`.

---

## API Endpoints

Base path: `/api/todos` (mounted in `server/src/index.ts`)

| Method | Path | Description | Validation |
|--------|------|-------------|------------|
| `GET` | `/api/health` | Health check (`{ status: "ok" }`) | — |
| `GET` | `/api/todos?search=&completed=&priority=&category=&sortBy=&sortOrder=` | List todos with filters/sorting | — |
| `GET` | `/api/todos/stats` | Aggregate stats (total, completed, by priority/category) | — |
| `GET` | `/api/todos/:id` | Get single todo | — |
| `POST` | `/api/todos` | Create todo | Zod: `createTodoSchema` |
| `PATCH` | `/api/todos/:id` | Update todo fields | Zod: `updateTodoSchema` |
| `PATCH` | `/api/todos/:id/toggle` | Toggle completed status | — |
| `DELETE` | `/api/todos/:id` | Delete single todo | — |
| `DELETE` | `/api/todos/completed/clear` | Bulk delete all completed | — |

---

## Database Schema

Auto-created on server startup by `initDb()` in `server/src/config/db.ts`:

```sql
CREATE TABLE IF NOT EXISTS todos (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    completed   BOOLEAN DEFAULT FALSE,
    priority    VARCHAR(20) DEFAULT 'medium',    -- low | medium | high | urgent
    category    VARCHAR(50) DEFAULT 'general',   -- work | personal | shopping | health | general
    due_date    TIMESTAMPTZ NULL,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

---

## Commands

```bash
# Full stack (build + run)
docker compose up --build

# Tear down
docker compose down

# Standalone labs (for isolated learning)
docker build -t todo-client:lab ./client
docker compose -f labA-docker-compose.yml up

docker build -t todo-server:lab ./server
docker compose -f labB-docker-compose.yml up

# Local development (no Docker)
cd client && pnpm dev          # Vite dev server on :5173
cd server && pnpm dev          # tsx watch on :5000
```

---

## .dockerignore Summary

| File | Excludes |
|------|----------|
| `client/.dockerignore` | `node_modules/`, `dist/`, `test-results/`, `.env`, `.env.*`, `.git/` |
| `server/.dockerignore` | `node_modules/`, `.env`, `.env.*`, `.git/` |

---

## Nginx Configuration (`client/nginx.conf`)

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location /api/ {
        proxy_pass http://server:5000;       # Docker internal DNS
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;    # SPA fallback
    }
}
```

---

## Continuous integration

The GitHub Actions workflow in `.github/workflows/ci.yml` runs three independent
checks on pushes to `main`, pull requests targeting `main`, and manual
dispatches:

| Job | What it checks | Database |
|-----|----------------|----------|
| `test-client` | Client lint and production build | None |
| `test-server` | Server typecheck, build, and database integration tests | A job-scoped PostgreSQL service |
| `test-e2e` | The Docker Compose test stack and Playwright browser journeys | The disposable database in `docker-compose.test.yml` |

Each job gets its own GitHub-hosted runner. PostgreSQL is a container service,
not a runner. The E2E job starts the client, server, and database together with
Docker Compose. The local `pnpm test:e2e` command uses the same stack and always
tears it down; a failed test remains a failed command.

Configure the repository's branch protection or ruleset to require the
`Client checks`, `Server integration`, and `Full-stack end-to-end` status checks
before merge. The workflow only verifies changes. It does not publish images
or deploy the app, leaving that work for the next stage.

---

## Next steps

- [ ] Publish tested client and server images to a container registry
- [ ] Deploy the images to AWS EC2 with `docker compose`
- [ ] Change the production host port from `3000:80` to `80:80`
- [ ] Configure SSL termination (Certbot or ALB + ACM)
- [ ] Add graceful SIGTERM handling in `server/src/index.ts`
