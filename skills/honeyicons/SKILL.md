---
name: honeyicons
description: Finds and uses icons from @honeyicons/react in React and TypeScript projects, looking up the live icon index online so icon names are never guessed. Use this whenever a project uses or asks for Honeyicons, when adding icons to buttons, menus, navigation, tabs, empty states, or forms in such a project, when choosing an icon for a concept ("which icon for settings?"), or when checking which Honeyicons exist, their variants, or the latest release.
metadata:
  package: "@honeyicons/react"
  repository: https://github.com/arjunkambj/honeyicons
---

# Honeyicons

`@honeyicons/react` ships a few hundred icons on a 24-unit grid with smooth, rounded geometry. Render them with `Icon` and a kebab-case name, such as `<Icon icon="bell" />` or `<Icon icon="chevron-down" />`. The set changes between releases, so a name that sounds plausible may not exist. Look names up in the live index before writing one. A wrong name fails the type check, or throws at runtime.

## 1. Find icons in the live index

Run the bundled finder from anywhere inside the consuming project. It walks up to find the installed package and compares against it:

```bash
node scripts/find-icon.mjs notification settings "user add"
```

The path is relative to the directory that contains this SKILL.md. Put queries before flags.

It fetches the icon index of the latest npm release and prints the kebab-case name (what `icon` takes), the component name, the category, the available variants, and the tags for each match. Pass several queries in one call to look up everything a task needs at once. A query can be a concept (`trash`), a kebab-case name (`arrow-down`), or a component name (`ArrowDown`). Lines marked `=` are exact matches.

| Need                                       | Flag                           |
| ------------------------------------------ | ------------------------------ |
| Only what the project can import right now | `--installed`                  |
| A pinned release                           | `--version <version>`          |
| Browse a category                          | `--list --category arrows`     |
| Unreleased icons on GitHub `main`          | `--github` or `--github=<ref>` |
| Machine-readable output                    | `--json`                       |

Categories are `actions`, `ai`, `arrows`, `brands`, `charts`, `chat`, `commerce`, `development`, `devices`, `editor`, `files`, `layout`, `maps`, `media`, `objects`, `security`, `settings`, `status`, `time`, `user`, and `weather`. A release lists only the categories it ships, so check with `--list --category <name>` against the version you use.

How to read the results:

- The **installed package decides what compiles**. If a match is flagged `NOT in installed version`, it exists in the latest release only. Either upgrade `@honeyicons/react` (see Upgrading) or pick an icon that is already installed.
- `--github` can list icons that are **not published to npm**. Never use those in a consumer project. Say they are coming in a future release.
- If nothing fits, say so and name the closest candidate. Don't hand-draw an inline SVG in its place. Point the user to https://github.com/arjunkambj/honeyicons/issues to request the icon.

If the script can't run (no Node or no shell), fetch the index directly. It is a JSON array of `{ name, export, category, variants, tags }`:

- Published: `https://cdn.jsdelivr.net/npm/@honeyicons/react@<version>/icons.json`
- Unreleased: `https://raw.githubusercontent.com/arjunkambj/honeyicons/main/packages/react/icons.json`

## 2. Install

Use the project's own package manager, for example `pnpm add @honeyicons/react`, `npm install @honeyicons/react`, or `bun add @honeyicons/react`. React 18 or later is required. Check the lockfile and the installed version before upgrading anything.

## 3. Use

```tsx
import { Icon } from "@honeyicons/react";

export function Toolbar() {
	return (
		<div className="flex items-center gap-2">
			<button type="button" aria-label="Notifications">
				<Icon icon="bell" size={20} />
			</button>
			<Icon icon="search" size={16} className="text-muted-foreground" />
			<button type="button" className="inline-flex items-center gap-1">
				Options <Icon icon="chevron-down" size={16} />
			</button>
		</div>
	);
}
```

| Prop          | Default        | Notes                                                                                                     |
| ------------- | -------------- | --------------------------------------------------------------------------------------------------------- |
| `icon`        | required       | The kebab-case `name` from the index, typed as `IconName`. Unknown names throw.                           |
| `size`        | `24`           | Number or CSS length (`"1em"` follows the font size). Sets width and height; don't pass `width`/`height`. |
| `color`       | `currentColor` | Prefer inheriting text color via `className` (`text-red-500`) over hard-coded colors.                     |
| `strokeWidth` | `1.8`          | Affects stroked icons only; filled-outline icons keep their baked weight.                                 |
| `variant`     | `"linear"`     | `"linear"` or `"bold"`. Every icon has both; any other variant throws.                                    |
| `title`       | none           | Gives the icon an accessible name (`role="img"`).                                                         |

Icons also accept `className`, `style`, event handlers, any other SVG props, and a `ref` to the `<svg>`.

Type props and data that hold an icon with `IconName`:

```tsx
import { Icon, type IconName } from "@honeyicons/react";

const nav: { label: string; href: string; icon: IconName }[] = [
	{ label: "Home", href: "/", icon: "home" },
	{ label: "Settings", href: "/settings", icon: "settings" },
];
// <Icon icon={item.icon} size={16} />
```

`@honeyicons/react/catalog` exports `catalog` (name, pascalName, category, tags, variants, component) for icon pickers and galleries.

`Icon` and the catalog include the full collection in the bundle. For fixed icons,
use named imports such as `import { Bell } from "@honeyicons/react"` and `<Bell />`
so bundlers can remove unused icons. Use `Icon` when the name is selected at runtime.

## 4. Best practices

- **Render with `Icon`.** Write `<Icon icon="bell" />` with the kebab-case name from the index. Type names as `IconName` instead of accepting any string.
- **Accessibility.** An icon without `title`, `aria-label`, or `aria-labelledby` is decorative and hidden from screen readers. That is right next to visible text. An icon-only button needs a name, and it belongs on the button (`<button aria-label="Close"><Icon icon="close" /></button>`), not on the icon. Add `title` only to a standalone icon that carries meaning.
- **Sizes.** The icons are drawn for 16px and 24px. Use 16 in dense UI, such as inline with text, table rows, and small buttons; 20 in standard buttons; and 24 for navigation and headers. Keep one size per context, and align with the text using `flex items-center` rather than nudging margins.
- **Color.** Let icons inherit `currentColor` from the text so themes, hover, and disabled states work for free.
- **Linear by default.** Use `bold` for a selected or active state, for example the current tab. Every icon has a bold version. Don't mix styles arbitrarily.
- **Pick by meaning and shape.** `chevron-down` is a disclosure caret, and `arrow-down` is an arrow with a shaft. `close` is the dismiss control, and `x` is the brand logo. `trash` deletes, and `archive` stores. Check the tags when two names seem close.
- **Keep geometry intact.** Don't restyle the paths, add outlines, or scale with CSS `transform` to fake weight. Filled-outline icons ignore `strokeWidth` by design.
- **Follow the project.** Match the existing wrappers and size conventions. Run the project's type check or build after adding icons. That check catches any name the lookup missed.

## Upgrading

Upgrading `@honeyicons/react` is fine when a needed icon exists only in a newer release. Use the project's package manager and update the lockfile. Then run the type check, because a release can rename icons. Keep the upgrade scoped to Honeyicons.
