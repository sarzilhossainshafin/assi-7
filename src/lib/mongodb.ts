
import dns from "node:dns";
import { MongoClient } from "mongodb";

// Use Google DNS only
dns.setServers(["8.8.8.8"]);

const uri = process.env.DATABASE_URL;

if (!uri) {
  throw new Error("Please add DATABASE_URL to .env.local");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

export const client =
  globalForMongo.mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

export const db = client.db();