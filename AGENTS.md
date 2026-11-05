# Project instructions

- Do not write tests unless the user explicitly asks for them.
- Write idiomatic TypeScript and follow the existing project conventions.
- Use `@honeyicons/react` for app and shared UI icons. Do not add Hugeicons dependencies or imports; map icons from generated or copied UI components to our existing exports.

## Branches, previews, and releases

- `preview` is the working branch. Commit there, or branch from it and open pull requests into `preview`. `main` only receives the release pull request from `preview`.
- Once a branch's pull request merges, delete the branch on GitHub and locally, and remove its worktree. `main` and `preview` stay.
- Deploy the site preview from `preview` with the local Cloudflare CLI: build the packages (`pnpm --filter @honeyicons/react --filter @honeyicons/ui build`), then `pnpm --filter web deploy:preview`. It uploads a version under the `preview` alias (https://preview-honeyicons.kambojarjunn78.workers.dev) without touching production. Production deploys stay manual with `pnpm --filter web deploy`.

### Releasing `@honeyicons/react`

A release is a merge of `preview` into `main`; `.github/workflows/publish.yml` does the rest. Publish only through it.

1. On `preview`, add the changelog entry in `apps/web/src/routes/changelog.tsx` under the next patch version. Leave `packages/react/package.json` alone: the workflow bumps the patch. For a minor or major release, set that version there yourself.
2. Open a pull request from `preview` into `main` and merge it with a merge commit, so the workflow can fast-forward `preview` afterwards.
3. The release is done when the Publish run on `main` is green, the `chore(react): release <version>` commit and `react-v<version>` tag exist, and npm lists the version as `latest`. npm can take a few minutes after the run to list it.
4. Pull `preview` before the next commit; the workflow pushed the version commit to it.

A merge that leaves `icons/`, `packages/react/`, and `scripts/build-icons.ts` unchanged publishes nothing. npm trusts the workflow through trusted publishing, so releases need no token or local npm login.

## Icons

`pnpm check:icons` is the gate. It renders every icon as shipped, measures it, and says what to fix, with numbers. `--help` lists its commands and `--rules` its limits. CI runs it on every push to `preview` and every pull request that touches icons, and a release stops if it fails.

`scripts/known-icon-issues.json` is the to-do list. `measured` holds what the check found in the existing set, `flagged` holds what a person saw, and `accepted` holds exceptions the user approved. The list only shrinks: entries leave when they're fixed, and new ones go in only when the user asks. Limits change the same way, followed by `--rebaseline`.

An icon is done when `pnpm check:icons <name>` says `ok` and it passes the **look test**: run `pnpm check:icons --look <name>` and open the sheet it writes, which shows the icon beside three neighbours from its category at real sizes on light and dark. It passes when a stranger could name each one and nothing jumps out in size, weight, or detail. When the user says **pass**, run the look test on the pending batch together and fix what it finds, changing only the icons in that batch.

Read before drawing:

- Bold, always: `docs/icons/bold.md`.
- Folder, file, user, slider, arrow, symbol, or `*-off` icons: `docs/icons/families.md`.
- Logos: `docs/icons/brands.md`.

### Add or redraw an icon

1. Search `icons/` by name and by shape. An existing icon stands unless the user asked for a replacement.
2. Choose the plainest drawing of the idea, the one a stranger names at 16px. Packs offer decorative and plain versions: a cart has wheels, a pin stands alone, a globe has no stand.
3. Draw it in `icons/linear/<category>/`. Use strokes with `stroke="currentColor"` on each node: the build sets the 1.8 width and round caps, and rejects paint on the root `<svg>`. A pasted SVG is a sketch to redraw: packs are drawn for their own line and size, so rescale it, re-space the insides, and drop details that don't fit.
4. Derive bold from that linear file.
5. Add tags in `icons/meta.json`, and the source and license in `packages/react/NOTICE.md`. A new category also needs a label and icon in `CATEGORY_DETAILS` in `apps/web/src/components/icons/constants.ts`.
6. Run `pnpm check:icons --fit <name>` to set the size and centre in both styles, then `pnpm generate:icons` and `pnpm check:icons <name>`. Repeat until it says `ok`. Generated files only ever change this way.
7. Run the look test.
8. Run the package build and type checks.

### Fix something on the to-do list

1. Run `pnpm check:icons --todo [rule]` and take one rule or one family at a time.
2. For `size` and `centre`, run `pnpm check:icons --fit <name>`, which changes both styles. For a family, check the whole family stays the same size. For anything else, apply the printed fix to the linear file, then derive bold again. A problem marked `bold` is only in the bold file, so derive that again first.
3. Run `pnpm generate:icons` and `pnpm check:icons <name>`. It reports `FIXED` for each solved problem, and `WORSE` if a listed problem grew. Run `pnpm check:icons --prune` to take them off the list, and delete any `flagged` note you resolved.
4. Run the look test against the rest of the family, then the package build and type checks.

### Drawing rules the check can't measure

- Sit straight horizontal and vertical lines on 3k ± 0.9 (2.1, 3.9, 5.1, 6.9 …) where the design allows, so one edge lands on a whole pixel at 16, 20, and 24px.
- Take frame corners from a nearby icon of the same shape, so they match. Change the curve itself: round joins alone don't smooth a corner.
- Join overlapping strokes into one path and union overlapping fills, so translucent colours render evenly.
- End inner lines inside their frames so round caps stay inside. Use native filled circles for solid dots.
- Remove stray segments, duplicated curves, and visible bumps.
