"""Region backdrops -- palettes and recipes only, no drawing code.

Every block lives in region_kit.py; a region is a palette plus an ordered list
of block calls (docs/spec/regionen-kulissen.md section 7). Leitmotifs, signature
colour and the one detail per region come from section 6 of that spec.

Usage:
    python generate_regions.py            render, check, write assets
    python generate_regions.py --check    additionally write the overlay images
    python generate_regions.py --report   print the contrast numbers
"""

import os
import sys

from PIL import Image

from pixel_io import save_png, upscale
from region_kit import (
    CANVAS_H, CANVAS_W, Palette, Region, WINDOW_NOOK_INSET, awning_row, bed,
    check, counter, foliage, glow, hearth, lamp_string, overlay, pipe_run,
    report, render, sign, stack, tower, wheel, window_grid, window_nook, crag,
)

# --- Chapter 1: "The Grid" -- cold artificial-light night, blue-grey base ----
# The gradient is brightest at the *top*: brightness rises upwards (spec
# section 5), so no bright horizon sits behind the figures.

REACTOR_ROW = Region(
    key='reactor_row',
    name='Reactor Row',
    palette=Palette(
        sky_top='#3a4d61', sky_bottom='#1c2731', far='#212d38', mid='#222d36',
        accent='#5fbf7a', ground='#171e24', light='#e9e2d2',
    ),
    sky=dict(stars=0, haze=True),
    recipe=[
        # B0 -- distant works, dim, continuing into the bleed
        (tower, dict(x=-30, y=44, w=28, h=22, color='far', depth=2)),
        (tower, dict(x=-6, y=38, w=16, h=28, color='far', depth=2)),
        (tower, dict(x=134, y=40, w=26, h=26, color='far', depth=2)),
        (tower, dict(x=162, y=46, w=34, h=20, color='far', depth=2)),
        (stack, dict(x=150, base_y=40, w=4, h=16, color='far', cap='flare')),
        # B1 -- the leitmotif: reactor dome with two stacks, left of centre.
        # The dome sits high on purpose: the focal point has to clear the figures
        # and their head HUD, and above y=33 nothing stands (spec section 3).
        (stack, dict(x=34, base_y=24, w=6, h=20, color='mid', plume=3, seed=2)),
        (stack, dict(x=70, base_y=24, w=5, h=24, color='mid', plume=2, seed=5)),
        (tower, dict(x=26, y=22, w=56, h=42, color='mid', cap='dome', cap_h=14)),
        (glow, dict(cx=54, cy=33, r=11, color='accent', core=3.5)),
        # flanking service blocks
        (tower, dict(x=-22, y=48, w=44, h=16, color='mid')),
        (window_grid, dict(x=-16, y=52, cols=7, rows=2, lit=0.35, seed=21)),
        (tower, dict(x=98, y=46, w=58, h=18, color='mid')),
        (window_grid, dict(x=104, y=50, cols=10, rows=2, lit=0.3, seed=22)),
        # the pipe walkway runs beneath the reactor and off into the bleed
        (pipe_run, dict(x0=-30, y0=56, x1=198, y1=56, thick=3, supports=8,
                        support_to=64, color='mid')),
    ],
    ground=dict(seed=17, speckle=0.05),
)

