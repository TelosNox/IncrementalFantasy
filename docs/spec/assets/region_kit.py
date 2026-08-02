"""Building blocks, framework overlay and automated checks for region backdrops.

Reference: docs/spec/regionen-kulissen.md (leitmotifs, colour discipline, format)
and docs/spec/ui-layout.md ("Buehnen-Framework", geometry).

A region is a *recipe*: a palette plus an ordered list of block calls. No region
owns drawing code -- that is the point of the kit (spec section 7). Sky and
ground band are produced generically by `render()` from the palette, not per
region (spec section 7.3).

Coordinates in a recipe are *nominal box* pixels: (0, 0) is the top-left corner
of the 168x96 stage box. The bleed extends the usable range to x -28..196 and
y -32..96 (the box is flush with the canvas bottom, so there is no bottom bleed).
"""

import math
from dataclasses import dataclass
from typing import Callable, Sequence

from PIL import Image, ImageDraw

# --- Format (regionen-kulissen.md section 9) -------------------------------

NOMINAL_W, NOMINAL_H = 168, 96
BLEED_X, BLEED_TOP = 28, 32
CANVAS_W, CANVAS_H = NOMINAL_W + 2 * BLEED_X, NOMINAL_H + BLEED_TOP  # 224 x 128

SU_PER_PIXEL = 3  # 1 backdrop pixel = 3 su = 3 sprite pixels

# Framework lines in nominal-box pixels (su / 3, see ui-layout.md).
SKY_BAND_END = 72 // SU_PER_PIXEL        # 24 -- sky band ends here
GROUND_LINE = 192 // SU_PER_PIXEL        # 64 -- "G", top edge of the ground area
STAND_BACK = 228 / SU_PER_PIXEL          # 76.0 -- "B2"
STAND_FRONT = 268 / SU_PER_PIXEL         # 89.33 -- "B1"

# Slot centres in nominal-box pixels, for the check overlay (ui-layout.md).
PARTY_SLOTS = [(176, STAND_FRONT), (216, STAND_BACK), (56, STAND_FRONT), (96, STAND_BACK)]
ENEMY_SLOTS = [(328, STAND_FRONT), (368, STAND_BACK), (408, STAND_FRONT), (448, STAND_BACK)]
SPRITE_SU = 64
BOSS_SU = 128

# --- Colour ----------------------------------------------------------------


def _rgba(c) -> tuple:
    if isinstance(c, tuple):
        return c if len(c) == 4 else (*c, 255)
    c = c.lstrip('#')
    v = [int(c[i:i + 2], 16) for i in range(0, len(c), 2)]
    return (v[0], v[1], v[2], v[3] if len(v) > 3 else 255)


def _hex(rgba: tuple) -> str:
    return '#%02x%02x%02x' % rgba[:3]


def lighten(c, f: float) -> str:
    r, g, b, _ = _rgba(c)
    return _hex((round(r + (255 - r) * f), round(g + (255 - g) * f), round(b + (255 - b) * f), 255))


def darken(c, f: float) -> str:
    r, g, b, _ = _rgba(c)
    return _hex((round(r * (1 - f)), round(g * (1 - f)), round(b * (1 - f)), 255))


def mix(a, b, t: float) -> str:
    ar, ag, ab, _ = _rgba(a)
    br, bg, bb, _ = _rgba(b)
    return _hex((round(ar + (br - ar) * t), round(ag + (bg - ag) * t), round(ab + (bb - ab) * t), 255))


def alpha(c, a: int) -> tuple:
    r, g, b, _ = _rgba(c)
    return (r, g, b, a)


def luminance(rgba) -> float:
    r, g, b = rgba[0] / 255, rgba[1] / 255, rgba[2] / 255
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def chroma(rgba) -> float:
    """Colourfulness independent of brightness -- (max-min)/255."""
    return (max(rgba[:3]) - min(rgba[:3])) / 255


def hsv(rgba) -> tuple:
    r, g, b = rgba[0] / 255, rgba[1] / 255, rgba[2] / 255
    mx, mn = max(r, g, b), min(r, g, b)
    d = mx - mn
    if d == 0:
        h = 0.0
    elif mx == r:
        h = (60 * ((g - b) / d)) % 360
    elif mx == g:
        h = 60 * ((b - r) / d) + 120
    else:
        h = 60 * ((r - g) / d) + 240
    return (h, 0.0 if mx == 0 else d / mx, mx)


