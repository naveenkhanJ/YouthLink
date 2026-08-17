/**
 * The single shared PrismaClient for the whole backend.
 *
 * Prisma 7 generates an ESM client and requires a database adapter at runtime.
 * The project stays CommonJS for now, so we initialize the client through a
 * promise-backed singleton instead of converting the whole backend to ESM.
 */
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

let prismaClient = null;
let prismaInitError = null;
let pool = null;
const prisma = {};

const initPromise = (async () => {
  try {
    const generatedClient = await import("../../generated/prisma/client.ts");
    const { PrismaClient } = generatedClient;

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);
    prismaClient = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });

    Object.assign(prisma, prismaClient);
    return prismaClient;
  } catch (error) {
    prismaInitError = error;
    if (
      error?.code === "MODULE_NOT_FOUND" ||
      String(error?.message || "").includes("has not been generated") ||
      String(error?.message || "").includes("does not provide an export named")
    ) {
      throw new Error(
        "The Prisma client has not been generated yet.\n" +
          "Run this in the backend/ folder, then start the server again:\n\n" +
          "  npx prisma generate\n\n" +
          "(The generated/ folder is git-ignored, so it is never in a fresh clone.)",
      );
    }
    throw error;
  }
})();

Object.defineProperty(prisma, "ready", {
  value: initPromise,
  enumerable: true,
  configurable: false,
});

const prismaProxy = new Proxy(prisma, {
  get(target, prop) {
    if (prop === "ready") {
      return target.ready;
    }
    if (prismaClient && prop in prismaClient) {
      return prismaClient[prop];
    }
    if (prop in target) {
      return target[prop];
    }
    if (prismaInitError) {
      throw prismaInitError;
    }
    throw new Error(
      "Prisma client is still initializing. Wait for prisma.ready before using it.",
    );
  },
});

prismaProxy.disconnect = async () => {
  if (prismaClient) {
    await prismaClient.$disconnect();
  }
  if (pool) {
    await pool.end();
  }
};

module.exports = prismaProxy;
