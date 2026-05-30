function playerHead(username, uuid) {
  if (uuid && String(uuid).trim().length > 0) {
    return `https://crafatar.com/avatars/${encodeURIComponent(uuid)}?size=128&overlay`;
  }
  return `https://mc-heads.net/avatar/${encodeURIComponent(String(username || 'Steve'))}/128`;
}

function buildQueryUrl(host, port) {
  const custom = process.env.MC_QUERY_API_URL;
  if (custom) {
    return custom.replace('{host}', host).replace('{port}', String(port));
  }
  return `https://api.mcstatus.io/v2/status/java/${host}:${port}`;
}

function buildFallbackQueryUrl(host, port) {
  return `https://api.mcsrvstat.us/3/${host}:${port}`;
}

function getPlayerName(entry) {
  if (typeof entry === 'string') {
    return entry;
  }

  if (!entry || typeof entry !== 'object') {
    return '';
  }

  return (
    entry.name_clean ||
    entry.name ||
    entry.username ||
    entry.nickname ||
    entry.player ||
    entry.displayName ||
    ''
  );
}

function getPlayerNamesFromStatus(body) {
  const sources = [body.players?.list, body.info?.raw, body.info?.clean];
  const names = [];

  for (const source of sources) {
    if (!Array.isArray(source)) {
      continue;
    }

    for (const entry of source) {
      const name = getPlayerName(entry);
      if (name) {
        names.push(name);
      }
    }
  }

  return [...new Set(names)];
}

function normalizeHttpStatusBody(body, host, port, source) {
  const online = Boolean(body.online);
  const playerNames = getPlayerNamesFromStatus(body);

  return {
    status: online ? 'online' : 'offline',
    onlinePlayers: Number(body.players?.online || 0),
    maxPlayers: Number(body.players?.max || 0),
    host,
    port,
    playerList: playerNames.slice(0, 30).map((name) => ({
      username: String(name),
      headUrl: playerHead(String(name), null),
    })),
    motd: Array.isArray(body.motd?.clean) ? body.motd.clean.join(' ') : String(body.hostname || ''),
    source,
  };
}

async function queryStatusViaHttpApis(host, port) {
  const sources = [
    { url: buildQueryUrl(host, port), source: 'minecraft-query-api' },
    { url: buildFallbackQueryUrl(host, port), source: 'minecraft-query-api-fallback' },
  ];

  let lastError = null;
  let lastBody = null;
  let lastStatus = null;

  for (const candidate of sources) {
    try {
      const response = await fetch(candidate.url, { method: 'GET' });
      if (!response.ok) {
        throw new Error(`Minecraft query API failed with status ${response.status}`);
      }

      const body = await response.json();
      lastBody = body;
      const status = normalizeHttpStatusBody(body, host, port, candidate.source);
      lastStatus = status;

      if (status.status === 'online') {
        return status;
      }

      if (body.error || body.debug?.error || body.querymismatch) {
        lastError = body.error?.query || body.debug?.error?.query || 'query mismatch';
        continue;
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (lastStatus) {
    return lastStatus;
  }

  if (lastBody) {
    return normalizeHttpStatusBody(lastBody, host, port, 'minecraft-query-offline');
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError || 'Unable to query server status'));
}

export function playerHeadUrl(username, uuid) {
  return playerHead(username, uuid);
}

export async function queryMinecraftStatus(host, port) {
  try {
    return await queryStatusViaHttpApis(host, port);
  } catch {
    return {
      status: 'offline',
      onlinePlayers: 0,
      maxPlayers: 0,
      host,
      port,
      playerList: [],
      motd: '',
      source: 'minecraft-query-offline',
    };
  }
}