BARGAIN_BAZAAR = Region(
    key='bargain_bazaar',
    name='Bargain Bazaar',
    palette=Palette(
        sky_top='#5d4269', sky_bottom='#191322', far='#221a2b', mid='#2b1f33',
        accent='#d95a9c', ground='#1a1422', light='#f3ead9',
    ),
    sky=dict(stars=0, haze=True),
    recipe=[
        # B0 -- the alley: tall walls left and right, a lower run in between, so
        # the eye reads a gap rather than one flat facade
        (tower, dict(x=-32, y=4, w=48, h=60, color='far', depth=2)),
        (tower, dict(x=14, y=26, w=34, h=38, color='far', depth=2)),
        (tower, dict(x=46, y=34, w=44, h=30, color='far', depth=2)),
        (tower, dict(x=88, y=28, w=38, h=36, color='far', depth=2)),
        (tower, dict(x=124, y=8, w=44, h=56, color='far', depth=2)),
        (tower, dict(x=166, y=20, w=32, h=44, color='far', depth=2)),
        (window_grid, dict(x=-24, y=12, cols=7, rows=5, lit=0.3, seed=31)),
        (window_grid, dict(x=18, y=32, cols=5, rows=3, lit=0.25, seed=32)),
        (window_grid, dict(x=130, y=16, cols=6, rows=6, lit=0.28, seed=33)),
        (window_grid, dict(x=94, y=34, cols=5, rows=3, lit=0.22, seed=34)),
        # B1 -- the leitmotif: stalls under a canopy of neon. The one detail is
        # the tall sign on the left: half of it has burnt out.
        (sign, dict(x=4, y=14, w=12, h=34, frame='accent', glyph='bars', burn=0.45, seed=35)),
        (sign, dict(x=136, y=24, w=24, h=14, frame='accent', glyph='wedge')),
        (sign, dict(x=54, y=22, w=20, h=8, frame='accent_dim', glyph='bars', seed=36)),
        (lamp_string, dict(x0=-32, y0=34, x1=198, y1=34, n=20, sag=6)),
        (tower, dict(x=6, y=50, w=30, h=14, color='mid')),
        (awning_row, dict(x=4, y=48, w=34, bay=6, drop=4)),
        (tower, dict(x=62, y=52, w=28, h=12, color='mid')),
        (awning_row, dict(x=60, y=50, w=32, bay=8, drop=4)),
        (tower, dict(x=118, y=50, w=32, h=14, color='mid')),
        (awning_row, dict(x=116, y=48, w=36, bay=6, drop=4)),
    ],
    ground=dict(seed=23, speckle=0.06),
)

MEGACORP_TOWER = Region(
    key='megacorp_tower',
    name='MegaCorp Tower',
    palette=Palette(
        sky_top='#33495e', sky_bottom='#16202b', far='#1b2632', mid='#213040',
        accent='#4b7fd4', ground='#151d26', light='#e6eef6',
    ),
    sky=dict(stars=22, haze=True, seed=41),
    recipe=[
        # B0 -- neighbouring blocks, well below the tower
        (tower, dict(x=-30, y=40, w=30, h=26, color='far', depth=2)),
        (tower, dict(x=150, y=44, w=46, h=22, color='far', depth=2)),
        # B1 -- the leitmotif: the facade seen from below
        # storeys instead of one flat slab: the facade darkens downwards, which
        # is both the light direction and the contrast rule (section 5)
        (tower, dict(x=6, y=-34, w=152, h=28, color='mid_hi', depth=0)),
        (tower, dict(x=6, y=-6, w=152, h=20, color='mid_top', depth=0)),
        (tower, dict(x=6, y=14, w=152, h=22, color='mid', depth=0)),
        (tower, dict(x=6, y=36, w=152, h=28, color='mid_lo', depth=0)),
        (pipe_run, dict(x0=6, y0=-34, x1=6, y1=64, thick=4, color='mid')),
        (pipe_run, dict(x0=152, y0=-34, x1=152, y1=64, thick=4, color='mid')),
        (pipe_run, dict(x0=44, y0=-34, x1=44, y1=64, thick=3, color='mid')),
        (pipe_run, dict(x0=88, y0=-34, x1=88, y1=64, thick=3, color='mid')),
        (pipe_run, dict(x0=6, y0=-7, x1=158, y1=-7, thick=2, color='mid')),
        (pipe_run, dict(x0=6, y0=13, x1=158, y1=13, thick=2, color='mid')),
        (pipe_run, dict(x0=6, y0=35, x1=158, y1=35, thick=2, color='mid')),
        (window_grid, dict(x=12, y=14, cols=6, rows=3, cell=5, lit=0.22, seed=51)),
        (window_grid, dict(x=50, y=12, cols=7, rows=4, cell=5, lit=0.18, seed=52)),
        (window_grid, dict(x=94, y=16, cols=5, rows=3, cell=5, lit=0.2, seed=53)),
        # the elevator shaft: a light band that fades downwards, so it never
        # becomes a bright surface behind the encounter
        (pipe_run, dict(x0=104, y0=-34, x1=104, y1=30, thick=7, color='accent_dim')),
        (pipe_run, dict(x0=104, y0=30, x1=104, y1=64, thick=7, color='mid_side')),
        (glow, dict(cx=107, cy=-8, r=13, color='accent', core=0)),
        # the one detail: a corporate logo, sized well past good taste
        (sign, dict(x=16, y=2, w=54, h=26, frame='accent', glyph='monogram')),
    ],
    ground=dict(seed=29, speckle=0.04),
)

