# honeyicons

A collection of SVG icons for React, with TypeScript support and theme-aware colors.

Honeyicons is inspired by [Hugeicons](https://hugeicons.com) and
[Solar Icons](https://github.com/480-Design/Solar-Icon-Set), with smooth curves,
rounded corners, and a shared 24-unit grid.

## Features

- **TypeScript** - For type safety and improved developer experience
- **React + TanStack Router** - Client-side SPA on Vite
- **Cloudflare Workers** - Static assets deployment via `@cloudflare/vite-plugin`
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Shared UI package** - shadcn/ui primitives live in `packages/ui`
- **Turborepo** - Optimized monorepo build system
- **Oxlint + Oxfmt** - Linting and formatting

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to see the web application.

## Set up with a coding agent

Give your coding agent this prompt:

```
Read https://github.com/arjunkambj/honeyicons/blob/main/docs/setup.md and set up @honeyicons/react in this project.
```

[docs/setup.md](docs/setup.md) walks the agent through installing the package and the
skill, rendering icons with `Icon`, and checking the result.

## Agent Skill

`skills/honeyicons` is an [Agent Skill](https://agentskills.io) for coding
agents. It looks up icons in the published icon index, so agents use real
icon names, and it covers usage and best practices for `@honeyicons/react`.

Install it with the [skills CLI](https://github.com/vercel-labs/skills) for
Claude Code, Codex, Cursor, and other agents:

```bash
npx skills add arjunkambj/honeyicons
```

The skill reads `icons.json`, which `pnpm generate:icons` writes to
`packages/react` and the package publishes. To search it directly, run
`node skills/honeyicons/scripts/find-icon.mjs bell settings`.

## UI Customization

React web apps in this stack share shadcn/ui primitives through `packages/ui`.

- Change design tokens and global styles in `packages/ui/src/styles/globals.css`
- Update shared primitives in `packages/ui/src/components/*`
- Adjust shadcn aliases or style config in `packages/ui/components.json` and `apps/web/components.json`

### Add more shared components

Run this from the project root to add more primitives to the shared UI package:

```bash
npx shadcn@latest add accordion dialog popover sheet table -c packages/ui
```

Import shared components like this:

```tsx
import { Button } from "@honeyicons/ui/components/button";
```

### Add app-specific blocks

If you want to add app-specific blocks instead of shared primitives, run the shadcn CLI from `apps/web`.

## Git Hooks and Formatting

- Run lint and format: `pnpm run check`

## Project Structure

```
honeyicons/
├── icons/                 # SVG source (linear, bold)
├── apps/
│   └── web/               # Gallery site (Vite + TanStack Router, Cloudflare)
├── packages/
│   ├── react/             # @honeyicons/react
│   ├── ui/                # Site chrome (shadcn). not the icon library
│   └── config/
└── scripts/
    └── build-icons.ts     # svg → React components
```

Icons live in `icons/{linear,bold}/{category}/name.svg` (24×24). An icon needs at least one variant. Category is the folder name. Optional tags go in `icons/meta.json`. Then:

```bash
pnpm run generate:icons
```

Use descriptive kebab-case names without imported numeric suffixes. Keep related
icons together with names such as `folder-add`, `volume-off`, and `chevron-down`.
Renaming an icon renames its export; no deprecated aliases are generated.

Third-party icon sources and adaptation details are recorded in
[the React package notices](packages/react/NOTICE.md).

## Available Scripts

- `pnpm run dev`: Start all applications in development mode
- `pnpm run build`: Build all applications
- `pnpm run dev:web`: Start only the web application
- `pnpm run check-types`: Check TypeScript types across all apps
- `pnpm run generate:icons`: Generate `@honeyicons/react` components from SVGs
- `pnpm run lint`: Lint the repo with Oxlint
- `pnpm run format`: Format the repo with Oxfmt
- `pnpm run format:check`: Check formatting without changing files
- `pnpm run check`: Auto-fix lint issues and format the repo
- `pnpm run deploy` from `apps/web`: Build and deploy the site to Cloudflare
