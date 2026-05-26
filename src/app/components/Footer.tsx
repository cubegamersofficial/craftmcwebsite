import { Link } from 'react-router';
import { Twitter, Youtube, Twitch, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[#1f1710] bg-[#0f0f0f] text-[#f9f1e3]">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#ffd028] grid place-items-center outline-panel"><span className="text-[#1f1710] font-black">C</span></div>
              <div className="font-black text-[#fff7e8]">Craft SMP</div>
            </div>
            <p className="text-sm text-[#c9baaa] mt-4 leading-relaxed">A survival server with economy, events, claims, and crossplay support. Built for players who want a lively world that still feels fair.</p>
            <div className="flex gap-2 mt-5">
              {[Twitter, Youtube, Twitch, Github].map((I, i) => (
                <a key={i} href="#" className="w-9 h-9 grid place-items-center rounded-lg bg-white/5 hover:bg-[#ffd028] text-[#c9baaa] hover:text-[#1f1710] transition outline-panel"><I size={16} /></a>
              ))}
            </div>
          </div>
          {[
            { t: 'Server', l: [['Home','/'],['Store','/store'],['Vote','/vote'],['Staff','/staff']] },
            { t: 'Resources', l: [['Wiki','/wiki'],['Rules','/rules'],['Support','/support'],['Status','#']] },
            { t: 'Community', l: [['Discord','#'],['Forums','#'],['Blog','#'],['Partners','#']] },
          ].map((g) => (
            <div key={g.t}>
              <div className="text-sm font-black text-[#fff7e8] uppercase tracking-wider">{g.t}</div>
              <ul className="mt-4 space-y-2.5">
                {g.l.map(([n, h]) => (
                  <li key={n}><Link to={h} className="text-sm text-[#c9baaa] hover:text-[#ffd028] transition">{n}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#c9baaa]">© 2026 Craft SMP. Not affiliated with Mojang or Microsoft.</div>
          <div className="text-xs text-[#c9baaa]">play.craftsmp.net · v1.21.4 · Java + Bedrock</div>
        </div>
      </div>
    </footer>
  );
}
