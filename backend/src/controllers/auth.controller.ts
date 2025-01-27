import { Request, Response, Router } from "express";
import { createUser, User } from "../models/user.model";

type GoogleAuthBody = {
  user: {
    email: string;
    name?: string;
  };
  account: {
    providerAccountId: string;
  };
};

export const handleGoogleAuth = async (
  req: Request<{}, {}, GoogleAuthBody>,
  res: Response
) => {
  try {
    const { user, account } = req.body;

    if (!user?.email || !account?.providerAccountId) {
      return res.status(400).json({ error: "Invalid user data" });
    }

    const userData: Partial<User> = {
      email: user.email,
      name: user.name,
      google_id: account.providerAccountId,
    };

    const dbUser = await createUser(userData);
    return res.status(200).json({ success: true, user: dbUser });
  } catch (error) {
    console.error("Error storing user:", error);
    return res.status(500).json({ error: "Failed to store user data" });
  }
};

const router = Router();
router.post("/google", handleGoogleAuth as any);

export { router as authRouter };
