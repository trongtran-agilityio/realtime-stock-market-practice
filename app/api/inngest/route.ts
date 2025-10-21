import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { sendSignUpEmail, sendDailyNewsSummary } from "@/lib/inngest/functions";

/**
 * Inngest API Route Handler
 * Configures serverless functions for:
 * - Welcome email after sign up
 * - Daily news summary delivery
 */
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [sendSignUpEmail, sendDailyNewsSummary],
});