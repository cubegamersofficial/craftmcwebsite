import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';

export function Login() {
  const [tab, setTab] = useState<'login'|'register'>('login');
  return (
    <section className="relative min-h-[80vh] grid place-items-center px-6 py-16">
      <div className="absolute inset-0 grid-pattern opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"></div>
      <div className="absolute top-20 left-1/4 w-[400px] h-[400px] rounded-full bg-[#ffd028]/18 blur-3xl"></div>
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] rounded-full bg-[#e6d1ff]/18 blur-3xl"></div>
      <div className="relative w-full max-w-md">
        <div className="glass rounded-3xl p-8 ring-gradient">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#ffd028] grid place-items-center outline-panel"><span className="text-[#1f1710] font-black">C</span></div>
            <div className="font-black text-[#1f1710]">Craft SMP</div>
          </div>
          <h2 className="mt-6 display-font text-6xl text-[#1f1710]">{tab==='login' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="text-sm text-[#745f49] mt-1">{tab==='login' ? 'Sign in to access your dashboard.' : 'Join 12,000+ players in the Craft SMP community.'}</p>

          <div className="mt-6 grid grid-cols-2 p-1 rounded-xl bg-[#fff7e8] border border-black/10 text-sm outline-panel">
            <button onClick={() => setTab('login')} className={`h-9 rounded-lg transition ${tab==='login' ? 'bg-[#ffd028] text-[#1f1710] font-black outline-panel' : 'text-[#7f6b56]'}`}>Login</button>
            <button onClick={() => setTab('register')} className={`h-9 rounded-lg transition ${tab==='register' ? 'bg-[#ffd028] text-[#1f1710] font-black outline-panel' : 'text-[#7f6b56]'}`}>Register</button>
          </div>

          <form className="mt-6 space-y-3">
            {tab==='register' && (
              <InputRow icon={User} placeholder="Minecraft username" />
            )}
            <InputRow icon={Mail} placeholder="Email address" />
            <InputRow icon={Lock} placeholder="Password" type="password" />
            {tab==='login' && <div className="text-right"><a href="#" className="text-xs text-[#2d5dff] font-semibold">Forgot password?</a></div>}
            <button type="button" className="w-full h-11 rounded-xl bg-[#ffd028] text-[#1f1710] font-black outline-panel hover:scale-[1.02] transition">
              {tab==='login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-5 flex items-center gap-3 text-xs text-[#7f6b56]">
            <div className="flex-1 h-px bg-black/10"></div> OR CONTINUE WITH <div className="flex-1 h-px bg-black/10"></div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="h-10 rounded-xl bg-[#fff7e8] hover:bg-[#fff3c2] text-[#1f1710] text-sm font-black outline-panel">Discord</button>
            <button className="h-10 rounded-xl bg-[#fff7e8] hover:bg-[#fff3c2] text-[#1f1710] text-sm font-black outline-panel">Microsoft</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function InputRow({ icon: Icon, placeholder, type='text' }: { icon: any; placeholder: string; type?: string }) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7f6b56]" />
      <input type={type} placeholder={placeholder} className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#fff7e8] border border-black/10 text-sm text-[#1f1710] placeholder:text-[#7f6b56] focus:outline-none focus:border-[#a66a00] outline-panel" />
    </div>
  );
}
