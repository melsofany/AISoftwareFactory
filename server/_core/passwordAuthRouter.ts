import { Router, Request, Response } from "express";
import { verifyPassword, createSessionCookie, isValidSession } from "./passwordAuth";

const router = Router();

router.post("/verify-password", (req: Request, res: Response) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  if (verifyPassword(password)) {
    const sessionCookie = createSessionCookie();
    res.cookie("manus-session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    return res.json({ success: true });
  }

  return res.status(401).json({ success: false, error: "Invalid password" });
});

router.get("/check", (req: Request, res: Response) => {
    const sessionId = req.cookies?.["manus-session"];
    if (sessionId && isValidSession(sessionId)) {
        return res.json({ authenticated: true });
    }
    return res.json({ authenticated: false });
});

export default router;
