# @honeyicons/react

SVG icons for React with TypeScript support, a 24-unit grid, and theme-aware colors.

Inspired by [Hugeicons](https://hugeicons.com) and
[Solar Icons](https://github.com/480-Design/Solar-Icon-Set), with smooth curves
and rounded corners. See [NOTICE.md](./NOTICE.md) for source attribution and licenses.

## Set up with your coding agent

Give your coding agent this prompt:

```
Read https://github.com/arjunkambj/honeyicons/blob/main/docs/setup.md and set up @honeyicons/react in this project.
```

Or install the package yourself:

```sh
pnpm add @honeyicons/react
```

## Usage

```tsx
import { Icon } from "@honeyicons/react";

export function Toolbar() {
	return (
		<nav>
			<Icon icon="home" />
			<Icon icon="moon" variant="bold" size={20} />
			<Icon icon="search" strokeWidth={1.5} color="gray" title="Search" />
		</nav>
	);
}
```

`icon` accepts the kebab-case icon names, typed as `IconName`, so editors
autocomplete them and typos fail type checking. Unknown names throw at runtime.
`variant` only accepts the variants that icon provides. `Icon` includes the full
collection in your bundle.

For fixed icons, named imports let bundlers remove unused icons:

```tsx
import { Bell, Search } from "@honeyicons/react";

<Bell size={20} />
<Search size={16} />
```

Requires React 18 or later. Icons accept SVG props, `size` (default `24`),
`color` (default `currentColor`), and `strokeWidth` (default `1.8`).
Use `title`, `aria-label`, or `aria-labelledby` to give an icon an accessible
name. Icons without a name are decorative by default. Explicit `role` and
`aria-hidden` props override these defaults.

For an icon-only button, put the accessible name on the button:

```tsx
import { Icon } from "@honeyicons/react";

export function NotificationsButton() {
	return (
		<button type="button" aria-label="Notifications">
			<Icon icon="bell" size={20} />
		</button>
	);
}
```

Use `className` and `style` for styling, and `size` for both dimensions (numbers
or CSS lengths such as `"1em"`). Icons inherit the surrounding text color and
forward `ref` to the SVG element. Standard SVG props, event handlers, and
children such as `<desc>` are supported.

Icons come in `linear` and `bold`. Each icon defaults to its first variant:
`linear`, or `bold` for icons drawn only in bold, such as most brand logos.
Passing a variant the icon does not have throws. Stroke width affects stroked
geometry; filled outlines retain their original geometry.

To type your own props, import `IconName`, `IconProps`, and `IconVariantMap`
from `@honeyicons/react`. `@honeyicons/react/icons.json` lists each icon's name,
export, category, variants, and tags, and `@honeyicons/react/catalog` exports the
same data with components for icon pickers.

To draw your own icon with the same props, pass its SVG elements to `createIcon`:

```tsx
import { createIcon } from "@honeyicons/react";

export const Divider = createIcon("Divider", {
	linear: [["path", { d: "M4 12h16", stroke: "currentColor" }]],
});
```

## Upgrading to 0.0.5

- The low-level `Icon iconNode={...}` API is replaced by `Icon icon="name"`.
  Use `createIcon` for custom SVG nodes.
- Deprecated icon aliases have been removed. Use the canonical exports listed
  in `icons.json`.
- Only `linear` and `bold` are supported. Unsupported variants throw instead of
  substituting another style. Unused `secondaryColor` and `secondaryOpacity`
  props have been removed.
- Shapes are now in `objects`, and spinners are in `status`.

## Agent skill

Coding agents such as Claude Code, Codex, and Cursor can install the Honeyicons
skill. It looks up real icon names in the published icon index and covers usage
and best practices:

```sh
npx skills add arjunkambj/honeyicons
```

## Development

The published package contains ESM JavaScript and TypeScript declarations.

To build or package from this repository, run `pnpm run build` or `pnpm pack`
inside `packages/react`. Packing builds the package automatically. The web app
and shared UI resolve the source through TypeScript paths during development.

See [NOTICE.md](./NOTICE.md) for third-party icon licenses and attribution.
