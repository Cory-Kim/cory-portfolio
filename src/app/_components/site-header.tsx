const navItems = [
  { label: "Systems", href: "#systems" },
  { label: "Experience", href: "#experience" },
  { label: "Cory OS", href: "#cory-os" },
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050506]/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <a
          href="#top"
          className="font-mono text-sm font-semibold uppercase tracking-[0.22em] text-white"
        >
          CORY // SYSTEM
        </a>
        <nav className="hidden items-center gap-7 font-mono text-xs uppercase tracking-[0.18em] text-zinc-400 sm:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors duration-300 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
