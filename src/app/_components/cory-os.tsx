"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

type DesktopApp = { id: string; label: string; code: string; detail: string };
type WindowState = { open: boolean; minimized: boolean; x: number; y: number; z: number };

const desktopApps: DesktopApp[] = [
  { id: "terminal", label: "Terminal", code: ">_", detail: "Command interface" },
  { id: "projects", label: "Projects", code: "[]", detail: "Selected systems" },
  { id: "resume", label: "Resume", code: "CV", detail: "Experience record" },
  { id: "notes", label: "Notes", code: "//", detail: "Ideas and logs" },
];

const initialWindows: Record<string, WindowState> = {
  terminal: { open: true, minimized: false, x: 190, y: 55, z: 1 },
  projects: { open: false, minimized: false, x: 245, y: 82, z: 1 },
  resume: { open: false, minimized: false, x: 300, y: 105, z: 1 },
  notes: { open: false, minimized: false, x: 350, y: 128, z: 1 },
};

export function CoryOsDesktop({ onClose }: { onClose: () => void }) {
  const [selectedApp, setSelectedApp] = useState("terminal");
  const [windows, setWindows] = useState(initialWindows);
  const [topZ, setTopZ] = useState(2);
  const [now, setNow] = useState<Date | null>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const updateClock = () => setNow(new Date());
    const query = window.matchMedia("(max-width: 639px)");
    const updateMobile = () => setMobile(query.matches);
    const frame = window.requestAnimationFrame(() => { updateClock(); updateMobile(); });
    const timer = window.setInterval(updateClock, 30_000);
    query.addEventListener("change", updateMobile);
    return () => { window.cancelAnimationFrame(frame); window.clearInterval(timer); query.removeEventListener("change", updateMobile); };
  }, []);

  const focusWindow = (id: string) => {
    const nextZ = topZ + 1;
    setTopZ(nextZ);
    setSelectedApp(id);
    setWindows((current) => ({ ...current, [id]: { ...current[id], open: true, minimized: false, z: nextZ } }));
  };
  const minimizeWindow = (id: string) => setWindows((current) => ({ ...current, [id]: { ...current[id], minimized: true } }));
  const closeWindow = (id: string) => setWindows((current) => ({ ...current, [id]: { ...current[id], open: false, minimized: false } }));
  const moveWindow = (id: string, x: number, y: number) => setWindows((current) => ({ ...current, [id]: { ...current[id], x, y } }));
  const taskbarAction = (id: string) => {
    const state = windows[id];
    if (!state.open || state.minimized || selectedApp !== id) focusWindow(id);
    else minimizeWindow(id);
  };

  return (
    <section className="absolute inset-0 z-[70] overflow-hidden bg-[#03090a] font-mono text-zinc-100">
      <div aria-hidden="true" className="absolute inset-0 opacity-80 [background-image:linear-gradient(rgba(69,125,130,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(69,125,130,0.1)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_62%_44%,rgba(20,103,105,0.2),transparent_38%)]" />
      <header className="relative z-10 flex h-14 items-center justify-between border-b border-teal-100/15 bg-[#030a0b]/90 px-4 sm:px-6">
        <div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center border border-teal-100/30 bg-teal-200/[0.06] text-[10px] font-bold text-teal-100">C//</span><div><p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-teal-100">Cory OS</p><p className="mt-0.5 text-[7px] uppercase tracking-[0.15em] text-zinc-600">Workspace // 06</p></div></div>
        <button type="button" onClick={onClose} className="h-9 border border-white/15 px-3 text-[8px] uppercase tracking-[0.16em] text-zinc-400 transition-colors hover:border-teal-100/45 hover:text-teal-50 sm:px-4"><span aria-hidden="true">&lt;- </span>Back to system</button>
      </header>

      <div className="absolute inset-x-0 bottom-[3.75rem] top-14 z-10 overflow-hidden p-3 sm:p-8">
        <div className="grid w-min grid-cols-2 gap-x-2 gap-y-3 sm:grid-cols-1 sm:gap-y-4">
          {desktopApps.map((app) => {
            const selected = selectedApp === app.id;
            return <button key={app.id} type="button" onClick={() => { if (mobile) focusWindow(app.id); else setSelectedApp(app.id); }} onDoubleClick={() => { if (!mobile) focusWindow(app.id); }} aria-pressed={selected} className={`group flex w-20 flex-col items-center gap-2 border p-2 text-center transition-colors sm:w-28 ${selected ? "border-teal-100/30 bg-teal-100/[0.07]" : "border-transparent hover:border-white/10 hover:bg-white/[0.03]"}`}><span className={`grid h-11 w-11 place-items-center border text-xs font-bold transition-colors sm:h-12 sm:w-12 sm:text-sm ${selected ? "border-teal-100/50 bg-[#0b2426] text-teal-50 shadow-[0_0_24px_rgba(94,234,212,0.12)]" : "border-white/15 bg-[#081113] text-zinc-400 group-hover:border-teal-100/25 group-hover:text-teal-100"}`}>{app.code}</span><span className="text-[8px] uppercase tracking-[0.08em] text-zinc-200 sm:text-[9px]">{app.label}</span></button>;
          })}
        </div>

        {desktopApps.map((app) => {
          const state = windows[app.id];
          if (!state.open || state.minimized) return null;
          return <DraggableWindow key={app.id} app={app} state={state} mobile={mobile} active={selectedApp === app.id} onFocus={() => focusWindow(app.id)} onMove={(x, y) => moveWindow(app.id, x, y)} onMinimize={() => minimizeWindow(app.id)} onClose={() => closeWindow(app.id)}><AppWindowContent app={app} /></DraggableWindow>;
        })}
        <div className="pointer-events-none absolute bottom-10 right-6 hidden text-right sm:block sm:right-10"><p className="text-[clamp(3rem,8vw,8rem)] font-black leading-none tracking-normal text-white/[0.025]">CORY OS</p><div className="mt-3 flex items-center justify-end gap-3 text-[8px] uppercase tracking-[0.2em] text-teal-100/35"><span className="h-px w-16 bg-teal-100/20" />Personal workspace</div></div>
      </div>

      <nav aria-label="Cory OS taskbar" className="absolute inset-x-0 bottom-0 z-20 flex h-[3.75rem] items-center border-t border-teal-100/20 bg-[#050d0f]/95 px-3 backdrop-blur-md sm:px-5">
        <button type="button" title="System menu" aria-label="Open system menu" className="grid h-9 w-9 shrink-0 place-items-center border border-teal-100/30 bg-teal-100/[0.06] text-[9px] font-bold text-teal-100 transition-colors hover:bg-teal-100/[0.12]">C//</button><div className="mx-2 h-6 w-px bg-white/10 sm:mx-3" />
        <div className="flex min-w-0 flex-1 items-center gap-1">{desktopApps.map((app) => { const state = windows[app.id]; return <button key={app.id} type="button" title={app.label} aria-label={`${state.open ? "Toggle" : "Open"} ${app.label}`} onClick={() => taskbarAction(app.id)} className={`relative grid h-9 w-9 place-items-center border text-[8px] font-bold transition-colors sm:w-10 ${state.open && !state.minimized && selectedApp === app.id ? "border-teal-100/35 bg-teal-100/[0.08] text-teal-50" : state.open ? "border-white/10 text-zinc-300" : "border-transparent text-zinc-600 hover:border-white/10 hover:text-zinc-200"}`}>{app.code}{state.open && <span className={`absolute inset-x-1 bottom-0 h-px ${state.minimized ? "bg-zinc-500" : "bg-teal-200"}`} />}</button>; })}</div>
        <div className="hidden items-center gap-3 border-l border-white/10 pl-4 text-right sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" /><div><p className="text-[9px] text-zinc-300">{now ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}</p><p className="mt-0.5 text-[7px] text-zinc-600">{now ? now.toLocaleDateString([], { month: "short", day: "2-digit" }) : "SYSTEM"}</p></div></div>
      </nav>
    </section>
  );
}

