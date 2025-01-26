import express, { Express } from "express";
import authRoutes from "./routes/auth.routes";

export const setupServer = async (): Promise<Express> => {
  const app = express();
  app.use("/auth", authRoutes);
  return app;
};
