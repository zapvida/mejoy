from __future__ import annotations

from pathlib import Path
from typing import Iterable

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "codex-artifacts" / "mejoy-logo-final-2026-04-28"

SIZE = 1024
DISC_SIZE = 656
DISC_POS = ((SIZE - DISC_SIZE) // 2, (SIZE - DISC_SIZE) // 2)

CREAM_TOP = "#FFF8F0"
CREAM_BOTTOM = "#F3E8D9"
TEAL_TOP = "#18B5C7"
TEAL_MID = "#109198"
TEAL_BOTTOM = "#0C7068"
ORANGE = "#FF7A12"
ORANGE_SOFT = "#FFB157"
TEXT_IVORY = "#FFFDF8"
DISC_STROKE = (255, 255, 255, 90)
SHADOW = (13, 46, 44, 72)


def ensure_dirs() -> None:
    (OUT_DIR / "favicon").mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "preview").mkdir(parents=True, exist_ok=True)


def hex_rgb(hex_color: str) -> tuple[int, int, int]:
    c = hex_color.lstrip("#")
    return tuple(int(c[i : i + 2], 16) for i in (0, 2, 4))


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


def rounded_rect_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    return mask


def ellipse_mask(size: tuple[int, int]) -> Image.Image:
    mask = Image.new("L", size, 0)
    d = ImageDraw.Draw(mask)
    d.ellipse((0, 0, size[0], size[1]), fill=255)
    return mask


def apply_mask(img: Image.Image, mask: Image.Image) -> Image.Image:
    out = img.copy()
    out.putalpha(mask)
    return out


def clip_to_mask(img: Image.Image, mask: Image.Image) -> Image.Image:
    out = img.copy()
    alpha = out.getchannel("A")
    out.putalpha(ImageChops.multiply(alpha, mask))
    return out


def paste_centered(base: Image.Image, overlay: Image.Image, center: tuple[int, int]) -> None:
    x = round(center[0] - overlay.width / 2)
    y = round(center[1] - overlay.height / 2)
    base.alpha_composite(overlay, (x, y))


def blur_spot(size: tuple[int, int], bbox: tuple[int, int, int, int], color: tuple[int, int, int, int], blur: int) -> Image.Image:
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.ellipse(bbox, fill=color)
    return img.filter(ImageFilter.GaussianBlur(blur))


def get_font(size: int) -> ImageFont.FreeTypeFont:
    font_paths = [
        ("/System/Library/Fonts/Avenir Next.ttc", 8),
        ("/System/Library/Fonts/Avenir Next.ttc", 0),
        ("/System/Library/Fonts/Avenir.ttc", 3),
        ("/System/Library/Fonts/SFNSRounded.ttf", 0),
    ]
    for path, index in font_paths:
        try:
            return ImageFont.truetype(path, size=size, index=index)
        except Exception:
            continue
    raise RuntimeError("No suitable system font found for the MeJoy logo.")


def draw_me_text(size: int, circle_only: bool) -> Image.Image:
    layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    shadow_layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    ds = ImageDraw.Draw(shadow_layer)

    font = get_font(322 if size >= 1024 else round(size * 0.315))
    text = "Me"
    bbox = d.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    cx = size / 2
    cy = size / 2 - (14 if circle_only else 6)
    x = round(cx - text_w / 2 - bbox[0])
    y = round(cy - text_h / 2 - bbox[1])

    ds.text((x, y + 10), text, font=font, fill=(5, 58, 58, 80))
    shadow = shadow_layer.filter(ImageFilter.GaussianBlur(12))
    layer.alpha_composite(shadow)
    d.text((x, y), text, font=font, fill=TEXT_IVORY)
    return layer


