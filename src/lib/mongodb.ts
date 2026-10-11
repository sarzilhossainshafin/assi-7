
import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL;

if (!uri) {
  throw new Error("Please add DATABASE_URL to .env.local");
}

const options = {};

const globalForMongo = globalThis as typeof globalThis & {
  _mongoClient?: MongoClient;
};

export const client =
  globalForMongo._mongoClient ?? new MongoClient(uri, options);

if (process.env.NODE_ENV !== "production") {
  globalForMongo._mongoClient = client;
}
