import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json({ error: 'DATABASE_URL is not set' });
  }

  const results: any = {
    databaseUrlPlaceholderChecked: databaseUrl.includes('user:password'),
    env: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL || 'not-vercel',
  };

  try {
    const isLocal = databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1');
    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: isLocal ? false : { rejectUnauthorized: false },
    });

    results.connectionStringParsed = {
      host: databaseUrl.split('@').slice(-1)[0].split(':')[0],
      port: databaseUrl.split(':').slice(-1)[0].split('/')[0],
    };

    const client = await pool.connect();
    results.connected = true;

    try {
      const res = await client.query('SELECT NOW()');
      results.querySuccess = true;
      results.time = res.rows[0];
    } catch (queryErr: any) {
      results.querySuccess = false;
      results.queryError = {
        message: queryErr.message,
        code: queryErr.code,
      };
    } finally {
      client.release();
      await pool.end();
    }
  } catch (err: any) {
    results.connected = false;
    results.error = {
      message: err.message,
      code: err.code,
      stack: err.stack,
    };
  }

  return NextResponse.json(results);
}