function DraggableWindow({ app, state, mobile, active, onFocus, onMove, onMinimize, onClose, children }: { app: DesktopApp; state: WindowState; mobile: boolean; active: boolean; onFocus: () => void; onMove: (x: number, y: number) => void; onMinimize: () => void; onClose: () => void; children: ReactNode }) {
  const windowRef = useRef<HTMLElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (mobile || event.button !== 0 || !windowRef.current) return;
    event.stopPropagation();
    onFocus();
    const rect = windowRef.current.getBoundingClientRect();
    dragOffset.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const drag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId) || !windowRef.current) return;
    const parent = windowRef.current.parentElement?.getBoundingClientRect();
    if (!parent) return;
    const maxX = Math.max(0, parent.width - windowRef.current.offsetWidth);
    const maxY = Math.max(0, parent.height - windowRef.current.offsetHeight);
    onMove(Math.min(maxX, Math.max(0, event.clientX - parent.left - dragOffset.current.x)), Math.min(maxY, Math.max(0, event.clientY - parent.top - dragOffset.current.y)));
  };
  return (
    <article ref={windowRef} onPointerDown={onFocus} className={`absolute overflow-hidden border bg-[#061012]/98 shadow-[0_24px_90px_rgba(0,0,0,0.72)] backdrop-blur-md ${active ? "border-teal-100/35" : "border-white/15"}`} style={mobile ? { inset: 12, zIndex: state.z } : { left: state.x, top: state.y, width: "min(42rem, calc(100% - 2rem))", height: "min(27rem, calc(100% - 2rem))", zIndex: state.z }}>
      <div onPointerDown={startDrag} onPointerMove={drag} className={`flex h-11 touch-none select-none items-center justify-between border-b px-3 ${mobile ? "cursor-default" : "cursor-move"} ${active ? "border-teal-100/25 bg-teal-100/[0.04]" : "border-white/10"}`}>
        <div className="flex items-center gap-3"><span className="grid h-6 w-7 place-items-center border border-white/10 text-[8px] font-bold text-teal-100">{app.code}</span><div><p className="text-[9px] uppercase tracking-[0.14em] text-zinc-200">{app.label}</p><p className="mt-0.5 text-[6px] uppercase tracking-[0.14em] text-zinc-600">{app.detail}</p></div></div>
        <div className="flex gap-1.5"><button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={onMinimize} title="Minimize" aria-label={`Minimize ${app.label}`} className="grid h-7 w-7 place-items-center border border-white/10 text-[11px] text-zinc-500 hover:border-teal-100/30 hover:text-teal-100">_</button><button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={onClose} title="Close" aria-label={`Close ${app.label}`} className="grid h-7 w-7 place-items-center border border-white/10 text-[10px] text-zinc-500 hover:border-red-300/30 hover:text-red-200">X</button></div>
      </div>
      <div className="h-[calc(100%_-_2.75rem)] overflow-auto">{children}</div>
    </article>
  );
}

function AppWindowContent({ app }: { app: DesktopApp }) {
  const messages: Record<string, string> = {
    terminal: "CORY OS v0.1 initialized. System shell online.",
    projects: "03 selected systems indexed and ready.",
    resume: "Experience and education records synchronized.",
    notes: "Personal workspace log connected.",
  };
  return <div className="flex h-full min-h-64 flex-col justify-between p-5 sm:p-7"><div><p className="text-[7px] uppercase tracking-[0.2em] text-teal-100/50">Module loaded</p><h2 className="mt-3 text-xl font-bold uppercase tracking-[0.12em] text-zinc-100">{app.label}</h2><p className="mt-3 max-w-md text-[11px] leading-5 text-zinc-400">{messages[app.id]}</p></div><div className="flex items-center gap-2 border-t border-white/10 pt-4 text-[7px] uppercase tracking-[0.16em] text-zinc-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />Window process active</div></div>;
}
