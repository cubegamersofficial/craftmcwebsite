import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Search, BookOpen, Terminal, Briefcase, Map, Coins, Calendar, HelpCircle, ChevronRight } from 'lucide-react';

const SECTIONS = [
  { id: 'start', name: 'Getting Started', icon: BookOpen },
  { id: 'cmds', name: 'Commands', icon: Terminal },
  { id: 'jobs', name: 'Jobs System', icon: Briefcase },
  { id: 'claims', name: 'Claims Guide', icon: Map },
  { id: 'economy', name: 'Economy Guide', icon: Coins },
  { id: 'events', name: 'Events Guide', icon: Calendar },
  { id: 'faq', name: 'FAQ', icon: HelpCircle },
];

const CONTENT: Record<string, { title: string; body: string }[]> = {
  start: [
    { title: 'Welcome to Craft SMP', body: 'Join with play.craftsmp.net on Java 1.21.4. Bedrock players connect via the same address on port 19132.' },
    { title: 'First steps', body: 'Run /spawn to find the new player area. Pick up your starter kit with /kit starter (once per account).' },
    { title: 'Setting your home', body: 'Use /sethome <name> to save up to 5 locations as a free player. Ranked players get more home slots.' },
  ],
  cmds: [
    { title: '/spawn', body: 'Teleport to the main spawn area.' },
    { title: '/tpa <player>', body: 'Request to teleport to another player.' },
    { title: '/balance', body: 'Check your current coin balance.' },
    { title: '/shop', body: 'Open the global shop GUI.' },
    { title: '/claim', body: 'Claim the current chunk you are standing in.' },
  ],
  jobs: [
    { title: 'Choosing a job', body: 'Run /jobs browse and join up to 3 jobs. Mining, Farming, Hunter, Builder, Fisher, and 15 more.' },
    { title: 'Leveling', body: 'Earn XP through job actions. Every 10 levels unlocks a new perk and pay boost.' },
  ],
  claims: [
    { title: 'How claims work', body: 'You earn claim blocks every hour of playtime. Use a golden shovel to define corners.' },
    { title: 'Trusting friends', body: '/trust <player> grants build access. /containertrust restricts to chests only.' },
  ],
  economy: [
    { title: 'Coins and Gems', body: 'Coins are the primary currency, earned through jobs and trade. Gems are a premium currency earned through voting and events.' },
    { title: 'Player shops', body: 'Create your own shop with /pshop create — set prices and earn passively.' },
  ],
  events: [
    { title: 'Weekly schedule', body: 'KOTH on Saturdays, Dropper on Wednesdays, lore quests rotate monthly.' },
  ],
  faq: [
    { title: 'Is the server pay-to-win?', body: 'No. Ranks grant cosmetic and quality-of-life perks. No combat or progression advantages.' },
    { title: 'Can I play on mobile?', body: 'Yes, via Bedrock crossplay. Connect to play.craftsmp.net on port 19132.' },
    { title: 'How do I report a player?', body: 'Use /report <player> <reason> or open a ticket in our Discord.' },
  ],
};

export function Wiki() {
  const [active, setActive] = useState('start');
  const [q, setQ] = useState('');
  const items = CONTENT[active].filter((i) => (i.title+i.body).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader eyebrow="Knowledge Base" title="Craft SMP Wiki" subtitle="Guides, commands and everything you need to master the network." />
      <section className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3">
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7f6b56]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the wiki…" className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#fff7e8] border border-black/10 text-sm text-[#1f1710] placeholder:text-[#7f6b56] focus:outline-none focus:border-[#a66a00] outline-panel" />
          </div>
          <nav className="space-y-1.5">
            {SECTIONS.map((s) => (
              <button key={s.id} onClick={() => setActive(s.id)} className={`w-full flex items-center gap-3 p-3 rounded-xl border transition outline-panel ${active===s.id ? 'bg-[#ffd028] border-[#1f1710] text-[#1f1710]' : 'bg-[#fff7e8] border-black/10 text-[#6f5f4b] hover:bg-[#fff3c2] hover:text-[#1f1710]'}`}>
                <s.icon size={16} /> <span className="text-sm">{s.name}</span>
                <ChevronRight size={14} className="ml-auto opacity-50" />
              </button>
            ))}
          </nav>
        </aside>

        <div className="lg:col-span-9">
          <div className="text-xs text-[#7f6b56] mb-2">Wiki / <span className="text-[#1f1710]">{SECTIONS.find(s => s.id===active)?.name}</span></div>
          <h2 className="display-font text-6xl text-[#1f1710] mb-6">{SECTIONS.find(s => s.id===active)?.name}</h2>
          <div className="space-y-4">
            {items.map((it) => (
              <article key={it.title} className="glass rounded-2xl p-6">
                <h3 className="text-[#1f1710] font-black text-lg">{it.title}</h3>
                <p className="mt-2 text-[#745f49] leading-relaxed">{it.body}</p>
              </article>
            ))}
            {items.length === 0 && <div className="glass rounded-2xl p-12 text-center text-[#745f49]">No matching articles.</div>}
          </div>
        </div>
      </section>
    </>
  );
}
