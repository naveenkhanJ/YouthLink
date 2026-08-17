/**
 * The single shared PrismaClient for the whole backend.
 *
 * Import this everywhere. Do NOT call `new PrismaClient()` in your own module:
 * every instance opens its own connection pool, and with four modules doing it
 * the database runs out of connections under very little load.
 *
 * NOTE the import path. schema.prisma sets `output = "../generated/prisma"`,
 * so the client is at "../../generated/prisma/client" — the "client"
 * entrypoint, not the bare generated/prisma directory (Prisma 7's
 * prisma-client generator splits client/browser/enums/models into separate
 * entrypoints). The generated folder is git-ignored — if this import fails,
 * run `npx prisma generate` in backend/.
 *
 * Prisma 7 requires an explicit driver adapter for SQL databases — there is
 * no built-in engine binary in this code path anymore. @prisma/adapter-pg
 * wraps the standard `pg` driver.
 */
const config = require("../config");

let PrismaClient, PrismaPg;
try {
  ({ PrismaClient } = require("../../generated/prisma/client"));
  ({ PrismaPg } = require("@prisma/adapter-pg"));
} catch (err) {
  if (err.code === "MODULE_NOT_FOUND") {
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

module.exports = prisma;