def create_disc() -> Image.Image:
    disc = vertical_gradient((DISC_SIZE, DISC_SIZE), TEAL_TOP, TEAL_BOTTOM)
    mask = ellipse_mask((DISC_SIZE, DISC_SIZE))
    disc = apply_mask(disc, mask)

    highlight = clip_to_mask(blur_spot(
        (DISC_SIZE, DISC_SIZE),
        (88, 38, 452, 280),
        (255, 255, 255, 92),
        34,
    ), mask)
    orange_glow = clip_to_mask(blur_spot(
        (DISC_SIZE, DISC_SIZE),
        (76, 52, 330, 282),
        (*hex_rgb(ORANGE_SOFT), 82),
        48,
    ), mask)
    center_depth = clip_to_mask(blur_spot(
        (DISC_SIZE, DISC_SIZE),
        (160, 260, 632, 652),
        (2, 73, 70, 52),
        56,
    ), mask)
    disc.alpha_composite(orange_glow)
    disc.alpha_composite(highlight)
    disc.alpha_composite(center_depth)

    stroke = Image.new("RGBA", (DISC_SIZE, DISC_SIZE), (0, 0, 0, 0))
    ds = ImageDraw.Draw(stroke)
    ds.ellipse((3, 3, DISC_SIZE - 4, DISC_SIZE - 4), outline=DISC_STROKE, width=6)
    disc.alpha_composite(stroke)

    disc.alpha_composite(draw_me_text(DISC_SIZE, circle_only=True))
    return clip_to_mask(disc, mask)


def create_circle_mark() -> Image.Image:
    base = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))

    shadow = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    ds = ImageDraw.Draw(shadow)
    x, y = DISC_POS
    ds.ellipse((x + 12, y + 26, x + DISC_SIZE + 12, y + DISC_SIZE + 26), fill=SHADOW)
    base.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(30)))

    base.alpha_composite(create_disc(), DISC_POS)
    return base


def create_square_avatar() -> Image.Image:
    base = vertical_gradient((SIZE, SIZE), CREAM_TOP, CREAM_BOTTOM)

    # Soft ambient shapes to make the icon feel less flat while preserving favicon clarity.
    base.alpha_composite(blur_spot((SIZE, SIZE), (-120, 690, 520, 1250), (*hex_rgb(ORANGE_SOFT), 58), 70))
    base.alpha_composite(blur_spot((SIZE, SIZE), (580, -120, 1180, 420), (255, 255, 255, 122), 90))
    base.alpha_composite(blur_spot((SIZE, SIZE), (-160, -80, 360, 340), (255, 255, 255, 110), 80))

    card_shadow = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    ds = ImageDraw.Draw(card_shadow)
    ds.rounded_rectangle((76, 76, 948, 948), radius=226, fill=(47, 31, 18, 34))
    base.alpha_composite(card_shadow.filter(ImageFilter.GaussianBlur(28)))

    card = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    dc = ImageDraw.Draw(card)
    dc.rounded_rectangle((62, 62, 962, 962), radius=224, fill=(255, 252, 246, 150), outline=(233, 214, 191, 110), width=2)
    base.alpha_composite(card)

    disc_layer = create_circle_mark()
    base.alpha_composite(disc_layer)
    return base


def create_crop_preview(square_avatar: Image.Image, circle_mark: Image.Image) -> Image.Image:
    preview = Image.new("RGB", (1600, 920), "#F4EBDD")
    d = ImageDraw.Draw(preview)
    font_title = get_font(62)
    font_label = get_font(34)
    d.text((80, 60), "MeJoy - preview final", font=font_title, fill="#203037")
    d.text((80, 150), "Avatar quadrado para Instagram/Facebook", font=font_label, fill="#48625C")
    d.text((880, 150), "Marca circular para favicon e app icon", font=font_label, fill="#48625C")

    preview.paste(square_avatar.resize((620, 620), Image.Resampling.LANCZOS), (80, 210))

    dark_panel = Image.new("RGB", (620, 620), "#1F2327")
    preview.paste(dark_panel, (880, 210))
    cm = circle_mark.resize((440, 440), Image.Resampling.LANCZOS)
    preview.paste(cm, (970, 300), cm)

    circle_crop = Image.new("L", (620, 620), 0)
    dc = ImageDraw.Draw(circle_crop)
    dc.ellipse((0, 0, 620, 620), fill=255)
    circle_view = square_avatar.resize((620, 620), Image.Resampling.LANCZOS).copy()
    circle_view.putalpha(circle_crop)
    preview.paste(circle_view, (80, 210), circle_view)
    return preview


