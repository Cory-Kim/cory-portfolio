"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { certifications, education, experienceEntries } from "../_data/experience";
import { selectedProjects } from "../_data/projects";

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

export function CoryOsDesktop({ onClose, onNavigate }: { onClose: () => void; onNavigate: (id: string | null) => void }) {
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
          return <DraggableWindow key={app.id} app={app} state={state} mobile={mobile} active={selectedApp === app.id} onFocus={() => focusWindow(app.id)} onMove={(x, y) => moveWindow(app.id, x, y)} onMinimize={() => minimizeWindow(app.id)} onClose={() => closeWindow(app.id)}><AppWindowContent app={app} onLaunch={focusWindow} onNavigate={onNavigate} onExit={onClose} /></DraggableWindow>;
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

function AppWindowContent({ app, onLaunch, onNavigate, onExit }: { app: DesktopApp; onLaunch: (id: string) => void; onNavigate: (id: string | null) => void; onExit: () => void }) {
  if (app.id === "terminal") return <TerminalContent onLaunch={onLaunch} onNavigate={onNavigate} onExit={onExit} />;
  if (app.id === "projects") return <ProjectsContent />;
  if (app.id === "resume") return <ResumeContent />;
  const messages: Record<string, string> = { notes: "Personal workspace log connected." };
  return <div className="flex h-full min-h-64 flex-col justify-between p-5 sm:p-7"><div><p className="text-[7px] uppercase tracking-[0.2em] text-teal-100/50">Module loaded</p><h2 className="mt-3 text-xl font-bold uppercase tracking-[0.12em] text-zinc-100">{app.label}</h2><p className="mt-3 max-w-md text-[11px] leading-5 text-zinc-400">{messages[app.id]}</p></div><div className="flex items-center gap-2 border-t border-white/10 pt-4 text-[7px] uppercase tracking-[0.16em] text-zinc-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />Window process active</div></div>;
}

function ProjectsContent() {
  return <div className="h-full overflow-y-auto p-4 sm:p-6"><div className="mb-4"><p className="text-[7px] uppercase tracking-[0.2em] text-teal-100/50">03 systems indexed</p><h2 className="mt-2 text-xl font-bold uppercase tracking-[0.12em] text-zinc-100">Selected work</h2></div><div className="space-y-2">{selectedProjects.map((project, index) => <a key={project.name} href={project.href} target="_blank" rel="noreferrer" className="group block border border-white/10 p-3 transition-colors hover:border-teal-100/35 hover:bg-teal-100/[0.04]"><div className="flex items-start justify-between gap-3"><span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-100">0{index + 1} {"//"} {project.name}</span><span className="text-teal-100/60">-&gt;</span></div><p className="mt-1 text-[8px] uppercase tracking-[0.12em] text-teal-200/55">{project.eyebrow}</p><p className="mt-2 text-[9px] leading-4 text-zinc-500">{project.summary}</p></a>)}</div></div>;
}

function ResumeContent() {
  return <div className="h-full overflow-y-auto p-4 sm:p-6"><div className="mb-5"><p className="text-[7px] uppercase tracking-[0.2em] text-teal-100/50">Identity record // CV</p><h2 className="mt-2 text-xl font-bold uppercase tracking-[0.12em] text-zinc-100">Cory Kim</h2><p className="mt-1 text-[9px] text-zinc-500">Software Developer // Vancouver, BC</p></div><section><p className="mb-2 text-[7px] uppercase tracking-[0.2em] text-teal-100/50">Experience</p><div className="space-y-3">{experienceEntries.map((entry) => <article key={entry.organization} className="border-l border-teal-100/25 pl-3"><p className="text-[8px] uppercase text-teal-200/60">{entry.period}</p><h3 className="mt-1 text-[10px] font-semibold text-zinc-100">{entry.role}</h3><p className="text-[8px] uppercase text-zinc-600">{entry.organization}</p><p className="mt-1 text-[9px] leading-4 text-zinc-500">{entry.summary}</p></article>)}</div></section><section className="mt-5 border-t border-white/10 pt-4"><p className="text-[7px] uppercase tracking-[0.2em] text-teal-100/50">Education</p><p className="mt-2 text-[10px] text-zinc-200">{education.school}</p><p className="text-[9px] text-zinc-500">{education.program}</p><div className="mt-3 flex flex-wrap gap-1.5">{certifications.map((certification) => <span key={certification} className="border border-white/10 px-2 py-1 text-[7px] text-zinc-500">{certification}</span>)}</div></section></div>;
}

type TerminalLine = { kind: "input" | "output" | "error"; text: string };

const terminalCommands = ["help", "about", "projects", "skills", "experience", "contact", "resume", "clear", "exit"];

function TerminalContent({ onLaunch, onNavigate, onExit }: { onLaunch: (id: string) => void; onNavigate: (id: string | null) => void; onExit: () => void }) {
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [lines, setLines] = useState<TerminalLine[]>([
    { kind: "output", text: "CORY OS v1.0" },
    { kind: "output", text: "System ready. Type 'help' to see available commands." },
    { kind: "output", text: "" },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  const runCommand = (rawCommand: string) => {
    const command = rawCommand.trim().toLowerCase();
    if (!command) return;
    setCommandHistory((current) => [command, ...current.filter((item) => item !== command)].slice(0, 20));
    setHistoryIndex(-1);
    setInput("");
    setLines((current) => [...current, { kind: "input", text: `cory@system:~$ ${command}` }]);

    if (command === "clear") {
      setLines([]);
      return;
    }
    if (command === "exit") {
      onExit();
      return;
    }
    if (command === "help") {
      setLines((current) => [...current, { kind: "output", text: "AVAILABLE COMMANDS" }, { kind: "output", text: "about       Who Cory is" }, { kind: "output", text: "projects    View selected work" }, { kind: "output", text: "skills      Explore the toolchain" }, { kind: "output", text: "experience  View work history" }, { kind: "output", text: "contact     Open contact channels" }, { kind: "output", text: "resume      Open the résumé" }, { kind: "output", text: "clear       Clear the terminal" }, { kind: "output", text: "exit        Return to the system map" }]);
      return;
    }
    const destinations: Record<string, string> = { projects: "projects", skills: "skills", experience: "experience", contact: "contact", about: "about" };
    if (destinations[command]) {
      setLines((current) => [...current, { kind: "output", text: `Opening ${command} module...` }]);
      window.setTimeout(() => {
        if (command === "projects") onLaunch("projects");
        else onNavigate(destinations[command]);
      }, 180);
      return;
    }
    if (command === "resume") {
      setLines((current) => [...current, { kind: "output", text: "Résumé module is ready in the desktop workspace." }]);
      window.setTimeout(() => onLaunch("resume"), 180);
      return;
    }
    const suggestion = terminalCommands.find((item) => item.startsWith(command.slice(0, 2)));
    setLines((current) => [...current, { kind: "error", text: suggestion ? `Command not found. Did you mean '${suggestion}'?` : `Command not found: '${command}'. Type 'help' for available commands.` }]);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") runCommand(input);
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const next = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(next);
      setInput(commandHistory[next] ?? "");
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = Math.max(historyIndex - 1, -1);
      setHistoryIndex(next);
      setInput(next === -1 ? "" : commandHistory[next]);
    }
  };

  return <div className="flex h-full flex-col bg-black/20 p-4 text-[10px] leading-5 sm:p-6 sm:text-[11px]" onClick={() => inputRef.current?.focus()}>
    <div className="min-h-0 flex-1 overflow-y-auto">
      {lines.map((line, index) => <p key={`${line.text}-${index}`} className={line.kind === "input" ? "text-teal-100" : line.kind === "error" ? "text-amber-200/80" : "text-zinc-400"}>{line.text || "\u00a0"}</p>)}
    </div>
    <div className="mt-4 border-t border-white/10 pt-3 text-teal-100"><span>cory@system:~$ </span><input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} autoFocus aria-label="Terminal command" className="w-[calc(100%-7.5rem)] bg-transparent text-teal-50 outline-none placeholder:text-zinc-700" placeholder="type a command" /></div>
    <div className="mt-3 flex flex-wrap gap-1.5">{terminalCommands.slice(0, 6).map((command) => <button key={command} type="button" onClick={() => runCommand(command)} className="border border-white/10 px-2 py-0.5 text-[8px] uppercase tracking-[0.1em] text-zinc-500 transition-colors hover:border-teal-100/30 hover:text-teal-100">{command}</button>)}</div>
  </div>;
}
