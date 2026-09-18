export type Skill = {
  name: string;
  short: string;
  category: "Languages" | "Frontend" | "Backend" | "Data & Systems";
  color: string;
};

export const featuredSkills: Skill[] = [
  { name: "Python", short: "PY", category: "Languages", color: "#68d8ff" },
  { name: "JavaScript", short: "JS", category: "Languages", color: "#f7df5e" },
  { name: "TypeScript", short: "TS", category: "Languages", color: "#5aa9ff" },
  { name: "C++", short: "C++", category: "Languages", color: "#8bbcff" },
  { name: "React", short: "RE", category: "Frontend", color: "#63e6ff" },
  { name: "Next.js", short: "N", category: "Frontend", color: "#f4f4f5" },
  { name: "Node.js", short: "NO", category: "Backend", color: "#7fe38d" },
  { name: "Django", short: "DJ", category: "Backend", color: "#62d6ad" },
  { name: "Linux", short: "LX", category: "Data & Systems", color: "#f2c66d" },
  { name: "SQL", short: "SQL", category: "Data & Systems", color: "#9bc8ff" },
  { name: "MongoDB", short: "MG", category: "Data & Systems", color: "#69d985" },
  { name: "Git", short: "GIT", category: "Data & Systems", color: "#ff806d" },
];

export const supportingSkills = [
  "C",
  "C#",
  "Java",
  "Bash",
  "Perl",
  "Express",
  "REST APIs",
  "PHP",
  "Redux",
  "Flutter",
  "Sass",
  "Cloudflare Workers",
  "GitHub",
  "JIRA",
];
