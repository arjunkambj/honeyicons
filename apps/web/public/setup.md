# Set up Honeyicons

Steps for a coding agent adding `@honeyicons/react` to a React project.

## 1. Install the package

Use the package manager that matches the project's lockfile:

| Lockfile                  | Command                         |
| ------------------------- | ------------------------------- |
| `pnpm-lock.yaml`          | `pnpm add @honeyicons/react`    |
| `package-lock.json`       | `npm install @honeyicons/react` |
| `yarn.lock`               | `yarn add @honeyicons/react`    |
| `bun.lock` or `bun.lockb` | `bun add @honeyicons/react`     |

The package needs React 18 or later.

## 2. Install the Honeyicons skill

The skill looks up real icon names, so you never guess one. Install it for the
agent you are running as. For Codex, use the command below. `-y` skips the
prompts:

```bash
npx skills add arjunkambj/honeyicons -a codex -y
```

Every icon's name, variants, and tags are listed in the icon index at
`https://cdn.jsdelivr.net/npm/@honeyicons/react@latest/icons.json`.

## 3. Render icons

```tsx
import { Icon } from "@honeyicons/react";

export function Toolbar() {
	return (
		<div className="flex items-center gap-2">
			<button type="button" aria-label="Notifications">
				<Icon icon="bell" size={20} />
			</button>
			<Icon icon="moon" variant="bold" size={20} />
		</div>
	);
}
```

- `icon` takes an icon's kebab-case `name` from the index. TypeScript checks
  names and variants, and an unknown name throws.
- `variant` is `linear` (the default) or `bold`. Every icon has both.
- Type props that take an icon name with `IconName`.
- `Icon` includes the full collection in the bundle. For fixed icons, use
  named imports such as `import { Bell } from "@honeyicons/react"` and `<Bell />`
  so unused icons can be removed by the bundler.
- Use `size={16}` in dense UI, `20` in buttons, and `24` in navigation and
  headers.
- Icons use the current text color. Style them with `className` rather than
  hard-coded colors.
- Icons are decorative by default. Put `aria-label` on icon-only buttons, or
  give an icon a `title` when it must be read out on its own.
- If the project already uses another icon library, ask before replacing it.

## 4. Check the result

Run the project's type check or build. It fails on any icon name or variant
that doesn't exist.
