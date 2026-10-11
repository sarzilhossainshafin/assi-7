import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL;

if (!uri) {
  throw new Error("DATABASE_URL environment variable পাওয়া যায়নি");
}

type MongoGlobal = typeof globalThis & {
  _mongoClient?: MongoClient;
};

const globalForMongo = globalThis as MongoGlobal;

export const client =
  globalForMongo._mongoClient ?? new MongoClient(uri);

globalForMongo._mongoClient = client;