from __future__ import annotations

import csv
import json
import math
from pathlib import Path
from textwrap import dedent

from PIL import Image, ImageColor, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "codex-artifacts" / "social-launch-v3"
FINAL_DIR = OUT_DIR / "final-posts"
REVIEW_DIR = OUT_DIR / "review"

CANVAS_W = 1080
CANVAS_H = 1350

FONT_REGULAR = "/System/Library/Fonts/Avenir Next.ttc"
FONT_BOLD = "/System/Library/Fonts/Avenir.ttc"

LOGO_SCREENSHOT = Path("/Users/teobeckert/Desktop/Captura de Tela 2026-04-28 às 02.22.44.png")
LOGO_FALLBACK = ROOT / "public" / "logosmejoy" / "faviconmejoy.png"

BG_TOP = "#FFF8F1"
BG_BOTTOM = "#F6E7D6"
ORANGE = "#FF7A12"
GREEN = "#0A6A5D"
BROWN = "#4A3327"
TEXT = "#12212B"
TEXT_SOFT = "#5D6571"
LINE = "#E7D6C1"


POSTS = [
    {
        "post": 1,
        "slug": "comece-com-direcao",
        "title": "Comece com direção",
        "subtitle": "Triagem, avaliação médica e acompanhamento para cuidar do emagrecimento com mais clareza.",
        "cta": "Começar minha triagem",
        "source": ROOT / "public/images/emagrecimento/medvi/hero-main.webp",
        "caption": dedent(
            """\
            Se você já tentou recomeçar muitas vezes, talvez o que faltou não tenha sido esforço. Faltou direção.

            Na Me Joy, o começo é com triagem, avaliação médica e acompanhamento. Sem atalho. Sem promessa vazia.

            Se fizer sentido para você, comece pela triagem.

            #EmagrecimentoComAcompanhamento #SaudeMetabolica #MeJoy"""
        ),
    },
    {
        "post": 2,
        "slug": "seu-caso-vem-primeiro",
        "title": "Seu caso vem primeiro",
        "subtitle": "A triagem ajuda a entender histórico, rotina e objetivos antes de qualquer decisão.",
        "cta": "Entender meu caso",
        "source": ROOT / "public/images/emagrecimento/medvi/journey-triagem.avif",
        "caption": dedent(
            """\
            Antes de pensar em solução, vale entender o seu caso.

            A triagem organiza histórico, rotina e objetivos com mais clareza. Decisão boa começa com contexto.

            Começar por aqui deixa o próximo passo mais seguro e mais inteligente.

            #TriagemOnline #EmagrecimentoComAcompanhamento #MeJoy"""
        ),
    },
    {
        "post": 3,
        "slug": "criterio-antes-de-tudo",
        "title": "Critério antes de tudo",
        "subtitle": "Toda conduta responsável começa com avaliação clínica individual.",
        "cta": "Ver como funciona",
        "source": ROOT / "public/images/emagrecimento/medvi/journey-consulta.avif",
        "caption": dedent(
            """\
            Emagrecimento sério não é receita pronta.

            Toda conduta responsável passa por avaliação clínica, com critério e segurança.

            Segurança não atrasa o processo. Segurança protege o processo.

            #AvaliacaoMedica #TratamentoDaObesidade #MeJoy"""
        ),
    },
    {
        "post": 4,
        "slug": "voce-nao-esta-sozinho",
        "title": "Você não está sozinho(a)",
        "subtitle": "Com acompanhamento certo, a constância fica mais leve e mais possível.",
        "cta": "Conhecer o acompanhamento",
        "source": ROOT / "public/images/emagrecimento/medvi/reviews-06.webp",
        "caption": dedent(
            """\
            Você não precisa carregar esse processo sozinho(a).

            Quando existe acompanhamento, fica mais fácil manter constância, ajustar rota e seguir com mais leveza.

            Suporte certo muda a jornada.

            #AcompanhamentoContinuo #SaudeMetabolica #MeJoy"""
        ),
    },
    {
        "post": 5,
        "slug": "cuidar-tambem-e-rotina",
        "title": "Cuidar também\né rotina",
        "subtitle": "Resultado sustentável nasce do que cabe na vida real.",
        "cta": "Buscar constância",
        "source": ROOT / "public/images/emagrecimento/medvi/metabolism-habits.avif",
        "caption": dedent(
            """\
            O melhor plano não é o mais rígido. É o que você consegue sustentar na vida real.

            Constância, ajuste e rotina possível valem mais do que pressa.

            Quando a estratégia cabe na sua vida, o cuidado fica mais forte.

            #Constancia #EmagrecimentoComAcompanhamento #MeJoy"""
        ),
    },
    {
        "post": 6,
        "slug": "historias-reais-sem-exagero",
        "title": "Histórias reais,\nsem exagero",
        "subtitle": "Cada pessoa responde de um jeito. O que importa é cuidado com honestidade.",
        "cta": "Ver histórias reais",
        "source": ROOT / "public/images/emagrecimento/medvi/reviews-01.webp",
        "caption": dedent(
            """\
            Aqui, a conversa não é sobre milagre. É sobre cuidado honesto, individual e possível.

            Cada pessoa responde de um jeito. O importante é ter direção, acompanhamento e expectativa realista.

            Confiança se constrói com verdade.

            #HistoriasReais #TratamentoDaObesidade #MeJoy"""
        ),
    },
    {
        "post": 7,
        "slug": "resultado-que-continua",
        "title": "Resultado que continua",
        "subtitle": "Mais consistência, menos ansiedade por pressa.",
        "cta": "Entender o processo",
        "source": ROOT / "public/images/emagrecimento/medvi/reviews-04.avif",
        "caption": dedent(
            """\
            Resultado bom não é só o que aparece rápido. É o que continua fazendo sentido ao longo do caminho.

            Sustentabilidade vem antes de ansiedade. Consistência vem antes de impulso.

            É assim que o progresso se sustenta.

            #ResultadosSustentaveis #SaudeMetabolica #MeJoy"""
        ),
    },
    {
        "post": 8,
        "slug": "mais-clareza-menos-culpa",
        "title": "Mais clareza.\nMenos culpa.",
        "subtitle": "Quando o processo faz sentido, cuidar da saúde deixa de ser guerra diária.",
        "cta": "Cuidar com clareza",
        "source": ROOT / "public/images/emagrecimento/medvi/reviews-03.avif",
        "caption": dedent(
            """\
            Quando você entende o processo, o cuidado fica mais leve.

            Menos culpa. Menos confusão. Mais clareza para continuar.

            Isso também é resultado.

            #BemEstar #SaudeMetabolica #MeJoy"""
        ),
    },
    {
        "post": 9,
        "slug": "entender-vem-antes-de-decidir",
        "title": "Entender vem\nantes de decidir",
        "subtitle": "O primeiro passo é descobrir o que faz sentido para você hoje.",
        "cta": "Fazer minha triagem",
        "source": ROOT / "public/images/emagrecimento/medvi/hero-secondary.webp",
        "caption": dedent(
            """\
            Nem todo mundo precisa da mesma estratégia. Por isso, o primeiro passo é entender o que faz sentido para você hoje.

            Se quiser começar com clareza, a triagem está aberta.

            Direção antes de decisão.

            #TriagemOnline #EmagrecimentoComAcompanhamento #MeJoy"""
        ),
    },
]


