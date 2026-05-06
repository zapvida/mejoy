from __future__ import annotations

import csv
import json
import math
from pathlib import Path
from textwrap import dedent

from PIL import Image, ImageColor, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "codex-artifacts" / "social-launch-v4"
FINAL_DIR = OUT_DIR / "final-posts"
SOURCE_DIR = OUT_DIR / "selected-sources"
REVIEW_DIR = OUT_DIR / "review"

CANVAS_W = 1080
CANVAS_H = 1350

FONT_REGULAR = "/System/Library/Fonts/Avenir Next.ttc"
FONT_BOLD = "/System/Library/Fonts/Avenir.ttc"

CREAM_TOP = "#FFF7EE"
CREAM_BOTTOM = "#F5EBDD"
DEEP_GREEN = "#0C5A50"
DEEP_GREEN_2 = "#13483F"
MUTED_GREEN = "#2B6B62"
ORANGE = "#FF7A12"
ORANGE_2 = "#FF922E"
TEXT = "#10212A"
TEXT_SOFT = "#5E6870"
LINE = "#EADBC7"

BRAND_X = 72
BRAND_Y = 58
CARD_X = 60
CARD_Y = 146
CARD_W = 960
CARD_H = 640
BODY_X = 72
BODY_W = 936
BODY_Y = 844


POSTS = [
    {
        "post": 1,
        "slug": "direcao-medica",
        "category": "POSICIONAMENTO",
        "title": "Emagrecer com direção médica",
        "subtitle": "Clareza, plano individual e acompanhamento para construir resultado sustentável.",
        "cta": "Começar minha triagem",
        "source": ROOT / "public/images/emagrecimento/medvi/hero-main.webp",
        "caption": dedent(
            """\
            Se você já tentou recomeçar muitas vezes, talvez o que faltou não tenha sido esforço. Faltou direção.

            Na MeJoy, o começo é com triagem, avaliação médica e acompanhamento. Sem atalho. Sem promessa vazia.

            Se fizer sentido para você, comece pela triagem.

            #EmagrecimentoComAcompanhamento #SaudeMetabolica #MeJoy"""
        ),
    },
    {
        "post": 2,
        "slug": "seu-caso-primeiro",
        "category": "TRIAGEM",
        "title": "Seu caso vem antes da solução",
        "subtitle": "A triagem organiza histórico, rotina e objetivos antes de qualquer decisão.",
        "cta": "Entender meu caso",
        "source": ROOT / "public/images/emagrecimento/medvi/journey-triagem.avif",
        "caption": dedent(
            """\
            Antes de pensar em solução, vale entender o seu caso.

            A triagem ajuda a organizar histórico, rotina e objetivos com mais clareza. Decisão boa começa com contexto.

            Começar por aqui deixa o próximo passo mais seguro e mais inteligente.

            #TriagemOnline #EmagrecimentoComAcompanhamento #MeJoy"""
        ),
    },
    {
        "post": 3,
        "slug": "criterio-clinico",
        "category": "SEGURANÇA",
        "title": "Toda conduta começa com critério",
        "subtitle": "Avaliação clínica antes de qualquer ajuste, prescrição ou próximo passo.",
        "cta": "Ver como funciona",
        "source": ROOT / "public/images/emagrecimento/medvi/journey-consulta.avif",
        "caption": dedent(
            """\
            Emagrecimento sério não é receita pronta.

            Toda conduta precisa passar por avaliação clínica, com critério e responsabilidade. É assim que a jornada fica mais segura e mais clara.

            Segurança não atrasa o processo. Segurança protege o processo.

            #AvaliacaoMedica #TratamentoDaObesidade #MeJoy"""
        ),
    },
    {
        "post": 4,
        "slug": "acompanhamento-real",
        "category": "ACOMPANHAMENTO",
        "title": "Você não precisa sustentar isso sozinho(a)",
        "subtitle": "Com acompanhamento certo, a rotina pesa menos e a constância fica mais viável.",
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
        "slug": "vida-real",
        "category": "ROTINA",
        "title": "Seu plano precisa\ncaber na rotina",
        "subtitle": "Resultado sustentável nasce de adesão, ajustes e estratégia possível.",
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
        "slug": "historias-reais",
        "category": "CONFIANÇA",
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
        "slug": "sustentabilidade",
        "category": "SUSTENTABILIDADE",
        "title": "Resultado bom é o que continua",
        "subtitle": "Menos ansiedade por pressa. Mais consistência para manter progresso com responsabilidade.",
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
        "slug": "clareza-e-leveza",
        "category": "BEM-ESTAR",
        "title": "Mais clareza. Menos culpa.",
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
        "slug": "comecar-com-clareza",
        "category": "PRÓXIMO PASSO",
        "title": "Comece pelo que faz sentido para você",
        "subtitle": "A triagem ajuda a entender seu momento com privacidade e direção inicial.",
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
    for path in [OUT_DIR, FINAL_DIR, SOURCE_DIR, REVIEW_DIR]:
        path.mkdir(parents=True, exist_ok=True)


def font(size: int, *, bold: bool = False) -> ImageFont.FreeTypeFont:
    path = FONT_BOLD if bold else FONT_REGULAR
    return ImageFont.truetype(path, size=size)


def lerp(a: str, b: str, t: float) -> tuple[int, int, int]:
    c1 = ImageColor.getrgb(a)
    c2 = ImageColor.getrgb(b)
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))


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


