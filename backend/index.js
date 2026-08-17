/**
 * Server bootstrap. Starts the HTTP listener and nothing else.
 *
 * The application itself lives in src/app.js — keep this file trivial so that
 * "how does the app get built" has exactly one answer.
 */
const app = require("./src/app");
const config = require("./src/config");
const prisma = require("./src/lib/prisma");

async function startServer() {
  await prisma.ready;
  app.listen(config.port, () => {
    console.log(`API listening on http://localhost:${config.port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
