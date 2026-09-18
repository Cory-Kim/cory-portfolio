type Station = {
  id: string;
  label: string;
  index: string;
  detail: string;
  position: string;
  motif: "servers" | "timeline" | "robot" | "door" | "dish" | "workstation";
};

const stations: Station[] = [
  {
    id: "works",
    label: "WORKS",
    index: "01",
    detail: "03 systems",
    position: "left-[9%] top-[22%]",
    motif: "servers",
  },
  {
    id: "experience",
    label: "EXPERIENCE",
    index: "02",
    detail: "timeline",
    position: "right-[11%] top-[20%]",
    motif: "timeline",
  },
  {
    id: "skills",
    label: "SKILLS",
    index: "03",
    detail: "toolchain",
    position: "left-[17%] bottom-[23%]",
    motif: "robot",
  },
  {
    id: "about",
    label: "ABOUT",
    index: "04",
    detail: "identity",
    position: "right-[18%] bottom-[25%]",
    motif: "door",
  },
  {
    id: "contact",
    label: "CONTACT",
    index: "05",
    detail: "signal",
    position: "left-[42%] top-[9%]",
    motif: "dish",
  },
  {
    id: "cory-os",
    label: "CORY OS",
    index: "06",
    detail: "workspace",
    position: "left-[44%] bottom-[10%]",
    motif: "workstation",
  },
];

const socials = [
  { label: "GitHub", href: "https://github.com/cdokyung" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/cory-kim-dev/" },
  { label: "Email", href: "mailto:cdokyung@gmail.com" },
];

export function SystemMap() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030506] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(45,212,191,0.14),transparent_32%),radial-gradient(circle_at_20%_18%,rgba(148,163,184,0.1),transparent_24%),linear-gradient(180deg,rgba(3,5,6,0)_0%,#030506_92%)]" />
      <div className="pointer-events-none absolute inset-0 system-grid opacity-55" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#030506] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#030506] to-transparent" />

      <section className="relative z-10 flex min-h-screen flex-col px-5 py-5 sm:px-8 lg:px-10">
        <header className="flex items-start justify-between gap-6">
          <a
            href="#system-map"
            className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-teal-100"
          >
            CORY // SYSTEM
          </a>
          <div className="flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-400">
            <span className="relative h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
            Available for opportunities
          </div>
        </header>

        <div
          id="system-map"
          className="relative mx-auto flex w-full max-w-7xl flex-1 items-center justify-center py-10"
        >
          <IntroPanel />
          <SystemSurface />
          <CoreNode />
          {stations.map((station) => (
            <StationNode
              key={station.id}
              station={station}
            />
          ))}
          <MobileStationDock />
        </div>

        <footer className="grid gap-4 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <p>Vancouver, BC</p>
          <p className="text-center text-teal-100/80">
            Drag to explore • Click a system
          </p>
          <nav className="flex gap-5 sm:justify-end">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="transition-colors hover:text-teal-100"
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noreferrer" : undefined}
              >
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
    <div className="absolute left-0 top-6 z-20 max-w-[18rem]">
      <p className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-zinc-500">
        Software Developer
      </p>
      <h1 className="text-4xl font-black uppercase leading-none tracking-normal text-white sm:text-5xl">
        Cory Kim
      </h1>
      <p className="mt-4 max-w-60 text-sm leading-6 text-zinc-400">
        Building interactive applications, AI tools, and full-stack product
        systems.
      </p>
    </div>
  );
}

function SystemSurface() {
  return (
    <div className="relative h-[min(68vh,680px)] min-h-[520px] w-full max-w-6xl overflow-hidden">
      <div className="system-plane absolute left-1/2 top-1/2 h-[40rem] w-[64rem] border border-teal-200/10 bg-teal-200/[0.015] shadow-[0_0_120px_rgba(20,184,166,0.08)]" />
      <svg
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Circuit paths connecting portfolio systems to the core"
        viewBox="0 0 1200 720"
        preserveAspectRatio="none"
      >
        <g
          fill="none"
          stroke="rgba(45, 212, 191, 0.46)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path d="M600 360 L230 205 L145 205" />
          <path d="M600 360 L945 190 L1065 190" />
          <path d="M600 360 L290 545 L205 545" />
          <path d="M600 360 L920 530 L1015 530" />
          <path d="M600 360 L575 115 L535 98" />
          <path d="M600 360 L620 610 L585 652" />
        </g>
        <g fill="rgba(94, 234, 212, 0.9)">
          <circle cx="230" cy="205" r="4" />
          <circle cx="945" cy="190" r="4" />
          <circle cx="290" cy="545" r="4" />
          <circle cx="920" cy="530" r="4" />
          <circle cx="575" cy="115" r="4" />
          <circle cx="620" cy="610" r="4" />
        </g>
      </svg>
    </div>
  );
}

