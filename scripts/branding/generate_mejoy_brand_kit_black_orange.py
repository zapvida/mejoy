from __future__ import annotations

from pathlib import Path
from typing import Iterable

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "codex-artifacts" / "mejoy-brand-kit-black-orange-2026-04-28"

ORANGE = "#FF7A12"
ORANGE_LIGHT = "#FFAA45"
ORANGE_DARK = "#E85E00"
BLACK = "#111111"
BLACK_SOFT = "#1E1E1E"
TRANSPARENT = (0, 0, 0, 0)


def ensure_dirs() -> None:
    for sub in ["favicon", "preview"]:
        (OUT_DIR / sub).mkdir(parents=True, exist_ok=True)


def hex_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def lerp(a: int, b: int, t: float) -> int:
    return round(a + (b - a) * t)


def lerp_rgb(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return tuple(lerp(x, y, t) for x, y in zip(a, b))


def vertical_gradient(size: tuple[int, int], top_hex: str, bottom_hex: str) -> Image.Image:
    w, h = size
    top = hex_rgb(top_hex)
    bottom = hex_rgb(bottom_hex)
    img = Image.new("RGBA", size)
    px = img.load()
    for y in range(h):
        t = y / max(1, h - 1)
        color = lerp_rgb(top, bottom, t)
        for x in range(w):
            px[x, y] = (*color, 255)
    return img


def radial_glow(size: tuple[int, int], bbox: tuple[int, int, int, int], color: tuple[int, int, int, int], blur: int) -> Image.Image:
    img = Image.new("RGBA", size, TRANSPARENT)
    d = ImageDraw.Draw(img)
    d.ellipse(bbox, fill=color)
    return img.filter(ImageFilter.GaussianBlur(blur))


def rounded_rect_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    return mask


def ellipse_mask(size: tuple[int, int]) -> Image.Image:
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size[0], size[1]), fill=255)
    return mask


def clip_to_mask(img: Image.Image, mask: Image.Image) -> Image.Image:
    out = img.copy()
    alpha = out.getchannel("A")
    out.putalpha(ImageChops.multiply(alpha, mask))
    return out


def get_font(size: int, heavy: bool = False) -> ImageFont.FreeTypeFont:
    tries = [
        ("/System/Library/Fonts/Avenir Next.ttc", 8 if heavy else 0),
        ("/System/Library/Fonts/Avenir.ttc", 3 if heavy else 0),
        ("/System/Library/Fonts/SFNSRounded.ttf", 0),
    ]
    for path, index in tries:
        try:
            return ImageFont.truetype(path, size=size, index=index)
        except Exception:
            continue
    raise RuntimeError("No usable font found.")


def draw_centered_text(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    text: str,
    font: ImageFont.FreeTypeFont,
    fill: str | tuple[int, int, int],
) -> None:
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    x0, y0, x1, y1 = box
    x = round((x0 + x1 - text_w) / 2 - bbox[0])
    y = round((y0 + y1 - text_h) / 2 - bbox[1])
    draw.text((x, y), text, font=font, fill=fill)


