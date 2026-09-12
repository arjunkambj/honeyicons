# @honeyicons/react

SVG icons for React with TypeScript support, a 24-unit grid, and theme-aware colors.

```sh
npm install @honeyicons/react
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
Use `title` to give an icon an accessible name. Icons without a title are
decorative by default.

Linear is the default variant. Selected icons also support other variants;
check the component's `variants` property before choosing one. Stroke width
affects stroked geometry; filled outlines retain their original geometry.

Catalog data is available from `@honeyicons/react/catalog`.

The published package contains ESM JavaScript and TypeScript declarations.
Named icon imports support tree shaking; importing the catalog includes the
full collection.

To build or package from this repository, run `bun run build` or `bun pm pack`
inside `packages/react`. Packing builds the package automatically. The web app
and shared UI resolve the source through TypeScript paths during development.

See [NOTICE.md](./NOTICE.md) for third-party icon licenses and attribution,
and [MIGRATION.md](./MIGRATION.md) for renamed exports.
