import { useState } from 'react';
import { MessageCircle, ChevronUp, Activity, Zap } from 'lucide-react';

export function FloatingActions() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {open && (
        <>
          <button className="glass rounded-full px-4 h-11 flex items-center gap-2 text-sm text-[#1f1710] hover:scale-105 transition">
            <Activity size={16} className="text-[#1d7f4c]" /> Server Status
          </button>
          <button className="glass rounded-full px-4 h-11 flex items-center gap-2 text-sm text-[#1f1710] hover:scale-105 transition">
            <Zap size={16} className="text-[#a66a00]" /> Quick Join
          </button>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="glass rounded-full w-11 h-11 grid place-items-center text-[#1f1710] hover:scale-105 transition">
            <ChevronUp size={18} />
          </button>
        </>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-[#ffd028] grid place-items-center text-[#1f1710] outline-panel hover:scale-110 transition"
        aria-label="Quick actions"
      >
        <MessageCircle size={22} />
      </button>
    </div>
  );
}
