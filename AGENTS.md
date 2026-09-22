# Project instructions

- Do not write tests unless the user explicitly asks for them.
- Write idiomatic TypeScript and follow the existing project conventions.
- Use `@honeyicons/react` for app and shared UI icons. Do not add Hugeicons dependencies or imports; map icons from generated or copied UI components to our existing exports.
- Create linear icons by default; add other styles only when requested.

## Pasted SVG workflow

- Check for an existing icon by name and shape before adding an incoming SVG; skip duplicates unless a replacement is requested. Clean the markup, choose a descriptive name and category, add search tags in `icons/meta.json`, and retain required source attribution in `packages/react/NOTICE.md`.
- Remove pasted Markdown escapes, source classes, fixed dimensions, unused attributes, and redundant path segments that do not affect the visible shape. Preserve meaningful fill rules, cutouts, opacity, and transforms.
- Preserve supplied filled outlines as fills with `currentColor`. Do not convert them to strokes or add a second stroke.
- During intake, preserve supplied silhouettes and filled geometry. Apply a consistency pass when the user says **"pass"** or explicitly requests consistent design; individual requested fixes can be made immediately.
- During a requested consistency pass, apply the design standards below to the pending batch and review the icons together at 16px and 24px on light and dark backgrounds. Do not redesign unrelated icons.
- Edit source SVGs in `icons/<style>/<category>/`, then run `pnpm generate:icons` to update React components and the catalog. Do not hand-edit generated files. Run the package build and type checks after additions or geometry changes.

## Icon design standards

- Use `viewBox="0 0 24 24"`, `currentColor`, and clear geometry at both 16px and 24px. Preserve recognizable silhouettes and proportions unless a redesign is requested.
- Use a 1.8-unit stroke with round caps and joins: 1.2px at 16px and 1.8px at 24px. Avoid per-icon stroke weights and non-scaling strokes.
- Use Solar-style smooth corner curves, starting from a 2-unit radius for rectangular corners with optical adjustments. Change the actual curves; round joins alone do not produce smooth corners.
- Match perceived weight, padding, visual size, and optical centering. Keep details and gaps clear at 16px.
- For filled outlines, adjust the filled geometry when standardizing weight and rounding; stroke props cannot change their baked outline. Preserve cutouts and opacity.
- Remove stray segments, duplicated curves, and visible bumps. End internal lines inside their frames so rounded caps do not protrude. Use native filled circles for solid dots.
- Keep the file family gently rounded with slightly taller page proportions. Preserve recognizable brand geometry without forcing rounded corners onto logos.
- Use the supplied Solar filled outline in `icons/linear/files/folder.svg` as the folder-family base: preserve its sloping tab, smooth curves, cutout, and rounded dash. Use the supplied `folder-open` and `folder-with-files` geometry for those variants; keep the dash on the front folder in `folders`. Adapt small tree folders for legibility without reverting to the old tab shape.
- `FolderAdd` uses only its plus symbol inside the folder; omit the decorative dash. Keep miniature tree folders wider than they are tall, with a clear sloping tab and even border weight.
- `UserAdd`, `UserRemove`, `UserCheck`, and `UserX` use a filled circular head and closed rounded bust, with free-standing status symbols beside the head. Do not enclose these status symbols in circular badges.
- Reuse the existing curved arrowhead geometry in arrow-bearing icons, including cloud transfers and import/export. Scale the complete arrowhead and preserve the curved tip instead of substituting a sharp elbow or narrow chevron.

- Slider families use perpendicular bar handles with a 1.8-unit stroke and round caps and joins. Each handle joins its track on one side, with a clear gap on the opposite side. Do not use circular handles. Main variants have three tracks; Alt variants have two. Horizontal and vertical versions are rotations of the same geometry.
