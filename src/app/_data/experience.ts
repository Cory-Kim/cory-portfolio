export type ExperienceEntry = {
  period: string;
  role: string;
  organization: string;
  type: string;
  summary: string;
  highlights: string[];
};

export const experienceEntries: ExperienceEntry[] = [
  {
    period: "JAN 2025 — PRESENT",
    role: "Freelance Software & AI Contributor",
    organization: "Outlier AI",
    type: "AI Evaluation",
    summary:
      "Reviewing and validating AI-generated outputs against project guidelines, quality standards, and technical specifications.",
    highlights: [
      "Evaluate responses for correctness, relevance, and adherence",
      "Identify quality issues and inconsistencies",
      "Maintain clear task records and feedback",
    ],
  },
  {
    period: "APR 2023 — PRESENT",
    role: "Math Teacher",
    organization: "Kumon Reading & Math Center",
    type: "Education",
    summary:
      "Supporting students and instructors through organized learning resources, clear communication, and thoughtful teaching strategies.",
    highlights: [
      "Organize course materials and learning resources",
      "Collaborate on effective teaching strategies",
      "Support student communication and engagement",
    ],
  },
  {
    period: "APR 2021 — MAR 2023",
    role: "Web Developer",
    organization: "Brave & Young Distributors Ltd",
    type: "E-commerce",
    summary:
      "Helped develop and maintain a food-distribution e-commerce platform alongside senior developers using React, Django, Python, SQL, and JavaScript.",
    highlights: [
      "Contributed to frontend and backend development",
      "Supported testing, reviews, and performance work",
      "Integrated payment, shipping, and inventory APIs",
    ],
  },
];

export const education = {
  school: "British Columbia Institute of Technology",
  program: "Computer Systems Technology Diploma",
  detail:
    "Algorithms, software development, databases, web development, and object-oriented programming.",
};

export const certifications = [
  "Google IT Automation with Python",
  "Google IT Support",
  "BCIT Computer Systems Certificate",
  "IBM Generative AI",
];
