import { Router, Request, Response, NextFunction } from "express";
import {
  googleAuth,
  googleCallback,
  handleGoogleAuth,
} from "../controllers/auth.controller";

const router = Router();

// Helper to wrap async handlers
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// OAuth flow routes
router.get(
  "/google",
  asyncHandler(async (req, res) => {
    await googleAuth(req, res);
  })
);

router.get(
  "/google/callback",
  asyncHandler(async (req, res) => {
    await googleCallback(req, res);
  })
);

// Handle user data
router.post(
  "/google/user",
  asyncHandler(async (req, res) => {
    await handleGoogleAuth(req, res);
  })
);

export { router as authRouter };