# --- Chapter 2 (first entry) -- earthy daylight ------------------------------
# Written *after* the kit was finished, purely as a recipe: the acceptance test
# for M12 is that a fourth region needs no new drawing code.

QUAINTSVILLE = Region(
    key='quaintsville',
    name='Quaintsville',
    palette=Palette(
        # "warmes Ocker" (spec section 6) only works *muted*: a bright ocker sits
        # inside the locked amber family, see the Umsetzungsentscheidung for M12.
        sky_top='#a8c4d6', sky_bottom='#6b8394', far='#4e6058', mid='#5f4f3b',
        accent='#7a5f2f', ground='#41392c', light='#efe6d2',
    ),
    sky=dict(stars=0, haze=True),
    recipe=[
        # B0 -- hills and a treeline that closes the horizon behind the figures
        (crag, dict(x=-30, base_y=64, w=120, h=28, color='far', jag=2, seed=61)),
        (crag, dict(x=64, base_y=64, w=136, h=22, color='far', jag=2, seed=62)),
        (foliage, dict(cx=-16, base_y=64, w=30, h=22, color='far', seed=63)),
        (foliage, dict(cx=178, base_y=64, w=32, h=24, color='far', seed=64)),
        # B1 -- the leitmotif: half-timbered gables with a wind wheel
        (tower, dict(x=14, y=44, w=30, h=20, color='mid', cap='gable', cap_h=11)),
        (window_grid, dict(x=20, y=50, cols=3, rows=2, lit=0.3, seed=65)),
        (tower, dict(x=52, y=48, w=26, h=16, color='mid', cap='gable', cap_h=9)),
        (window_grid, dict(x=58, y=53, cols=3, rows=1, lit=0.4, seed=66)),
        (tower, dict(x=90, y=46, w=24, h=18, color='mid', cap='gable', cap_h=10)),
        (stack, dict(x=126, base_y=64, w=5, h=34, color='mid', cap='flare')),
        (wheel, dict(cx=128, cy=30, r=11, spokes=8, color='accent', rim='mid_lo', angle=0.35)),
        (foliage, dict(cx=112, base_y=64, w=26, h=20, color='far', seed=67)),
        # the one detail: a signpost carrying far too many signs
        (stack, dict(x=150, base_y=64, w=2, h=26, color='mid', cap='flare')),
        (sign, dict(x=140, y=40, w=18, h=5, frame='accent', glyph='arrow')),
        (sign, dict(x=144, y=46, w=16, h=5, frame='accent', glyph='arrow')),
        (sign, dict(x=138, y=52, w=17, h=5, frame='accent', glyph='arrow')),
    ],
    ground=dict(seed=71, speckle=0.07),
)

# --- The inn (M19a, regionen-kulissen.md section 6a) ------------------------
# One backdrop for all 15 regions, not one per region: an interior, palette
# per *chapter*. The window carries the current region's signature colour, but
# that is a runtime parameter the generator does not know (section 6a point
# 4) -- so the glass here is only the neutral fallback tone, and the rect
# below is exported for whatever wires up that tint later (M19b).

