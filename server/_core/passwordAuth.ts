import { Request, Response, NextFunction } from "express";
import type { User } from "../../drizzle/schema";

const MANUS_PASSWORD = process.env.MANUS_PASSWORD;

// A simple session store in memory for this example
// In production, use a proper session store or database
const activeSessions = new Set<string>();

export function verifyPasswordMiddleware(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.cookies?.["manus-session"];
  
  if (sessionId && activeSessions.has(sessionId)) {
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
  return activeSessions.has(sessionId);
}

export function verifyPassword(password: string): boolean {
  if (!MANUS_PASSWORD) {
    console.error("MANUS_PASSWORD is not set");
    // For development, allow 'admin' if no password is set
    if (process.env.NODE_ENV !== "production") {
        return password === "admin";
    }
    return false;
  }
  return password === MANUS_PASSWORD;
}

export function createSessionCookie(): string {
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  activeSessions.add(sessionId);
  return sessionId;
}

export function getMockUser(): User {
    return {
        id: 1,
        openId: "admin-user",
        name: "Admin",
        email: "admin@example.com",
        loginMethod: "password",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date()
    };
}
