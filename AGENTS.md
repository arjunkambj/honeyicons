# Project instructions

- Do not write tests unless the user explicitly asks for them.
- Write idiomatic TypeScript and follow the existing project conventions.
- Use `@honeyicons/react` for app and shared UI icons. Do not add Hugeicons dependencies or imports; map icons from generated or copied UI components to our existing exports.
- Create every icon in linear and bold. Draw linear first, then derive bold from it by the rules in **Bold variants** below.

## Pasted SVG workflow

- Check for an existing icon by name and shape before adding an incoming SVG; skip duplicates unless a replacement is requested. Clean the markup, choose a descriptive name and category, add search tags in `icons/meta.json`, and retain required source attribution in `packages/react/NOTICE.md`.
- Remove pasted Markdown escapes, source classes, fixed dimensions, unused attributes, and redundant path segments that do not affect the visible shape. Preserve meaningful fill rules, cutouts, opacity, and transforms.
- Preserve supplied filled outlines as fills with `currentColor`. Do not convert them to strokes or add a second stroke.
- During intake, preserve supplied silhouettes and filled geometry. Apply a consistency pass when the user says **"pass"** or explicitly requests consistent design; individual requested fixes can be made immediately.
- During a requested consistency pass, apply the design standards below to the pending batch and review the icons together at 16px, 20px, and 24px on light and dark backgrounds, including 1× pixel renders. Do not redesign unrelated icons.
- Edit source SVGs in `icons/<style>/<category>/`, then run `pnpm generate:icons` to update React components and the catalog. Do not hand-edit generated files. A new category folder also needs a label and icon in `CATEGORY_DETAILS` in `apps/web/src/components/icons/constants.ts`. Run the package build and type checks after additions or geometry changes.

## Icon design standards

- Use `viewBox="0 0 24 24"`, `currentColor`, and clear geometry at both 16px and 24px. Preserve recognizable silhouettes and proportions unless a redesign is requested.
- Use a 1.8-unit stroke with round caps and joins: 1.2px at 16px, 1.5px at 20px, and 1.8px at 24px. Keep it at every size; do not add size-dependent stroke widths, per-icon stroke weights, or non-scaling strokes. A root `stroke-width` must be `1.8` or omitted; the build rejects other values.
- Keep outer edges within the 1.2 and 22.8 keylines, so stroke and filled icons share one live area; full-size frames center their stroke on 2.1 and 21.9. Center other horizontal and vertical strokes on 3k ± 0.9 (2.1, 3.9, 5.1, 6.9 …) where the design allows, so one edge lands on a whole pixel at 16px, 20px, and 24px.
- Leave at least 2.25 units of clear space between separate elements (1.5px at 16px). Solid dots use a radius of at least 1. When a design cannot fit these clearances, drop or merge details instead of tightening gaps.
- Use Solar-style smooth corner curves, starting from a 2-unit radius for rectangular corners with optical adjustments. Change the actual curves; round joins alone do not produce smooth corners.
- Match perceived weight, padding, visual size, and optical centering. Keep details and gaps clear at 16px.
- For filled outlines, adjust the filled geometry when standardizing weight and rounding; stroke props cannot change their baked outline. Preserve cutouts and opacity.
- Remove stray segments, duplicated curves, and visible bumps. End internal lines inside their frames so rounded caps do not protrude. Use native filled circles for solid dots.
- Do not let separate elements overlap. Join overlapping strokes into one path and union overlapping filled shapes so translucent colors render evenly without darker seams.
- Keep the file family gently rounded with slightly taller page proportions. Preserve recognizable brand geometry without forcing rounded corners onto logos.
- Use the supplied Solar filled outline in `icons/linear/files/folder.svg` as the folder-family base: preserve its sloping tab, smooth curves, cutout, and rounded dash. `folder-open` is the back folder with a tilted front flap that overhangs on the right and carries the dash; its flap edge joins the left side on the folder's own corner curve. Use the supplied `folder-with-files` geometry for that variant; keep the dash on the front folder in `folders`. Adapt small tree folders for legibility without reverting to the old tab shape.
- `FolderAdd` uses only its plus symbol inside the folder; omit the decorative dash. Keep miniature tree folders wider than they are tall, with a clear sloping tab and even border weight.
- The user family (`User`, `UserAdd`, `UserRemove`, `UserCheck`, `UserX`, `UserLock`, `UserSettings`, `UserGroup`) uses the ring head and deep closed bust from `icons/linear/user/user.svg`: a flat base, round shoulders, and a gentle top arch, as a 1.8-unit filled outline. Do not use a flat elliptical body. Status variants place the symbol in the bust's bottom-right corner: the figure shifts 3 units left, the linear bust ends at x = 12.9 with round caps (straight base, arch cap), and bold closes that opening into a flat side 1.8 clear of the symbol with 0.9 corners. Keep the head whole; do not enclose symbols in circular badges. `UserGroup` is two people: the user figure shifted 2.3 units left in front, and a 0.86-scale figure behind on the right, trimmed 1.8 clear with round caps (bold: the back pieces cut 1.8 clear, tips rounded 0.9).
- Build family variants from the base icon's existing geometry instead of new drawings. `*-off` variants cut a rounded gap through the base icon along a diagonal slash, leaving at least 1.5 units clear on each side of the slash; remove, lock, search, and check variants add the symbol to the unchanged base.
- Reuse the existing curved arrowhead geometry in arrow-bearing icons, including cloud transfers and import/export. Scale the complete arrowhead and preserve the curved tip instead of substituting a sharp elbow or narrow chevron.

- Slider families use perpendicular bar handles with a 1.8-unit stroke and round caps and joins. Each handle joins its track on one side, with a clear gap on the opposite side. Do not use circular handles. Main variants have three tracks; Alt variants have two. Horizontal and vertical versions are rotations of the same geometry.
- In a file with stroked nodes, give every filled node `stroke="none"`; otherwise it inherits the 1.8 root stroke and thickens.

## Bold variants

- Derive each bold icon only from its own linear file, in Solar's bold style. Keep the linear silhouette and fill every enclosed region.
- A linear line with fill on both sides becomes a 1.8-unit gap. Dividers, header lines, folds, stripes, lid edges, and slashes that meet the outer frame cut all the way through and split the fill into pieces. Knock out floating details with round caps. Never leave a thin bridge of frame across the end of a gap.
- Keep the front of stacked shapes whole, and trim the visible back piece 1.8 units clear of it.
- Close a frame that is open only for a symbol and fill it. Symbols in a corner use one notch: the symbol's bounds plus 1.8, a 2-unit inner corner, and 0.9-unit rounding on the trimmed frame corners. `*-off` variants remove the slash plus 1.5 units on each side, then add the slash back.
- Line-only icons keep the linear file byte-identical. Letter counters, handle openings, and real holes, such as the life-buoy centre, stay open.
- Leave no slivers or bridges under 1.2 units, islands under 0.8 square units, spurs, or bumps. When linear spacing causes one, fix linear first. Output a single `currentColor` fill path.
