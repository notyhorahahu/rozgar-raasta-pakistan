import pg from "pg";
// src/lib/db.ts
var pool = null;
function getPool() {
	if (pool) return pool;
	const connectionString = process.env.DATABASE_URL ?? "postgresql://rozgar:rozgar_local_test@127.0.0.1:5432/rozgar_test";
	if (!connectionString) throw new Error("DATABASE_URL is not set. Set it in .env (local testing) or in the Vercel project env vars (production).");
	const isLocal = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");
	pool = new pg.Pool({
		connectionString,
		ssl: isLocal ? false : { rejectUnauthorized: false },
		max: 10
	});
	pool.on("error", (err) => {
		console.error("[db] idle pool client error", err);
	});
	return pool;
}
async function query(text, params) {
	return getPool().query(text, params);
}
export { query as t };
