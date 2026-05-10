from __future__ import annotations

import csv
import json
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[2]
SLOT_MATRIX = ROOT / "docs" / "creative" / "MEJOY_PRODUCAO_FIRST_ASSET_MATRIX.csv"
OUT_DIR = ROOT / "public" / "imagensmejoyproducao"

FONT_PATHS = [
    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
    "/System/Library/Fonts/SFNS.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
]

SIZES: dict[str, tuple[int, int]] = {
    "1:1": (1280, 1280),
    "4:5": (1280, 1600),
    "3:4": (1280, 1707),
    "4:3": (1440, 1080),
    "5:4": (1400, 1120),
    "16:9": (1600, 900),
    "16:10": (1600, 1000),
    "9:16": (1440, 2560),
}


@dataclass(frozen=True)
class ExtraAsset:
    name: str
    source: str
    crops: tuple[str, ...]
    runtime_ratio: str
    focus_y: float = 0.5


EXTRA_ASSETS: tuple[ExtraAsset, ...] = (
    ExtraAsset("home-editorial-01", "/imagensmejoyproducao/slots/MJY-EMO-021/master.webp", ("3:4", "4:5"), "3:4", 0.34),
    ExtraAsset("home-editorial-02", "/imagensmejoyproducao/slots/MJY-EMO-019/master.webp", ("3:4", "4:5"), "3:4", 0.34),
    ExtraAsset("home-editorial-03", "/imagensmejoyproducao/slots/MJY-EMO-013/master.webp", ("3:4", "4:5"), "3:4", 0.34),
    ExtraAsset("home-secondary-saude", "/imagensmejoyproducao/slots/MJY-EMO-002/master.webp", ("16:10", "16:9"), "16:10", 0.44),
    ExtraAsset("home-secondary-detox", "/imagensmejoyproducao/slots/MJY-EMO-003/master.webp", ("16:10", "16:9"), "16:10", 0.4),
    ExtraAsset("home-why-criterio", "/imagensmejoyproducao/slots/MJY-EMO-017/master.webp", ("5:4", "4:5"), "5:4", 0.34),
    ExtraAsset("home-why-lgpd", "/imagensmejoyproducao/slots/MJY-EMO-010/master.webp", ("5:4", "4:5"), "5:4", 0.45),
    ExtraAsset("home-why-linguagem", "/imagensmejoyproducao/slots/MJY-EMO-009/master.webp", ("5:4", "4:5"), "5:4", 0.34),
    ExtraAsset("home-why-canal", "/imagensmejoyproducao/slots/MJY-EMO-030/master.webp", ("5:4", "4:5"), "5:4", 0.34),
    ExtraAsset("home-testimonial-avatar-c", "/imagensmejoyproducao/slots/MJY-EMO-025/master.webp", ("1:1",), "1:1", 0.34),
    ExtraAsset("social-avatar-d", "/imagensmejoyproducao/slots/MJY-EMO-026/master.webp", ("1:1",), "1:1", 0.34),
    ExtraAsset("lp-story-portrait-b", "/imagensmejoyproducao/slots/MJY-EMO-019/master.webp", ("4:5", "1:1", "9:16"), "4:5", 0.34),
    ExtraAsset("lp-story-wide-b", "/imagensmejoyproducao/slots/MJY-EMO-022/master.webp", ("16:10", "16:9", "1:1"), "16:10", 0.34),
    ExtraAsset("specialist-lead", "/imagensmejoyproducao/slots/MJY-EMO-017/master.webp", ("4:5", "1:1"), "4:5", 0.34),
    ExtraAsset("results-hero-support", "/imagensmejoyproducao/slots/MJY-EMO-026/master.webp", ("4:5", "1:1"), "4:5", 0.34),
    ExtraAsset("track-tirzepatida", "/imagensmejoyproducao/slots/MJY-EMO-029/master.webp", ("16:9", "4:5"), "16:9", 0.34),
    ExtraAsset("track-semaglutida", "/imagensmejoyproducao/slots/MJY-EMO-017/master.webp", ("16:9", "4:5"), "16:9", 0.34),
    ExtraAsset("track-contrave", "/imagensmejoyproducao/slots/MJY-EMO-018/master.webp", ("16:9", "4:5"), "16:9", 0.34),
    ExtraAsset("track-alternativas", "/imagensmejoyproducao/slots/MJY-EMO-019/master.webp", ("16:9", "4:5"), "16:9", 0.45),
    ExtraAsset("protocol-metabolic-results", "/imagensmejoyproducao/slots/MJY-EMO-021/master.webp", ("4:5", "1:1"), "4:5", 0.36),
)


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for path in FONT_PATHS:
        try:
            return ImageFont.truetype(path, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


def clean_ratio(ratio: str) -> str:
    return ratio.replace(":", "x")


def default_focus_y(runtime_ratio: str) -> float:
    if runtime_ratio in {"3:4", "4:5", "9:16"}:
        return 0.36
    if runtime_ratio == "1:1":
        return 0.42
    return 0.48


def runtime_ratio_for_section(section: str, crop_list: tuple[str, ...]) -> str:
    if "hero_row" in section or "avatar" in section:
        return "1:1"
    if "hero_portrait" in section:
        return "3:4"
    if "how_" in section:
        return "4:3"
    if "tailored" in section:
        return "1:1"
    if "story_wide" in section or "social_proof_wide" in section:
        return "16:9"
    if "story_portrait" in section:
        return "4:5"
    if "app_context" in section:
        return "4:5"
    if "triage_phone" in section or "triage_hero" in section:
        return "4:5"
    if "decision_" in section or "consult_frame" in section or "support_app_continuity" in section:
        return "4:5"
    return crop_list[0]


def open_source(path_str: str, fallback_path_str: str | None = None) -> Image.Image:
    path = ROOT / "public" / path_str.lstrip("/")
    if not path.exists() and fallback_path_str:
        fallback = ROOT / "public" / fallback_path_str.lstrip("/")
        if fallback.exists():
            path = fallback
    image = Image.open(path)
    image = ImageOps.exif_transpose(image)
    if image.mode not in {"RGB", "RGBA"}:
        image = image.convert("RGB")
    return image


def grade_image(image: Image.Image) -> Image.Image:
    graded = image.copy()
    graded = ImageEnhance.Contrast(graded).enhance(1.02)
    graded = ImageEnhance.Color(graded).enhance(1.02)
    graded = ImageEnhance.Sharpness(graded).enhance(1.02)
    return graded.filter(ImageFilter.UnsharpMask(radius=0.8, percent=65, threshold=2))


def save_crop(image: Image.Image, ratio: str, out_path: Path, focus_y: float) -> None:
    size = SIZES[ratio]
    cropped = ImageOps.fit(
        image,
        size,
        method=Image.Resampling.LANCZOS,
        centering=(0.5, focus_y),
    )
    out_path.parent.mkdir(parents=True, exist_ok=True)
    save_args = {"format": "WEBP", "quality": 94, "method": 6}
    if cropped.mode == "RGBA":
        cropped.save(out_path, lossless=False, **save_args)
    else:
        cropped.convert("RGB").save(out_path, **save_args)


def render_contact_sheet(entries: list[tuple[str, Path]], out_path: Path) -> None:
    thumb_w = 220
    thumb_h = 220
    cols = 5
    rows = (len(entries) + cols - 1) // cols
    canvas = Image.new("RGB", (cols * 252 + 32, rows * 290 + 32), "#f4f6f5")
    draw = ImageDraw.Draw(canvas)
    label_font = load_font(18)
    sub_font = load_font(13)

    for idx, (label, path) in enumerate(entries):
        row = idx // cols
        col = idx % cols
        x = 20 + col * 252
        y = 20 + row * 290
        tile = Image.new("RGB", (240, 278), "white")
        tile_draw = ImageDraw.Draw(tile)
        tile_draw.rounded_rectangle((0, 0, 239, 277), radius=24, fill="white", outline="#d8e5de")
        thumb = Image.open(path).convert("RGB")
        thumb = ImageOps.fit(thumb, (thumb_w, thumb_h), method=Image.Resampling.LANCZOS, centering=(0.5, 0.42))
        tile.paste(thumb, (10, 10))
        tile_draw.text((12, 240), label, font=label_font, fill="#123226")
        tile_draw.text((12, 262), path.parent.name if path.parent.name != "slots" else path.stem, font=sub_font, fill="#5a6b62")
        canvas.paste(tile, (x, y))

    out_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out_path, quality=92)


