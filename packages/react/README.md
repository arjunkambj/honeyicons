# @honeyicons/react

SVG icons for React with TypeScript support, a 24-unit grid, and theme-aware colors.

```sh
pnpm add @honeyicons/react
```

```tsx
import { Bell, Search } from "@honeyicons/react";

export function Toolbar() {
	return (
		<div>
			<Bell size={24} title="Notifications" />
			<Search size={16} color="currentColor" />
		</div>
	);
}
```

Requires React 18 or later. Icons accept SVG props, `size` (default `24`),
`color` (default `currentColor`), and `strokeWidth` (default `1.5`).
Use `title`, `aria-label`, or `aria-labelledby` to give an icon an accessible
name. Icons without a name are decorative by default. Explicit `role` and
`aria-hidden` props override these defaults.

For an icon-only button, put the accessible name on the button:

```tsx
import { Bell } from "@honeyicons/react";

export function NotificationsButton() {
	return (
		<button type="button" aria-label="Notifications">
			<Bell size={20} />
		</button>
	);
}
```

Use `className` and `style` for styling, and `size` for both dimensions (numbers
or CSS lengths such as `"1em"`). Icons inherit the surrounding text color and
forward `ref` to the SVG element. Standard SVG props, event handlers, and
children such as `<desc>` are supported.

Linear is the default variant. Selected icons also support other variants;
check the component's `variants` property before choosing one. Stroke width
affects stroked geometry; filled outlines retain their original geometry.
Unsupported variants fall back to linear.

Catalog data is available as the named `catalog` export from
`@honeyicons/react/catalog`. For reusable components, import the `HoneyIcon`
and `HoneyIconProps` types from `@honeyicons/react`.

The published package contains ESM JavaScript and TypeScript declarations.
Named icon imports support tree shaking; importing the catalog includes the
full collection.

To build or package from this repository, run `bun run build` or `bun pm pack`
inside `packages/react`. Packing builds the package automatically. The web app
and shared UI resolve the source through TypeScript paths during development.

See [NOTICE.md](./NOTICE.md) for third-party icon licenses and attribution,
and [MIGRATION.md](./MIGRATION.md) for renamed exports.
