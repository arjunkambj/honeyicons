# Honeyicons

SVG icons for React. Every icon comes in `linear` and `bold`, drawn on a
24-unit grid with smooth curves and rounded corners, and follows the text color.
Browse them at [honeyicons.com](https://honeyicons.com).

Honeyicons is inspired by [Hugeicons](https://hugeicons.com) and
[Solar Icons](https://github.com/480-Design/Solar-Icon-Set).

## Use the icons

Give your coding agent this prompt:

```
Set up @honeyicons/react using https://honeyicons.com/setup.md
```

Or install the package yourself:

```bash
pnpm add @honeyicons/react
```

```tsx
import { Icon } from "@honeyicons/react";

<Icon icon="bell" />
<Icon icon="moon" variant="bold" size={20} />
```

The [package README](packages/react/README.md) covers every prop, brand
colors, accessibility, and custom icons.

## Agent skill

`skills/honeyicons` is an [Agent Skill](https://agentskills.io) that looks up
real icon names in the published icon index, so agents don't guess them.
Install it for Claude Code, Codex, Cursor, and other agents:

```bash
npx skills add arjunkambj/honeyicons
```

## Work on the repo

```bash
pnpm install
pnpm dev
```

The gallery site runs at [localhost:5173](http://localhost:5173). Before you
push, run:

```bash
pnpm generate:icons
pnpm lint
pnpm format:check
pnpm check-types
pnpm build
```

`pnpm check` fixes lint issues and formats the repo.

## Add an icon

1. Put the SVG in `icons/linear/<category>/<name>.svg` and its bold version in
   `icons/bold/<category>/<name>.svg`. The folder name is the category.
2. Add search tags in `icons/meta.json`.
3. Run `pnpm generate:icons` to write the React components and `icons.json`.
   Never edit those generated files by hand.

Use descriptive kebab-case names, such as `folder-add` or `volume-off`.
Renaming an icon renames its export. A new category also needs a label and icon
in `CATEGORY_DETAILS` in `apps/web/src/components/icons/constants.ts`.

The drawing rules for strokes, spacing, bold versions, and brand marks are in
[AGENTS.md](AGENTS.md). Credit for icons adapted from other sets goes in
[NOTICE.md](packages/react/NOTICE.md).

## Branches and releases

- Work happens on `preview`. Commit there, or open pull requests into it.
- To release, open a pull request from `preview` into `main`. Merging it
  publishes the next patch version of `@honeyicons/react` to npm. For a minor
  or major version, set it in `packages/react/package.json` on `preview` first.
- Delete each branch and its worktree once its pull request merges.
- Pushing to `preview` deploys the
  [preview site](https://honeyicons-preview.kambojarjunn78.workers.dev), and
  pushing to `main` deploys [honeyicons.com](https://honeyicons.com). Deploys run
  on GitHub Actions with [Alchemy](https://alchemy.run), and their settings live
  in Infisical.

## Project layout

```
honeyicons/
├── icons/          # SVG sources, linear and bold
├── apps/web/       # Gallery site (Vite, TanStack Router, Cloudflare)
├── packages/
│   ├── react/      # @honeyicons/react
│   ├── ui/         # Site components (shadcn), not the icon library
│   └── config/     # Shared TypeScript config
├── scripts/        # build-icons.ts turns the SVGs into React components
└── skills/         # Agent skill
```

## License

Honeyicons is released under the [MIT License](LICENSE). Icons adapted from
other sets keep their own licenses, listed in
[NOTICE.md](packages/react/NOTICE.md).