def build_slots() -> dict[str, dict[str, object]]:
    manifest: dict[str, dict[str, object]] = {}
    entries: list[tuple[str, Path]] = []
    with SLOT_MATRIX.open() as fp:
      rows = list(csv.DictReader(fp))

    for row in rows:
        slot_id = row["slot_id"]
        source = row["master_asset"]
        crops = tuple(part.strip() for part in row["crop"].split("|") if part.strip())
        section = row["section"]
        runtime_ratio = runtime_ratio_for_section(section, crops)
        focus_y = default_focus_y(runtime_ratio)
        image = grade_image(
            open_source(
                source,
                fallback_path_str=f"/imagensmejoyproducao/slots/{slot_id}/master.webp",
            )
        )
        slot_dir = OUT_DIR / "slots" / slot_id
        crop_paths: dict[str, str] = {}

        for ratio in crops:
            out_path = slot_dir / f"{clean_ratio(ratio)}.webp"
            save_crop(image, ratio, out_path, focus_y)
            crop_paths[ratio] = f"/imagensmejoyproducao/slots/{slot_id}/{clean_ratio(ratio)}.webp"

        master_path = slot_dir / "master.webp"
        save_crop(image, runtime_ratio, master_path, focus_y)
        entries.append((slot_id, master_path))
        manifest[slot_id] = {
            "slot_id": slot_id,
            "route": row["route"],
            "section": section,
            "runtime_ratio": runtime_ratio,
            "runtime_asset": f"/imagensmejoyproducao/slots/{slot_id}/master.webp",
            "crops": crop_paths,
            "copy_side": row["copy_side"],
            "cta": row["cta"],
            "compliance_note": row["compliance_note"],
        }

    render_contact_sheet(entries, OUT_DIR / "contact-sheet-slots.jpg")
    return manifest