function MobileStationDock() {
  return (
    <div className="absolute inset-x-0 bottom-3 z-30 grid grid-cols-2 gap-2 lg:hidden">
      {stations.map((station) => (
        <div
          key={station.id}
          className="border border-teal-100/12 bg-[#071011]/80 px-3 py-2 font-mono uppercase backdrop-blur"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[0.62rem] font-semibold tracking-[0.16em] text-teal-50">
              {station.label}
            </span>
            <span className="text-[0.56rem] tracking-[0.14em] text-teal-200/50">
              {station.index}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function CoreNode() {
  return (
    <div className="absolute left-1/2 top-1/2 z-20 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-teal-100/25 bg-[#061212]/80 shadow-[0_0_80px_rgba(45,212,191,0.28)] backdrop-blur">
      <div className="absolute inset-4 rounded-full border border-teal-100/10" />
      <div className="absolute inset-9 rounded-full border border-teal-100/15 bg-teal-200/[0.03]" />
      <div className="relative text-center">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-teal-100/60">
          Central
        </p>
        <p className="mt-1 font-mono text-xl font-semibold uppercase tracking-[0.16em] text-teal-50">
          Core
        </p>
      </div>
    </div>
  );
}

function StationNode({ station }: { station: Station }) {
  return (
    <article
      className={`absolute z-30 hidden w-36 -translate-x-1/2 -translate-y-1/2 lg:block ${station.position}`}
    >
      <div className="station-shell relative h-32 border border-teal-100/18 bg-[#071011]/88 p-3 shadow-[0_22px_60px_rgba(0,0,0,0.36),0_0_30px_rgba(45,212,191,0.1)] backdrop-blur">
        <Motif type={station.motif} />
      </div>
      <div className="mt-3 flex items-start justify-between gap-3 font-mono uppercase">
        <div>
          <h2 className="text-xs font-semibold tracking-[0.18em] text-teal-50">
            {station.label}
          </h2>
          <p className="mt-1 text-[0.58rem] tracking-[0.14em] text-zinc-500">
            {station.detail}
          </p>
        </div>
        <span className="text-[0.6rem] tracking-[0.16em] text-teal-200/60">
          {station.index}
        </span>
      </div>
    </article>
  );
}

function Motif({ type }: { type: Station["motif"] }) {
  if (type === "servers") {
    return (
      <div className="flex h-full items-end justify-center gap-2">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-20 w-7 border border-teal-100/20 bg-teal-100/[0.04] p-1"
          >
            <span className="mb-2 block h-1 w-full bg-teal-200/70" />
            <span className="mb-1 block h-1 w-3 bg-white/25" />
            <span className="block h-1 w-4 bg-white/15" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "timeline") {
    return (
      <div className="grid h-full place-items-center">
        <div className="relative h-20 w-24 border-l border-teal-200/50">
          {[0, 1, 2].map((item) => (
            <span
              key={item}
              className="absolute left-0 h-px w-20 bg-teal-100/25"
              style={{ top: `${item * 34 + 5}px` }}
            >
              <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full border border-teal-100/50 bg-[#071011]" />
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (type === "robot") {
    return (
      <div className="relative h-full">
        <div className="absolute left-8 top-4 h-8 w-12 border border-teal-100/25 bg-teal-100/[0.04]" />
        <div className="absolute left-12 top-12 h-8 w-px rotate-45 bg-teal-100/40" />
        <div className="absolute bottom-6 right-6 h-9 w-9 rounded-full border border-teal-100/30" />
        <div className="absolute bottom-2 right-2 h-px w-16 -rotate-12 bg-teal-100/25" />
      </div>
    );
  }

  if (type === "door") {
    return (
      <div className="grid h-full place-items-center">
        <div className="relative h-20 w-14 border border-teal-100/25 bg-teal-100/[0.03]">
          <div className="absolute inset-x-3 top-3 h-10 border border-white/10" />
          <span className="absolute right-2 top-10 h-1.5 w-1.5 rounded-full bg-teal-200" />
        </div>
      </div>
    );
  }

  if (type === "dish") {
    return (
      <div className="relative h-full">
        <div className="absolute bottom-7 left-10 h-12 w-12 rounded-full border border-teal-100/30 border-l-transparent border-t-transparent" />
        <div className="absolute bottom-4 left-16 h-11 w-px -rotate-24 bg-teal-100/35" />
        <div className="absolute left-16 top-5 h-14 w-14 rounded-full border border-teal-100/15" />
        <div className="absolute left-12 top-9 h-8 w-8 rounded-full border border-teal-100/20" />
      </div>
    );
  }

  return (
    <div className="grid h-full place-items-center">
      <div className="relative h-16 w-24 border border-teal-100/25 bg-teal-100/[0.03]">
        <div className="absolute inset-2 border border-white/10 bg-black/30" />
        <div className="absolute -bottom-5 left-1/2 h-5 w-px -translate-x-1/2 bg-teal-100/30" />
        <div className="absolute -bottom-6 left-8 h-px w-8 bg-teal-100/30" />
      </div>
    </div>
  );
}