@dataclass(frozen=True)
class Palette:
    """Seven authored colours; every other tone is derived.

    The two brightness steps per surface (spec: "zwei Helligkeitsstufen je
    Flaeche") and the light-from-top-left rule are baked in here rather than
    left to each recipe -- that is what keeps 15 regions stylistically coherent.
    """

    sky_top: str
    sky_bottom: str
    far: str      # B0 distant silhouettes
    mid: str      # B1 motif mass (front face)
    accent: str   # Signaturfarbe
    ground: str   # B2 ground area
    light: str    # neutral warm white for lit windows (never a signal colour)

    @property
    def roles(self) -> dict:
        return {
            'sky_top': self.sky_top,
            'sky_bottom': self.sky_bottom,
            'far': self.far,
            'far_hi': lighten(self.far, 0.10),
            'far_lo': darken(self.far, 0.18),
            'mid': self.mid,
            'mid_top': lighten(self.mid, 0.16),   # light from top-left
            'mid_side': darken(self.mid, 0.18),   # right face away from the light
            'mid_hi': lighten(self.mid, 0.28),
            'mid_lo': darken(self.mid, 0.32),
            'accent': self.accent,
            'accent_top': lighten(self.accent, 0.16),
            'accent_side': darken(self.accent, 0.18),
            'accent_dim': mix(self.accent, self.mid, 0.55),
            'ground': self.ground,
            'ground_top': lighten(self.ground, 0.12),
            'ground_hi': lighten(self.ground, 0.07),
            'ground_lo': darken(self.ground, 0.22),
            'light': self.light,
            'light_dim': mix(self.light, self.mid, 0.3),
        }


# --- Canvas ----------------------------------------------------------------


