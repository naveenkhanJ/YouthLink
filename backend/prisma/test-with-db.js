/**
 * `npm run test:db` — runs the whole Jest suite INCLUDING the database API tests
 * (src/modules/account/test/account.api.integration.test.js), with no manual setup.
 *
 * Owner: Afham (shared components).
 *
 * Plain `npm test` skips the database tests because they need a disposable database: they apply
 * the migrations and run the seed, which empties every table. This script prepares that database
 * and then runs Jest with TEST_DATABASE_URL pointing at it:
 *
 *   1. It takes DATABASE_URL from backend/.env (the database you already develop against) and
 *      derives the test database from it by adding "_test" to the name — youthlink becomes
 *      youthlink_test, on the same server, with the same user and password. So nobody types a
 *      password or needs psql on their PATH. A TEST_DATABASE_URL already set in the environment
 *      is used as it is instead.
 *   2. It refuses anything that is not on this machine or whose name does not contain "test", so
 *      it can never point at the development database. (The test suite checks the same again.)
 *   3. It creates the test database if it does not exist yet, through the `pg` driver the backend
 *      already depends on. It never drops or empties anything itself; the seed does that inside
 *      the test database only.
 *   4. It runs Jest exactly as `npm test` does, with TEST_DATABASE_URL set for that run only.
 *      Extra arguments are passed to Jest: `npm run test:db -- account.login` runs one file.
 *
 * Usage (from backend/):  npm run test:db
 */
import "dotenv/config";
import pg from "pg";
import { spawnSync } from "child_process";

const LOCAL_HOSTS = ["localhost", "127.0.0.1", "::1", "[::1]"];

/** The test database's URL: TEST_DATABASE_URL if set, otherwise DATABASE_URL with "_test" added. */
function testDatabaseUrl() {
  if (process.env.TEST_DATABASE_URL) return new URL(process.env.TEST_DATABASE_URL);
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "No DATABASE_URL found. Copy backend/.env.example to backend/.env and fill it in, " +
        "or set TEST_DATABASE_URL yourself.",
    );
  }
  const url = new URL(process.env.DATABASE_URL);
  const name = decodeURIComponent(url.pathname.slice(1));
  url.pathname = `/${/test/i.test(name) ? name : `${name}_test`}`;
  return url;
}

/** Stops with a clear message unless the URL is a local database whose name contains "test". */
function assertSafe(url) {
  const name = decodeURIComponent(url.pathname.slice(1));
  if (!LOCAL_HOSTS.includes(url.hostname)) {
    throw new Error(`Refusing to run: the test database must be on this machine (got host "${url.hostname}").`);
  }
  if (!/test/i.test(name)) {
    throw new Error(`Refusing to run: the test database's name must contain "test" (got "${name}").`);
  }
  // The name goes into CREATE DATABASE below, which cannot take a query parameter.
  if (!/^[A-Za-z0-9_]+$/.test(name)) {
    throw new Error(`Refusing to run: use only letters, digits and "_" in the test database's name (got "${name}").`);
  }
  return name;
}

/** Creates the test database on the same server if it is not there yet. */
async function ensureDatabase(url, name) {
  // Connect to the server's maintenance database: the test database may not exist yet.
  const admin = new URL(url);
  admin.pathname = "/postgres";
  admin.search = "";
  const client = new pg.Client({ connectionString: admin.toString() });
  await client.connect();
  try {
    const { rowCount } = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [name]);
    if (rowCount === 0) {
      await client.query(`CREATE DATABASE "${name}"`);
      console.log(`Created the test database "${name}".`);
    }
  } finally {
    await client.end();
  }
}

async function main() {
  const url = testDatabaseUrl();
  const name = assertSafe(url);
  await ensureDatabase(url, name);
  console.log(`Running every test, including the database tests, against "${name}" on ${url.host}.\n`);

  const result = spawnSync(
    process.execPath,
    ["--experimental-vm-modules", "node_modules/jest/bin/jest.js", ...process.argv.slice(2)],
    { stdio: "inherit", env: { ...process.env, TEST_DATABASE_URL: url.toString() } },
  );
  process.exit(result.status ?? 1);
}

main().catch((err) => {
  // A wrong password or a stopped server is the usual cause; say so without printing the URL,
  // which contains the password.
  console.error(`\ntest:db could not start: ${err.message}`);
  if (err.code === "ECONNREFUSED") console.error("Is PostgreSQL running on this machine?");
  if (err.code === "28P01") console.error("The user or password in backend/.env DATABASE_URL was not accepted.");
  process.exit(1);
});
