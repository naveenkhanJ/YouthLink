/**
 * The single shared PrismaClient for the whole backend.
 *
 * Import this everywhere. Do NOT call `new PrismaClient()` in your own module:
 * every instance opens its own connection pool, and with four modules doing it
 * the database runs out of connections under very little load.
 *
 * NOTE the import path. schema.prisma sets `output = "../generated/prisma"`,
 * so the client is NOT at "@prisma/client". The generated folder is
 * git-ignored — if this import fails, run `npx prisma generate` in backend/.
 */
let PrismaClient;
try {
  ({ PrismaClient } = require("../../generated/prisma"));
} catch (err) {
  if (err.code === "MODULE_NOT_FOUND") {
    throw new Error(
      "The Prisma client has not been generated yet.\n" +
        "Run this in the backend/ folder, then start the server again:\n\n" +
        "  npx prisma generate\n\n" +
        "(The generated/ folder is git-ignored, so it is never in a fresh clone.)",
    );
  }
  throw err;
}

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

module.exports = prisma;
