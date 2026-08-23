import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "./schema";
import { createDb } from "./db";

export interface AuthEnv {
  DB: D1Database;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL?: string;
  TRUSTED_ORIGINS?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
}

export function createAuth(env: AuthEnv) {
  const db = createDb(env.DB);

  const trustedOrigins = env.TRUSTED_ORIGINS
    ? env.TRUSTED_ORIGINS.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : ["http://localhost:5173"];

  return betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins,
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
              clientId: env.GOOGLE_CLIENT_ID,
              clientSecret: env.GOOGLE_CLIENT_SECRET,
            },
          }
        : {}),
    },
  });
}
