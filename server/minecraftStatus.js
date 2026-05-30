import minecraftServerUtil from 'minecraft-server-util';

const { status: queryJavaStatus } = minecraftServerUtil;

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
  return `https://api.mcsrvstat.us/3/${host}`;
}

function buildFallbackQueryUrl(host, port) {
  return `https://api.mcstatus.io/v2/status/java/${host}:${port}`;
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
  try {
    const response = await fetch(buildQueryUrl(host, port), { method: 'GET' });
    if (!response.ok) {
      throw new Error(`Minecraft query API failed with status ${response.status}`);
    }

    const body = await response.json();
    return normalizeHttpStatusBody(body, host, port, 'minecraft-query-api');
  } catch {
    const fallbackResponse = await fetch(buildFallbackQueryUrl(host, port), { method: 'GET' });
    if (!fallbackResponse.ok) {
      throw new Error(`Fallback query API failed with status ${fallbackResponse.status}`);
    }

    const fallbackBody = await fallbackResponse.json();
    return normalizeHttpStatusBody(fallbackBody, host, port, 'minecraft-query-api-fallback');
  }
}

export function playerHeadUrl(username, uuid) {
  return playerHead(username, uuid);
}

export async function queryMinecraftStatus(host, port) {
  const timeoutMs = Number(process.env.MC_STATUS_TIMEOUT_MS || 5000);

  try {
    const response = await queryJavaStatus(host, port, { timeout: timeoutMs });
    const sample = Array.isArray(response.players?.sample) ? response.players.sample : [];

    return {
      status: 'online',
      onlinePlayers: Number(response.players?.online || sample.length || 0),
      maxPlayers: Number(response.players?.max || 0),
      host,
      port,
      playerList: sample.slice(0, 30).map((entry) => {
        const username = getPlayerName(entry) || 'Player';
        const uuid = entry?.id || entry?.uuid || null;

        return {
          username: String(username),
          headUrl: playerHead(String(username), uuid),
        };
      }),
      motd: Array.isArray(response.motd?.clean) ? response.motd.clean.join(' ') : String(response.motd?.raw || ''),
      source: 'minecraft-server-util',
    };
  } catch {
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
        source: 'minecraft-server-util-offline',
      };
    }
  }
}