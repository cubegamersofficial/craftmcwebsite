import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Search, Shield, MessageSquare, Swords, Map, Coins, AlertTriangle } from 'lucide-react';

const CATS = [
  { id: 'general', name: 'General Rules', icon: Shield },
  { id: 'chat', name: 'Chat Rules', icon: MessageSquare },
  { id: 'pvp', name: 'PvP Rules', icon: Swords },
  { id: 'claim', name: 'Claim Rules', icon: Map },
  { id: 'economy', name: 'Economy Rules', icon: Coins },
];

const RULES: Record<string, { title: string; desc: string; punishment: 'Warn'|'Mute'|'Tempban'|'Permaban' }[]> = {
  general: [
    { title: 'Respect every player and staff member', desc: 'Toxicity, harassment, hate speech or discrimination will not be tolerated.', punishment: 'Mute' },
    { title: 'No cheating, hacks or exploits', desc: 'Any unfair advantage including X-ray, autoclickers, kill aura, etc. results in immediate ban.', punishment: 'Permaban' },
    { title: 'No alt accounts to bypass punishments', desc: 'Ban evasion will lead to a permanent IP ban on all accounts involved.', punishment: 'Permaban' },
    { title: 'Report bugs, do not exploit them', desc: 'Found a duplication bug or money exploit? Report it for a reward instead.', punishment: 'Tempban' },
  ],
  chat: [
    { title: 'No spam or self-promotion', desc: 'Do not advertise other servers, Discords, or services without permission.', punishment: 'Mute' },
    { title: 'English in global chat', desc: 'Use the language channels in Discord for non-English conversation.', punishment: 'Warn' },
    { title: 'No NSFW content or links', desc: 'Includes usernames, builds, skins and chat content.', punishment: 'Tempban' },
  ],
  pvp: [
    { title: 'No combat logging', desc: 'Logging out in combat to avoid death is treated as a loss.', punishment: 'Warn' },
    { title: 'No spawn camping', desc: 'Camping new players in non-PvP zones is forbidden.', punishment: 'Tempban' },
    { title: 'Drop loot returns', desc: 'Returning a victim\'s loot after killing them in a non-PvP region.', punishment: 'Warn' },
  ],
  claim: [
    { title: 'No building within 100 blocks of others', desc: 'Unless invited / trusted by the claim owner.', punishment: 'Warn' },
    { title: 'No claim griefing or trap setups', desc: 'Includes lava casting, mob traps near builds, or sign spam.', punishment: 'Tempban' },
  ],
  economy: [
    { title: 'No real money trading (RMT)', desc: 'In-game items may not be sold for real currency outside the store.', punishment: 'Permaban' },
    { title: 'No scamming', desc: 'All trades must be honored. Use /trade for safety.', punishment: 'Tempban' },
  ],
};

const COLORS: Record<string, string> = { Warn: '#facc15', Mute: '#fb923c', Tempban: '#ef4444', Permaban: '#7B61FF' };

export function Rules() {
  const [active, setActive] = useState('general');
  const [q, setQ] = useState('');
  const filtered = RULES[active].filter((r) => (r.title+r.desc).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader eyebrow="Server Policy" title="Rules & Conduct" subtitle="Play fair, be kind, build cool stuff. These rules apply across the network." />
      <section className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3">
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7f6b56]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search rules…" className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#fff7e8] border border-black/10 text-sm text-[#1f1710] placeholder:text-[#7f6b56] focus:outline-none focus:border-[#a66a00] outline-panel" />
          </div>
          <div className="space-y-1.5">
            {CATS.map((c) => (
              <button key={c.id} onClick={() => setActive(c.id)} className={`w-full flex items-center gap-3 p-3 rounded-xl border transition outline-panel ${active===c.id ? 'bg-[#ffd028] border-[#1f1710] text-[#1f1710]' : 'bg-[#fff7e8] border-black/10 text-[#6f5f4b] hover:bg-[#fff3c2] hover:text-[#1f1710]'}`}>
                <c.icon size={16} /> <span className="text-sm">{c.name}</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-white/50">{RULES[c.id].length}</span>
              </button>
            ))}
          </div>
          <div className="mt-6 glass rounded-2xl p-4 text-sm">
            <div className="flex items-center gap-2 text-[#a66a00]"><AlertTriangle size={14} /><span className="text-[#1f1710] font-black">Appeal a ban?</span></div>
            <p className="text-[#745f49] mt-2">Visit our Discord and open a ticket. Most appeals are answered within 24 hours.</p>
          </div>
        </aside>

        <div className="lg:col-span-9 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="display-font text-6xl text-[#1f1710]">{CATS.find(c => c.id===active)?.name}</h2>
            <div className="text-sm text-[#7f6b56]">{filtered.length} rules</div>
          </div>
          {filtered.map((r, i) => (
            <div key={r.title} className="glass rounded-2xl p-5 flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-[#ffd028] grid place-items-center text-[#1f1710] font-black outline-panel">{i+1}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-[#1f1710] font-black">{r.title}</div>
                  <span className="text-[11px] uppercase tracking-widest font-black px-2 py-1 rounded-full outline-panel" style={{ background: `${COLORS[r.punishment]}22`, color: COLORS[r.punishment] }}>{r.punishment}</span>
                </div>
                <p className="mt-1.5 text-sm text-[#745f49] leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="glass rounded-2xl p-12 text-center text-[#745f49]">No rules match "{q}".</div>
          )}
        </div>
      </section>
    </>
  );
}
