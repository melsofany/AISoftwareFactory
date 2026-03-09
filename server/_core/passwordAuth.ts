import { Request, Response, NextFunction } from "express";

const MANUS_PASSWORD = process.env.MANUS_PASSWORD;

export function verifyPasswordMiddleware(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.cookies?.["manus-session"];
  
  if (sessionId && isValidSession(sessionId)) {
    return next();
  }

  // For public endpoints that don't require auth
  if (req.path === "/api/auth/verify-password") {
    return next();
  }

  // For all other endpoints, require authentication
  return res.status(401).json({ error: "Unauthorized" });
}

export function isValidSession(sessionId: string): boolean {
  // In a real app, you'd validate this against a session store
  return sessionId === "valid";
}

export function verifyPassword(password: string): boolean {
  if (!MANUS_PASSWORD) {
    console.error("MANUS_PASSWORD is not set");
    return false;
  }
  return password === MANUS_PASSWORD;
}

export function createSessionCookie(): string {
  // Generate a simple session token
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
