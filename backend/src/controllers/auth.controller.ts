import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: `${process.env.BACKEND_URL}/auth/google/callback`,
});

export const googleAuth = (req: Request, res: Response) => {
  const authUrl = client.generateAuthUrl({
    scope: ["email", "profile"],
  });
  res.redirect(authUrl);
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    const { tokens } = await client.getToken(code as string);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Store user in database here

    res.json({ token: tokens.access_token });
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
};
