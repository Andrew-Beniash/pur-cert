import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.routes";
import { getPool } from "./config/database";

export const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const startServer = async () => {
  try {
    // Initialize database connection
    await getPool();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Only start the server if this file is being run directly
if (require.main === module) {
  startServer();
}
