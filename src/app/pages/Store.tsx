import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Crown, Box, Key, Sparkles, Tag, ShoppingCart, Plus, Minus, Trash2, Trophy, Check } from 'lucide-react';

const CATEGORIES = [
  { id: 'ranks', name: 'Ranks', icon: Crown, count: 6 },
  { id: 'crates', name: 'Crates', icon: Box, count: 8 },
  { id: 'keys', name: 'Keys', icon: Key, count: 5 },
  { id: 'cosmetics', name: 'Cosmetics', icon: Sparkles, count: 24 },
  { id: 'tags', name: 'Tags', icon: Tag, count: 18 },
];

const RANKS = [
  { name: 'Iron', price: 4.99, color: '#9CA3AF', perks: ['/fly in lobby','5 homes','Iron prefix'], popular: false },
  { name: 'Gold', price: 9.99, color: '#facc15', perks: ['/fly anywhere','10 homes','Gold prefix','Daily crate key'], popular: false },
  { name: 'Diamond', price: 19.99, color: '#00C2FF', perks: ['All Gold perks','20 homes','/feed','/heal','Diamond prefix'], popular: true },
  { name: 'Emerald', price: 29.99, color: '#22C55E', perks: ['All Diamond perks','30 homes','/nick','Emerald prefix'], popular: false },
  { name: 'Obsidian', price: 49.99, color: '#7B61FF', perks: ['All Emerald perks','Unlimited homes','VIP events','Obsidian prefix'], popular: false },
  { name: 'Bedrock', price: 99.99, color: '#ef4444', perks: ['Everything','Custom prefix','Private vault','Founder badge'], popular: false },
];

