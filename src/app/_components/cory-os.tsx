"use client";

import { useEffect, useState } from "react";

type DesktopApp = {
  id: string;
  label: string;
  code: string;
  detail: string;
};

const desktopApps: DesktopApp[] = [
  { id: "terminal", label: "Terminal", code: ">_", detail: "Command interface" },
  { id: "projects", label: "Projects", code: "[]", detail: "Selected systems" },
  { id: "resume", label: "Resume", code: "CV", detail: "Experience record" },
  { id: "notes", label: "Notes", code: "//", detail: "Ideas and logs" },
];

export function CoryOsDesktop({ onClose }: { onClose: () => void }) {
  const [selectedApp, setSelectedApp] = useState("terminal");
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateClock = () => setNow(new Date());
    const firstFrame = window.requestAnimationFrame(updateClock);
    const timer = window.setInterval(updateClock, 30_000);
    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <section className="absolute inset-0 z-[70] overflow-hidden bg-[#03090a] font-mono text-zinc-100">
      <div aria-hidden="true" className="absolute inset-0 opacity-80 [background-image:linear-gradient(rgba(69,125,130,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(69,125,130,0.1)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_62%_44%,rgba(20,103,105,0.2),transparent_38%)]" />

      <header className="relative z-10 flex h-14 items-center justify-between border-b border-teal-100/15 bg-[#030a0b]/90 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center border border-teal-100/30 bg-teal-200/[0.06] text-[10px] font-bold text-teal-100">C//</span>
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-teal-100">Cory OS</p>
            <p className="mt-0.5 text-[7px] uppercase tracking-[0.15em] text-zinc-600">Workspace // 06</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="h-9 border border-white/15 px-3 text-[8px] uppercase tracking-[0.16em] text-zinc-400 transition-colors hover:border-teal-100/45 hover:text-teal-50 sm:px-4">
          <span aria-hidden="true">&lt;- </span>Back to system
        </button>
      </header>

      <div className="absolute inset-x-0 bottom-[3.75rem] top-14 z-10 p-5 sm:p-8">
        <div className="grid w-min grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-1 sm:gap-y-4">
          {desktopApps.map((app) => {
            const selected = selectedApp === app.id;
            return (
              <button key={app.id} type="button" onClick={() => setSelectedApp(app.id)} aria-pressed={selected} className={`group flex w-24 flex-col items-center gap-2 border p-2 text-center transition-colors sm:w-28 ${selected ? "border-teal-100/30 bg-teal-100/[0.07]" : "border-transparent hover:border-white/10 hover:bg-white/[0.03]"}`}>
                <span className={`grid h-12 w-12 place-items-center border text-sm font-bold transition-colors ${selected ? "border-teal-100/50 bg-[#0b2426] text-teal-50 shadow-[0_0_24px_rgba(94,234,212,0.12)]" : "border-white/15 bg-[#081113] text-zinc-400 group-hover:border-teal-100/25 group-hover:text-teal-100"}`}>{app.code}</span>
                <span className="text-[9px] uppercase tracking-[0.1em] text-zinc-200">{app.label}</span>
              </button>
            );
          })}
        </div>

        <div className="pointer-events-none absolute bottom-10 right-6 hidden text-right sm:block sm:right-10">
          <p className="text-[clamp(3rem,8vw,8rem)] font-black leading-none tracking-normal text-white/[0.025]">CORY OS</p>
          <div className="mt-3 flex items-center justify-end gap-3 text-[8px] uppercase tracking-[0.2em] text-teal-100/35">
            <span className="h-px w-16 bg-teal-100/20" />
            Personal workspace
          </div>
        </div>

        <aside className="absolute right-6 top-6 hidden w-56 border-l border-teal-100/15 pl-5 lg:block">
          <p className="text-[7px] uppercase tracking-[0.2em] text-teal-100/50">System status</p>
          <dl className="mt-4 space-y-3 text-[8px] uppercase tracking-[0.12em]">
            <div className="flex justify-between gap-3"><dt className="text-zinc-600">Session</dt><dd className="text-zinc-300">Guest</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-zinc-600">Network</dt><dd className="text-emerald-300">Online</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-zinc-600">Module</dt><dd className="text-teal-100">{selectedApp}</dd></div>
          </dl>
        </aside>
      </div>

      <nav aria-label="Cory OS taskbar" className="absolute inset-x-0 bottom-0 z-20 flex h-[3.75rem] items-center border-t border-teal-100/20 bg-[#050d0f]/95 px-3 backdrop-blur-md sm:px-5">
        <button type="button" title="System menu" aria-label="Open system menu" className="grid h-9 w-9 shrink-0 place-items-center border border-teal-100/30 bg-teal-100/[0.06] text-[9px] font-bold text-teal-100 transition-colors hover:bg-teal-100/[0.12]">C//</button>
        <div className="mx-3 h-6 w-px bg-white/10" />
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          {desktopApps.map((app) => (
            <button key={app.id} type="button" title={app.label} aria-label={app.label} onClick={() => setSelectedApp(app.id)} className={`relative grid h-9 w-10 place-items-center border text-[8px] font-bold transition-colors ${selectedApp === app.id ? "border-teal-100/35 bg-teal-100/[0.08] text-teal-50" : "border-transparent text-zinc-500 hover:border-white/10 hover:text-zinc-200"}`}>
              {app.code}
              {selectedApp === app.id && <span className="absolute inset-x-1 bottom-0 h-px bg-teal-200" />}
            </button>
          ))}
        </div>
        <div className="hidden items-center gap-3 border-l border-white/10 pl-4 text-right sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />
          <div>
            <p className="text-[9px] text-zinc-300">{now ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}</p>
            <p className="mt-0.5 text-[7px] text-zinc-600">{now ? now.toLocaleDateString([], { month: "short", day: "2-digit" }) : "SYSTEM"}</p>
          </div>
        </div>
      </nav>
    </section>
  );
}
