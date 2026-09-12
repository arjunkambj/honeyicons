# honeyicons

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Next.js, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Shared UI package** - shadcn/ui primitives live in `packages/ui`
- **Turborepo** - Optimized monorepo build system
- **Biome** - Linting and formatting

## Getting Started

First, install the dependencies:

```bash
bun install
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.

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

- Run checks: `bun run check`

## Project Structure

```
honeyicons/
├── icons/                 # SVG source (linear required; bold and duotone optional)
├── apps/
│   └── web/               # Gallery site (Next.js)
├── packages/
│   ├── react/             # @honeyicons/react
│   ├── ui/                # Site chrome (shadcn). not the icon library
│   └── config/
└── scripts/
    └── build-icons.ts     # svg → React components
```

Icons live in `icons/{linear,bold,duotone}/{category}/name.svg` (24×24). Linear is required. Bold and duotone can be added later at the same path. Category is the folder name. Optional tags go in `icons/meta.json`. Then:

```bash
bun run generate:icons
```

Use descriptive kebab-case names without imported numeric suffixes. Keep related
icons together with names such as `folder-add`, `volume-off`, and `chevron-down`.
Renamed icons can declare `aliases` in `icons/meta.json` to generate deprecated
React exports and retain search keywords without duplicating catalog entries.
See [the naming migration](packages/react/MIGRATION.md) for renamed exports and
the arrow-to-chevron migration.

Third-party icon sources and adaptation details are recorded in
[the React package notices](packages/react/NOTICE.md).

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run check-types`: Check TypeScript types across all apps
- `bun run generate:icons`: Generate `@honeyicons/react` components from SVGs
- `bun run check`: Run Biome formatting and linting