def build_extras() -> dict[str, dict[str, object]]:
    manifest: dict[str, dict[str, object]] = {}
    for extra in EXTRA_ASSETS:
        image = grade_image(open_source(extra.source))
        out_dir = OUT_DIR / "extras" / extra.name
        crops: dict[str, str] = {}
        for ratio in extra.crops:
            out_path = out_dir / f"{clean_ratio(ratio)}.webp"
            save_crop(image, ratio, out_path, extra.focus_y)
            crops[ratio] = f"/imagensmejoyproducao/extras/{extra.name}/{clean_ratio(ratio)}.webp"
        master_path = out_dir / "master.webp"
        save_crop(image, extra.runtime_ratio, master_path, extra.focus_y)
        manifest[extra.name] = {
            "runtime_ratio": extra.runtime_ratio,
            "runtime_asset": f"/imagensmejoyproducao/extras/{extra.name}/master.webp",
            "crops": crops,
        }
    return manifest


def main() -> None:
    slot_manifest = build_slots()
    extra_manifest = build_extras()
    manifest = {
        "generated_at": "2026-05-09",
        "slots": slot_manifest,
        "extras": extra_manifest,
    }
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
    print(f"Generated {len(slot_manifest)} slots and {len(extra_manifest)} extras in {OUT_DIR}")


if __name__ == "__main__":
    main()
