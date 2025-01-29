import { Request, Response, NextFunction } from "express";
import cors from "cors";
import { expressjwt } from "express-jwt";

// CORS middleware
export const corsMiddleware = cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
});

// Error handling middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Invalid or missing token" });
  }

  res.status(500).json({ error: "Something went wrong!" });
};

// Authentication error handler
export const handleAuthError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Invalid token" });
  } else {
    next(err);
  }
};
