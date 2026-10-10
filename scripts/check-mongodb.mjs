
import dotenv from "dotenv";
import dns from "node:dns";
import { MongoClient } from "mongodb";

dotenv.config({ path: ".env.local" });

// Use public DNS for this test
dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function checkMongoDB() {
  const uri = process.env.DATABASE_URL;

  if (!uri) {
    console.error("DATABASE_URL পাওয়া যায়নি।");
    return;
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    console.log("MongoDB CONNECTED SUCCESSFULLY!");
  } catch (error) {
    console.error("MONGODB CONNECTION ERROR:", error.message);
  } finally {
    await client.close();
  }
}

checkMongoDB();
