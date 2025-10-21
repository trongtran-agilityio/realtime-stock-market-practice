import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase } from "@/database/mongoose";
import { nextCookies } from "better-auth/next-js";
import { Db } from "mongodb";

/**
 * Singleton pattern for authentication instance
 * Ensures single connection across app lifecycle
 */
let authInstance: ReturnType<typeof betterAuth> | null = null;

/**
 * Initialize or retrieve authentication instance
 * Features:
 * - MongoDB adapter integration
 * - Email/password authentication
 * - Next.js cookie handling
 */
export const getAuth = async () => {
  if (authInstance) return authInstance;

  const mongoose = await connectToDatabase();
  const db = mongoose.connection.db as unknown as Db;

  if (!db) throw new Error('MongoDB connection not found.');

  authInstance = betterAuth({
    database: mongodbAdapter(db),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
      enabled: true,
      disableSignUp: false,
      requireEmailVerification: false,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      autoSignIn: true,
    },
    plugins: [nextCookies()],
  });

  return authInstance;
}

export const auth = await getAuth();
