# TaskPulse Server (Backend)

RESTful API built with Express 5, TypeScript, and Neon PostgreSQL database.

## 📁 Folder Structure

```
server/
├── src/
│   ├── config/
│   │   └── db.ts            # Neon PostgreSQL connection pool & table DDL initialization
│   ├── controllers/
│   │   └── todoController.ts# Express HTTP request handlers & status code logic
│   ├── middleware/
│   │   ├── validator.ts     # Zod payload validation middleware
│   │   └── errorHandler.ts  # Global Express error handler
│   ├── models/
│   │   └── todoModel.ts     # PostgreSQL SQL database query layer
│   ├── routes/
│   │   └── todoRoutes.ts    # REST API endpoints definition
│   ├── tests/
│   │   └── api.test.ts      # Server integration tests
│   ├── types/
│   │   └── todo.ts          # Server TypeScript interfaces & DTOs
│   └── index.ts             # Express app entrypoint & server bootstrap
├── .env                     # DATABASE_URL configuration
└── package.json             # Server dependencies & scripts
```

## 🛠️ Scripts

```bash
# Install dependencies
pnpm install

# Start Express Backend Dev Server (http://localhost:5000)
pnpm dev

# Run Server Integration Tests
pnpm test

# Build Server to JavaScript (dist/)
pnpm build
```

## 🚀 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| **GET** | `/api/health` | Server health check |
| **GET** | `/api/todos` | Fetch list of todos (supports `search`, `completed`, `priority`, `category`, `sortBy`) |
| **GET** | `/api/todos/stats` | Aggregate task statistics summary |
| **GET** | `/api/todos/:id` | Fetch single todo by ID |
| **POST** | `/api/todos` | Create a new todo task |
| **PATCH**| `/api/todos/:id` | Update todo details |
| **PATCH**| `/api/todos/:id/toggle` | Toggle todo completion status |
| **DELETE**| `/api/todos/:id` | Delete todo task |
| **DELETE**| `/api/todos/completed/clear` | Clear all completed tasks |
