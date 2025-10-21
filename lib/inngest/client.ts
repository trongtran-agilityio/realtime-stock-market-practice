import { Inngest } from "inngest";

/**
 * Inngest client configuration
 * Handles event-driven functions and AI integration
 * Requires GEMINI_API_KEY in environment
 */
export const inngest = new Inngest({
  id: 'signalist',
  ai: {
    gemini: { apiKey: process.env.GEMINI_API_KEY! },
  },
})