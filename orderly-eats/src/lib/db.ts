import mongoose from "mongoose";
import * as dns from "dns";
import { promises as dnsPromises } from "dns";

// Use Google DNS to resolve SRV records since the corporate DNS server
// at 10.86.185.42 blocks SRV lookups needed by mongodb+srv:// URIs.
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch {
  // ignore if already set or locked
}

let isConnected = false;

const clientOptions = {
  serverApi: { version: "1" as const, strict: true, deprecationErrors: true },
};

/**
 * Parse a mongodb+srv:// URI into a direct mongodb:// URI by resolving
 * SRV records via the configured DNS servers (Google DNS).
 */
async function srvToDirectUri(srvUri: string): Promise<string> {
  // Strip mongodb+srv:// prefix
  const rest = srvUri.slice("mongodb+srv://".length);

  // Split at @ to separate auth from host+path
  const atIndex = rest.lastIndexOf("@");
  let auth = "";
  let hostPart = rest;
  if (atIndex >= 0) {
    auth = rest.slice(0, atIndex + 1); // includes the @
    hostPart = rest.slice(atIndex + 1);
  }

  // Split hostPart at first / or ? to separate host from path+query
  const pathIndex = hostPart.search(/[/?#]/);
  const host = pathIndex >= 0 ? hostPart.slice(0, pathIndex) : hostPart;
  const pathQuery = pathIndex >= 0 ? hostPart.slice(pathIndex) : "";

  // Resolve SRV records via Node.js dns (uses our Google DNS override)
  const records = await dnsPromises.resolveSrv("_mongodb._tcp." + host);
  const hosts = records.map((r) => `${r.name}:${r.port}`);

  return "mongodb://" + auth + hosts.join(",") + pathQuery;
}

/**
 * Connect to MongoDB via Mongoose using the Stable API.
 * Pings the deployment on first connect to confirm reachability.
 * Reuses an existing connection if already established.
 */
export async function connectToDatabase(dbName?: string): Promise<typeof mongoose.connection> {
  const uri = (process.env.MONGODB_URI ?? "").trim();
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  if (mongoose.connection.readyState === 1) {
    // already connected
    return mongoose.connection;
  }

  let lastError: unknown;

  // Attempt 1: Standard SRV connection (mongodb+srv://)
  // This may fail on networks that block SRV DNS lookups
  if (uri.startsWith("mongodb+srv://")) {
    try {
      await mongoose.connect(uri, {
        ...clientOptions,
        dbName: dbName ?? process.env.MONGODB_DB ?? "orderly-eats",
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
    } catch (err) {
      lastError = err;
      console.warn("MongoDB: SRV connection failed, manually resolving DNS...", (err as Error).message);
    }
  }

  // Attempt 2: Manually resolve SRV via Node.js dns and connect with explicit hosts
  // NOTE: mongodb+srv:// implies TLS automatically, but mongodb:// does NOT.
  // We must explicitly enable TLS for Atlas connections.
  if ((mongoose.connection.readyState as number) !== 1 && uri.startsWith("mongodb+srv://")) {
    try {
      const directUri = await srvToDirectUri(uri);
      console.log("MongoDB: connecting via resolved hosts...");
      await mongoose.connect(directUri, {
        ...clientOptions,
        dbName: dbName ?? process.env.MONGODB_DB ?? "orderly-eats",
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000,
        tls: true, // Required - mongodb+srv:// implies TLS but mongodb:// does not
        tlsAllowInvalidCertificates: true,
      });
    } catch (err) {
      lastError = err;
      console.warn("MongoDB: direct connection also failed.", (err as Error).message);
    }
  }

  // If neither attempt succeeded, throw so store.server.ts can fall back to in-memory
  if ((mongoose.connection.readyState as number) !== 1) {
    throw lastError ?? new Error("MongoDB connection failed");
  }

  // Ping the deployment to confirm the connection is alive
  await mongoose.connection.db.admin().command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");

  isConnected = true;
  return mongoose.connection;
}

/**
 * Returns the underlying Mongoose connection.
 * Throws if not yet connected — call connectToDatabase first.
 */
export function getConnection() {
  if (mongoose.connection.readyState !== 1) {
    throw new Error("Mongoose not connected. Call connectToDatabase first.");
  }
  return mongoose.connection;
}

/**
 * Close the Mongoose connection gracefully.
 */
export async function closeConnection() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
    console.log("MongoDB: disconnected");
  }
}

export { mongoose };