import { PageHeader } from '../components/PageHeader';
import { ExternalLink, Trophy, Flame, Gift, Check } from 'lucide-react';

const SITES = [
  { name: 'Minecraft-MP', reward: '250 coins + 1 key', cooldown: '24h', ready: true },
  { name: 'PlanetMinecraft', reward: '200 coins + XP boost', cooldown: '24h', ready: true },
  { name: 'TopG', reward: '300 coins + 2 gems', cooldown: '12h', ready: true },
  { name: 'MinecraftServers.org', reward: '150 coins', cooldown: '24h', ready: false },
  { name: 'ServerPact', reward: '200 coins + crate key', cooldown: '24h', ready: true },
  { name: 'BestServers', reward: '100 coins', cooldown: '24h', ready: false },
];

const REWARDS = [
  { day: 1, reward: '500 coins', icon: '🪙' },
  { day: 3, reward: 'Rare key', icon: '🗝️' },
  { day: 7, reward: 'Epic crate', icon: '📦' },
  { day: 14, reward: '5 gems', icon: '💎' },
  { day: 30, reward: 'Mythic mount', icon: '🐉' },
];

export function Vote() {
  const streak = 4;
  return (
    <>
      <PageHeader
        eyebrow="Support the Server"
        title={<>Vote daily, <span className="text-gradient">earn rewards</span></>}
        subtitle="Every vote helps us climb the rankings — and you get coins, keys, and gems for it."
        action={
          <div className="glass rounded-2xl p-4 flex items-center gap-4 outline-panel">
            <div className="w-12 h-12 rounded-xl bg-[#ffd028] grid place-items-center text-[#1f1710] outline-panel"><Flame size={22} /></div>
            <div>
              <div className="text-xs text-[#7f6b56]">Your Streak</div>
              <div className="text-2xl font-black text-[#1f1710]">{streak} days</div>
            </div>
          </div>
        }
      />
      <section className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="display-font text-6xl text-[#1f1710] mb-4">Vote Sites</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {SITES.map((s) => (
                <div key={s.name} className="glass rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-[#1f1710] font-black truncate">{s.name}</div>
                    <div className="text-xs text-[#7f6b56] mt-1">{s.reward}</div>
                    <div className="text-[11px] text-[#7f6b56] mt-1">Cooldown: {s.cooldown}</div>
                  </div>
                  <a href="#" className={`shrink-0 inline-flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-black transition outline-panel ${s.ready ? 'bg-[#ffd028] text-[#1f1710] hover:scale-105' : 'bg-[#fff7e8] text-[#7f6b56] cursor-not-allowed'}`}>
                    {s.ready ? <>Vote <ExternalLink size={14} /></> : 'Voted'}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[#1f1710] font-black flex items-center gap-2"><Gift size={18} className="text-[#a66a00]" /> Daily Reward Progress</h3>
                <p className="text-sm text-[#7f6b56] mt-1">3 of 6 sites voted today</p>
              </div>
              <div className="text-sm text-[#1d7f4c] font-black">+450 coins today</div>
            </div>
            <div className="mt-5 h-3 rounded-full bg-black/10 overflow-hidden">
              <div className="h-full bg-[#ffd028]" style={{ width: '50%' }}></div>
            </div>
            <div className="mt-5 grid grid-cols-5 gap-2">
              {REWARDS.map((r) => (
                <div key={r.day} className={`rounded-xl border p-3 text-center outline-panel ${r.day <= streak ? 'border-[#1d7f4c]/40 bg-[#1d7f4c]/8' : 'border-black/10 bg-[#fff7e8]'}`}>
                  <div className="text-2xl">{r.icon}</div>
                  <div className="text-xs text-[#1f1710] mt-1">Day {r.day}</div>
                  <div className="text-[11px] text-[#7f6b56]">{r.reward}</div>
                  {r.day <= streak && <Check size={12} className="text-[#1d7f4c] mx-auto mt-1" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside>
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 text-[#1f1710]"><Trophy size={18} className="text-[#a66a00]" /><span className="font-black">Global Vote Leaderboard</span></div>
            <div className="text-xs text-[#7f6b56]">Resets monthly · May 2026</div>
            <ol className="mt-5 space-y-2.5 text-sm">
              {[
                ['NetherKing', 124, '#facc15'],
                ['Ender_Wraith', 118, '#9CA3AF'],
                ['PixelPirate', 109, '#fb923c'],
                ['BlazeQueen', 96, '#8A95AC'],
                ['Steve_99', 88, '#8A95AC'],
                ['ShadowKnight (You)', 64, '#00C2FF'],
              ].map(([n, v, c], i) => (
                <li key={String(n)} className="flex items-center justify-between p-2.5 rounded-lg bg-[#fffdf6] border border-black/10">
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md grid place-items-center text-xs font-black outline-panel" style={{ background: `${c}22`, color: c }}>{i+1}</span>
                    <span className="text-[#1f1710]">{n}</span>
                  </span>
                  <span className="text-[#2d5dff] font-black">{v}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </section>
    </>
  );
}
