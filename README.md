# Cory Kim Portfolio

[![CI](https://github.com/Cory-Kim/cory-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Cory-Kim/cory-portfolio/actions/workflows/ci.yml)

An interactive portfolio showcasing full-stack applications, AI-powered tools, mobile experiences, and creative web development.

The site is designed as a product experience rather than a static project list: motion, 3D elements, and focused project storytelling help visitors understand both the work and the engineering behind it.

## Highlights

- Interactive project presentation built with modern React patterns
- Real-time 3D scenes and WebGL effects
- Motion-driven transitions and interface feedback
- Responsive layouts for desktop and mobile
- Project case studies spanning web, mobile, AI, and local-first software
- Cloudflare deployment configuration through OpenNext

## Tech stack

| Area | Technologies |
| --- | --- |
| Framework | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| 3D | Three.js, React Three Fiber |
| Motion | GSAP, Framer Motion |
| Deployment | OpenNext, Cloudflare |

## Featured projects

- **Explain This** - A cross-platform AI app that turns photos into clear, adaptive explanations.
- **Soundtrack My Space** - An ambient sound mixer with layered audio controls, focus and sleep presets, and shareable sessions.
- **Recall** - A local-first desktop search application for finding information across personal files while keeping data on-device by default.

## Getting started

### Prerequisites

- Node.js 20 or newer
- npm

### Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production build

```bash
npm run build
npm start
```

### Quality checks

```bash
npm run check
```

The check covers linting, portfolio-data integrity, secure project links, and the production build.

## Project structure

```text
public/       Static assets and media
src/app/      Next.js application routes, components, and styles
```

## Design approach

The portfolio balances visual experimentation with clarity. Animation and 3D are used to support navigation and project storytelling, while responsive constraints keep the experience usable across screen sizes.

## Author

Built by [Cory Kim](https://github.com/Cory-Kim).
