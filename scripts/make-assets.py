#!/usr/bin/env python3
"""Generate So-key Ai launcher / splash / web assets from so-key-ai-logo.png.

    python3 scripts/make-assets.py

Writes:
  app/src/main/res/mipmap-*/ic_launcher.png          legacy icon (rounded square)
  app/src/main/res/mipmap-*/ic_launcher_round.png    legacy round icon
  app/src/main/res/mipmap-*/ic_launcher_foreground.png  adaptive foreground
  app/src/main/res/mipmap-*/splash_logo.png          launcher-splash mark
  app/src/main/assets/www/img/*.png                  in-app logo
"""
from __future__ import annotations

import os
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "so-key-ai-logo.png")
RES = os.path.join(ROOT, "app/src/main/res")
WWW_IMG = os.path.join(ROOT, "app/src/main/assets/www/img")

DENSITIES = {
    "mdpi": 1.0,
    "hdpi": 1.5,
    "xhdpi": 2.0,
    "xxhdpi": 3.0,
    "xxxhdpi": 4.0,
}

# brand background used behind the mark (matches --bg in the web UI)
BG_TOP = (22, 22, 34)
BG_BOTTOM = (8, 8, 14)


def load_logo(size: int) -> Image.Image:
    logo = Image.open(SRC).convert("RGBA")
    return logo.resize((size, size), Image.LANCZOS)


def gradient_square(size: int) -> Image.Image:
    bg = Image.new("RGB", (1, size))
    px = bg.load()
    for y in range(size):
        t = y / max(1, size - 1)
        px[0, y] = tuple(
            int(BG_TOP[i] + (BG_BOTTOM[i] - BG_TOP[i]) * t) for i in range(3)
        )
    return bg.resize((size, size), Image.BILINEAR).convert("RGBA")


def rounded_mask(size: int, radius_ratio: float) -> Image.Image:
    mask = Image.new("L", (size * 4, size * 4), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, size * 4 - 1, size * 4 - 1),
        radius=int(size * 4 * radius_ratio),
        fill=255,
    )
    return mask.resize((size, size), Image.LANCZOS)


def circle_mask(size: int) -> Image.Image:
    mask = Image.new("L", (size * 4, size * 4), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size * 4 - 1, size * 4 - 1), fill=255)
    return mask.resize((size, size), Image.LANCZOS)


def glow(logo: Image.Image, spread: int = 6) -> Image.Image:
    """Soft accent halo so the mark keeps its neon feel on any background."""
    alpha = logo.getchannel("A").filter(ImageFilter.GaussianBlur(spread))
    halo = Image.new("RGBA", logo.size, (0, 0, 0, 0))
    halo.putalpha(alpha.point(lambda v: int(v * 0.55)))
    halo_colored = Image.new("RGBA", logo.size, (99, 91, 255, 0))
    halo_colored.putalpha(halo.getchannel("A"))
    return Image.alpha_composite(halo_colored, logo)


def build_legacy(size: int, round_icon: bool) -> Image.Image:
    base = gradient_square(size)
    mask = circle_mask(size) if round_icon else rounded_mask(size, 0.22)
    icon = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    icon.paste(base, (0, 0), mask)
    inner = int(size * (0.72 if round_icon else 0.78))
    logo = glow(load_logo(inner))
    icon.alpha_composite(logo, ((size - inner) // 2, (size - inner) // 2))
    return icon


def build_foreground(size: int) -> Image.Image:
    # adaptive icons crop to a 66/108 safe zone: keep the mark well inside
    inner = int(size * 0.62)
    fg = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    logo = glow(load_logo(inner))
    fg.alpha_composite(logo, ((size - inner) // 2, (size - inner) // 2))
    return fg


def main() -> None:
    os.makedirs(WWW_IMG, exist_ok=True)
    for name, factor in DENSITIES.items():
        out_dir = os.path.join(RES, f"mipmap-{name}")
        os.makedirs(out_dir, exist_ok=True)
        legacy = int(48 * factor)
        build_legacy(legacy, False).save(os.path.join(out_dir, "ic_launcher.png"))
        build_legacy(legacy, True).save(os.path.join(out_dir, "ic_launcher_round.png"))
        build_foreground(int(108 * factor)).save(
            os.path.join(out_dir, "ic_launcher_foreground.png")
        )
        splash = load_logo(int(96 * factor))
        splash.save(os.path.join(out_dir, "splash_logo.png"))

    logo192 = load_logo(192)
    logo192.save(os.path.join(WWW_IMG, "logo-192.png"))
    load_logo(512).save(os.path.join(WWW_IMG, "logo-512.png"))
    load_logo(64).save(os.path.join(WWW_IMG, "logo-64.png"))
    print("assets written:", RES, "and", WWW_IMG)


if __name__ == "__main__":
    main()
