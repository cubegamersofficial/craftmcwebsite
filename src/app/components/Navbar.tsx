import { Link, NavLink } from 'react-router';
import { useState } from 'react';
import { Bell, Menu, X, User, LogOut, Settings, Trophy, ShoppingBag, ChevronDown } from 'lucide-react';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/store', label: 'Store' },
  { to: '/wiki', label: 'Wiki' },
  { to: '/rules', label: 'Rules' },
  { to: '/vote', label: 'Vote' },
  { to: '/staff', label: 'Staff' },
  { to: '/support', label: 'Support' },
];

export function Navbar() {
  const [mobile, setMobile] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#f8efe0]/95 border-b border-[#1f1710]/15">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#ffd028] outline-panel grid place-items-center group-hover:scale-105 transition-transform">
            <span className="text-[#1f1710] font-black">C</span>
          </div>
          <div className="leading-tight">
            <div className="font-black tracking-tight text-[#1f1710]">Craft SMP</div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-[#8a6e43]">Survival · Season 5</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-full text-sm transition-all ${
                  isActive
                    ? 'text-[#1f1710] bg-[#ffd028] outline-panel shadow-none'
                    : 'text-[#6f5f4b] hover:text-[#1f1710] hover:bg-black/5'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="relative w-10 h-10 rounded-lg bg-white hover:bg-[#fff3be] outline-panel grid place-items-center text-[#1f1710] transition"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#1d7f4c] pulse-dot"></span>
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 glass rounded-2xl p-3">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <div className="text-sm font-semibold text-[#1f1710]">Notifications</div>
                  <button className="text-xs text-[#8a6e43]">Mark all read</button>
                </div>
                <div className="space-y-1 mt-1">
                  {[
                    { t: 'Daily reward ready', d: 'Claim 250 coins now', c: '#22C55E' },
                    { t: 'New season event', d: 'King of the Hill starts 8PM', c: '#00C2FF' },
                    { t: 'Friend online', d: 'Steve_99 joined the server', c: '#7B61FF' },
                  ].map((n) => (
                    <div key={n.t} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-black/5">
                      <span className="mt-1 w-2 h-2 rounded-full" style={{ background: n.c }}></span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-[#1f1710]">{n.t}</div>
                        <div className="text-xs text-[#7f6b56]">{n.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <a
            href="#"
            className="inline-flex items-center gap-2 px-4 h-10 rounded-full bg-[#1f1710] hover:bg-[#3b2f24] text-[#fff7e8] text-sm font-medium transition outline-panel"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3a.077.077 0 0 0-.082.038c-.354.63-.748 1.453-1.024 2.1a18.27 18.27 0 0 0-5.49 0c-.276-.66-.687-1.47-1.044-2.1a.08.08 0 0 0-.082-.037A19.74 19.74 0 0 0 5.077 4.37a.07.07 0 0 0-.033.027C1.59 9.046.747 13.58 1.16 18.057a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.105 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.371-.291a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.009c.12.099.245.198.372.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.893.077.077 0 0 0-.04.105c.36.698.772 1.362 1.225 1.994a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.673-3.549-13.66a.061.061 0 0 0-.031-.03Z"/></svg>
            Discord
          </a>

          <div className="relative">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="inline-flex items-center gap-2 pl-1 pr-3 h-10 rounded-full bg-white hover:bg-[#fff3be] outline-panel text-sm transition"
            >
              <div className="w-8 h-8 rounded-md bg-[#ffd028] grid place-items-center text-xs font-black text-[#1f1710]">SH</div>
              <span className="text-[#1f1710]">Shadow</span>
              <ChevronDown size={14} className="text-[#7f6b56]" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 glass rounded-2xl p-2">
                <div className="px-3 py-3 border-b border-black/10">
                  <div className="text-sm font-semibold text-[#1f1710]">Shadow_Knight</div>
                  <div className="text-xs text-[#7f6b56]">Diamond Rank · 12,480 coins</div>
                </div>
                {[
                  { i: User, t: 'My Profile' },
                  { i: ShoppingBag, t: 'My Orders' },
                  { i: Trophy, t: 'Achievements' },
                  { i: Settings, t: 'Settings' },
                ].map((it) => (
                  <button key={it.t} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#1f1710] hover:bg-black/5">
                    <it.i size={16} className="text-[#7f6b56]" />
                    {it.t}
                  </button>
                ))}
                <div className="my-1 border-t border-black/10"></div>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#b42318] hover:bg-black/5">
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        <button onClick={() => setMobile(!mobile)} className="lg:hidden w-10 h-10 grid place-items-center rounded-lg bg-white outline-panel text-[#1f1710]">
          {mobile ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobile && (
        <div className="lg:hidden border-t border-black/10 bg-[#f8efe0]/98 backdrop-blur-xl">
          <div className="px-6 py-4 space-y-1">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} onClick={() => setMobile(false)}
                className={({ isActive }) => `block px-3 py-2.5 rounded-lg text-sm ${isActive ? 'text-[#1f1710] bg-[#ffd028]' : 'text-[#6f5f4b] hover:bg-black/5'}`}>
                {n.label}
              </NavLink>
            ))}
            <Link to="/login" onClick={() => setMobile(false)} className="block text-center mt-3 px-3 py-2.5 rounded-lg text-sm text-[#1f1710] bg-[#ffd028] font-bold outline-panel">
              Login / Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