INN_WINDOW = dict(x=84, y=-6, w=24, h=26)
INN_WINDOW_GLASS = (
    INN_WINDOW['x'] + WINDOW_NOOK_INSET, INN_WINDOW['y'] + WINDOW_NOOK_INSET,
    INN_WINDOW['w'] - 2 * WINDOW_NOOK_INSET, INN_WINDOW['h'] - 2 * WINDOW_NOOK_INSET,
)

INN = Region(
    key='inn',
    name='Inn',
    palette=Palette(
        # Warm wood and candlelight, deliberately against chapter 1's cold
        # neon outside -- the whole point of the room is that it is not the
        # zone (spec section 6a, "der Kontrast zum Kampf ist der Zweck").
        sky_top='#6b5644', sky_bottom='#372c22', far='#241d19', mid='#4a3624',
        accent='#8a5024', ground='#241c15', light='#efe6d2',
    ),
    sky=dict(stars=0, haze=True),
    recipe=[
        # the one window, offset off-centre (spec section 3: the stage
        # centre stays the quietest point of the image)
        (window_nook, dict(x=INN_WINDOW['x'], y=INN_WINDOW['y'], w=INN_WINDOW['w'], h=INN_WINDOW['h'])),
        # furniture mass sits entirely right of the party column (x 8-83,
        # spec section 3) so the four party slots stay clear
        (hearth, dict(x=100, base_y=64, w=16, h=18)),
        (counter, dict(x=120, base_y=64, w=26, h=13)),
        (bed, dict(x=150, base_y=64, w=20, h=14, head='left')),
        (bed, dict(x=172, base_y=64, w=20, h=14, head='left')),
    ],
    ground=dict(seed=81, speckle=0.05),
)

REGIONS = [REACTOR_ROW, BARGAIN_BAZAAR, MEGACORP_TOWER, QUAINTSVILLE, INN]

# Regions the game currently ships (chapter 1). Quaintsville stays in docs/ as
# the proof that the kit takes a new region without new code. The inn ships
# as an asset now (M19a) even though nothing imports it yet -- M19b wires up
# the scene and the runtime window tint.
SHIPPED = {'reactor_row', 'bargain_bazaar', 'megacorp_tower', 'inn'}

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'regions')
CHECK_OUT = os.path.join(OUT, '_check')
GAME_OUT = os.path.abspath(os.path.join(HERE, '..', '..', '..', 'src', 'assets', 'regions'))


def main() -> int:
    want_check = '--check' in sys.argv
    want_report = '--report' in sys.argv
    os.makedirs(OUT, exist_ok=True)
    if want_check:
        os.makedirs(CHECK_OUT, exist_ok=True)

    sheet = Image.new('RGBA', (CANVAS_W * 3, CANVAS_H * 3 * len(REGIONS)), (0, 0, 0, 255))
    failed = []
    for i, region in enumerate(REGIONS):
        img = render(region)
        findings = check(img)
        save_png(img, os.path.join(OUT, f'{region.key}_{CANVAS_W}.png'))
        save_png(upscale(img, 3), os.path.join(OUT, f'{region.key}_{CANVAS_W * 3}.png'))
        if region.key in SHIPPED:
            os.makedirs(GAME_OUT, exist_ok=True)
            save_png(img, os.path.join(GAME_OUT, f'{region.key}_{CANVAS_W}.png'))
        if want_check:
            save_png(overlay(img), os.path.join(CHECK_OUT, f'{region.key}_check.png'))
        sheet.paste(upscale(img, 3), (0, i * CANVAS_H * 3))

        line = f'{region.key:16s} {"OK" if not findings else "FAIL"}'
        if want_report:
            line += '  ' + ' '.join(f'{k}={v}' for k, v in report(img).items())
        print(line)
        for f in findings:
            print(f'    - {f}')
        if findings:
            failed.append(region.key)
    save_png(sheet, os.path.join(OUT, '_sheet.png'))

    if failed:
        print(f'\n{len(failed)} region(s) violate the spec: {", ".join(failed)}')
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
