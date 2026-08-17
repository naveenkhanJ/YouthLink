/**
 * Server bootstrap. Starts the HTTP listener and nothing else.
 *
 * The application itself lives in src/app.js — keep this file trivial so that
 * "how does the app get built" has exactly one answer.
 */
import app from "./src/app.js";
import config from "./src/config/index.js";

app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});
