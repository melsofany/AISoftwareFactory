import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { isValidSession, getMockUser } from "./passwordAuth";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // 1. Try password session auth first
    const sessionId = opts.req.cookies?.["manus-session"];
    if (sessionId && isValidSession(sessionId)) {
      user = getMockUser();
      console.log("[Context] User authenticated via password session");
      return {
        req: opts.req,
        res: opts.res,
        user,
      };
    }

    // 2. Fallback to OAuth SDK if no password session
    if (!user) {
      try {
        user = await sdk.authenticateRequest(opts.req);
        if (user) {
          console.log("[Context] User authenticated via OAuth");
        }
      } catch (error) {
        // Authentication is optional for public procedures.
        console.log("[Context] OAuth authentication failed:", error instanceof Error ? error.message : String(error));
        user = null;
      }
    }
  } catch (error) {
    console.error("[Context] Unexpected error during context creation:", error);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
