import { HeroSection } from "./_components/hero-section";
import { SelectedSystems } from "./_components/selected-systems";
import { SiteHeader } from "./_components/site-header";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.13),transparent_38%),linear-gradient(180deg,rgba(5,5,6,0)_0%,#050506_80%)]" />
      <SiteHeader />
      <div className="relative z-10">
        <HeroSection />
        <SelectedSystems />
        <section
          id="experience"
          className="border-t border-white/10 px-5 py-20 sm:px-8 lg:px-10"
        >
          <div className="mx-auto max-w-7xl">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
              Experience layer coming next
            </p>
          </div>
        </section>
        <section
          id="cory-os"
          className="border-t border-white/10 px-5 py-20 sm:px-8 lg:px-10"
        >
          <div className="mx-auto max-w-7xl">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
              Cory OS layer coming next
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
