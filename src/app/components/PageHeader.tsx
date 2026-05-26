import type { ReactNode } from 'react';

export function PageHeader({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: ReactNode; subtitle?: string; action?: ReactNode }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"></div>
      <div className="absolute -top-32 left-1/4 w-[480px] h-[480px] rounded-full bg-[#ffd028]/20 blur-3xl"></div>
      <div className="absolute -top-32 right-1/4 w-[480px] h-[480px] rounded-full bg-[#e6d1ff]/24 blur-3xl"></div>
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          {eyebrow && <div className="text-xs uppercase tracking-[0.25em] text-[#2d5dff] font-black">{eyebrow}</div>}
          <h1 className="mt-3 display-font text-[60px] leading-[0.92] md:text-[88px] text-[#1f1710] tracking-[0.01em]">{title}</h1>
          {subtitle && <p className="mt-3 text-[#745f49] max-w-2xl leading-relaxed">{subtitle}</p>}
        </div>
        {action}
      </div>
    </section>
  );
}
