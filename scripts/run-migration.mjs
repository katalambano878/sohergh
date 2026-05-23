/**
 * Run Supabase migrations via exec_sql RPC (if present) or PostgreSQL.
 *
 * Run: node scripts/run-migration.mjs
 *      node scripts/run-migration.mjs --file 20260406_voice_support.sql
 *
 * Default applies every *.sql in supabase/migrations/ in sorted order (full migration).
 * For an already-initialized DB, skip the baseline or use --file for incremental SQL only.
 *
 * Prerequisites (one of):
 * 1. DATABASE_URL — direct Postgres (Supabase Dashboard → Settings → Database)
 * 2. SUPABASE_DB_PASSWORD + NEXT_PUBLIC_SUPABASE_URL
 * 3. SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL — tries exec_sql RPC per file (often unavailable)
 */

import pg from 'pg';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, '..', 'supabase', 'migrations');

function loadEnv() {
    const envPath = path.join(__dirname, '..', '.env.local');
    const altPath = path.join(__dirname, '..', '.env');
    const p = fs.existsSync(envPath) ? envPath : fs.existsSync(altPath) ? altPath : null;
    if (!p) return {};
    return Object.fromEntries(
        fs.readFileSync(p, 'utf-8').split('\n')
            .filter(l => /^[A-Z_]+=/.test(l.trim()))
            .map(l => {
                const eq = l.indexOf('=');
                return [l.slice(0, eq).trim(), l.slice(eq + 1).trim()];
            })
    );
}

const env = { ...process.env, ...loadEnv() };
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const PROJECT_REF = SUPABASE_URL?.match(/([a-zA-Z0-9]{20,})\.supabase\.co/)?.[1];

let connectionString = env.DATABASE_URL;
let directConnection = null;
if (!connectionString && env.SUPABASE_DB_PASSWORD && PROJECT_REF) {
    const pw = encodeURIComponent(env.SUPABASE_DB_PASSWORD);
    connectionString = `postgresql://postgres.${PROJECT_REF}:${pw}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;
    directConnection = `postgresql://postgres:${pw}@db.${PROJECT_REF}.supabase.co:5432/postgres`;
}

function parseArgs() {
    const argv = process.argv.slice(2);
    let singleFile = null;
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a.startsWith('--file=')) singleFile = a.slice('--file='.length);
        else if (a === '--file' && argv[i + 1]) singleFile = argv[++i];
    }
    return { singleFile };
}

function listMigrationFiles(singleFile) {
    if (!fs.existsSync(MIGRATIONS_DIR)) {
        console.error('ERROR: Migrations directory not found:', MIGRATIONS_DIR);
        process.exit(1);
    }
    const all = fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql')).sort();
    if (singleFile) {
        const name = singleFile.includes(path.sep) ? path.basename(singleFile) : singleFile;
        if (!all.includes(name)) {
            console.error('ERROR: Migration not found:', name);
            console.error('Available:', all.join(', '));
            process.exit(1);
        }
        return [name];
    }
    return all;
}

async function runViaSupabaseRpc(sql) {
    if (!SUPABASE_URL || !SERVICE_KEY) return { ok: false, reason: 'no_service_key' };
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
    if (error) throw error;
    return { ok: true };
}

async function tryConnect(connStr, label) {
    console.log(`Trying ${label}...`);
    const client = new pg.Client({
        connectionString: connStr,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 15000,
    });
    try {
        await client.connect();
        console.log(`Connected via ${label}.`);
        return client;
    } catch (err) {
        console.log(`${label} failed: ${err.message}`);
        return null;
    }
}

async function main() {
    const { singleFile } = parseArgs();
    const files = listMigrationFiles(singleFile);
    const projectRef =
        PROJECT_REF ||
        connectionString?.match(/postgres\.([a-zA-Z0-9]+)|db\.([a-zA-Z0-9]+)\.supabase/)?.[1] ||
        'project';

    console.log('=== Supabase migrations ===');
    console.log(`Project: ${projectRef}`);
    console.log(`Files (${files.length}): ${files.join(', ')}\n`);

    const runSqlOnPg = async (client, sql, label) => {
        console.log(`Executing: ${label} ...`);
        await client.query(sql);
    };

    // Try exec_sql RPC for each file (only when no direct DB URL and service key present)
    if (SUPABASE_URL && SERVICE_KEY && !connectionString && !directConnection) {
        console.log('Trying Supabase exec_sql RPC per file...\n');
        try {
            for (const f of files) {
                const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, f), 'utf-8');
                await runViaSupabaseRpc(sql);
                console.log(`OK: ${f}`);
            }
            console.log('\nAll migrations completed via exec_sql RPC.');
            return;
        } catch (err) {
            if (err.message?.includes('exec_sql') || err.message?.includes('does not exist')) {
                console.log('exec_sql RPC not available; use DATABASE_URL or SUPABASE_DB_PASSWORD.\n');
            } else {
                console.error('RPC failed:', err.message);
                process.exit(1);
            }
        }
    }

    let client = connectionString ? await tryConnect(connectionString, 'pooler') : null;
    if (!client && directConnection) {
        client = await tryConnect(directConnection, 'direct (5432)');
    }

    if (!client) {
        console.error('\nERROR: Could not connect. Add to .env.local:');
        console.error('  DATABASE_URL or SUPABASE_DB_PASSWORD');
        console.error('\nOr use Supabase MCP in Cursor (apply_migration) or SQL Editor:');
        console.error(`https://supabase.com/dashboard/project/${projectRef}/sql/new`);
        process.exit(1);
    }

    try {
        for (const f of files) {
            const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, f), 'utf-8');
            await runSqlOnPg(client, sql, f);
        }
        console.log('\nAll migrations completed successfully.');
    } catch (err) {
        console.error('\nMigration failed:', err.message);
        if (err.message?.includes('already exists')) {
            console.error('If the DB already has the baseline schema, use --file for newer migrations only.');
        }
        process.exit(1);
    } finally {
        await client.end();
    }
}

main().catch((err) => {
    console.error('Fatal error:', err.message);
    process.exit(1);
});
