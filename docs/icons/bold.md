# Bold icons

Each bold icon is the filled form of its own linear file and nothing else. To change a bold shape, change linear and derive bold again.

- Keep the linear silhouette and fill every enclosed region. Output one `currentColor` fill path.
- A linear line with fill on both sides becomes a 1.8 gap. Dividers, header lines, folds, stripes, lid edges, and slashes that meet the outer frame cut all the way through and split the fill into pieces. Floating details are knocked out with round caps.
- In stacked shapes the front stays whole, and the visible back piece stops 1.8 clear of it.
- Close a frame that's open only for a symbol, and fill it. A corner symbol uses one notch: the symbol's bounds plus 1.8, a 2-unit inner corner, and 0.9 rounding on the trimmed frame corners. `*-off` icons remove the slash plus 1.5 on each side, then add the slash back.
- Door brackets and trays around an arrow, as in `login`, `logout`, `download`, and `upload`, are frames. Close them with a chord between the end caps and fill them. The arrow stays whole, and the frame stops 1.8 clear of it with cut corners rounded 0.9.
- Line-only icons keep the linear file byte for byte. Letter counters, handle openings, and real holes, such as the life-buoy centre, stay open.
- Every piece stays at least 1.2 wide, with no spurs or bumps. If linear spacing causes one, fix linear first.

## Baking outlines with skia-pathops

`scripts/outline_kit.py` has the helpers and handles the first two points below. It needs a throwaway environment: `python3 -m venv <dir>`, then `<dir>/bin/pip install skia-pathops fonttools`. Keep `<dir>` outside the repo.

- Stroke at 64× scale, convert conics, then scale back. At normal scale the stroker emits coarse curves and rounded corners bulge.
- Add pieces one at a time with pairwise `pathops.op` and compare areas after each step. `OpBuilder` and a single combined `simplify` can drop holes or whole pieces.
- Cut stroke centrelines rather than eroding outlines. Subtract a cut that crosses edges cleanly rather than intersecting outlines that share an edge.
- Check the result against linear with a large raster diff. Pathops areas can report phantom regions.
