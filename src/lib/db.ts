import pg from 'pg';

// Server-side PostgreSQL pool. Works with local PostgreSQL 16 (testing)
// and with a Neon pooled connection string (production) — same code,
// same DATABASE_URL env var in both places.
//
// SSL: local connections (localhost / 127.0.0.1) use no SSL; any other
// host (e.g. Neon) uses SSL with rejectUnauthorized: false, which is
// what Neon's pooled endpoints require.
let pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
	if (pool) return pool;
	const connectionString =
		process.env.DATABASE_URL ?? import.meta.env.DATABASE_URL;
	if (!connectionString) {
		throw new Error(
			'DATABASE_URL is not set. Set it in .env (local testing) or in the Vercel project env vars (production).',
		);
	}
	const isLocal =
		connectionString.includes('localhost') ||
		connectionString.includes('127.0.0.1');
	pool = new pg.Pool({
		connectionString,
		ssl: isLocal ? false : { rejectUnauthorized: false },
		max: 10,
	});
	pool.on('error', (err) => {
		console.error('[db] idle pool client error', err);
	});
	return pool;
}

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
	text: string,
	params?: unknown[],
): Promise<pg.QueryResult<T>> {
	const client = getPool();
	return client.query<T>(text, params as pg.QueryConfig['values']);
}
