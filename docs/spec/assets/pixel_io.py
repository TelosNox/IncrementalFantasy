"""Deterministic PNG output for every asset generator.

Pillow's defaults changed between versions, so a plain `Image.save()` rewrites
every byte of every PNG on a version bump even when not a single pixel moved
(see the note in docs/06_Implementierungsplan_Kapitel1.md, M12). Pinning the
encoder settings and stripping metadata makes a byte diff meaningful again:
identical pixels -> identical file.
"""

from PIL import Image
from PIL.PngImagePlugin import PngInfo


def save_png(img: Image.Image, path: str) -> None:
    """Save `img` as an RGBA PNG with pinned encoder settings and no metadata."""
    img.convert('RGBA').save(
        path,
        format='PNG',
        optimize=False,
        compress_level=6,
        pnginfo=PngInfo(),
    )


def upscale(img: Image.Image, factor: int) -> Image.Image:
    """Nearest-neighbour upscale -- the only scaling this project uses."""
    return img.resize((img.width * factor, img.height * factor), Image.NEAREST)
