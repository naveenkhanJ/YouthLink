require("dotenv/config");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Health check — confirms the server is up and env vars loaded.
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    database: process.env.DATABASE_URL ? "configured" : "missing DATABASE_URL",
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
