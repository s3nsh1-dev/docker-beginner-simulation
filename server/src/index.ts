import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { initDb, pool } from "./config/db.js";
import todoRoutes from "./routes/todoRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// Healthcheck — Stage 8 simulated crash
app.get("/api/health", (req, res) => {
  res.status(500).json({ status: "error", reason: "simulated crash" });
});

// Routes
app.use("/api/todos", todoRoutes);

// Centralized error handling
app.use(errorHandler);

// Start server after DB initialization
const startServer = async () => {
  try {
    await initDb();
    const server = app.listen(PORT, () => {
      console.log(
        `🚀 Express REST API server running on http://localhost:${PORT}`,
      );
    });

    const shutdown = async () => {
      console.log('Shutting down gracefully...');
      server.close();
      await pool.end();
      process.exit(0);
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
