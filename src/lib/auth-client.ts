import { createAuthClient } from "better-auth/react";

const baseURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL;

if (!baseURL) {
  throw new Error("NEXT_PUBLIC_BETTER_AUTH_URL environment variable পাওয়া যায়নি");
}

export const authClient = createAuthClient({
  baseURL,
});