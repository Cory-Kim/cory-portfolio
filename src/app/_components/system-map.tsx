"use client";

import dynamic from "next/dynamic";

const SystemScene = dynamic(
  () => import("./system-scene").then((module) => module.SystemScene),
  { ssr: false },
);

const socials = [
  { label: "GitHub", href: "https://github.com/cdokyung" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/cory-kim-dev/" },
  { label: "Email", href: "mailto:cdokyung@gmail.com" },
];

export function SystemMap() {
  return (
    <main className="relative h-[100svh] min-h-[38rem] overflow-hidden bg-[#030506] text-white">
      <SystemScene />
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_48%,transparent_20%,rgba(3,5,6,0.28)_68%,rgba(3,5,6,0.82)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-[#030506]/85 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-[#030506]/95 to-transparent" />

      <section className="pointer-events-none relative z-20 flex h-full flex-col px-5 py-5 sm:px-8 lg:px-10">
        <header className="flex items-start justify-between gap-6">
          <a href="#system-map" className="pointer-events-auto font-mono text-xs font-semibold uppercase tracking-[0.24em] text-teal-100">
            CORY // SYSTEM
          </a>
          <div className="flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-zinc-400 sm:text-[0.65rem]">
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
            <span className="hidden sm:inline">Available for opportunities</span>
            <span className="sm:hidden">Available</span>
          </div>
        </header>

        <div id="system-map" className="relative flex-1"><IntroPanel /></div>

        <footer className="grid gap-3 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-zinc-500 sm:grid-cols-[1fr_auto_1fr] sm:items-end sm:text-[0.65rem]">
          <p>Vancouver, BC</p>
          <p className="text-left text-teal-100/80 sm:text-center">Drag to explore • Click a system</p>
          <nav className="pointer-events-auto flex gap-4 sm:justify-end sm:gap-5">
            {socials.map((social) => (
              <a key={social.label} href={social.href} className="transition-colors hover:text-teal-100" target={social.href.startsWith("http") ? "_blank" : undefined} rel={social.href.startsWith("http") ? "noreferrer" : undefined}>
                {social.label}
              </a>
            ))}
          </nav>
        </footer>
      </section>
    </main>
  );
}

function IntroPanel() {
  return (
    <div className="absolute left-0 top-8 max-w-[15rem] sm:top-10 sm:max-w-[18rem] lg:top-12">
      <p className="mb-2 font-mono text-[0.58rem] uppercase tracking-[0.24em] text-zinc-500 sm:mb-3 sm:text-[0.65rem]">Software Developer</p>
      <h1 className="text-3xl font-black uppercase leading-none tracking-normal text-white sm:text-5xl">Cory Kim</h1>
      <p className="mt-3 max-w-60 text-xs leading-5 text-zinc-400 sm:mt-4 sm:text-sm sm:leading-6">Building interactive applications, AI tools, and full-stack product systems.</p>
    </div>
  );
}
