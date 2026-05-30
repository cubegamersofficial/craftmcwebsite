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

async function safeJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export async function fetchServerStatus(): Promise<ServerStatus> {
  const backend = await safeJson<ServerStatus>(
    await fetch(apiPath(`/api/server/status?t=${Date.now()}`), {
      cache: 'no-store',
    })
  );

  if (backend.status === 'online' || backend.source !== 'minecraft-query-offline') {
    return backend;
  }

  return {
    status: 'offline',
    onlinePlayers: 0,
    maxPlayers: 0,
    host: 'play.craftmc.online',
    port: 25574,
    playerList: [],
    motd: '',
  };
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
