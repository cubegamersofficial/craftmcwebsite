import { PageHeader } from '../components/PageHeader';
import { MessageSquare } from 'lucide-react';

const STAFF = [
  { name: 'CraftLord', role: 'Owner', color: '#ef4444', status: 'online', bio: 'Founder, full-stack dev. Builds the network and breaks it weekly.' },
  { name: 'EnderQueen', role: 'Co-Owner', color: '#7B61FF', status: 'online', bio: 'Operations, partnerships, and event design lead.' },
  { name: 'PixelMage', role: 'Admin', color: '#00C2FF', status: 'away', bio: 'Plugin developer & systems administrator.' },
  { name: 'ShadowWolf', role: 'Admin', color: '#00C2FF', status: 'online', bio: 'Anti-cheat lead and senior moderator coach.' },
  { name: 'BlazeKnight', role: 'Moderator', color: '#22C55E', status: 'online', bio: 'Veteran moderator, runs weekly KOTH events.' },
  { name: 'StarFury', role: 'Moderator', color: '#22C55E', status: 'offline', bio: 'EU coverage. Loves redstone and writing lore.' },
  { name: 'NovaCraft', role: 'Helper', color: '#facc15', status: 'online', bio: 'New player guide. Will absolutely help you find diamonds.' },
  { name: 'IronFox', role: 'Helper', color: '#facc15', status: 'online', bio: 'Asia-Pacific coverage. Builder & friendly face.' },
];

const STATUS: Record<string, string> = { online: '#22C55E', away: '#facc15', offline: '#6B7280' };

export function Staff() {
  return (
    <>
      <PageHeader eyebrow="The Team" title="Meet the staff" subtitle="The people keeping Craft SMP fair, fun, and friendly — 24/7 across every timezone." />
      <section className="max-w-7xl mx-auto px-6 py-12">
        {['Owner','Admin','Moderator','Helper'].map((role) => (
          <div key={role} className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="display-font text-6xl text-[#1f1710]">{role}s</h2>
              <div className="h-px flex-1 bg-black/10"></div>
              <div className="text-sm text-[#7f6b56]">{STAFF.filter(s => s.role===role || (role==='Owner' && s.role==='Co-Owner')).length}</div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {STAFF.filter(s => s.role===role || (role==='Owner' && s.role==='Co-Owner')).map((s) => (
                <div key={s.name} className="group glass rounded-2xl p-5 hover:-translate-y-1 transition relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-30" style={{ background: s.color }}></div>
                  <div className="relative flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl ring-2 ring-black/10 grid place-items-center text-xl font-black text-[#1f1710]" style={{ background: `linear-gradient(135deg, ${s.color}, #fff7e8)` }}>
                        {s.name[0]}
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#fff7e8]" style={{ background: STATUS[s.status] }}></span>
                    </div>
                    <div>
                      <div className="text-[#1f1710] font-black">{s.name}</div>
                      <span className="text-[11px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full inline-block mt-1 outline-panel" style={{ background: `${s.color}22`, color: s.color }}>{s.role}</span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-[#745f49]">{s.bio}</p>
                  <a href="#" className="mt-5 w-full inline-flex items-center justify-center gap-2 h-9 rounded-lg bg-[#1f1710] hover:bg-[#3b2f24] text-sm text-[#fff7e8] transition outline-panel">
                    <MessageSquare size={14} /> Message on Discord
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