def ensure_dirs() -> None:
    for path in [OUT_DIR, FINAL_DIR, REVIEW_DIR]:
        path.mkdir(parents=True, exist_ok=True)


def font(size: int, *, bold: bool = False) -> ImageFont.FreeTypeFont:
    path = FONT_BOLD if bold else FONT_REGULAR
    return ImageFont.truetype(path, size=size)


def lerp(a: str, b: str, t: float) -> tuple[int, int, int]:
    c1 = ImageColor.getrgb(a)
    c2 = ImageColor.getrgb(b)
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))


def cover(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    return ImageOps.fit(im, size, method=Image.Resampling.LANCZOS)


def contain(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    return ImageOps.contain(im, size, method=Image.Resampling.LANCZOS)


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    return mask


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font_obj: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    lines: list[str] = []
    for block in text.split("\n"):
        words = block.split()
        current = ""
        for word in words:
            candidate = word if not current else f"{current} {word}"
            bbox = draw.textbbox((0, 0), candidate, font=font_obj)
            if bbox[2] - bbox[0] <= max_width or not current:
                current = candidate
            else:
                lines.append(current)
                current = word
        if current:
            lines.append(current)
        elif not words:
            lines.append("")
    return lines


def fit_font(
    draw: ImageDraw.ImageDraw,
    text: str,
    *,
    max_width: int,
    max_lines: int,
    start_size: int,
    min_size: int,
    bold: bool = False,
) -> tuple[ImageFont.FreeTypeFont, list[str]]:
    for size in range(start_size, min_size - 1, -2):
        f = font(size, bold=bold)
        lines = wrap_text(draw, text, f, max_width)
        if len(lines) <= max_lines:
            return f, lines
    f = font(min_size, bold=bold)
    return f, wrap_text(draw, text, f, max_width)


def draw_centered_lines(
    draw: ImageDraw.ImageDraw,
    lines: list[str],
    *,
    center_x: int,
    y: int,
    font_obj: ImageFont.FreeTypeFont,
    fill: str,
    line_gap: int,
) -> int:
    current_y = y
    total_h = 0
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font_obj)
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
        draw.text((center_x - w / 2, current_y), line, font=font_obj, fill=fill)
        current_y += h + line_gap
        total_h += h + line_gap
    return total_h - line_gap


def render_background() -> Image.Image:
    bg = Image.new("RGBA", (CANVAS_W, CANVAS_H))
    px = bg.load()
    for y in range(CANVAS_H):
        t = y / max(1, CANVAS_H - 1)
        color = lerp(BG_TOP, BG_BOTTOM, t)
        for x in range(CANVAS_W):
            px[x, y] = (*color, 255)

    overlay = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    d.ellipse((740, -60, 1180, 330), fill=(255, 255, 255, 130))
    d.ellipse((-120, 980, 280, 1400), fill=(255, 160, 58, 30))
    d.rounded_rectangle((36, 36, CANVAS_W - 36, CANVAS_H - 36), radius=32, outline=LINE, width=2)
    bg.alpha_composite(overlay)
    return bg


def crop_logo_icon() -> Image.Image:
    source = LOGO_SCREENSHOT if LOGO_SCREENSHOT.exists() else LOGO_FALLBACK
    with Image.open(source) as raw:
        im = raw.convert("RGBA")
    bg = im.getpixel((0, 0))
    width, height = im.size
    xs = []
    ys = []
    for y in range(height):
        for x in range(width):
            p = im.getpixel((x, y))
            if sum(abs(p[i] - bg[i]) for i in range(3)) > 12:
                xs.append(x)
                ys.append(y)
    if not xs:
        return im
    x0 = max(0, min(xs) - 8)
    y0 = max(0, min(ys) - 8)
    x1 = min(width, max(xs) + 8)
    y1 = min(height, max(ys) + 8)
    return im.crop((x0, y0, x1, y1))


def draw_header(base: Image.Image, draw: ImageDraw.ImageDraw, logo_icon: Image.Image) -> None:
    icon = contain(logo_icon, (72, 72))
    title_font = font(56, bold=True)
    slogan_font = font(24, bold=False)
    title = "Me Joy"
    slogan = "Me Amo, Me Cuido"

    title_box = draw.textbbox((0, 0), title, font=title_font)
    title_w = title_box[2] - title_box[0]
    row_w = icon.width + 18 + title_w
    row_x = (CANVAS_W - row_w) // 2
    row_y = 58

    shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((row_x - 8, row_y - 6, row_x + icon.width + 8, row_y + icon.height + 6), radius=20, fill=(0, 0, 0, 24))
    shadow = shadow.filter(ImageFilter.GaussianBlur(10))
    base.alpha_composite(shadow)
    base.paste(icon, (row_x, row_y), icon)

    title_y = row_y + (icon.height - (title_box[3] - title_box[1])) / 2 - 2
    draw.text((row_x + icon.width + 18, title_y), title, font=title_font, fill=BROWN)

    sb = draw.textbbox((0, 0), slogan, font=slogan_font)
    sw = sb[2] - sb[0]
    draw.text(((CANVAS_W - sw) / 2, 144), slogan, font=slogan_font, fill=GREEN)


def render_image_block(base: Image.Image, source_path: Path) -> None:
    with Image.open(source_path) as raw:
        src = raw.convert("RGB")

    card_x = 78
    card_y = 196
    card_w = 924
    card_h = 584

    shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(shadow)
    d.rounded_rectangle((card_x + 12, card_y + 16, card_x + card_w + 12, card_y + card_h + 16), radius=34, fill=(10, 40, 36, 40))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    base.alpha_composite(shadow)

    card = Image.new("RGBA", (card_w, card_h), (255, 255, 255, 0))
    cd = ImageDraw.Draw(card)
    cd.rounded_rectangle((0, 0, card_w, card_h), radius=34, fill="white", outline="#D8E4E0", width=3)

    image_box_w = card_w - 76
    image_box_h = card_h - 76
    image = cover(src, (image_box_w, image_box_h))
    image = ImageEnhance.Color(image).enhance(1.03)
    image = ImageEnhance.Contrast(image).enhance(1.02)
    image_rgba = image.convert("RGBA")
    ix = (card_w - image.width) // 2
    iy = (card_h - image.height) // 2
    card.paste(image_rgba, (ix, iy), rounded_mask((image.width, image.height), 28))

    base.paste(card, (card_x, card_y), rounded_mask((card_w, card_h), 34))


def render_post(post: dict, logo_icon: Image.Image) -> Path:
    base = render_background()
    draw = ImageDraw.Draw(base)
    draw_header(base, draw, logo_icon)
    render_image_block(base, post["source"])

    title_font, title_lines = fit_font(
        draw,
        post["title"],
        max_width=860,
        max_lines=2,
        start_size=68,
        min_size=50,
        bold=True,
    )
    title_y = 838
    draw_centered_lines(draw, title_lines, center_x=CANVAS_W // 2, y=title_y, font_obj=title_font, fill=TEXT, line_gap=10)

    draw.rounded_rectangle((CANVAS_W // 2 - 56, 1032, CANVAS_W // 2 + 56, 1040), radius=4, fill=ORANGE)

    subtitle_font, subtitle_lines = fit_font(
        draw,
        post["subtitle"],
        max_width=860,
        max_lines=3,
        start_size=32,
        min_size=26,
        bold=False,
    )
    draw_centered_lines(draw, subtitle_lines, center_x=CANVAS_W // 2, y=1074, font_obj=subtitle_font, fill=TEXT_SOFT, line_gap=8)

    button_font = font(28, bold=True)
    button_text = post["cta"]
    bb = draw.textbbox((0, 0), button_text, font=button_font)
    bw = (bb[2] - bb[0]) + 64
    bh = (bb[3] - bb[1]) + 28
    bx = (CANVAS_W - bw) // 2
    by = 1210
    draw.rounded_rectangle((bx, by, bx + bw, by + bh), radius=30, fill=GREEN)
    draw.text((bx + 32, by + 14), button_text, font=button_font, fill="white")

    out_path = FINAL_DIR / f"{post['post']:02d}-{post['slug']}.jpg"
    base.convert("RGB").save(out_path, quality=94, subsampling=0)
    return out_path


def write_manifest(output_paths: list[Path]) -> None:
    rows = []
    for post, final_path in zip(POSTS, output_paths):
        rows.append(
            {
                "post": post["post"],
                "slug": post["slug"],
                "title": post["title"].replace("\n", " "),
                "subtitle": post["subtitle"],
                "cta": post["cta"],
                "final_image": str(final_path.relative_to(ROOT)),
                "caption": post["caption"],
            }
        )
    (OUT_DIR / "post-manifest.json").write_text(json.dumps(rows, indent=2, ensure_ascii=False) + "\n")
    with (OUT_DIR / "post-manifest.csv").open("w", newline="", encoding="utf-8") as fp:
        writer = csv.DictWriter(fp, fieldnames=["post", "slug", "title", "subtitle", "cta", "final_image", "caption"])
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def write_markdown(output_paths: list[Path]) -> None:
    lines = [
        "# Série final validada - Instagram/Facebook",
        "",
        "9 posts finais com `Me Joy` e slogan `Me Amo, Me Cuido`.",
        "",
    ]
    for post, image_path in zip(POSTS, output_paths):
        lines.extend(
            [
                f"## Post {post['post']:02d}",
                "",
                f"- Imagem: `{image_path.relative_to(ROOT)}`",
                f"- Título: `{post['title'].replace(chr(10), ' ')}`",
                f"- Subtítulo: `{post['subtitle']}`",
                f"- CTA: `{post['cta']}`",
                "",
                "```text",
                post["caption"].rstrip(),
                "```",
                "",
            ]
        )
    (OUT_DIR / "copies-prontas.md").write_text("\n".join(lines) + "\n")


def write_preview(output_paths: list[Path]) -> None:
    cols = 3
    rows = 3
    pad = 28
    thumb_w = 300
    thumb_h = 375
    sheet = Image.new("RGB", (cols * thumb_w + (cols + 1) * pad, rows * thumb_h + (rows + 1) * pad), "#F0E2D2")
    for idx, path in enumerate(output_paths):
        with Image.open(path) as im:
            tile = cover(im.convert("RGB"), (thumb_w, thumb_h))
        x = pad + (idx % cols) * (thumb_w + pad)
        y = pad + (idx // cols) * (thumb_h + pad)
        sheet.paste(tile, (x, y))
    sheet.save(REVIEW_DIR / "feed-preview-9.jpg", quality=94)


def main() -> None:
    ensure_dirs()
    logo_icon = crop_logo_icon()
    output_paths = [render_post(post, logo_icon) for post in POSTS]
    write_manifest(output_paths)
    write_markdown(output_paths)
    write_preview(output_paths)
    print(f"Gerados {len(output_paths)} posts em {FINAL_DIR}")


if __name__ == "__main__":
    main()
