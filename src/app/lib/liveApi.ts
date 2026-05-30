export type ServerPlayer = {
  username: string;
  headUrl: string;
};

export type ServerStatus = {
  status: 'online' | 'offline';
  onlinePlayers: number;
  maxPlayers: number;
  host: string;
  port: number;
  playerList: ServerPlayer[];
  motd?: string;
  updatedAt?: string;
};

export type LeaderboardEntry = {
  rank: number;
  username: string;
  value: number;
  valueLabel: string;
  headUrl: string;
};

type LeaderboardResponse = {
  type: 'playtime' | 'money';
  items: LeaderboardEntry[];
  source?: string;
  reason?: string | null;
  updatedAt?: string;
};

export type LeaderboardPayload = {
  items: LeaderboardEntry[];
  updatedAt?: string;
  source?: string;
  reason?: string | null;
};

const DEFAULT_MC_HOST = 'play.craftmc.online';
const DEFAULT_MC_PORT = 25574;

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '') || '';

const API_BASE_URL = (() => {
  if (!rawApiBaseUrl) {
    return '';
  }

  try {
    const parsed = new URL(rawApiBaseUrl, 'http://localhost');
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
      return '';
    }
  } catch {
    return '';
  }

  return rawApiBaseUrl;
})();

function apiPath(path: string) {
  return `${API_BASE_URL}${path}`;
}

function playerHead(username: string) {
  return `https://mc-heads.net/avatar/${encodeURIComponent(username || 'Steve')}/128`;
}

function getPlayerName(entry: unknown) {
  if (typeof entry === 'string') {
    return entry;
  }

  if (!entry || typeof entry !== 'object') {
    return '';
  }

  const record = entry as Record<string, unknown>;
  return String(
    record.name_clean ||
      record.name ||
      record.username ||
      record.nickname ||
      record.player ||
      record.displayName ||
      ''
  );
}

function normalizeDirectStatus(body: Record<string, unknown>, host: string, port: number): ServerStatus {
  const online = Boolean(body.online);
  const players = body.players as Record<string, unknown> | undefined;
  const playerList = [players?.list, (body as Record<string, unknown>).info && (body as Record<string, unknown>).info['raw'], (body as Record<string, unknown>).info && (body as Record<string, unknown>).info['clean']]
    .flatMap((source) => (Array.isArray(source) ? source : []))
    .map((entry) => getPlayerName(entry))
    .filter(Boolean)
    .slice(0, 30)
    .map((username) => ({ username, headUrl: playerHead(username) }));

  return {
    status: online ? 'online' : 'offline',
    onlinePlayers: Number(players?.online || 0),
    maxPlayers: Number(players?.max || 0),
    host,
    port,
    playerList,
    motd: Array.isArray((body as Record<string, unknown>).motd?.clean)
      ? ((body as Record<string, unknown>).motd?.clean as string[]).join(' ')
      : String((body as Record<string, unknown>).hostname || ''),
  };
}

async function fetchDirectStatus(host = DEFAULT_MC_HOST, port = DEFAULT_MC_PORT): Promise<ServerStatus> {
  const urls = [
    `https://api.mcstatus.io/v2/status/java/${host}:${port}`,
    `https://api.mcsrvstat.us/3/${host}:${port}`,
  ];

  let lastError: unknown = null;

  for (const url of urls) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Direct status request failed (${response.status})`);
      }

      const body = (await response.json()) as Record<string, unknown>;
      const status = normalizeDirectStatus(body, host, port);
      if (status.status === 'online') {
        return status;
      }
      lastError = body;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Unable to fetch direct server status');
}

async function safeJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export async function fetchServerStatus(): Promise<ServerStatus> {
  try {
    const backend = await safeJson<ServerStatus>(
      await fetch(apiPath(`/api/server/status?t=${Date.now()}`), {
        cache: 'no-store',
      })
    );

    if (backend.status === 'online' || backend.source !== 'minecraft-query-offline') {
      return backend;
    }
  } catch {
    // fall through to direct query
  }

  return fetchDirectStatus();
}

export async function fetchLeaderboard(type: 'playtime' | 'money', limit = 10): Promise<LeaderboardPayload> {
  const payload = await safeJson<LeaderboardResponse>(
    await fetch(apiPath(`/api/leaderboard?type=${type}&limit=${limit}`))
  );
  return {
    items: payload.items,
    updatedAt: payload.updatedAt,
    source: payload.source,
    reason: payload.reason,
  };
}
