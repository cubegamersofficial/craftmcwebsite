import { PageHeader } from '../components/PageHeader';
import { LifeBuoy, MessageSquare, Mail, FileQuestion } from 'lucide-react';

export function Support() {
  return (
    <>
      <PageHeader eyebrow="Help Center" title="We're here to help" subtitle="Pick the option that fits — most tickets are answered within 4 hours." />
      <section className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-5">
        {[
          { i: MessageSquare, t: 'Discord Ticket', d: 'Open a private ticket with our staff team. Fastest for bans & purchases.', cta: 'Open Discord' },
          { i: Mail, t: 'Email Support', d: 'support@craftsmp.net — best for refunds and account recovery.', cta: 'Send Email' },
          { i: FileQuestion, t: 'Browse FAQ', d: 'Most common questions are already answered in the Wiki.', cta: 'Read Wiki' },
        ].map((c) => (
          <div key={c.t} className="glass rounded-2xl p-6 outline-panel">
            <div className="w-12 h-12 rounded-xl bg-[#ffd028] grid place-items-center text-[#1f1710] outline-panel"><c.i size={22} /></div>
            <div className="mt-4 text-lg text-[#1f1710] font-black">{c.t}</div>
            <div className="mt-1.5 text-sm text-[#745f49]">{c.d}</div>
            <button className="mt-5 px-4 h-10 rounded-xl bg-[#1f1710] hover:bg-[#3b2f24] text-[#fff7e8] text-sm font-black outline-panel">{c.cta}</button>
          </div>
        ))}
      </section>
      <section className="max-w-3xl mx-auto px-6 py-8">
        <div className="glass rounded-2xl p-6 outline-panel">
          <div className="flex items-center gap-2 text-[#1f1710]"><LifeBuoy size={18} className="text-[#a66a00]" /><span className="font-black">Open a ticket</span></div>
          <div className="grid sm:grid-cols-2 gap-4 mt-5">
            <Field label="Your username" placeholder="Steve_99" />
            <Field label="Category" placeholder="Bug report" />
          </div>
          <Field label="Subject" placeholder="Short description" />
          <div>
            <label className="text-sm text-[#1f1710]">Message</label>
            <textarea rows={5} placeholder="Tell us what happened…" className="mt-1.5 w-full rounded-xl bg-[#fff7e8] border border-black/10 px-3 py-2.5 text-sm text-[#1f1710] placeholder:text-[#7f6b56] focus:outline-none focus:border-[#a66a00] outline-panel"></textarea>
          </div>
          <button className="mt-4 h-11 px-6 rounded-xl bg-[#ffd028] text-[#1f1710] font-black outline-panel">Submit Ticket</button>
        </div>
      </section>
    </>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="mt-4 first:mt-0">
      <label className="text-sm text-[#1f1710]">{label}</label>
      <input placeholder={placeholder} className="mt-1.5 w-full h-11 rounded-xl bg-[#fff7e8] border border-black/10 px-3 text-sm text-[#1f1710] placeholder:text-[#7f6b56] focus:outline-none focus:border-[#a66a00] outline-panel" />
    </div>
  );
}
