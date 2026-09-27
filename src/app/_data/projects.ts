export type Project = {
  name: string;
  href: string;
  eyebrow: string;
  summary: string;
  stack: string[];
};

export const selectedProjects: Project[] = [
  {
    name: "Reloqen",
    href: "https://play.google.com/store/apps/details?id=com.reloqen.app",
    eyebrow: "Native Android service workflow",
    summary:
      "A customizable repair and service management app for customer records, job workflows, receipts, backups, and lifetime Pro upgrades.",
    stack: ["Kotlin", "Jetpack Compose", "Room", "Hilt"],
  },
  {
    name: "Explain This",
    href: "https://holy-pond-5fb7.cdokyung.workers.dev/",
    eyebrow: "AI learning tool",
    summary:
      "A focused explainer experience for turning dense concepts into clear, approachable breakdowns.",
    stack: ["AI", "Cloudflare Workers", "UX"],
  },
  {
    name: "Soundtrack My Space",
    href: "https://soundtrack-my-space.cdokyung.workers.dev/",
    eyebrow: "Interactive recommendation app",
    summary:
      "A mood-forward tool that connects rooms, atmosphere, and music into a playful recommendation flow.",
    stack: ["React", "Audio", "Product thinking"],
  },
  {
    name: "Pizza Delivery",
    href: "https://pizza-app-eight.vercel.app/",
    eyebrow: "Full-stack ordering flow",
    summary:
      "A polished ordering interface with the bones of a real delivery product: browsing, choosing, and checkout flow.",
    stack: ["Next.js", "Vercel", "Commerce"],
  },
];
