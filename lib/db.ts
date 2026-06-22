import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

export interface Subscriber {
  id: number;
  email: string;
  created_at: string;
  verified: boolean;
  verification_token: string | null;
  verification_token_expires: string | null;
  unsubscribed: boolean;
  unsubscribed_at: string | null;
  signup_ip: string | null;
}

export interface Newsletter {
  id: number;
  slug: string;
  title: string;
  content: string; // Markdown/MDX
  status: 'draft' | 'scheduled' | 'sent';
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsletterEvent {
  id: number;
  newsletter_id: number;
  subscriber_id: number;
  event_type: 'open' | 'click';
  url: string | null;
  created_at: string;
}

let pool: Pool | null = null;
let usePostgres = true;

// Lazy pool loader that handles env reloads and placeholder URL checks
function getPool(): Pool | null {
  const databaseUrl = process.env.DATABASE_URL;
  const isPlaceholder = !databaseUrl || 
    databaseUrl.includes('user:password') || 
    databaseUrl.includes('host:port/database');

  if (isPlaceholder) {
    usePostgres = false;
    return null;
  }

  if (!pool) {
    const isLocal = databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1');
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: isLocal ? false : { rejectUnauthorized: false },
    });
  }
  usePostgres = true;
  return pool;
}

const JSON_DB_DIR = path.join(process.cwd(), '.data');
const JSON_DB_PATH = path.join(JSON_DB_DIR, 'newsletter_db.json');

// Get JSON DB contents
function getJsonDb(): { subscribers: Subscriber[]; newsletters: Newsletter[]; events: NewsletterEvent[] } {
  if (!fs.existsSync(JSON_DB_DIR)) {
    fs.mkdirSync(JSON_DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(JSON_DB_PATH)) {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify({ subscribers: [], newsletters: [], events: [] }, null, 2));
  }
  try {
    return JSON.parse(fs.readFileSync(JSON_DB_PATH, 'utf-8'));
  } catch (e) {
    return { subscribers: [], newsletters: [], events: [] };
  }
}

// Save JSON DB contents
function saveJsonDb(data: { subscribers: Subscriber[]; newsletters: Newsletter[]; events: NewsletterEvent[] }) {
  if (!fs.existsSync(JSON_DB_DIR)) {
    fs.mkdirSync(JSON_DB_DIR, { recursive: true });
  }
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2));
}

let isDbInitialized = false;

