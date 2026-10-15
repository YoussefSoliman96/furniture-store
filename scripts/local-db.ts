/**
 * Local Postgres for development: real Postgres binaries via embedded-postgres,
 * no Docker or system install needed. Data persists in .data/postgres.
 *   npm run db:local    (leave it running; Ctrl+C stops the server)
 * Production uses Supabase; only DATABASE_URL differs.
 */
import { existsSync } from "node:fs";
import EmbeddedPostgres from "embedded-postgres";

const databaseDir = ".data/postgres";
const port = 5433;

const pg = new EmbeddedPostgres({
  databaseDir,
  user: "postgres",
  password: "postgres",
  port,
  persistent: true,
  // Windows otherwise defaults to a non-UTF-8 encoding that can't store Arabic.
  initdbFlags: ["--encoding=UTF8", "--locale=C"],
  onLog: () => {},
});

async function main() {
  if (!existsSync(databaseDir)) await pg.initialise();
  await pg.start();
  console.log(`Postgres ready on postgres://postgres:postgres@127.0.0.1:${port}/postgres`);

  const stop = async () => {
    await pg.stop();
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
}

main().catch(async (err) => {
  console.error(err);
  await pg.stop().catch(() => {});
  process.exit(1);
});
