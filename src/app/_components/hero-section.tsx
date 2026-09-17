import { HeroVisual } from "./hero-visual";

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative grid min-h-screen items-center gap-12 px-5 pb-20 pt-28 sm:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.78fr)] lg:px-10 lg:pb-24 lg:pt-24"
    >
      <div className="mx-auto w-full max-w-7xl lg:contents">
        <div className="flex min-h-[620px] flex-col justify-between lg:min-h-[720px]">
          <div>
            <div className="mb-14 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-zinc-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-50" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
              </span>
              Available for opportunities
            </div>
            <p className="mb-5 font-mono text-sm uppercase tracking-[0.24em] text-zinc-500">
              Software Developer
            </p>
            <h1 className="max-w-4xl text-[clamp(4.5rem,17vw,12.6rem)] font-black uppercase leading-[0.78] text-white">
              Cory
              <span className="block text-zinc-500">Kim.</span>
            </h1>
          </div>

          <div className="mt-12 max-w-2xl">
            <p className="text-xl leading-8 text-zinc-300 sm:text-2xl sm:leading-9">
              I build interactive applications, AI-powered tools, and
              full-stack experiences with a cinematic product sense.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#systems"
                className="group inline-flex h-12 items-center justify-center border border-white bg-white px-6 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-black transition duration-300 hover:bg-zinc-200"
              >
                Explore Systems
                <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">
                  -&gt;
                </span>
              </a>
              <a
                href="/resume.pdf"
                className="inline-flex h-12 items-center justify-center border border-white/15 px-6 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:border-white/40 hover:bg-white/8"
              >
                Resume
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-xl lg:max-w-none">
          <HeroVisual />
        </div>
      </div>

      <a
        href="#systems"
        className="absolute bottom-8 left-5 hidden items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500 transition hover:text-white sm:left-8 lg:flex"
      >
        Scroll to explore
        <span className="scroll-cue inline-block">↓</span>
      </a>
    </section>
  );
}
