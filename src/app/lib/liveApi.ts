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
  uuid: string | null;
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

async function safeJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export async function fetchServerStatus(): Promise<ServerStatus> {
  return safeJson<ServerStatus>(
    await fetch(`/api/server/status?t=${Date.now()}`, {
      cache: 'no-store',
    })
  );
}

export async function fetchLeaderboard(type: 'playtime' | 'money', limit = 10): Promise<LeaderboardPayload> {
  const payload = await safeJson<LeaderboardResponse>(
    await fetch(`/api/leaderboard?type=${type}&limit=${limit}`)
  );
  return {
    items: payload.items,
    updatedAt: payload.updatedAt,
    source: payload.source,
    reason: payload.reason,
  };
}