def draw_lines(
    draw: ImageDraw.ImageDraw,
    lines: list[str],
    *,
    x: int,
    y: int,
    font_obj: ImageFont.FreeTypeFont,
    fill: str,
    line_gap: int,
    stroke_width: int = 0,
) -> int:
    current_y = y
    for idx, line in enumerate(lines):
        draw.text((x, current_y), line, font=font_obj, fill=fill, stroke_width=stroke_width, stroke_fill=fill)
        bbox = draw.textbbox((x, current_y), line, font=font_obj)
        current_y += (bbox[3] - bbox[1]) + line_gap
    return current_y - y


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    return mask


def cover(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    return ImageOps.fit(im, size, method=Image.Resampling.LANCZOS)


def contain(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    return ImageOps.contain(im, size, method=Image.Resampling.LANCZOS)


def render_background() -> Image.Image:
    bg = Image.new("RGBA", (CANVAS_W, CANVAS_H))
    pixels = bg.load()
    for y in range(CANVAS_H):
        t = y / max(1, CANVAS_H - 1)
        color = lerp(CREAM_TOP, CREAM_BOTTOM, t)
        for x in range(CANVAS_W):
            pixels[x, y] = (*color, 255)

    overlay = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    d.ellipse((760, -100, 1220, 360), fill=(255, 255, 255, 120))
    d.ellipse((-90, 1010, 330, 1450), fill=(255, 164, 72, 34))
    d.rounded_rectangle((36, 36, CANVAS_W - 36, CANVAS_H - 36), radius=34, outline=LINE, width=2)
    bg.alpha_composite(overlay)
    return bg


def add_shadow(base: Image.Image, box: tuple[int, int, int, int], radius: int = 32, alpha: int = 70) -> None:
    shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(shadow)
    d.rounded_rectangle(box, radius=radius, fill=(7, 37, 34, alpha))
    shadow = shadow.filter(ImageFilter.GaussianBlur(20))
    base.alpha_composite(shadow)


def draw_brand(draw: ImageDraw.ImageDraw) -> None:
    label = "MeJoy"
    f = font(31, bold=True)
    bbox = draw.textbbox((0, 0), label, font=f)
    pill_w = bbox[2] - bbox[0] + 54
    pill_h = max(56, bbox[3] - bbox[1] + 22)
    draw.rounded_rectangle((BRAND_X, BRAND_Y, BRAND_X + pill_w, BRAND_Y + pill_h), radius=26, fill=ORANGE)
    draw.text((BRAND_X + pill_w / 2, BRAND_Y + pill_h / 2 - 1), label, font=f, fill="white", anchor="mm")


def render_image_block(base: Image.Image, source_path: Path) -> None:
    with Image.open(source_path) as raw:
        src = raw.convert("RGB")

    outer = cover(src, (CARD_W, CARD_H))
    outer = ImageEnhance.Brightness(outer).enhance(0.78)
    outer = ImageEnhance.Contrast(outer).enhance(1.04)
    outer = outer.filter(ImageFilter.GaussianBlur(16))

    container = Image.new("RGBA", (CARD_W, CARD_H), (0, 0, 0, 0))
    d = ImageDraw.Draw(container)
    d.rounded_rectangle((0, 0, CARD_W, CARD_H), radius=46, fill=DEEP_GREEN_2)

    blurred = outer.convert("RGBA")
    blurred.putalpha(190)
    container.alpha_composite(blurred)

    sheen = Image.new("RGBA", (CARD_W, CARD_H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sheen)
    sd.rectangle((0, CARD_H - 120, CARD_W, CARD_H), fill=(255, 255, 255, 20))
    sd.rectangle((0, 0, CARD_W, 70), fill=(255, 255, 255, 16))
    container.alpha_composite(sheen)

    inner = contain(src, (CARD_W - 112, CARD_H - 112))
    inner = ImageEnhance.Color(inner).enhance(1.03)
    inner = ImageEnhance.Sharpness(inner).enhance(1.05)
    inner_rgba = inner.convert("RGBA")
    inner_x = (CARD_W - inner.width) // 2
    inner_y = (CARD_H - inner.height) // 2

    card_box = (CARD_X, CARD_Y, CARD_X + CARD_W, CARD_Y + CARD_H)
    add_shadow(base, card_box, radius=46, alpha=65)
    base.paste(container, (CARD_X, CARD_Y), rounded_mask((CARD_W, CARD_H), 46))
    base.paste(inner_rgba, (CARD_X + inner_x, CARD_Y + inner_y), rounded_mask((inner.width, inner.height), 34))


def render_post(post: dict) -> Path:
    base = render_background()
    render_image_block(base, post["source"])
    draw = ImageDraw.Draw(base)

    draw_brand(draw)

    cat_font = font(22, bold=True)
    draw.text((BODY_X, BODY_Y), post["category"], font=cat_font, fill=MUTED_GREEN)

    title_font, title_lines = fit_font(
        draw,
        post["title"],
        max_width=BODY_W,
        max_lines=2,
        start_size=70,
        min_size=50,
        bold=True,
    )
    title_y = BODY_Y + 42
    title_height = draw_lines(
        draw,
        title_lines,
        x=BODY_X,
        y=title_y,
        font_obj=title_font,
        fill=TEXT,
        line_gap=8,
        stroke_width=1,
    )

    line_y = title_y + title_height + 22
    draw.rounded_rectangle((BODY_X, line_y, BODY_X + 142, line_y + 8), radius=4, fill=ORANGE)

    subtitle_font, subtitle_lines = fit_font(
        draw,
        post["subtitle"],
        max_width=BODY_W,
        max_lines=2,
        start_size=34,
        min_size=28,
        bold=False,
    )
    subtitle_y = line_y + 34
    draw_lines(
        draw,
        subtitle_lines,
        x=BODY_X,
        y=subtitle_y,
        font_obj=subtitle_font,
        fill=TEXT_SOFT,
        line_gap=8,
    )

    button_font = font(27, bold=True)
    button_text = post["cta"]
    bb = draw.textbbox((0, 0), button_text, font=button_font)
    bw = (bb[2] - bb[0]) + 58
    bh = 56
    by = 1214
    bx = BODY_X
    draw.rounded_rectangle((bx, by, bx + bw, by + bh), radius=28, fill=DEEP_GREEN)
    draw.text((bx + bw / 2, by + bh / 2 - 1), button_text, font=button_font, fill="white", anchor="mm")

    note = "Acompanhamento médico individual"
    note_font = font(22, bold=False)
    nb = draw.textbbox((0, 0), note, font=note_font)
    nw = nb[2] - nb[0]
    draw.text((CANVAS_W - 72, by + bh / 2 - 1), note, font=note_font, fill=MUTED_GREEN, anchor="rm")

    out_path = FINAL_DIR / f"{post['post']:02d}-{post['slug']}.jpg"
    base.convert("RGB").save(out_path, quality=92, subsampling=0)
    return out_path


def copy_sources() -> None:
    for post in POSTS:
        suffix = post["source"].suffix.lower()
        target = SOURCE_DIR / f"{post['post']:02d}-{post['slug']}{suffix}"
        target.write_bytes(post["source"].read_bytes())


def write_manifest(output_paths: list[Path]) -> None:
    rows = []
    for post, final_path in zip(POSTS, output_paths):
        rows.append(
            {
                "post": post["post"],
                "slug": post["slug"],
                "category": post["category"],
                "title": post["title"],
                "subtitle": post["subtitle"],
                "cta": post["cta"],
                "source_image": str(post["source"].relative_to(ROOT)),
                "final_image": str(final_path.relative_to(ROOT)),
                "caption": post["caption"],
            }
        )

    (OUT_DIR / "post-manifest.json").write_text(json.dumps(rows, indent=2, ensure_ascii=False) + "\n")

    with (OUT_DIR / "post-manifest.csv").open("w", newline="", encoding="utf-8") as fp:
        writer = csv.DictWriter(
            fp,
            fieldnames=["post", "slug", "category", "title", "subtitle", "cta", "source_image", "final_image", "caption"],
        )
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def write_markdown(output_paths: list[Path]) -> None:
    lines = [
        "# Série final - Instagram/Facebook",
        "",
        "9 posts finais, em ordem, com imagens e legendas prontas para copiar e colar.",
        "",
    ]
    for post, image_path in zip(POSTS, output_paths):
        lines.extend(
            [
                f"## Post {post['post']:02d}",
                "",
                f"- Imagem: `{image_path.relative_to(ROOT)}`",
                f"- Título na arte: `{post['title']}`",
                f"- Subtítulo na arte: `{post['subtitle']}`",
                f"- CTA na arte: `{post['cta']}`",
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
    sheet = Image.new("RGB", (cols * thumb_w + (cols + 1) * pad, rows * thumb_h + (rows + 1) * pad), "#EFE4D6")
    for idx, path in enumerate(output_paths):
        with Image.open(path) as im:
            tile = cover(im.convert("RGB"), (thumb_w, thumb_h))
        x = pad + (idx % cols) * (thumb_w + pad)
        y = pad + (idx // cols) * (thumb_h + pad)
        sheet.paste(tile, (x, y))
    sheet.save(REVIEW_DIR / "feed-preview-9.jpg", quality=92)


def main() -> None:
    ensure_dirs()
    copy_sources()
    output_paths = [render_post(post) for post in POSTS]
    write_manifest(output_paths)
    write_markdown(output_paths)
    write_preview(output_paths)
    print(f"Gerados {len(output_paths)} posts em {FINAL_DIR}")


if __name__ == "__main__":
    main()