def write_svg(circle_only: bool) -> None:
    square_background = ""
    if not circle_only:
        square_background = f"""
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="{CREAM_TOP}"/>
      <stop offset="100%" stop-color="{CREAM_BOTTOM}"/>
    </linearGradient>
    <radialGradient id="warmGlow" cx="18%" cy="84%" r="42%">
      <stop offset="0%" stop-color="{ORANGE_SOFT}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="{ORANGE_SOFT}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="coolGlow" cx="84%" cy="12%" r="38%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.66"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="{SIZE}" height="{SIZE}" rx="224" fill="url(#bgGrad)"/>
  <rect x="62" y="62" width="900" height="900" rx="224" fill="rgba(255,252,246,0.58)" stroke="rgba(233,214,191,0.72)" stroke-width="2"/>
  <circle cx="180" cy="860" r="260" fill="url(#warmGlow)"/>
  <circle cx="860" cy="160" r="220" fill="url(#coolGlow)"/>
"""

    text_y = 582 if circle_only else 580
    outer_shadow = ""
    if circle_only:
        outer_shadow = """
  <filter id="discShadow" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#123c39" flood-opacity="0.30"/>
  </filter>
"""
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{SIZE}" height="{SIZE}" viewBox="0 0 {SIZE} {SIZE}">
  <defs>
    <linearGradient id="discGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="{TEAL_TOP}"/>
      <stop offset="52%" stop-color="{TEAL_MID}"/>
      <stop offset="100%" stop-color="{TEAL_BOTTOM}"/>
    </linearGradient>
    <radialGradient id="discHighlight" cx="28%" cy="20%" r="48%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.34"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="discWarm" cx="24%" cy="26%" r="40%">
      <stop offset="0%" stop-color="{ORANGE_SOFT}" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="{ORANGE_SOFT}" stop-opacity="0"/>
    </radialGradient>
    <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#083838" flood-opacity="0.26"/>
    </filter>
    {outer_shadow}
  </defs>
  {square_background}
  <g filter="url(#discShadow)">
    <circle cx="512" cy="512" r="328" fill="url(#discGrad)" stroke="rgba(255,255,255,0.42)" stroke-width="6"/>
    <circle cx="512" cy="512" r="328" fill="url(#discWarm)"/>
    <circle cx="512" cy="512" r="328" fill="url(#discHighlight)"/>
  </g>
  <text x="512" y="{text_y}" text-anchor="middle" fill="{TEXT_IVORY}" font-size="322" font-family="Avenir Next, Avenir, Helvetica Neue, Arial, sans-serif" font-weight="800" filter="url(#textShadow)">Me</text>
</svg>
"""
    name = "mejoy-mark-circle.svg" if circle_only else "mejoy-avatar-social.svg"
    (OUT_DIR / name).write_text(svg)


def save_pngs(name: str, image: Image.Image, sizes: Iterable[int]) -> None:
    for size in sizes:
        resized = image.resize((size, size), Image.Resampling.LANCZOS)
        target = OUT_DIR / "favicon" / f"{name}-{size}.png"
        resized.save(target)


def main() -> None:
    ensure_dirs()
    circle_mark = create_circle_mark()
    square_avatar = create_square_avatar()
    preview = create_crop_preview(square_avatar, circle_mark)

    circle_mark.save(OUT_DIR / "mejoy-mark-circle-1024.png")
    square_avatar.save(OUT_DIR / "mejoy-avatar-social-1024.png")
    preview.save(OUT_DIR / "preview" / "mejoy-logo-preview.png")

    save_pngs("mejoy-mark-circle", circle_mark, [512, 256, 192, 180, 96, 48, 32, 16])
    square_avatar.resize((512, 512), Image.Resampling.LANCZOS).save(OUT_DIR / "mejoy-avatar-social-512.png")
    square_avatar.resize((256, 256), Image.Resampling.LANCZOS).save(OUT_DIR / "mejoy-avatar-social-256.png")

    favicon_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
    circle_mark.save(OUT_DIR / "favicon.ico", sizes=favicon_sizes)

    write_svg(circle_only=True)
    write_svg(circle_only=False)


if __name__ == "__main__":
    main()
