import { selectedProjects } from "../_data/projects";

export function SelectedSystems() {
  return (
    <section id="systems" className="border-t border-white/10 px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-6 lg:grid-cols-[0.7fr_1fr]">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
            Selected Systems
          </p>
          <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Early proof points for practical tools, expressive interfaces, and
            product-minded engineering.
          </h2>
        </div>

        <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 lg:grid-cols-3">
          {selectedProjects.map((project, index) => (
            <article
              key={project.name}
              className="group flex min-h-[340px] flex-col justify-between bg-[#070708] p-6 transition duration-300 hover:bg-[#101113] sm:p-8"
            >
              <div>
                <div className="mb-10 flex items-center justify-between font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{project.eyebrow}</span>
                </div>
                <h3 className="text-3xl font-semibold tracking-tight text-white">
                  {project.name}
                </h3>
                <p className="mt-5 max-w-sm leading-7 text-zinc-400">
                  {project.summary}
                </p>
              </div>

              <div>
                <div className="mb-7 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="border border-white/10 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-zinc-400"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white"
                >
                  View System
                  <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">
                    -&gt;
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