async function ensureTables(pool: Pool) {
  if (isDbInitialized) return;
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        verified BOOLEAN DEFAULT FALSE,
        verification_token VARCHAR(255),
        verification_token_expires TIMESTAMP WITH TIME ZONE,
        unsubscribed BOOLEAN DEFAULT FALSE,
        unsubscribed_at TIMESTAMP WITH TIME ZONE,
        signup_ip VARCHAR(45)
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS newsletters (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'draft',
        scheduled_at TIMESTAMP WITH TIME ZONE,
        sent_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS newsletter_events (
        id SERIAL PRIMARY KEY,
        newsletter_id INT REFERENCES newsletters(id) ON DELETE CASCADE,
        subscriber_id INT REFERENCES subscribers(id) ON DELETE CASCADE,
        event_type VARCHAR(50) NOT NULL,
        url VARCHAR(2048),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    isDbInitialized = true;
  } finally {
    client.release();
  }
}

// Dynamic Query Execution Wrapper with Automatic Graceful Fallback
async function runQuery<T>(
  pgQuery: (client: Pool) => Promise<T>,
  jsonQuery: () => Promise<T>
): Promise<T> {
  const activePool = getPool();
  if (usePostgres && activePool) {
    try {
      await ensureTables(activePool);
      return await pgQuery(activePool);
    } catch (error: any) {
      const isConnectionError = 
        error.code === 'ECONNREFUSED' || 
        error.code === 'ENOTFOUND' || 
        error.code === '28P01' || // password authentication failed
        error.message?.includes('connect') ||
        error.message?.includes('authentication') ||
        error.message?.includes('refused');

      if (isConnectionError) {
        console.warn(
          '\x1b[33m%s\x1b[0m',
          `⚠️ Database connection/auth failed (${error.code || error.message}). Falling back to local JSON database.`
        );
        usePostgres = false; // Disable PostgreSQL for the remainder of this runtime session
        return await jsonQuery();
      }
      throw error;
    }
  }
  return await jsonQuery();
}

// ── Database Methods ──

// Initialize Database Tables
export async function initDb() {
  const activePool = getPool();
  if (usePostgres && activePool) {
    await ensureTables(activePool);
  } else {
    getJsonDb();
  }
}

// ── Subscriber Database Operations ──

export async function getSubscribers(search = ''): Promise<Subscriber[]> {
  return runQuery(
    async (client) => {
      const queryStr = search
        ? 'SELECT * FROM subscribers WHERE email ILIKE $1 ORDER BY created_at DESC'
        : 'SELECT * FROM subscribers ORDER BY created_at DESC';
      const params = search ? [`%${search}%`] : [];
      const res = await client.query(queryStr, params);
      return res.rows;
    },
    async () => {
      const db = getJsonDb();
      if (!search) return db.subscribers;
      const term = search.toLowerCase();
      return db.subscribers.filter((s) => s.email.toLowerCase().includes(term));
    }
  );
}

export async function getSubscriberByEmail(email: string): Promise<Subscriber | null> {
  return runQuery(
    async (client) => {
      const res = await client.query('SELECT * FROM subscribers WHERE email = $1', [email]);
      return res.rows[0] || null;
    },
    async () => {
      const db = getJsonDb();
      return db.subscribers.find((s) => s.email.toLowerCase() === email.toLowerCase()) || null;
    }
  );
}

export async function getSubscriberByToken(token: string): Promise<Subscriber | null> {
  return runQuery(
    async (client) => {
      const res = await client.query('SELECT * FROM subscribers WHERE verification_token = $1', [token]);
      return res.rows[0] || null;
    },
    async () => {
      const db = getJsonDb();
      return db.subscribers.find((s) => s.verification_token === token) || null;
    }
  );
}

export async function createSubscriber(
  email: string,
  token: string,
  expires: Date,
  ip: string | null = null
): Promise<Subscriber> {
  return runQuery(
    async (client) => {
      const queryStr = `
        INSERT INTO subscribers (email, verification_token, verification_token_expires, signup_ip, verified, unsubscribed)
        VALUES ($1, $2, $3, $4, FALSE, FALSE)
        ON CONFLICT (email) DO UPDATE
        SET verification_token = EXCLUDED.verification_token,
            verification_token_expires = EXCLUDED.verification_token_expires,
            signup_ip = EXCLUDED.signup_ip,
            unsubscribed = FALSE,
            unsubscribed_at = NULL
        RETURNING *
      `;
      const res = await client.query(queryStr, [email, token, expires, ip]);
      return res.rows[0];
    },
    async () => {
      const db = getJsonDb();
      const existingIdx = db.subscribers.findIndex((s) => s.email.toLowerCase() === email.toLowerCase());

      const newSub: Subscriber = {
        id: existingIdx >= 0 ? db.subscribers[existingIdx].id : Date.now(),
        email,
        created_at: existingIdx >= 0 ? db.subscribers[existingIdx].created_at : new Date().toISOString(),
        verified: false,
        verification_token: token,
        verification_token_expires: expires.toISOString(),
        unsubscribed: false,
        unsubscribed_at: null,
        signup_ip: ip,
      };

      if (existingIdx >= 0) {
        db.subscribers[existingIdx] = newSub;
      } else {
        db.subscribers.push(newSub);
      }
      saveJsonDb(db);
      return newSub;
    }
  );
}

export async function verifySubscriber(id: number): Promise<void> {
  return runQuery(
    async (client) => {
      await client.query(
        'UPDATE subscribers SET verified = TRUE, verification_token = NULL, verification_token_expires = NULL WHERE id = $1',
        [id]
      );
    },
    async () => {
      const db = getJsonDb();
      const sub = db.subscribers.find((s) => s.id === id);
      if (sub) {
        sub.verified = true;
        sub.verification_token = null;
        sub.verification_token_expires = null;
        saveJsonDb(db);
      }
    }
  );
}

export async function unsubscribeSubscriber(email: string): Promise<void> {
  return runQuery(
    async (client) => {
      await client.query(
        'UPDATE subscribers SET unsubscribed = TRUE, unsubscribed_at = NOW() WHERE email = $1',
        [email]
      );
    },
    async () => {
      const db = getJsonDb();
      const sub = db.subscribers.find((s) => s.email.toLowerCase() === email.toLowerCase());
      if (sub) {
        sub.unsubscribed = true;
        sub.unsubscribed_at = new Date().toISOString();
        saveJsonDb(db);
      }
    }
  );
}

// Check rate limit for IP/email
export async function checkRateLimit(email: string, ip: string | null): Promise<boolean> {
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  return runQuery(
    async (client) => {
      const res = await client.query(
        `SELECT count(*) FROM subscribers 
         WHERE (email = $1 OR signup_ip = $2) 
         AND created_at > $3`,
        [email, ip, oneMinuteAgo]
      );
      const count = parseInt(res.rows[0].count);
      return count < 2;
    },
    async () => {
      const db = getJsonDb();
      const count = db.subscribers.filter(
        (s) =>
          (s.email.toLowerCase() === email.toLowerCase() || (ip && s.signup_ip === ip)) &&
          new Date(s.created_at) > oneMinuteAgo
      ).length;
      return count < 2;
    }
  );
}

// ── Newsletter Database Operations ──

export async function getNewsletters(status?: 'draft' | 'scheduled' | 'sent'): Promise<Newsletter[]> {
  return runQuery(
    async (client) => {
      const queryStr = status
        ? 'SELECT * FROM newsletters WHERE status = $1 ORDER BY created_at DESC'
        : 'SELECT * FROM newsletters ORDER BY created_at DESC';
      const params = status ? [status] : [];
      const res = await client.query(queryStr, params);
      return res.rows;
    },
    async () => {
      const db = getJsonDb();
      const list = db.newsletters.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      if (!status) return list;
      return list.filter((n) => n.status === status);
    }
  );
}

export async function getNewsletterBySlug(slug: string): Promise<Newsletter | null> {
  return runQuery(
    async (client) => {
      const res = await client.query('SELECT * FROM newsletters WHERE slug = $1', [slug]);
      return res.rows[0] || null;
    },
    async () => {
      const db = getJsonDb();
      return db.newsletters.find((n) => n.slug === slug) || null;
    }
  );
}

export async function getNewsletterById(id: number): Promise<Newsletter | null> {
  return runQuery(
    async (client) => {
      const res = await client.query('SELECT * FROM newsletters WHERE id = $1', [id]);
      return res.rows[0] || null;
    },
    async () => {
      const db = getJsonDb();
      return db.newsletters.find((n) => n.id === id) || null;
    }
  );
}

export async function createNewsletter(
  slug: string,
  title: string,
  content: string,
  status: 'draft' | 'scheduled' | 'sent' = 'draft',
  scheduledAt: Date | null = null
): Promise<Newsletter> {
  return runQuery(
    async (client) => {
      const queryStr = `
        INSERT INTO newsletters (slug, title, content, status, scheduled_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const res = await client.query(queryStr, [slug, title, content, status, scheduledAt]);
      return res.rows[0];
    },
    async () => {
      const db = getJsonDb();
      const newNewsletter: Newsletter = {
        id: Date.now(),
        slug,
        title,
        content,
        status,
        scheduled_at: scheduledAt ? scheduledAt.toISOString() : null,
        sent_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      db.newsletters.push(newNewsletter);
      saveJsonDb(db);
      return newNewsletter;
    }
  );
}

export async function updateNewsletter(
  id: number,
  slug: string,
  title: string,
  content: string,
  status: 'draft' | 'scheduled' | 'sent',
  scheduledAt: Date | null = null,
  sentAt: Date | null = null
): Promise<Newsletter> {
  return runQuery(
    async (client) => {
      const queryStr = `
        UPDATE newsletters
        SET slug = $1, title = $2, content = $3, status = $4, scheduled_at = $5, sent_at = $6, updated_at = NOW()
        WHERE id = $7
        RETURNING *
      `;
      const res = await client.query(queryStr, [slug, title, content, status, scheduledAt, sentAt, id]);
      return res.rows[0];
    },
    async () => {
      const db = getJsonDb();
      const idx = db.newsletters.findIndex((n) => n.id === id);
      if (idx === -1) throw new Error('Newsletter not found');

      const updated: Newsletter = {
        ...db.newsletters[idx],
        slug,
        title,
        content,
        status,
        scheduled_at: scheduledAt ? scheduledAt.toISOString() : null,
        sent_at: sentAt ? sentAt.toISOString() : db.newsletters[idx].sent_at,
        updated_at: new Date().toISOString(),
      };
      db.newsletters[idx] = updated;
      saveJsonDb(db);
      return updated;
    }
  );
}

export async function deleteNewsletter(id: number): Promise<void> {
  return runQuery(
    async (client) => {
      await client.query('DELETE FROM newsletters WHERE id = $1', [id]);
    },
    async () => {
      const db = getJsonDb();
      db.newsletters = db.newsletters.filter((n) => n.id !== id);
      db.events = db.events.filter((e) => e.newsletter_id !== id);
      saveJsonDb(db);
    }
  );
}

// ── Tracking Database Operations ──

export async function trackEvent(
  newsletterId: number,
  subscriberId: number,
  eventType: 'open' | 'click',
  url: string | null = null
): Promise<void> {
  return runQuery(
    async (client) => {
      if (eventType === 'open') {
        const existing = await client.query(
          'SELECT id FROM newsletter_events WHERE newsletter_id = $1 AND subscriber_id = $2 AND event_type = $3',
          [newsletterId, subscriberId, eventType]
        );
        if (existing.rowCount && existing.rowCount > 0) return;
      }
      await client.query(
        'INSERT INTO newsletter_events (newsletter_id, subscriber_id, event_type, url) VALUES ($1, $2, $3, $4)',
        [newsletterId, subscriberId, eventType, url]
      );
    },
    async () => {
      const db = getJsonDb();
      if (eventType === 'open') {
        const existing = db.events.find(
          (e) => e.newsletter_id === newsletterId && e.subscriber_id === subscriberId && e.event_type === eventType
        );
        if (existing) return;
      }
      const newEvent: NewsletterEvent = {
        id: Date.now(),
        newsletter_id: newsletterId,
        subscriber_id: subscriberId,
        event_type: eventType,
        url,
        created_at: new Date().toISOString(),
      };
      db.events.push(newEvent);
      saveJsonDb(db);
    }
  );
}

// ── Analytics Database Operations ──

export async function getAnalytics() {
  return runQuery(
    async (client) => {
      const totalsRes = await client.query(`
        SELECT 
          (SELECT COUNT(*) FROM subscribers) as total,
          (SELECT COUNT(*) FROM subscribers WHERE verified = TRUE) as verified,
          (SELECT COUNT(*) FROM subscribers WHERE unsubscribed = TRUE) as unsubscribed
      `);
      const totals = {
        totalSubscribers: parseInt(totalsRes.rows[0].total),
        verifiedSubscribers: parseInt(totalsRes.rows[0].verified),
        unsubscribed: parseInt(totalsRes.rows[0].unsubscribed),
      };

      const growthRes = await client.query(`
        SELECT DATE_TRUNC('day', created_at)::date as date, COUNT(*) as count
        FROM subscribers
        WHERE created_at > NOW() - INTERVAL '30 days'
        GROUP BY date
        ORDER BY date ASC
      `);
      const growth = growthRes.rows.map((row: any) => ({
        date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: parseInt(row.count),
      }));

      const campaignsRes = await client.query(`
        SELECT 
          n.id, 
          n.title, 
          n.sent_at,
          (SELECT COUNT(*) FROM newsletter_events WHERE newsletter_id = n.id AND event_type = 'open') as opens,
          (SELECT COUNT(*) FROM newsletter_events WHERE newsletter_id = n.id AND event_type = 'click') as clicks
        FROM newsletters n
        WHERE n.status = 'sent'
        ORDER BY n.sent_at DESC
      `);
      const campaignPerformance = campaignsRes.rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        sentAt: row.sent_at,
        opens: parseInt(row.opens),
        clicks: parseInt(row.clicks),
      }));

      return {
        ...totals,
        growth,
        campaignPerformance,
      };
    },
    async () => {
      const db = getJsonDb();
      const totalSubscribers = db.subscribers.length;
      const verifiedSubscribers = db.subscribers.filter((s) => s.verified).length;
      const unsubscribed = db.subscribers.filter((s) => s.unsubscribed).length;

      const growthMap: { [key: string]: number } = {};
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      db.subscribers
        .filter((s) => new Date(s.created_at) > thirtyDaysAgo)
        .forEach((s) => {
          const dateStr = new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          growthMap[dateStr] = (growthMap[dateStr] || 0) + 1;
        });

      const growth = Object.keys(growthMap).map((date) => ({
        date,
        count: growthMap[date],
      }));

      const sentNewsletters = db.newsletters.filter((n) => n.status === 'sent');
      const campaignPerformance = sentNewsletters.map((n) => {
        const opens = db.events.filter((e) => e.newsletter_id === n.id && e.event_type === 'open').length;
        const clicks = db.events.filter((e) => e.newsletter_id === n.id && e.event_type === 'click').length;
        return {
          id: n.id,
          title: n.title,
          sentAt: n.sent_at,
          opens,
          clicks,
        };
      });

      return {
        totalSubscribers,
        verifiedSubscribers,
        unsubscribed,
        growth,
        campaignPerformance,
      };
    }
  );
}