def create_mark_circle(size: int = 1024) -> Image.Image:
    base = Image.new("RGBA", (size, size), TRANSPARENT)
    mask = ellipse_mask((size, size))

    shadow = Image.new("RGBA", (size, size), TRANSPARENT)
    ds = ImageDraw.Draw(shadow)
    ds.ellipse((38, 72, size - 38, size - 4), fill=(0, 0, 0, 86))
    base.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(30)))

    disc = vertical_gradient((size, size), ORANGE_LIGHT, ORANGE_DARK)
    disc = clip_to_mask(disc, mask)
    disc.alpha_composite(clip_to_mask(radial_glow((size, size), (90, 60, 540, 440), (255, 219, 170, 82), 50), mask))
    disc.alpha_composite(clip_to_mask(radial_glow((size, size), (410, 420, 1010, 1010), (0, 0, 0, 60), 70), mask))
    stroke = Image.new("RGBA", (size, size), TRANSPARENT)
    ImageDraw.Draw(stroke).ellipse((5, 5, size - 6, size - 6), outline=(0, 0, 0, 120), width=8)
    disc.alpha_composite(stroke)
    base.alpha_composite(disc)

    font = get_font(round(size * 0.34), heavy=True)
    text_layer = Image.new("RGBA", (size, size), TRANSPARENT)
    dt = ImageDraw.Draw(text_layer)
    bbox = dt.textbbox((0, 0), "Me", font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    x = round((size - w) / 2 - bbox[0])
    y = round((size - h) / 2 - bbox[1] - size * 0.015)
    dt.text((x + 2, y + 8), "Me", font=font, fill=(255, 181, 98, 110))
    shadow_text = text_layer.filter(ImageFilter.GaussianBlur(10))
    base.alpha_composite(clip_to_mask(shadow_text, mask))
    dt = ImageDraw.Draw(base)
    dt.text((x, y), "Me", font=font, fill=BLACK)
    return base


def create_avatar_square(size: int = 1024) -> Image.Image:
    base = Image.new("RGBA", (size, size), BLACK)
    base.alpha_composite(radial_glow((size, size), (-160, 700, 420, 1280), (*hex_rgb(ORANGE), 120), 90))
    base.alpha_composite(radial_glow((size, size), (520, -80, 1040, 360), (*hex_rgb(ORANGE_DARK), 55), 90))

    card = Image.new("RGBA", (size, size), TRANSPARENT)
    ImageDraw.Draw(card).rounded_rectangle((44, 44, size - 44, size - 44), radius=220, outline=(255, 122, 18, 80), width=3)
    base.alpha_composite(card)

    mark = create_mark_circle(round(size * 0.78))
    mark_x = (size - mark.width) // 2
    mark_y = (size - mark.height) // 2
    base.alpha_composite(mark, (mark_x, mark_y))
    return base


def create_wordmark(width: int = 1800, height: int = 620) -> Image.Image:
    base = Image.new("RGBA", (width, height), TRANSPARENT)
    mark = create_mark_circle(420)
    base.alpha_composite(mark, (70, 100))

    d = ImageDraw.Draw(base)
    title_font = get_font(238, heavy=True)
    sub_font = get_font(86, heavy=False)
    d.text((560, 150), "Me Joy", font=title_font, fill=BLACK)
    d.text((572, 395), "Me Cuido. Me Amo!", font=sub_font, fill=ORANGE_DARK)
    d.rounded_rectangle((570, 515, 1080, 532), radius=8, fill=ORANGE)
    return base


def create_cover(width: int = 1640, height: int = 624) -> Image.Image:
    base = Image.new("RGBA", (width, height), BLACK)
    base.alpha_composite(radial_glow((width, height), (980, -180, 1620, 520), (*hex_rgb(ORANGE), 120), 130))
    base.alpha_composite(radial_glow((width, height), (1220, 120, 1800, 820), (*hex_rgb(ORANGE_DARK), 110), 120))
    base.alpha_composite(radial_glow((width, height), (-220, 480, 380, 920), (*hex_rgb(ORANGE_DARK), 42), 100))

    mark = create_mark_circle(246)
    base.alpha_composite(mark, (132, 184))

    d = ImageDraw.Draw(base)
    title_font = get_font(142, heavy=True)
    slogan_font = get_font(72, heavy=False)
    accent_font = get_font(72, heavy=True)

    d.text((430, 154), "Me Joy,", font=title_font, fill=ORANGE)
    d.text((436, 306), "Me Cuido.", font=slogan_font, fill="#FFB05A")
    d.text((840, 306), "Me Amo!", font=accent_font, fill=ORANGE)
    d.rounded_rectangle((436, 430, 1138, 444), radius=7, fill=ORANGE_DARK)
    return base


def write_svg_files() -> None:
    circle_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="{ORANGE_LIGHT}"/>
      <stop offset="100%" stop-color="{ORANGE_DARK}"/>
    </linearGradient>
    <radialGradient id="shine" cx="28%" cy="20%" r="36%">
      <stop offset="0%" stop-color="#ffddb0" stop-opacity="0.75"/>
      <stop offset="100%" stop-color="#ffddb0" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="20" stdDeviation="22" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>
  <g filter="url(#shadow)">
    <circle cx="512" cy="512" r="500" fill="url(#orangeGrad)" stroke="rgba(0,0,0,0.45)" stroke-width="8"/>
    <circle cx="512" cy="512" r="500" fill="url(#shine)"/>
  </g>
  <text x="512" y="560" text-anchor="middle" fill="{BLACK}" font-size="348" font-family="Avenir Next, Avenir, Helvetica Neue, Arial, sans-serif" font-weight="800">Me</text>
</svg>
"""
    (OUT_DIR / "mejoy-mark-circle.svg").write_text(circle_svg)

    cover_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="1640" height="624" viewBox="0 0 1640 624">
  <defs>
    <radialGradient id="glow1" cx="84%" cy="18%" r="38%">
      <stop offset="0%" stop-color="{ORANGE}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="{ORANGE}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="92%" cy="58%" r="34%">
      <stop offset="0%" stop-color="{ORANGE_DARK}" stop-opacity="0.90"/>
      <stop offset="100%" stop-color="{ORANGE_DARK}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1640" height="624" fill="{BLACK}"/>
  <circle cx="1380" cy="120" r="250" fill="url(#glow1)"/>
  <circle cx="1500" cy="410" r="260" fill="url(#glow2)"/>
  <g transform="translate(132,184) scale(0.240234375)">
    <circle cx="512" cy="512" r="500" fill="url(#glow1)" opacity="0"/>
    <circle cx="512" cy="512" r="500" fill="url(#orangeGrad)" stroke="rgba(0,0,0,0.45)" stroke-width="8"/>
    <text x="512" y="560" text-anchor="middle" fill="{BLACK}" font-size="348" font-family="Avenir Next, Avenir, Helvetica Neue, Arial, sans-serif" font-weight="800">Me</text>
  </g>
  <text x="430" y="272" fill="{ORANGE}" font-size="142" font-family="Avenir Next, Avenir, Helvetica Neue, Arial, sans-serif" font-weight="800">Me Joy,</text>
  <text x="436" y="378" fill="#FFB05A" font-size="72" font-family="Avenir Next, Avenir, Helvetica Neue, Arial, sans-serif">Me Cuido.</text>
  <text x="840" y="378" fill="{ORANGE}" font-size="72" font-family="Avenir Next, Avenir, Helvetica Neue, Arial, sans-serif" font-weight="800">Me Amo!</text>
  <rect x="436" y="430" width="702" height="14" rx="7" fill="{ORANGE_DARK}"/>
</svg>
"""
    # cover SVG reuses a simpler mark instance and is mainly for scale-safe editing.
    cover_svg = cover_svg.replace('fill="url(#orangeGrad)"', f'fill="{ORANGE}"')
    (OUT_DIR / "mejoy-cover-facebook.svg").write_text(cover_svg)


def save_resized(name: str, image: Image.Image, sizes: Iterable[int]) -> None:
    for size in sizes:
        image.resize((size, size), Image.Resampling.LANCZOS).save(OUT_DIR / "favicon" / f"{name}-{size}.png")


def create_preview(avatar: Image.Image, cover: Image.Image, wordmark: Image.Image) -> Image.Image:
    preview = Image.new("RGB", (1800, 1380), "#F4E6D7")
    d = ImageDraw.Draw(preview)
    title = get_font(74, heavy=True)
    label = get_font(36, heavy=False)
    d.text((70, 52), "Me Joy - kit preto e laranja", font=title, fill=BLACK)
    d.text((70, 150), "Perfil", font=label, fill=BLACK_SOFT)
    d.text((700, 150), "Capa", font=label, fill=BLACK_SOFT)
    d.text((70, 930), "Wordmark", font=label, fill=BLACK_SOFT)
    preview.paste(avatar.resize((520, 520), Image.Resampling.LANCZOS), (70, 210))
    preview.paste(cover.resize((1030, 392), Image.Resampling.LANCZOS).convert("RGB"), (700, 210))
    preview.paste(wordmark.resize((1500, 516), Image.Resampling.LANCZOS), (70, 980), wordmark.resize((1500, 516), Image.Resampling.LANCZOS))
    return preview


def main() -> None:
    ensure_dirs()
    mark = create_mark_circle()
    avatar = create_avatar_square()
    wordmark = create_wordmark()
    cover = create_cover()

    mark.save(OUT_DIR / "mejoy-mark-circle-1024.png")
    avatar.save(OUT_DIR / "mejoy-avatar-social-1024.png")
    wordmark.save(OUT_DIR / "mejoy-wordmark-horizontal-1800.png")
    cover.save(OUT_DIR / "mejoy-cover-facebook-1640x624.png")
    cover.resize((820, 312), Image.Resampling.LANCZOS).save(OUT_DIR / "mejoy-cover-facebook-820x312.png")
    avatar.resize((512, 512), Image.Resampling.LANCZOS).save(OUT_DIR / "mejoy-avatar-social-512.png")
    avatar.resize((256, 256), Image.Resampling.LANCZOS).save(OUT_DIR / "mejoy-avatar-social-256.png")

    save_resized("mejoy-mark-circle", mark, [512, 256, 192, 180, 96, 48, 32, 16])
    mark.save(OUT_DIR / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

    preview = create_preview(avatar, cover, wordmark)
    preview.save(OUT_DIR / "preview" / "mejoy-brand-kit-preview.png")
    write_svg_files()


if __name__ == "__main__":
    main()
