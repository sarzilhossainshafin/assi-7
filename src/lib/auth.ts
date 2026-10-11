
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { client } from "@/lib/mongodb";

const baseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL;

if (!baseURL) {
  throw new Error("BETTER_AUTH_URL is not configured");
}

export const auth = betterAuth({
  database: mongodbAdapter(client.db(), {
    client,
  }),

  baseURL,

  trustedOrigins: [
    "https://assi-7-mk9h.vercel.app",
  ],

  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
