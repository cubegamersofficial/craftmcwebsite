import mysql from 'mysql2/promise';
import { playerHeadUrl as playerHead, queryMinecraftStatus } from '../server/minecraftStatus.js';

const MC_HOST = process.env.MC_SERVER_HOST || 'play.craftmc.online';
const MC_PORT = Number(process.env.MC_SERVER_PORT || 25565);
const STATUS_POLL_MS = Number(process.env.STATUS_POLL_MS || 10000);
const LEADERBOARD_POLL_MS = Number(process.env.LEADERBOARD_POLL_MS || 30000);
const PLAYTIME_VALUE_SECONDS = (process.env.PLAYTIME_VALUE_SECONDS || 'true').toLowerCase() === 'true';

const MONEY_QUERY = process.env.MONEY_LEADERBOARD_QUERY || '';
const PLAYTIME_QUERY = process.env.PLAYTIME_LEADERBOARD_QUERY || '';

const dbEnabled = Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME);
const pool = dbEnabled
  ? mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
      queueLimit: 0,
    })
  : null;

const statusCache = {
  fetchedAt: 0,
  data: {
    status: 'offline',
    onlinePlayers: 0,
    maxPlayers: 0,
    host: MC_HOST,
    port: MC_PORT,
    playerList: [],
    motd: '',
    source: 'minecraft-query-api',
  },
};

const leaderboardCache = {
  money: { fetchedAt: 0, data: [] },
  playtime: { fetchedAt: 0, data: [] },
};

function json(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.end(JSON.stringify(body));
}

function formatValue(type, value) {
  if (type === 'money') {
    return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })}h`;
}

function mapLeaderboardRows(type, rows) {
  return rows.map((row, index) => {
    const username =
      row.username ||
      row.player_name ||
      row.name ||
      row.player ||
      row.nick ||
      `Player ${index + 1}`;

    const uuid = row.uuid || row.player_uuid || row.user_uuid || null;
    const baseRaw = Number(
      row.value ?? row.balance ?? row.playtime ?? row.play_time ?? row.time_played ?? 0
    );

    const numericValue =
      type === 'playtime' && PLAYTIME_VALUE_SECONDS ? baseRaw / 3600 : baseRaw;

    return {
      rank: index + 1,
      username: String(username),
      value: Number.isFinite(numericValue) ? numericValue : 0,
      valueLabel: formatValue(type, Number.isFinite(numericValue) ? numericValue : 0),
      headUrl: playerHead(username, uuid),
    };
  });
}

async function queryLeaderboard(type, limit) {
  if (!pool) {
    return [];
  }

  const query = type === 'money' ? MONEY_QUERY : PLAYTIME_QUERY;
  if (!query) {
    return [];
  }

  const [rows] = await pool.query(query, [limit]);
  if (!Array.isArray(rows)) {
    return [];
  }
  return mapLeaderboardRows(type, rows);
}

async function getStatusLive() {
  const now = Date.now();
  if (now - statusCache.fetchedAt < STATUS_POLL_MS) {
    return statusCache.data;
  }

  const next = await queryMinecraftStatus(MC_HOST, MC_PORT);
  statusCache.data = next;
  statusCache.fetchedAt = now;
  return next;
}

async function getLeaderboardLive(type, limit) {
  const now = Date.now();
  const slot = leaderboardCache[type];
  if (now - slot.fetchedAt < LEADERBOARD_POLL_MS && slot.data.length > 0) {
    return slot.data.slice(0, limit);
  }

  const rows = await queryLeaderboard(type, limit);
  slot.data = rows;
  slot.fetchedAt = now;
  return rows;
}

async function handle(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end();
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  const url = new URL(req.url || '/', 'http://localhost');
  const route = url.pathname.replace(/^\/api\/?/, '');

  if (req.method !== 'GET') {
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  if (route === 'health') {
    json(res, 200, { ok: true, dbEnabled, host: MC_HOST, port: MC_PORT });
    return;
  }

  if (route === 'server/status') {
    try {
      const data = await getStatusLive();
      json(res, 200, { ...data, updatedAt: new Date(statusCache.fetchedAt).toISOString() });
    } catch (error) {
      json(res, 200, {
        ...statusCache.data,
        status: statusCache.data.status || 'offline',
        updatedAt: new Date(statusCache.fetchedAt || Date.now()).toISOString(),
        source: 'fallback',
        error: 'Unable to fetch Minecraft server status',
        detail: String(error instanceof Error ? error.message : error),
      });
    }
    return;
  }

  if (route === 'leaderboard') {
    const type = url.searchParams.get('type') === 'money' ? 'money' : 'playtime';
    const limit = Math.max(3, Math.min(Number(url.searchParams.get('limit') || 10), 50));
    const queryConfigured = type === 'money' ? Boolean(MONEY_QUERY) : Boolean(PLAYTIME_QUERY);

    try {
      const rows = await getLeaderboardLive(type, limit);
      const source = pool ? 'mysql' : 'not-configured';
      const reason = !pool
        ? 'Database is not configured in .env'
        : !queryConfigured
          ? `${type} leaderboard query is missing in .env`
          : rows.length === 0
            ? 'Query returned no rows'
            : null;

      json(res, 200, {
        type,
        items: rows,
        source,
        reason,
        updatedAt: new Date(leaderboardCache[type].fetchedAt || Date.now()).toISOString(),
      });
    } catch (error) {
      json(res, 500, {
        error: `Unable to fetch ${type} leaderboard`,
        detail: String(error instanceof Error ? error.message : error),
        items: leaderboardCache[type].data || [],
      });
    }
    return;
  }

  if (route === 'live') {
    try {
      const [status, playtime, money] = await Promise.all([
        getStatusLive(),
        getLeaderboardLive('playtime', 10),
        getLeaderboardLive('money', 10),
      ]);

      json(res, 200, {
        status,
        leaderboards: {
          playtime,
          money,
        },
        generatedAt: new Date().toISOString(),
      });
    } catch (error) {
      json(res, 500, {
        error: 'Unable to fetch live dashboard data',
        detail: String(error instanceof Error ? error.message : error),
      });
    }
    return;
  }

  json(res, 404, { error: 'Not found' });
}

export default handle;