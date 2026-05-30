import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCent,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Earth,
  ExternalLink,
  MapPinned,
  MessageCircle,
  NotebookText,
  Play,
  Shield,
  Sparkles,
  Sword,
  Users,
  Wifi,
} from 'lucide-react';
import { toast } from 'sonner';
import { fetchLeaderboard, fetchServerStatus } from '../lib/liveApi';
import type { LeaderboardEntry, ServerStatus } from '../lib/liveApi';
import craftSmpLogo from '../../../images/CraftSMlogo.png';

const FALLBACK_STATUS: ServerStatus = {
  status: 'offline',
  onlinePlayers: 0,
  maxPlayers: 0,
  host: 'play.craftmc.online',
  port: 25574,
  playerList: [],
};

export function Home() {
  const [serverStatus, setServerStatus] = useState<ServerStatus>(FALLBACK_STATUS);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [leaderboardType, setLeaderboardType] = useState<'playtime' | 'money'>('playtime');
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardUpdatedAt, setLeaderboardUpdatedAt] = useState<string | null>(null);
  const [leaderboardSource, setLeaderboardSource] = useState<string | null>(null);
  const [leaderboardReason, setLeaderboardReason] = useState<string | null>(null);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;

    async function loadStatus() {
      try {
        const next = await fetchServerStatus();
        if (!disposed) {
          setServerStatus(next);
          setStatusError(null);
          setStatusLoading(false);
        }
      } catch {
        if (!disposed) {
          setStatusError('Live status unavailable');
          setStatusLoading(false);
        }
      }
    }

    loadStatus();
    const timer = window.setInterval(loadStatus, 8000);

    const refreshOnFocus = () => {
      void loadStatus();
    };

    const refreshOnVisible = () => {
      if (document.visibilityState === 'visible') {
        void loadStatus();
      }
    };

    window.addEventListener('focus', refreshOnFocus);
    document.addEventListener('visibilitychange', refreshOnVisible);

    return () => {
      disposed = true;
      window.clearInterval(timer);
      window.removeEventListener('focus', refreshOnFocus);
      document.removeEventListener('visibilitychange', refreshOnVisible);
    };
  }, []);

  useEffect(() => {
    let disposed = false;

    async function loadLeaderboard() {
      if (!disposed) {
        setLeaderboardLoading(true);
      }

      try {
        const payload = await fetchLeaderboard(leaderboardType, 10);
        if (!disposed) {
          setLeaderboard(payload.items);
          setLeaderboardUpdatedAt(payload.updatedAt || null);
          setLeaderboardSource(payload.source || null);
          setLeaderboardReason(payload.reason || null);
          setLeaderboardError(null);
          setLeaderboardLoading(false);
        }
      } catch {
        if (!disposed) {
          setLeaderboardError('Leaderboard unavailable');
          setLeaderboardLoading(false);
        }
      }
    }

    loadLeaderboard();
    const timer = window.setInterval(loadLeaderboard, 30000);
    return () => {
      disposed = true;
      window.clearInterval(timer);
    };
  }, [leaderboardType]);

  return (
    <div className="space-y-16 md:space-y-24 pb-10">
      <Hero serverStatus={serverStatus} statusError={statusError} statusLoading={statusLoading} />
      <TrailerBlock />
      <FeatureStrip />
      <LiveWorld serverStatus={serverStatus} />
      <Gallery />
      <Legends
        type={leaderboardType}
        onTypeChange={setLeaderboardType}
        leaderboard={leaderboard}
        loading={leaderboardLoading}
        updatedAt={leaderboardUpdatedAt}
        source={leaderboardSource}
        reason={leaderboardReason}
        error={leaderboardError}
      />
      <Faq />
      <RulesBlock />
      <DiscordBlock onlinePlayers={serverStatus.onlinePlayers} />
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="inline-flex items-center rounded-full bg-[#ffd028] px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-[#1f1710] outline-panel">
      {children}
    </div>
  );
}

function SectionTitle({ title, accent, subtitle }: { title: string; accent?: string; subtitle: string }) {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="display-font text-[56px] md:text-[80px] leading-[0.9] tracking-[0.02em] text-[#1f1710] drop-shadow-[0_2px_0_rgba(255,255,255,0.75)]">
        {title} <span className="text-[#f0b400] [text-shadow:2px_2px_0_#1f1710]">{accent}</span>
      </h2>
      <p className="mt-4 text-sm md:text-base leading-relaxed text-[#745f49]">{subtitle}</p>
    </div>
  );
}

