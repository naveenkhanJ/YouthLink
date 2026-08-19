
import config from "../config/index.js";

let PrismaClient, PrismaPg;
try {
  ({ PrismaClient } = await import("../../generated/prisma/client.js"));
  ({ PrismaPg } = await import("@prisma/adapter-pg"));
} catch (err) {
  if (err.code === "ERR_MODULE_NOT_FOUND") {
    throw new Error(
      "The Prisma client or its driver adapter is missing.\n" +
        "Run this in the backend/ folder, then start the server again:\n\n" +
        "  npm install\n" +
        "  npx prisma generate\n\n" +
        "(The generated/ folder is git-ignored, so it is never in a fresh clone.)",
    );
  }
  throw err;
}

const adapter = new PrismaPg({ connectionString: config.databaseUrl });

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

export default prisma;
