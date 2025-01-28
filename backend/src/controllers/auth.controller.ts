import { Request, Response } from "express";
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

export const googleAuth = async (
  req: Request,
  res: Response
): Promise<void> => {
  // In a real implementation, this would initiate the Google OAuth flow
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?
    client_id=${process.env.GOOGLE_CLIENT_ID}
    &redirect_uri=${encodeURIComponent(process.env.GOOGLE_CALLBACK_URL || "")}
    &response_type=code
    &scope=email profile`);
};

export const googleCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      res.status(400).json({ error: "Invalid authorization code" });
      return;
    }

    // In a real implementation, this would:
    // 1. Exchange the code for tokens
    // 2. Get user info from Google
    // 3. Create/update user in our database
    res.redirect("/auth/success");
  } catch (error) {
    console.error("Error in Google callback:", error);
    res.redirect("/auth/error");
  }
};

export const handleGoogleAuth = async (
  req: Request<{}, {}, GoogleAuthBody>,
  res: Response
): Promise<Response | void> => {
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