export function Store() {
  const [active, setActive] = useState('ranks');
  const [cart, setCart] = useState<{ name: string; price: number; qty: number }[]>([
    { name: 'Diamond Rank', price: 19.99, qty: 1 },
    { name: 'Mythic Crate Key', price: 2.49, qty: 3 },
  ]);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <>
      <PageHeader eyebrow="Marketplace" title={<>Support the server, <span className="text-gradient">unlock perks</span></>} subtitle="Every purchase helps us pay for servers, events and prize pools. No pay-to-win — ever." />
      <section className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 space-y-2">
          <div className="text-xs uppercase tracking-widest text-[#8b7253] font-black px-2">Categories</div>
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => setActive(c.id)} className={`w-full flex items-center justify-between p-3 rounded-2xl border transition outline-panel ${active===c.id ? 'bg-[#ffd028] text-[#1f1710]' : 'bg-[#fff7e8] text-[#6f5f4b] hover:bg-[#fff3c2] hover:text-[#1f1710]'}`}>
              <span className="flex items-center gap-3"><c.icon size={16} /> {c.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/50">{c.count}</span>
            </button>
          ))}
          <div className="glass rounded-2xl p-5 mt-6">
            <div className="flex items-center gap-2 text-[#a66a00]"><Trophy size={16} /><span className="text-sm font-black text-[#1f1710]">Top Supporters</span></div>
            <ol className="mt-3 space-y-2.5 text-sm">
              {[['Ender_Wraith','$840'],['Steve_99','$612'],['BlazeQueen','$498'],['NetherKing','$421'],['PixelPirate','$355']].map(([n, v], i) => (
                <li key={n} className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><span className="w-5 h-5 rounded-md bg-black/5 text-xs grid place-items-center text-[#7f6b56]">{i+1}</span><span className="text-[#1f1710]">{n}</span></span>
                  <span className="text-[#22C55E]">{v}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <div className="lg:col-span-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="display-font text-5xl leading-none text-[#1f1710]">Featured Ranks</h2>
            <select className="bg-[#fff7e8] border border-black/10 rounded-xl px-3 py-2 text-sm text-[#1f1710] outline-panel">
              <option>Featured</option><option>Price: Low to High</option><option>Price: High to Low</option>
            </select>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {RANKS.map((r) => (
              <div key={r.name} className={`relative glass rounded-2xl p-5 ${r.popular ? 'ring-gradient' : ''}`}>
                {r.popular && <span className="absolute -top-2.5 left-5 text-[10px] px-2 py-0.5 rounded-full bg-[#ffd028] text-[#1f1710] font-black uppercase tracking-widest outline-panel">Most Popular</span>}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl grid place-items-center" style={{ background: `${r.color}22`, color: r.color }}><Crown size={20} /></div>
                    <div>
                      <div className="text-[#1f1710] font-black">{r.name}</div>
                      <div className="text-xs text-[#7f6b56]">Lifetime</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#1f1710]">${r.price}</div>
                  </div>
                </div>
                <ul className="mt-4 space-y-1.5 text-sm text-[#745f49]">
                  {r.perks.map((p) => <li key={p} className="flex items-center gap-2"><Check size={14} className="text-[#22C55E]" /> {p}</li>)}
                </ul>
                <button
                  onClick={() => setCart((c) => c.find(x => x.name === r.name+' Rank') ? c : [...c, { name: r.name+' Rank', price: r.price, qty: 1 }])}
                  className="mt-5 w-full h-10 rounded-xl bg-[#1f1710] hover:bg-[#3b2f24] text-[#fff7e8] text-sm font-black transition outline-panel"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 glass rounded-2xl p-6">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#22C55E] pulse-dot"></div><span className="text-sm font-black text-[#1f1710]">Recent Purchases</span></div>
            <div className="mt-4 space-y-2.5">
              {[
                ['PixelPirate','Diamond Rank','$19.99','2m ago'],
                ['BlazeQueen','Mythic Crate Key x5','$12.45','7m ago'],
                ['NetherKing','Obsidian Rank','$49.99','22m ago'],
                ['SteveBuilds','Custom Tag','$3.99','41m ago'],
              ].map(([who, what, amt, when]) => (
                <div key={who+what} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#ffd028] outline-panel"></div>
                    <div><span className="text-[#1f1710]">{who}</span> <span className="text-[#7f6b56]">bought</span> <span className="text-[#1f1710]">{what}</span></div>
                  </div>
                  <div className="text-right"><div className="text-[#1d7f4c]">${amt}</div><div className="text-[11px] text-[#7f6b56]">{when}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="lg:col-span-3">
          <div className="glass rounded-2xl p-5 sticky top-24">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#1f1710]"><ShoppingCart size={18} /> <span className="font-black">Your Cart</span></div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-black/5 text-[#7f6b56]">{cart.length} items</span>
            </div>
            <div className="mt-4 space-y-3">
              {cart.map((it, idx) => (
                <div key={it.name} className="p-3 rounded-xl bg-[#fffdf6] border border-black/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-[#1f1710]">{it.name}</div>
                      <div className="text-xs text-[#7f6b56]">${it.price.toFixed(2)} each</div>
                    </div>
                    <button onClick={() => setCart(cart.filter((_, i) => i !== idx))} className="text-[#7f6b56] hover:text-[#b42318]"><Trash2 size={14} /></button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-lg border border-black/10 bg-[#fff7e8]">
                      <button onClick={() => setCart(cart.map((x, i) => i===idx ? { ...x, qty: Math.max(1, x.qty - 1) } : x))} className="w-7 h-7 grid place-items-center text-[#7f6b56] hover:text-[#1f1710]"><Minus size={12} /></button>
                      <span className="w-7 text-center text-sm text-[#1f1710]">{it.qty}</span>
                      <button onClick={() => setCart(cart.map((x, i) => i===idx ? { ...x, qty: x.qty + 1 } : x))} className="w-7 h-7 grid place-items-center text-[#7f6b56] hover:text-[#1f1710]"><Plus size={12} /></button>
                    </div>
                    <div className="text-sm text-[#1f1710] font-black">${(it.price * it.qty).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 space-y-2 text-sm">
              <div className="flex justify-between text-[#7f6b56]"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
              <div className="flex justify-between text-[#7f6b56]"><span>Tax</span><span>$0.00</span></div>
              <div className="flex justify-between text-[#1f1710] font-black text-base pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
            <button className="mt-4 w-full h-11 rounded-xl bg-[#ffd028] text-[#1f1710] font-black outline-panel hover:scale-[1.02] transition">
              Secure Checkout
            </button>
            <div className="mt-3 text-[11px] text-[#7f6b56] text-center">Powered by Tebex · 14-day refund policy</div>
          </div>
        </aside>
      </section>
    </>
  );
}
