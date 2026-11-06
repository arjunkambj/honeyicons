"""Helpers for deriving bold icons: rounded polylines, stroke outlines, and boolean ops on the 24-unit grid.

Needs skia-pathops and fonttools. See docs/icons/bold.md.

Example, for a folder with a plus knocked out of it:

    body = solid(FOLDER_PATH)
    print(bold_svg(minus(body, outline(to_path(PLUS_PATH)))))
"""
import math
import pathops
from fontTools.svgLib.path import parse_path
from fontTools.pens.transformPen import TransformPen
from fontTools.qu2cu import qu2cu

LINE = 1.8
SCALE = 64


def fmt(n):
    s = f"{round(n, 3):.3f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


def to_path(d, transform=None):
    p = pathops.Path()
    pen = p.getPen(glyphSet=None)
    if transform:
        pen = TransformPen(pen, transform)
    parse_path(d, pen)
    return p


def scaled(p, k):
    return p.transform(k, 0, 0, k, 0, 0)


def outline(p, width=LINE):
    """Outline of a stroke with round caps and joins. Done at 64x so curves stay smooth."""
    big = scaled(p, SCALE)
    big.stroke(width * SCALE, pathops.LineCap.ROUND_CAP, pathops.LineJoin.ROUND_JOIN, 4)
    big.convertConicsToQuads(tolerance=0.25)
    big = pathops.simplify(big, fix_winding=True)
    return scaled(big, 1 / SCALE)


def clean(p):
    big = scaled(p, SCALE)
    big.convertConicsToQuads(tolerance=0.25)
    return scaled(pathops.simplify(big, fix_winding=True), 1 / SCALE)


def union(*parts):
    acc = None
    for part in parts:
        acc = part if acc is None else pathops.op(acc, part, pathops.PathOp.UNION, fix_winding=True)
    return acc


def minus(a, *cuts):
    for cut in cuts:
        a = pathops.op(a, cut, pathops.PathOp.DIFFERENCE, fix_winding=True)
    return a


def solid(d, transform=None):
    """A closed centreline's filled form: its inside plus its stroke."""
    p = to_path(d, transform)
    return union(clean(p), outline(p))


def grown(p, by):
    return union(p, outline(p, by * 2))


def rounded_corners(p, r=0.9):
    """Rounds convex corners by shrinking then growing the shape."""
    shrunk = minus(p, outline(p, r * 2))
    return union(shrunk, outline(shrunk, r * 2))


def rounded(points, closed=False):
    """A path through (x, y, radius) points with exact tangent arcs at each corner."""
    n = len(points)
    def unit(a, b):
        dx, dy = b[0] - a[0], b[1] - a[1]
        h = math.hypot(dx, dy)
        return dx / h, dy / h
    out, first = [], None
    indices = range(n) if closed else range(1, n - 1)
    pieces = []
    for i in indices:
        prev, cur, nxt = points[(i - 1) % n], points[i], points[(i + 1) % n]
        r = cur[2] if len(cur) > 2 else 0
        ui, uo = unit(prev, cur), unit(cur, nxt)
        cross = ui[0] * uo[1] - ui[1] * uo[0]
        dot = ui[0] * uo[0] + ui[1] * uo[1]
        turn = math.atan2(abs(cross), dot)
        t = r * math.tan(turn / 2)
        a = (cur[0] - ui[0] * t, cur[1] - ui[1] * t)
        b = (cur[0] + uo[0] * t, cur[1] + uo[1] * t)
        pieces.append((a, b, r, 1 if cross > 0 else 0))
    if closed:
        d = f"M{fmt(pieces[0][1][0])} {fmt(pieces[0][1][1])}"
        for a, b, r, sweep in pieces[1:] + pieces[:1]:
            d += f"L{fmt(a[0])} {fmt(a[1])}"
            if r:
                d += f"A{fmt(r)} {fmt(r)} 0 0 {sweep} {fmt(b[0])} {fmt(b[1])}"
        return d + "Z"
    d = f"M{fmt(points[0][0])} {fmt(points[0][1])}"
    for a, b, r, sweep in pieces:
        d += f"L{fmt(a[0])} {fmt(a[1])}"
        if r:
            d += f"A{fmt(r)} {fmt(r)} 0 0 {sweep} {fmt(b[0])} {fmt(b[1])}"
    return d + f"L{fmt(points[-1][0])} {fmt(points[-1][1])}"


def to_d(p, max_err=0.008):
    """Path data for a filled outline, with runs of quadratics merged into cubics."""
    out, quads, cur = [], [], None
    def flush():
        nonlocal quads
        if not quads:
            return
        for curve in qu2cu.quadratic_to_curves(quads, max_err):
            letter = "C" if len(curve) == 4 else "Q"
            out.append(letter + " ".join(f"{fmt(x)} {fmt(y)}" for x, y in curve[1:]))
        quads = []
    for verb, pts in p:
        if verb == pathops.PathVerb.MOVE:
            flush(); cur = pts[0]; out.append(f"M{fmt(cur[0])} {fmt(cur[1])}")
        elif verb == pathops.PathVerb.LINE:
            # Boolean ops leave tiny joins; they only add noise.
            if math.hypot(pts[0][0] - cur[0], pts[0][1] - cur[1]) < 0.03:
                continue
            flush(); cur = pts[0]; out.append(f"L{fmt(cur[0])} {fmt(cur[1])}")
        elif verb == pathops.PathVerb.QUAD:
            quads.append([cur, pts[0], pts[1]]); cur = pts[1]
        elif verb == pathops.PathVerb.CUBIC:
            flush(); cur = pts[2]
            out.append("C" + " ".join(f"{fmt(x)} {fmt(y)}" for x, y in pts))
        elif verb == pathops.PathVerb.CLOSE:
            flush(); out.append("Z")
    flush()
    return "".join(out)


def centreline_d(d, transform):
    """Re-express path data after a transform, with curves kept as cubics."""
    out = []
    for verb, pts in to_path(d, transform):
        if verb == pathops.PathVerb.MOVE:
            out.append(f"M{fmt(pts[0][0])} {fmt(pts[0][1])}")
        elif verb == pathops.PathVerb.LINE:
            out.append(f"L{fmt(pts[0][0])} {fmt(pts[0][1])}")
        elif verb == pathops.PathVerb.QUAD:
            out.append("Q" + " ".join(f"{fmt(x)} {fmt(y)}" for x, y in pts))
        elif verb == pathops.PathVerb.CUBIC:
            out.append("C" + " ".join(f"{fmt(x)} {fmt(y)}" for x, y in pts))
        elif verb == pathops.PathVerb.CLOSE:
            out.append("Z")
    return "".join(out)


def linear_svg(nodes):
    body = "\n".join(f"  {n}" for n in nodes)
    return f'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">\n{body}\n</svg>\n'


def stroke_node(d):
    return f'<path d="{d}" stroke="currentColor" />'


def bold_svg(p):
    return f'<svg viewBox="0 0 24 24" fill="none">\n  <path d="{to_d(p)}" fill="currentColor" />\n</svg>\n'
