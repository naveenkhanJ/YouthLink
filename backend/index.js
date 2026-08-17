
import app from "./src/app.js";
import config from "./src/config/index.js";

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