class Backdrop:
    """Drawing surface in nominal-box coordinates."""

    def __init__(self, palette: Palette):
        self.pal = palette
        self._roles = palette.roles
        self.img = Image.new('RGBA', (CANVAS_W, CANVAS_H), _rgba(palette.sky_bottom))
        self.d = ImageDraw.Draw(self.img)

    # colour lookup: role name, hex string or rgba tuple
    def col(self, c) -> tuple:
        if isinstance(c, str) and c in self._roles:
            return _rgba(self._roles[c])
        return _rgba(c)

    def _paint(self, fn, c):
        rgba = self.col(c)
        if rgba[3] == 255:
            fn(self.d, rgba)
        else:  # keep translucent passes from stacking into hard edges
            layer = Image.new('RGBA', (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
            fn(ImageDraw.Draw(layer), rgba)
            self.img = Image.alpha_composite(self.img, layer)
            self.d = ImageDraw.Draw(self.img)

    @staticmethod
    def to_canvas(x, y) -> tuple:
        return (x + BLEED_X, y + BLEED_TOP)

    def rect(self, x, y, w, h, c):
        cx, cy = self.to_canvas(x, y)
        self._paint(lambda d, cc: d.rectangle([cx, cy, cx + w - 1, cy + h - 1], fill=cc), c)

    def poly(self, pts, c):
        p = [self.to_canvas(a, b) for a, b in pts]
        self._paint(lambda d, cc: d.polygon(p, fill=cc), c)

    def ellipse(self, cx, cy, rx, ry, c):
        ax, ay = self.to_canvas(cx, cy)
        self._paint(lambda d, cc: d.ellipse([ax - rx, ay - ry, ax + rx, ay + ry], fill=cc), c)

    def line(self, pts, c, width=1):
        p = [self.to_canvas(a, b) for a, b in pts]
        self._paint(lambda d, cc: d.line(p, fill=cc, width=width), c)

    def outline(self, x, y, w, h, c):
        cx, cy = self.to_canvas(x, y)
        self._paint(lambda d, cc: d.rectangle([cx, cy, cx + w - 1, cy + h - 1], outline=cc, width=1), c)


def rnd(seed: int, i: int = 0, j: int = 0) -> float:
    """Reproducible pseudo-noise -- no `random`, so output never drifts."""
    h = (seed * 73856093) ^ (i * 19349663) ^ (j * 83492791)
    h = (h ^ (h >> 13)) & 0xFFFFFFFF
    h = (h * 1274126177) & 0xFFFFFFFF
    return ((h >> 8) & 0xFFFF) / 0xFFFF


# --- Blocks ----------------------------------------------------------------
# Every block takes the Backdrop first and keeps its own style rules: iso tilt
# with the depth vector (+d, -d) like the sprite generator's `blk`, light from
# top-left (top face lighter, right face darker), two brightness steps.

ISO_DEPTH = 3


def _faces(bd: Backdrop, color, top=None, side=None):
    """Resolve front/top/right tones for a mass in `color`."""
    if isinstance(color, str) and color in bd._roles and color + '_top' in bd._roles:
        return (bd._roles[color], bd._roles[color + '_top'], bd._roles[color + '_side'])
    base = _hex(bd.col(color))
    return (base, top or lighten(base, 0.16), side or darken(base, 0.18))


def tower(bd: Backdrop, x, y, w, h, *, color='mid', depth=ISO_DEPTH, cap='flat', cap_h=None):
    """Rectangular mass: buildings, houses, stall bodies, facades.

    cap: 'flat' | 'gable' (pitched roof) | 'stepped' (receding slabs) | 'dome'.
    """
    front, top, side = _faces(bd, color)
    bd.rect(x, y, w, h, front)
    if depth:
        bd.poly([(x, y), (x + depth, y - depth), (x + w + depth, y - depth), (x + w, y)], top)
        bd.poly([(x + w, y), (x + w + depth, y - depth), (x + w + depth, y + h - depth), (x + w, y + h)], side)
    ch = cap_h if cap_h is not None else max(4, w // 4)
    if cap == 'gable':
        bd.poly([(x - 1, y), (x + w / 2, y - ch), (x + w + 1, y)], top)
        bd.poly([(x + w / 2, y - ch), (x + w + 1, y), (x + w + 1 + depth, y - depth)], side)
    elif cap == 'stepped':
        sx, sw, sy = x, w, y
        for _ in range(3):
            sx, sw = sx + sw * 0.14, sw * 0.72
            sh = max(2, ch // 2)
            sy -= sh
            bd.rect(round(sx), round(sy), round(sw), sh, front)
            bd.poly([(sx, sy), (sx + depth, sy - depth), (sx + sw + depth, sy - depth), (sx + sw, sy)], top)
    elif cap == 'dome':
        bd.ellipse(x + w / 2, y, w / 2, ch, front)
        bd.ellipse(x + w / 2 - depth * 0.6, y - ch * 0.35, w / 2.6, ch * 0.5, top)


def stack(bd: Backdrop, x, base_y, w, h, *, color='mid', lean=0, cap='flare', plume=0, seed=1):
    """Slim vertical shaft: chimneys, masts, pillars, a rocket (lean + 'nose').

    `lean` shifts the top sideways; `plume` adds soft puffs above the mouth
    (kept dim -- Kulissen-Leben lives in the sky band, spec section 10).
    """
    front, top, side = _faces(bd, color)
    top_y = base_y - h
    bd.poly([(x, base_y), (x + w, base_y), (x + w + lean, top_y), (x + lean, top_y)], front)
    bd.poly([(x + w, base_y), (x + w + lean, top_y), (x + w + lean + 1, top_y), (x + w + 1, base_y)], side)
    if cap == 'flare':
        bd.rect(round(x + lean - 1), top_y - 2, w + 3, 3, top)
    elif cap == 'cone':
        bd.poly([(x + lean - 1, top_y), (x + lean + w / 2, top_y - w), (x + lean + w + 1, top_y)], top)
    elif cap == 'nose':
        bd.poly([(x + lean, top_y), (x + lean + w / 2, top_y - w * 1.6), (x + lean + w, top_y)], top)
    for i in range(plume):
        px = x + lean + w / 2 + (rnd(seed, i) - 0.35) * 8 + i * 2
        py = top_y - 5 - i * 5
        bd.ellipse(px, py, 5 + i, 2.5 + i * 0.6, alpha(lighten(front, 0.45), 96 - i * 22))


def pipe_run(bd: Backdrop, x0, y0, x1, y1, *, color='mid', thick=3, supports=0, support_to=None):
    """Horizontal or vertical run: pipe bridges, rails, cables, elevator shafts."""
    front, top, side = _faces(bd, color)
    if abs(x1 - x0) >= abs(y1 - y0):
        bd.rect(round(x0), round(y0), round(x1 - x0), thick, front)
        bd.rect(round(x0), round(y0), round(x1 - x0), 1, top)
        bd.rect(round(x0), round(y0 + thick - 1), round(x1 - x0), 1, side)
    else:
        bd.rect(round(x0), round(y0), thick, round(y1 - y0), front)
        bd.rect(round(x0), round(y0), 1, round(y1 - y0), top)
        bd.rect(round(x0 + thick - 1), round(y0), 1, round(y1 - y0), side)
    if supports and support_to is not None:
        step = (x1 - x0) / supports
        for i in range(supports):
            sx = round(x0 + step * (i + 0.5))
            bd.rect(sx, round(y0 + thick), 2, round(support_to - y0 - thick), side)


def awning_row(bd: Backdrop, x, y, w, *, color='accent', alt='light_dim', bay=6, drop=3):
    """Striped awnings over market stalls / a parasol row."""
    n = max(1, int(w // bay))
    for i in range(n):
        c = color if i % 2 else alt
        bd.rect(x + i * bay, y, bay, drop, c)
        bd.poly([(x + i * bay, y + drop), (x + i * bay + bay, y + drop), (x + i * bay + bay / 2, y + drop + 2)], c)
    bd.rect(x, y - 1, n * bay, 1, 'mid_top')


def window_grid(bd: Backdrop, x, y, cols, rows, *, cell=5, size=2, lit=0.45,
                color='light', dark='mid_lo', seed=3):
    """Window pattern. Lit windows default to the palette's neutral warm white --
    never to a signal colour (spec section 4)."""
    for i in range(cols):
        for j in range(rows):
            on = rnd(seed, i, j) < lit
            bd.rect(x + i * cell, y + j * cell, size, size, color if on else dark)


def crag(bd: Backdrop, x, base_y, w, h, *, color='far', jag=3, seed=5):
    """Rock silhouette: ridges, plateaus, crater rims, hills."""
    front, top, _ = _faces(bd, color)
    steps = max(3, w // 6)
    pts = [(x, base_y)]
    for i in range(steps + 1):
        px = x + w * i / steps
        t = math.sin(math.pi * i / steps)
        py = base_y - h * (0.45 + 0.55 * t) + (rnd(seed, i) - 0.5) * jag
        pts.append((px, py))
    pts.append((x + w, base_y))
    bd.poly(pts, front)
    bd.line(pts[1:-1], top)


def foliage(bd: Backdrop, cx, base_y, w, h, *, color='mid', seed=7):
    """Clumped mass: trees, bushes, canopies, hanging roots."""
    front, top, _ = _faces(bd, color)
    bd.rect(round(cx - max(1, w // 12)), round(base_y - h * 0.3), max(1, w // 6), round(h * 0.3), _faces(bd, color)[2])
    for i in range(5):
        ox = (rnd(seed, i) - 0.5) * w * 0.7
        oy = (rnd(seed, i, 1) - 0.5) * h * 0.35
        bd.ellipse(cx + ox, base_y - h * 0.62 + oy, w * 0.32, h * 0.3, front)
    for i in range(3):
        ox = (rnd(seed, i, 2) - 0.7) * w * 0.5
        bd.ellipse(cx + ox, base_y - h * 0.78, w * 0.2, h * 0.16, top)


def sign(bd: Backdrop, x, y, w, h, *, frame='accent', fill='mid_lo', glyph=None,
         glyph_color=None, burn=0.0, seed=11):
    """Panel with frame and one simple glyph: neon signs, logos, signposts.

    `burn` blanks that fraction of the glyph -- the "half dead sign" gag without
    a region-specific drawing function.
    """
    gc = glyph_color or frame
    bd.rect(x, y, w, h, fill)
    bd.outline(x, y, w, h, frame)
    ix, iy, iw, ih = x + 2, y + 2, w - 4, h - 4
    if glyph == 'bars':
        n = max(1, (ih + 1) // 4)
        for i in range(n):
            if rnd(seed, i) < burn:
                continue
            bd.rect(ix, iy + i * 4, max(2, iw), 2, gc)
    elif glyph == 'wedge':
        if burn < 0.5:
            bd.poly([(ix + iw / 2, iy), (ix + iw, iy + ih / 2), (ix + iw / 2, iy + ih), (ix, iy + ih / 2)], gc)
    elif glyph == 'arrow':
        bd.rect(ix, iy + ih / 2 - 1, iw - 2, 2, gc)
        bd.poly([(ix + iw - 3, iy), (ix + iw, iy + ih / 2), (ix + iw - 3, iy + ih)], gc)
    elif glyph == 'monogram':
        # A corporate mark has to read as a *mark*. The previous 'logo' glyph was
        # two crossbars plus a centre post -- a sideways H, which on a high-rise
        # reads as a helipad (spec section 2, "what else could this be?"). A
        # letterform cannot be mistaken for infrastructure.
        sw = max(3, int(iw * 0.11))
        midx = ix + iw / 2
        vy = iy + ih * 0.72
        bd.rect(ix, iy, sw, ih, gc)
        bd.rect(ix + iw - sw, iy, sw, ih, gc)
        bd.poly([(ix + sw, iy), (ix + sw * 2, iy), (midx + sw / 2, vy), (midx - sw / 2, vy)], gc)
        bd.poly([(ix + iw - sw * 2, iy), (ix + iw - sw, iy), (midx + sw / 2, vy), (midx - sw / 2, vy)], gc)
    elif glyph == 'burst':
        bd.ellipse(ix + iw / 2, iy + ih / 2, iw / 3, ih / 3, gc)


def wheel(bd: Backdrop, cx, cy, r, *, spokes=6, color='mid', rim=None, angle=0.0):
    """Radial element: windmill, mine cart wheels, fans, gears."""
    front, top, _ = _faces(bd, color)
    bd.ellipse(cx, cy, r, r, rim or top)
    bd.ellipse(cx, cy, r - 1, r - 1, front)
    for i in range(spokes):
        a = angle + 2 * math.pi * i / spokes
        bd.line([(cx, cy), (cx + r * math.cos(a), cy + r * math.sin(a))], top)
    bd.ellipse(cx, cy, max(1, r // 5), max(1, r // 5), top)


def lamp_string(bd: Backdrop, x0, y0, x1, y1, *, n=10, color='light', sag=4, wire='mid_lo'):
    """Hanging light chain. Warm *white* by default, not amber -- the amber
    family belongs to Shock (spec section 4)."""
    pts = []
    for i in range(n + 1):
        t = i / n
        pts.append((x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + math.sin(math.pi * t) * sag))
    bd.line(pts, wire)
    for i, (px, py) in enumerate(pts):
        if i in (0, n):
            continue
        bd.rect(round(px), round(py), 2, 2, color)


# --- Interior blocks (Gasthaus, regionen-kulissen.md section 6a) -----------
# The inn is the first interior; these belong to the shared kit like everything
# above (spec section 7) so any future indoor scene can reuse them.

WINDOW_NOOK_INSET = 2  # glass rect = (x+inset, y+inset, w-2*inset, h-2*inset)


def bed(bd: Backdrop, x, base_y, w, h, *, color='mid', linen='light', head='left'):
    """Low sleeping mass: a headboard at one end, a blanket-topped mattress
    along the rest. `head` picks which end carries the headboard."""
    front, top, side = _faces(bd, color)
    hb_w = max(3, round(w * 0.16))
    mw = w - hb_w
    hx = x if head == 'left' else x + mw
    mx = x + hb_w if head == 'left' else x
    mh = max(2, round(h * 0.45))
    bd.rect(hx, base_y - h, hb_w, h, front)
    bd.rect(hx, base_y - h, hb_w, 1, top)
    bd.rect(mx, base_y - mh, mw, mh, front)
    bd.rect(mx, base_y - mh, mw, max(1, round(mh * 0.4)), linen)
    bd.rect(mx + mw - 1, base_y - mh, 1, mh, side)


def counter(bd: Backdrop, x, base_y, w, h, *, color='mid', overhang=2):
    """Waist-height bar counter: a body with a lighter slab top, wider than
    the body underneath it."""
    front, top, side = _faces(bd, color)
    bd.rect(x, base_y - h, w, h, front)
    bd.rect(x, base_y - h, w, 1, top)
    bd.rect(x + w - 1, base_y - h, 1, h, side)
    slab_h = max(2, round(h * 0.18))
    bd.rect(x - overhang, base_y - h - slab_h, w + overhang * 2, slab_h, top)


def hearth(bd: Backdrop, x, base_y, w, h, *, color='mid', ember='accent', ember_r=3, core=1.5):
    """Stone hearth with a dim ember glow -- the scene's one Kulissen-Leben
    element (spec section 10). The ember stays dark enough to clear the
    signal-colour lock (section 4): the check flags saturated *light points*,
    so keeping value low reads as embers, not as a Shock/HP cue, whatever the
    hue. `core_color` is deliberately not lightened -- a brighter highlight
    would risk crossing the check's V threshold."""
    front, top, side = _faces(bd, color)
    bd.rect(x, base_y - h, w, h, front)
    bd.rect(x, base_y - h, w, 1, top)
    mouth_w, mouth_h = round(w * 0.55), round(h * 0.6)
    mx, my = x + (w - mouth_w) // 2, base_y - mouth_h
    bd.rect(mx, my, mouth_w, mouth_h, side)
    glow(bd, mx + mouth_w / 2, my + mouth_h * 0.7, ember_r, color=ember, steps=3,
         core=core, core_color=ember)


def window_nook(bd: Backdrop, x, y, w, h, *, frame='mid_lo', sill='mid_top', glass='light', mullion=True):
    """Recessed window in an interior rear wall -- the inn's one window
    (spec section 6a). `glass` is only the fallback tone: at runtime the game
    tints this same rectangle with the current region's signature colour, a
    value the generator does not know (section 6a point 4) -- so the fallback
    must look right on its own, not just placeholder-right. The glass rect is
    `(x, y, w, h)` inset by `WINDOW_NOOK_INSET` on every side."""
    bd.rect(x, y, w, h, frame)
    bd.rect(x - 1, y + h, w + 2, 2, sill)
    i = WINDOW_NOOK_INSET
    gx, gy, gw, gh = x + i, y + i, w - 2 * i, h - 2 * i
    bd.rect(gx, gy, gw, gh, glass)
    if mullion:
        bd.rect(x + w // 2, gy, 1, gh, frame)
        bd.rect(gx, y + h // 2, gw, 1, frame)


def glow(bd: Backdrop, cx, cy, r, color='accent', *, steps=3, core=0, core_color=None):
    """Soft radial light. The only place where saturation is allowed to peak --
    keep it out of the locked hue families."""
    for i in range(steps, 0, -1):
        bd.ellipse(cx, cy, r * i / steps, r * i / steps * 0.92, alpha(bd.col(color), int(30 + 26 * (steps - i))))
    if core:
        bd.ellipse(cx, cy, core, core, color)
        bd.ellipse(cx, cy, max(1, core * 0.45), max(1, core * 0.45), core_color or lighten(_hex(bd.col(color)), 0.55))


def sky(bd: Backdrop, *, bands=24, stars=0, haze=True, seed=13):
    """Generic B0 wash from the palette -- gradient, optional stars, haze band."""
    for i in range(bands):
        y = -BLEED_TOP + i * (GROUND_LINE + BLEED_TOP) / bands
        h = math.ceil((GROUND_LINE + BLEED_TOP) / bands) + 1
        bd.rect(-BLEED_X, round(y), CANVAS_W, h, mix(bd.pal.sky_top, bd.pal.sky_bottom, i / max(1, bands - 1)))
    for i in range(stars):
        sx = -BLEED_X + rnd(seed, i) * CANVAS_W
        sy = -BLEED_TOP + rnd(seed, i, 1) * (SKY_BAND_END + BLEED_TOP - 2)
        bd.rect(round(sx), round(sy), 1, 1, alpha(bd.pal.light, 150))
    if haze:
        bd.rect(-BLEED_X, GROUND_LINE - 14, CANVAS_W, 14, alpha(bd.pal.sky_bottom, 60))


def ground_texture(bd: Backdrop, *, seed=17, speckle=0.05, edge=True, band=None):
    """The B2 ground area -- generic from palette + texture, identical rules for
    every region (spec section 7.3). Never a motif: no pattern crosses the
    stand lines, only low-contrast grain."""
    top = band or 'ground'
    bd.rect(-BLEED_X, GROUND_LINE, CANVAS_W, NOMINAL_H - GROUND_LINE, top)
    if edge:
        bd.rect(-BLEED_X, GROUND_LINE, CANVAS_W, 1, 'ground_top')
        bd.rect(-BLEED_X, GROUND_LINE + 1, CANVAS_W, 1, 'ground_hi')
    # depth: the ground darkens slightly towards the viewer (front of stage)
    bd.rect(-BLEED_X, NOMINAL_H - 8, CANVAS_W, 8, alpha(bd.col('ground_lo'), 90))
    for x in range(-BLEED_X, NOMINAL_W + BLEED_X):
        for y in range(GROUND_LINE + 2, NOMINAL_H):
            if rnd(seed, x, y) < speckle:
                bd.rect(x, y, 1, 1, alpha(bd.col('ground_lo' if rnd(seed, y, x) < 0.5 else 'ground_hi'), 70))


# --- Region + rendering ----------------------------------------------------

Step = tuple[Callable, dict]


@dataclass
class Region:
    key: str
    name: str
    palette: Palette
    sky: dict           # options for the generic sky pass
    recipe: Sequence[Step]   # ordered block calls: (block, kwargs)
    ground: dict = None      # options for the generic ground pass


def render(region: Region) -> Image.Image:
    bd = Backdrop(region.palette)
    sky(bd, **region.sky)
    for block, kwargs in region.recipe:
        block(bd, **kwargs)
    ground_texture(bd, **(region.ground or {}))
    return bd.img


# --- Check mode ------------------------------------------------------------


def overlay(img: Image.Image, scale=4) -> Image.Image:
    """Render with the framework lines drawn in (G, B2, B1, bleed, slots) so a
    violation is visible before the asset is taken over."""
    out = img.convert('RGBA').resize((img.width * scale, img.height * scale), Image.NEAREST)
    d = ImageDraw.Draw(out, 'RGBA')

    def X(x):
        return (x + BLEED_X) * scale

    def Y(y):
        return (y + BLEED_TOP) * scale

    d.rectangle([X(0), Y(-BLEED_TOP), X(NOMINAL_W) - 1, Y(NOMINAL_H) - 1], outline=(255, 255, 255, 120))
    d.rectangle([X(0), Y(0), X(NOMINAL_W) - 1, Y(NOMINAL_H) - 1], outline=(255, 255, 255, 220), width=2)
    for y, label, c in ((SKY_BAND_END, 'sky/figure', (120, 200, 255, 200)),
                        (GROUND_LINE, 'G', (255, 255, 255, 230)),
                        (STAND_BACK, 'B2', (120, 255, 160, 230)),
                        (STAND_FRONT, 'B1', (255, 180, 80, 230))):
        d.line([(0, Y(y)), (out.width, Y(y))], fill=c, width=1)
        d.text((4, Y(y) + 2), label, fill=c)
    for slots, c in ((PARTY_SLOTS, (120, 200, 255, 150)), (ENEMY_SLOTS, (255, 140, 140, 150))):
        for sx_su, sy_px in slots:
            sx = sx_su / SU_PER_PIXEL
            w = SPRITE_SU / SU_PER_PIXEL
            d.rectangle([X(sx - w / 2), Y(sy_px - w), X(sx + w / 2), Y(sy_px)], outline=c)
    bw = BOSS_SU / SU_PER_PIXEL  # solo boss, centred in the enemy zone on B2
    d.rectangle([X(388 / SU_PER_PIXEL - bw / 2), Y(STAND_BACK - bw),
                 X(388 / SU_PER_PIXEL + bw / 2), Y(STAND_BACK)], outline=(255, 90, 90, 190))
    return out


# --- Automated counter-check (spec sections 4 and 5) ------------------------

# Locked hue families (regionen-kulissen.md section 4). Gold/amber = Shock,
# cyan = player control / focus target, warm red = "hit next".
LOCKED_HUES = (('gold/amber', 30, 68), ('cyan', 160, 205), ('warm red', 350, 360), ('warm red', 0, 22))
SIGNAL_S, SIGNAL_V = 0.35, 0.60   # what counts as a *saturated light* pixel
SIGNAL_MAX_BLOB = 90              # larger, calmer areas are not "punktuell"

FIGURE_TOP = 33                   # boss head height -- above this nothing stands
BRIGHT_L = 0.60                   # "helle Flaeche" behind a sprite silhouette
BRIGHT_SHARE_MAX = 0.12
CHROMA_MEAN_MAX = 0.16   # colourfulness, (max-min)/255 -- HSV S is useless here,
CHROMA_SHARE_MAX = 0.04  # it reads near-black blue-greys as highly saturated
CHROMA_STRONG = 0.42
GROUND_STEP_MAX = 0.12            # max luminance step along a stand line
GROUND_STD_MAX = 0.075
BAND_MARGIN = 0.015               # sky > figure > ground, by at least this much
BLEED_FOCAL_S, BLEED_FOCAL_L, BLEED_FOCAL_BLOB = 0.35, 0.50, 6


def _pixels(img):
    return img.convert('RGBA').load()


def _blobs(mask, w, h, max_size=None):
    """Connected components (4-neighbourhood) of a set of (x, y) pixels."""
    seen, out = set(), []
    for p in mask:
        if p in seen:
            continue
        stack_, comp = [p], []
        seen.add(p)
        while stack_:
            x, y = stack_.pop()
            comp.append((x, y))
            for q in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if q in mask and q not in seen:
                    seen.add(q)
                    stack_.append(q)
        if max_size is None or len(comp) <= max_size:
            out.append(comp)
    return out


def _nominal_box():
    return range(BLEED_X, BLEED_X + NOMINAL_W), range(BLEED_TOP, CANVAS_H)


def check(img: Image.Image) -> list:
    """Return a list of findings; empty means the backdrop passes."""
    px = _pixels(img)
    bad = []
    if (img.width, img.height) != (CANVAS_W, CANVAS_H):
        bad.append(f'canvas is {img.width}x{img.height}, expected {CANVAS_W}x{CANVAS_H}')
        return bad
    xs, ys = _nominal_box()
    if any(px[x, y][3] != 255 for x in range(img.width) for y in range(img.height)):
        bad.append('backdrop has transparent pixels -- the stage would show through')

    # 1) signal-colour lock: punctual saturated light in a locked hue family
    mask = set()
    for x in range(img.width):
        for y in range(img.height):
            h, s, v = hsv(px[x, y])
            if s >= SIGNAL_S and v >= SIGNAL_V and any(lo <= h <= hi for _, lo, hi in LOCKED_HUES):
                mask.add((x, y))
    for comp in _blobs(mask, img.width, img.height, max_size=SIGNAL_MAX_BLOB):
        x, y = comp[0]
        h, _, _ = hsv(px[x, y])
        fam = next(n for n, lo, hi in LOCKED_HUES if lo <= h <= hi)
        bad.append(f'locked signal colour ({fam}) as a light point of {len(comp)} px '
                   f'at ({x - BLEED_X},{y - BLEED_TOP}) {_hex(px[x, y])}')

    # 2) contrast budget: brightness rises upwards
    def band_mean(y0, y1):
        vals = [luminance(px[x, y]) for x in xs for y in range(BLEED_TOP + y0, BLEED_TOP + y1)]
        return sum(vals) / len(vals)

    l_sky, l_fig, l_ground = band_mean(-BLEED_TOP, SKY_BAND_END), band_mean(SKY_BAND_END, GROUND_LINE), band_mean(GROUND_LINE, NOMINAL_H)
    if not l_sky > l_fig + BAND_MARGIN:
        bad.append(f'sky band is not brighter than the figure band ({l_sky:.3f} vs {l_fig:.3f})')
    if not l_fig > l_ground + BAND_MARGIN:
        bad.append(f'figure band is not brighter than the ground band ({l_fig:.3f} vs {l_ground:.3f})')

    # 3) no bright surfaces behind a sprite silhouette
    zone = [(x, y) for x in xs for y in range(BLEED_TOP + FIGURE_TOP, BLEED_TOP + GROUND_LINE)]
    bright = sum(1 for p in zone if luminance(px[p]) > BRIGHT_L)
    if bright / len(zone) > BRIGHT_SHARE_MAX:
        bad.append(f'{bright / len(zone):.1%} of the sprite zone is brighter than {BRIGHT_L} '
                   f'(limit {BRIGHT_SHARE_MAX:.0%}) -- silhouettes will be eaten')

    # 4) saturation belongs to the figures
    chromas = [chroma(px[x, y]) for x in xs for y in ys]
    mean_c = sum(chromas) / len(chromas)
    share_c = sum(1 for c in chromas if c > CHROMA_STRONG) / len(chromas)
    if mean_c > CHROMA_MEAN_MAX:
        bad.append(f'mean chroma {mean_c:.2f} exceeds {CHROMA_MEAN_MAX}')
    if share_c > CHROMA_SHARE_MAX:
        bad.append(f'{share_c:.1%} of the box is strongly coloured (limit {CHROMA_SHARE_MAX:.0%})')

    # 5) the ground is an area, not a motif: walkable across both stand lines
    for name, line_y in (('B2', STAND_BACK), ('B1', STAND_FRONT)):
        y = BLEED_TOP + int(round(line_y))
        row = [luminance(px[x, y]) for x in xs]
        step = max(abs(row[i + 1] - row[i]) for i in range(len(row) - 1))
        if step > GROUND_STEP_MAX:
            bad.append(f'stand line {name} crosses a hard edge (max step {step:.3f} > {GROUND_STEP_MAX})')
    gvals = [luminance(px[x, y]) for x in xs for y in range(BLEED_TOP + GROUND_LINE, CANVAS_H)]
    gm = sum(gvals) / len(gvals)
    std = (sum((v - gm) ** 2 for v in gvals) / len(gvals)) ** 0.5
    if std > GROUND_STD_MAX:
        bad.append(f'ground band is too busy (luminance std {std:.3f} > {GROUND_STD_MAX})')

    # 6) bleed carries no focal motif
    bleed = set()
    for x in list(range(0, BLEED_X)) + list(range(BLEED_X + NOMINAL_W, CANVAS_W)):
        for y in range(CANVAS_H):
            h, s, v = hsv(px[x, y])
            if s >= BLEED_FOCAL_S and luminance(px[x, y]) >= BLEED_FOCAL_L:
                bleed.add((x, y))
    for y in range(0, BLEED_TOP):
        for x in range(CANVAS_W):
            h, s, v = hsv(px[x, y])
            if s >= BLEED_FOCAL_S and luminance(px[x, y]) >= BLEED_FOCAL_L:
                bleed.add((x, y))
    for comp in _blobs(bleed, img.width, img.height):
        if len(comp) >= BLEED_FOCAL_BLOB:
            x, y = comp[0]
            bad.append(f'focal motif in the bleed: {len(comp)} px at ({x - BLEED_X},{y - BLEED_TOP})')
    return bad


def report(img: Image.Image) -> dict:
    """Numbers behind the checks -- useful while tuning a palette."""
    px = _pixels(img)
    xs, ys = _nominal_box()

    def band_mean(y0, y1):
        vals = [luminance(px[x, y]) for x in xs for y in range(BLEED_TOP + y0, BLEED_TOP + y1)]
        return sum(vals) / len(vals)

    chromas = [chroma(px[x, y]) for x in xs for y in ys]
    zone = [(x, y) for x in xs for y in range(BLEED_TOP + FIGURE_TOP, BLEED_TOP + GROUND_LINE)]
    return {
        'L_sky': round(band_mean(-BLEED_TOP, SKY_BAND_END), 3),
        'L_figure': round(band_mean(SKY_BAND_END, GROUND_LINE), 3),
        'L_ground': round(band_mean(GROUND_LINE, NOMINAL_H), 3),
        'C_mean': round(sum(chromas) / len(chromas), 3),
        'bright_zone': round(sum(1 for p in zone if luminance(px[p]) > BRIGHT_L) / len(zone), 3),
    }