function Hero({
  serverStatus,
  statusError,
  statusLoading,
}: {
  serverStatus: ServerStatus;
  statusError: string | null;
  statusLoading: boolean;
}) {
  const ip = serverStatus.host || 'play.craftmc.online';
  const [copied, setCopied] = useState(false);
  const isOnline = serverStatus.status === 'online';
  const statusUpdatedLabel = formatRelativeTimestamp(serverStatus.updatedAt);

  return (
    <section className="relative pt-6 md:pt-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="outline-panel rounded-[32px] bg-[#fff4d4] overflow-hidden relative">
          <div className="absolute inset-0 grid-pattern opacity-40"></div>
          <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#ffd028]/35 blur-3xl"></div>
          <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#e6d1ff]/35 blur-3xl"></div>

          <div className="relative px-5 py-6 md:px-8 md:py-8">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-full bg-[#1f1710] px-4 py-2 text-[#fff7e8] outline-panel">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]">
                <span className={`h-2 w-2 rounded-full ${statusLoading ? 'bg-[#ffd028]' : isOnline ? 'bg-[#1d7f4c]' : 'bg-[#ff8f57]'} pulse-dot`}></span>
                {statusLoading ? 'Checking server...' : isOnline ? 'Online' : 'Offline'}
              </div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#e7d9c4]">
                {statusUpdatedLabel}
              </div>
            </div>

            <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <SectionLabel>Craft SMP</SectionLabel>
                <h1 className="mt-6 max-w-2xl display-font text-[66px] leading-[0.86] md:text-[108px] md:leading-[0.84] text-[#1f1710]">
                  The ultimate survival revolution.
                </h1>
                <p className="mt-5 max-w-xl text-[15px] md:text-[17px] leading-7 text-[#6f5f4b]">
                  A community-first SMP built around economy, claims, events, and crossplay. It feels lively, structured, and player-driven without looking like a generic template.
                </p>
                {statusError && (
                  <p className="mt-2 text-sm text-[#b42318]">
                    {statusError}. Showing cached values.
                  </p>
                )}

                <div className="mt-7 flex flex-wrap gap-3">
                  <a href="#trailer" className="inline-flex items-center gap-2 rounded-2xl bg-[#1f1710] px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#fff7e8] outline-panel transition hover:-translate-y-0.5">
                    <Play size={16} fill="currentColor" /> Watch trailer
                  </a>
                  <button
                    onClick={async () => {
                      await navigator.clipboard?.writeText(ip);
                      setCopied(true);
                      toast.success('Server IP copied');
                      window.setTimeout(() => setCopied(false), 1400);
                    }}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#ffd028] px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#1f1710] outline-panel transition hover:-translate-y-0.5"
                  >
                    <Copy size={16} /> {copied ? 'Copied IP' : 'Copy IP'}
                  </button>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {[
                    ['Java + Bedrock', 'Play with friends on any device.', Earth],
                    ['Real economy', 'Shops, jobs, and fair progression.', BadgeCent],
                    ['Active staff', 'Fast support, clear rules, live events.', MessageCircle],
                  ].map(([title, text, Icon]) => (
                    <div key={title as string} className="rounded-2xl bg-[#fff9eb] px-4 py-4 outline-panel">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#ffd028] text-[#1f1710] outline-panel">
                          <Icon size={18} />
                        </span>
                        <div>
                          <div className="text-sm font-black text-[#1f1710]">{title as string}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mx-auto w-full max-w-md">
                <div className="rounded-[28px] bg-[#fff8e8] p-4 outline-panel">
                  <div className="rounded-[22px] bg-[#f7eccb] p-3 outline-panel">
                    <div className="grid place-items-center py-0.5">
                      <div className="relative flex min-h-[210px] w-full max-w-[420px] items-center justify-center overflow-hidden rounded-[32px] bg-[#f3ebc4] p-1.5 shadow-[0_12px_0_rgba(31,23,16,0.08)] md:min-h-[235px] md:max-w-[450px]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4),transparent_55%)]"></div>
                        <img
                          src={craftSmpLogo}
                          alt="Craft SMP logo"
                          className="relative h-full w-full object-cover object-[center_52%] scale-[1.18] drop-shadow-[0_10px_14px_rgba(31,23,16,0.14)]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <MetricCard title="Players" value={`${serverStatus.onlinePlayers}`} subtitle="online right now" />
                    <MetricCard title="Slots" value={statusLoading ? '--' : `${serverStatus.maxPlayers || 0}`} subtitle="total capacity" />
                    <MetricCard title="Status" value={statusLoading ? 'Checking' : isOnline ? 'Online' : 'Offline'} subtitle="query heartbeat" />
                    <MetricCard title="Version" value="1.21.x" subtitle="java + bedrock" />
                  </div>

                  <div className="mt-4 flex items-center gap-3 rounded-[22px] bg-[#1f1710] px-4 py-4 text-[#fff7e8] outline-panel">
                    <div className="flex-1">
                      <div className="text-[10px] uppercase tracking-[0.24em] text-[#d9c8b1]">Server address</div>
                      <div className="mt-1 font-mono text-sm">{ip}</div>
                    </div>
                    <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#ffd028] px-4 text-sm font-black uppercase tracking-[0.16em] text-[#1f1710] outline-panel">
                      <ArrowRight size={16} /> Join now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="rounded-2xl bg-[#fffdf6] px-4 py-4 outline-panel">
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b7253]">{title}</div>
      <div className="mt-2 display-font text-4xl leading-none text-[#1f1710]">{value}</div>
      <div className="mt-1 text-xs text-[#7f6b56]">{subtitle}</div>
    </div>
  );
}

function TrailerBlock() {
  return (
    <section id="trailer" className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="text-center">
        <SectionLabel>Generate excitement</SectionLabel>
      </div>
      <div className="mt-5">
        <SectionTitle title="Official" accent="Trailer" subtitle="A dark, cinematic block with strong contrast gives the page a real focal point instead of another floating card." />
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] bg-[#1a1712] p-4 outline-panel">
          <div className="aspect-[16/9] rounded-[22px] bg-[radial-gradient(circle_at_center,rgba(255,208,40,0.18),transparent_30%),linear-gradient(180deg,#090909,#131313_70%,#050505)] relative overflow-hidden">
            <div className="absolute inset-0 grid place-items-center">
              <button className="grid h-20 w-20 place-items-center rounded-full bg-[#ffd028] outline-panel">
                <Play size={28} fill="currentColor" className="ml-1 text-[#1f1710]" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {[
            ['Epic visuals', 'Custom terrain, set pieces, and hand-built areas.'],
            ['Global network', 'Players logging in from multiple regions.'],
            ['Map tracking', 'Live world telemetry and active player movement.'],
          ].map(([title, text]) => (
            <div key={title} className="rounded-[24px] bg-[#fff7e8] p-5 outline-panel">
              <div className="flex items-start gap-3">
                <span className="mt-1 grid h-10 w-10 place-items-center rounded-xl bg-[#ffd028] outline-panel">
                  <Sparkles size={18} />
                </span>
                <div>
                  <div className="text-base font-black text-[#1f1710]">{title}</div>
                  <div className="mt-1 text-sm leading-6 text-[#745f49]">{text}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureStrip() {
  const items = [
    { title: 'Epic visuals', desc: 'Hand-built areas and edited scenery.', icon: Sparkles },
    { title: 'Global network', desc: 'Cross-region play and fast logins.', icon: Users },
    { title: 'RPG systems', desc: 'Economy, jobs, and progression.', icon: Sword },
    { title: 'Always moderated', desc: 'Clear rules and active support.', icon: Shield },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="grid gap-4 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="rounded-[24px] bg-[#fff7e8] px-5 py-6 outline-panel">
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#ffd028] outline-panel">
                <item.icon size={18} />
              </span>
              <ArrowUpRight size={16} className="text-[#8b7253]" />
            </div>
            <div className="mt-4 text-lg font-black text-[#1f1710]">{item.title}</div>
            <div className="mt-1 text-sm leading-6 text-[#745f49]">{item.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LiveWorld({ serverStatus }: { serverStatus: ServerStatus }) {
  const onlinePlayers = serverStatus.playerList.slice(0, 6);
  const hasPlayers = onlinePlayers.length > 0;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <SectionLabel>Live world</SectionLabel>
          <h3 className="mt-4 display-font text-5xl md:text-7xl text-[#1f1710]">Real-time status tracking</h3>
        </div>
        <a href="#" className="inline-flex items-center gap-2 rounded-full bg-[#1f1710] px-4 py-2 text-sm font-black uppercase tracking-[0.16em] text-[#fff7e8] outline-panel">
          Fullscreen map <ExternalLink size={14} />
        </a>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-[28px] bg-[#fff7e8] p-4 outline-panel">
          <div className="aspect-[16/9] rounded-[22px] bg-[radial-gradient(circle_at_28%_36%,rgba(255,208,40,0.9),transparent_14%),radial-gradient(circle_at_46%_46%,rgba(60,154,82,0.95),transparent_28%),radial-gradient(circle_at_62%_42%,rgba(52,117,255,0.85),transparent_18%),linear-gradient(180deg,#274989,#13265a)] relative overflow-hidden">
            <div className="absolute inset-0 opacity-40 grid-pattern mix-blend-screen"></div>
            <div className="absolute left-4 top-4 rounded-full bg-[#1f1710] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#fff7e8]">
              live feed
            </div>
          </div>
        </div>

        <div className="rounded-[28px] bg-[#1f1710] p-5 text-[#fff7e8] outline-panel">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#d8c7b1]">Online players</div>
              <div className="mt-1 text-2xl font-black">{serverStatus.onlinePlayers} active</div>
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#ffd028] text-[#1f1710] outline-panel">
              <Wifi size={18} />
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {hasPlayers ? (
              onlinePlayers.map((player) => (
                <div key={player.username} className="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-3">
                  <img src={`https://mc-heads.net/avatar/${encodeURIComponent(player.username)}/64`} alt={player.username} className="h-9 w-9 rounded-lg outline-panel" />
                  <div className="flex-1">
                    <div className="text-sm font-black">{player.username}</div>
                    <div className="text-xs text-[#c9baaa]">online now</div>
                  </div>
                  <ArrowRight size={14} className="text-[#c9baaa]" />
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-white/5 px-3 py-3 text-sm text-[#c9baaa]">
                {serverStatus.onlinePlayers > 0 ? 'Players are online, but the live name list is still loading.' : 'No players online right now.'}
              </div>
            )}
          </div>
          <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ffd028] px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-[#1f1710] outline-panel">
            Open live map <MapPinned size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const shots = [
    'linear-gradient(135deg,#2c5cff,#8b5cf6)',
    'linear-gradient(135deg,#6ad46e,#f2c14e)',
    'linear-gradient(135deg,#ff8f57,#ffd028)',
    'linear-gradient(135deg,#1f1710,#62513d)',
  ];
  const [index, setIndex] = useState(0);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <SectionLabel>Server gallery</SectionLabel>
          <h3 className="mt-4 display-font text-5xl md:text-7xl text-[#1f1710]">Glimpses of the adventure</h3>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIndex((index + shots.length - 1) % shots.length)} className="grid h-11 w-11 place-items-center rounded-xl bg-[#fff7e8] outline-panel">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => setIndex((index + 1) % shots.length)} className="grid h-11 w-11 place-items-center rounded-xl bg-[#fff7e8] outline-panel">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-[28px] bg-[#fff7e8] p-4 outline-panel">
          <div className="aspect-[16/9] rounded-[22px] overflow-hidden relative outline-panel">
            <div className="absolute inset-0" style={{ background: shots[index] }}></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.2),transparent_22%),linear-gradient(180deg,transparent,rgba(0,0,0,0.4))]"></div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-[#fff7e8]">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f3e0bf]">featured build</div>
                <div className="mt-1 text-2xl font-black">Jungle Court</div>
              </div>
              <div className="rounded-full bg-[#1f1710]/80 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em]">{index + 1} / {shots.length}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {shots.map((shot, shotIndex) => (
            <button
              key={shot}
              onClick={() => setIndex(shotIndex)}
              className={`aspect-square rounded-[24px] overflow-hidden relative outline-panel transition ${index === shotIndex ? 'translate-y-[-2px]' : ''}`}
            >
              <div className="absolute inset-0" style={{ background: shot }}></div>
              <div className="absolute inset-0 bg-black/15"></div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Legends({
  type,
  onTypeChange,
  leaderboard,
  loading,
  updatedAt,
  source,
  reason,
  error,
}: {
  type: 'playtime' | 'money';
  onTypeChange: (type: 'playtime' | 'money') => void;
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  updatedAt: string | null;
  source: string | null;
  reason: string | null;
  error: string | null;
}) {
  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3, 10);
  const accents = ['#ffd028', '#d8dde8', '#e7a66a'];
  const updateLabel = formatRelativeTimestamp(updatedAt || undefined);
  const hasEntries = leaderboard.length > 0;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <SectionLabel>The legends</SectionLabel>
          <h3 className="mt-4 display-font text-5xl md:text-7xl text-[#1f1710]">Live server leaderboard</h3>
        </div>
        <div className="inline-flex rounded-full bg-[#fff7e8] p-1 outline-panel">
          {(['playtime', 'money'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => onTypeChange(tab)}
              className={`rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.12em] transition ${
                tab === type ? 'bg-[#ffd028] text-[#1f1710] outline-panel' : 'text-[#7f6b56]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-[#7f6b56]">
        leaderboard refresh {updateLabel}
      </p>

      {error && <p className="mt-3 text-sm text-[#b42318]">{error}. Showing last available results.</p>}
      {!error && loading && (
        <p className="mt-3 text-sm text-[#7f6b56]">Loading leaderboard...</p>
      )}
      {!error && !loading && !hasEntries && (
        <p className="mt-3 text-sm text-[#7f6b56]">
          {reason || (source === 'not-configured' ? 'Database is not configured in .env' : 'No leaderboard rows found yet')}.
          {source === 'not-configured' ? ' Add DB_HOST, DB_USER, DB_PASSWORD, DB_NAME and leaderboard queries, then restart backend.' : ''}
        </p>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {topThree.map((entry, idx) => (
          <article
            key={`${type}-${entry.username}-${entry.rank}`}
            className="relative overflow-hidden rounded-[28px] bg-[#fff7e8] p-5 outline-panel"
            style={{ boxShadow: `0 10px 30px -16px ${accents[idx]}` }}
          >
            <div className="absolute -top-14 -right-10 h-32 w-32 rounded-full opacity-35 blur-2xl" style={{ background: accents[idx] }}></div>
            <div className="relative flex items-center justify-between">
              <div className="inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-xs font-black outline-panel" style={{ background: accents[idx], color: '#1f1710' }}>
                #{entry.rank}
              </div>
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#7f6b56]">{type}</span>
            </div>
            <div className="relative mt-4 flex items-center gap-3">
              <img src={entry.headUrl} alt={entry.username} className="h-16 w-16 rounded-2xl outline-panel" />
              <div>
                <div className="text-lg font-black text-[#1f1710]">{entry.username}</div>
                <div className="text-sm text-[#7f6b56]">{entry.valueLabel}</div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {rest.map((entry) => (
          <article key={`${type}-${entry.username}-${entry.rank}-row`} className="rounded-[24px] bg-[#fff7e8] p-4 outline-panel">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#ffd028] text-sm font-black text-[#1f1710] outline-panel">
                {entry.rank}
              </div>
              <img src={entry.headUrl} alt={entry.username} className="h-10 w-10 rounded-xl outline-panel" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-black text-[#1f1710]">{entry.username}</div>
                <div className="text-xs text-[#7f6b56]">{entry.valueLabel}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatRelativeTimestamp(value?: string) {
  if (!value) {
    return 'updated --';
  }

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) {
    return 'updated --';
  }

  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) {
    return `updated ${seconds} sec ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `updated ${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);
  return `updated ${hours} hr ago`;
}

function Faq() {
  const faqs = [
    'How do I join the server?',
    'Is the server pay-to-win?',
    'How do I claim land?',
    'Can I play on Bedrock?',
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="text-center">
        <SectionLabel>Get started</SectionLabel>
        <div className="mt-5">
          <SectionTitle title="Frequently asked" accent="questions" subtitle="Quick answers for new players so the page still feels easy to use, not just stylish." />
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-3xl space-y-3">
        {faqs.map((faq) => (
          <details key={faq} className="group rounded-[24px] bg-[#fff7e8] outline-panel">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-black text-[#1f1710] md:text-base">
              <span>{faq}</span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ffd028] outline-panel transition group-open:rotate-45">
                <ArrowRight size={14} />
              </span>
            </summary>
            <div className="px-5 pb-5 text-sm leading-6 text-[#745f49]">
              Open the game, join using the server IP, and check the rules page for land claims and support details.
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function RulesBlock() {
  const rules = [
    { title: 'No griefing', desc: 'Respect builds, bases, and community projects.', color: '#7ee081' },
    { title: 'No hacking', desc: 'Keep the experience fair for everyone.', color: '#ffd028' },
    { title: 'Respect players', desc: 'No harassment, spam, or baiting.', color: '#e8a7ff' },
    { title: 'No exploits', desc: 'Report bugs instead of abusing them.', color: '#ffb3c1' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="rounded-[32px] bg-[#17603a] p-5 md:p-6 text-[#fff7e8] outline-panel">
        <div className="text-center">
          <SectionLabel>The server code</SectionLabel>
          <h3 className="mt-4 display-font text-5xl md:text-7xl">Rules that keep the world fun</h3>
          <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base leading-7 text-[#d8e8d9]">
            Clear rules make the server feel premium and trustworthy. They also make the interface feel more grounded when the visual system echoes real content.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {rules.map((rule) => (
            <div key={rule.title} className="rounded-[24px] bg-[#fff7e8] px-4 py-5 text-[#1f1710] outline-panel">
              <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-xl outline-panel" style={{ background: rule.color }}>
                  <CheckCircle2 size={18} />
                </div>
                <NotebookText size={16} className="text-[#7f6b56]" />
              </div>
              <div className="mt-4 text-lg font-black">{rule.title}</div>
              <div className="mt-1 text-sm leading-6 text-[#745f49]">{rule.desc}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-[24px] bg-[#1f1710] px-5 py-4 text-center text-sm font-black uppercase tracking-[0.18em] text-[#fff7e8] outline-panel">
          By playing on Craft SMP, you agree to these rules.
        </div>
      </div>
    </section>
  );
}

function DiscordBlock({ onlinePlayers }: { onlinePlayers: number }) {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 pb-6">
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] bg-[#1f1f1f] p-6 md:p-8 text-[#fff7e8] outline-panel">
          <SectionLabel>Join the discussion</SectionLabel>
          <h3 className="mt-5 display-font text-5xl md:text-7xl">Get involved on Discord</h3>
          <p className="mt-4 max-w-xl text-sm md:text-base leading-7 text-[#d8c7b1]">
            Daily events, patch notes, support requests, build showcases, and community chatter all live here.
          </p>
          <a href="#" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#6f7cff] px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white outline-panel">
            Join Discord <ExternalLink size={14} />
          </a>
        </div>

        <div className="grid gap-5">
          <div className="rounded-[32px] bg-[#fff7e8] p-5 outline-panel">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8b7253]">Live members</div>
            <div className="mt-3 flex items-end gap-3">
              <div className="display-font text-7xl leading-none text-[#1f1710]">{onlinePlayers}</div>
              <div className="pb-2 text-sm text-[#745f49]">players online across all regions.</div>
            </div>
          </div>

          <div className="rounded-[32px] bg-[#fff7e8] p-5 outline-panel">
            <div className="flex -space-x-2">
              {['A', 'B', 'C', 'D'].map((avatar, index) => (
                <div key={avatar} className="grid h-11 w-11 place-items-center rounded-full border-2 border-[#fff7e8] bg-[#ffd028] text-sm font-black text-[#1f1710]" style={{ transform: `translateY(${index % 2 ? 2 : 0}px)` }}>
                  {avatar}
                </div>
              ))}
              <div className="grid h-11 w-11 place-items-center rounded-full border-2 border-[#fff7e8] bg-[#1f1710] text-xs font-black text-[#fff7e8]">+364</div>
            </div>
            <div className="mt-4 text-sm font-black text-[#1f1710]">Discord is where the community actually moves.</div>
            <div className="mt-1 text-sm leading-6 text-[#745f49]">Announcements, feedback, and event signups all happen there.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
