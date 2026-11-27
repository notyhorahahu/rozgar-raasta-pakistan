// Create the one admin for Rozgar Raasta Pakistan.
//
// Usage (local testing):
//   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD='<strong-password>' \
//     node scripts/create-admin.mjs
//
// Usage (production, one time only): set DATABASE_URL, ADMIN_EMAIL and
// ADMIN_PASSWORD as Vercel env vars, run this script against the Neon
// database, then REMOVE ADMIN_PASSWORD from Vercel env vars.
//
// Safety:
// - Refuses to run if an admin already exists (idempotent — running
//   it twice cannot create a second one or reset the first password).
//   There is exactly ONE admin; the database also enforces this with
//   the users_single_admin_idx partial unique index (migration 003).
// - Refuses to run if ADMIN_EMAIL / ADMIN_PASSWORD / DATABASE_URL are missing.
// - Never prints the password or the connection string.
// - Passwords are hashed with bcrypt, cost factor 12. Minimum length 8.
// - The script needs DATABASE_URL in the environment; it does NOT read
//   .env itself (use `node --env-file=.env scripts/create-admin.mjs`
//   locally, or export the variables first).
import bcrypt from 'bcryptjs';
import pg from 'pg';

const { DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!DATABASE_URL) {
	console.error('ERROR: DATABASE_URL is not set. Set it to the database you want to initialise.');
	process.exit(1);
}
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
	console.error('ERROR: ADMIN_EMAIL and ADMIN_PASSWORD must both be set in the environment.');
	process.exit(1);
}
const email = ADMIN_EMAIL.trim().toLowerCase();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
	console.error('ERROR: ADMIN_EMAIL is not a valid email address.');
	process.exit(1);
}
if (ADMIN_PASSWORD.length < 8) {
	console.error('ERROR: ADMIN_PASSWORD must be at least 8 characters.');
	process.exit(1);
}

const isLocal = DATABASE_URL.includes('localhost') || DATABASE_URL.includes('127.0.0.1');
const pool = new pg.Pool({
	connectionString: DATABASE_URL,
	ssl: isLocal ? false : { rejectUnauthorized: false },
});

try {
	const existing = await pool.query(
		`SELECT id, email FROM users WHERE role = 'admin' LIMIT 1`,
	);
	if (existing.rows.length > 0) {
		console.error(
			`ERROR: an admin already exists (${existing.rows[0].email}). Refusing to create another one — there is only one admin. ` +
				'If the password is lost, reset it directly in the database (UPDATE users SET password_hash = ... WHERE role = \'admin\').',
		);
		process.exit(1);
	}

	const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
	const created = await pool.query(
		`INSERT INTO users (email, password_hash, role, name)
		 VALUES ($1, $2, 'admin', $3)
		 RETURNING id, email, role, created_at`,
		[email, passwordHash, 'Admin'],
	);
	const row = created.rows[0];
	console.log(`Admin created: ${row.email} (role: ${row.role}, id: ${row.id})`);
	console.log('Log in at /admin/login. Remember to remove ADMIN_PASSWORD from the environment afterwards.');
} catch (err) {
	console.error('ERROR: failed to create the admin:', err.message);
	process.exit(1);
} finally {
	await pool.end();
}
