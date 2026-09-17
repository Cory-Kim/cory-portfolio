export function HeroVisual() {
  return (
    <div className="relative min-h-[360px] overflow-hidden border border-white/12 bg-[#090b0d] shadow-2xl shadow-black/50 sm:min-h-[460px] lg:min-h-[620px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(250,250,250,0.16),transparent_28%),linear-gradient(140deg,rgba(255,255,255,0.09),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 hero-grid opacity-60" />
      <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-white/[0.03] shadow-[0_0_90px_rgba(255,255,255,0.12)] sm:h-72 sm:w-72">
        <div className="absolute inset-6 rounded-full border border-white/10" />
        <div className="absolute inset-14 rounded-full border border-white/8" />
      </div>
      <div className="absolute inset-x-8 top-8 flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-[0.18em] text-zinc-500">
        <span>Future WebGL Node</span>
        <span>v0.1</span>
      </div>
      <div className="absolute bottom-8 left-8 right-8">
        <div className="mb-4 h-px w-full bg-gradient-to-r from-white/0 via-white/30 to-white/0" />
        <div className="flex items-end justify-between gap-6">
          <p className="max-w-52 font-mono text-xs uppercase leading-5 tracking-[0.16em] text-zinc-400">
            Reserved space for the interactive system visualization.
          </p>
          <div className="h-16 w-16 border border-white/15 bg-white/[0.03]" />
        </div>
      </div>
    </div>
  );
}
