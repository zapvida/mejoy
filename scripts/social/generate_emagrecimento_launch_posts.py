from __future__ import annotations

import csv
import json
import math
from pathlib import Path
from textwrap import dedent

from PIL import Image, ImageColor, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "codex-artifacts" / "social-launch"
FINAL_DIR = OUT_DIR / "final-posts"
SOURCE_DIR = OUT_DIR / "selected-sources"
REVIEW_DIR = OUT_DIR / "review"

CANVAS_W = 1080
CANVAS_H = 1350
CARD_X = 72
CARD_Y = 150
CARD_W = 936
CARD_H = 640
BODY_X = 72
BODY_Y = 860
BODY_W = 936
FOOTER_Y = 1236

FONT_REGULAR = "/System/Library/Fonts/Avenir Next.ttc"
FONT_BOLD = "/System/Library/Fonts/Avenir.ttc"

BG_TOP = "#FFF8F0"
BG_BOTTOM = "#F2ECE2"
TEXT = "#111827"
TEXT_MUTED = "#5B6470"
EMERALD = "#114B45"
EMERALD_SOFT = "#E7F2EE"
ORANGE = "#F97A10"
ORANGE_SOFT = "#FFF1E3"
LINE = "#E8DED0"


POSTS = [
    {
        "post": 1,
        "grid_order": 1,
        "slug": "emagrecimento-com-criterio-medico",
        "category": "LANÇAMENTO",
        "title": "Emagrecimento com critério médico",
        "subtitle": "Triagem inteligente, plano individual e foco em resultado sustentável.",
        "cta": "Comece pela triagem",
        "footer": "Conteúdo educativo. Avaliação médica individual.",
        "source": ROOT / "public/images/emagrecimento/medvi/hero-main.webp",
        "caption": dedent(
            """\
            Emagrecer com segurança não começa na pressa. Começa em entender o seu caso, o seu histórico e o que faz sentido sustentar na vida real.

            Aqui na Me Joy Farma, o ponto de partida é simples: triagem, avaliação médica e acompanhamento contínuo. Sem promessa milagrosa. Sem tentativa aleatória.

            Se você quer começar com mais clareza e menos ruído, esse perfil foi feito para você.

            Se fizer sentido, comece pela triagem.

            #EmagrecimentoComAcompanhamento #SaudeMetabolica #TratamentoDaObesidade"""
        ),
        "alt_text": "Mulher sorrindo em roupa fitness com mensagem sobre emagrecimento com critério médico.",
        "objective": "Apresentação da marca e promessa central.",
        "boost_recommended": True,
    },
    {
        "post": 2,
        "grid_order": 2,
        "slug": "comece-entendendo-o-seu-caso",
        "category": "TRIAGEM",
        "title": "Comece entendendo o seu caso",
        "subtitle": "Uma triagem online clara ajuda a organizar próximos passos com mais segurança.",
        "cta": "Entender meu caso",
        "footer": "Privacidade, clareza e direção inicial.",
        "source": ROOT / "public/images/emagrecimento/medvi/journey-triagem.avif",
        "caption": dedent(
            """\
            Muita gente tenta resolver o emagrecimento pulando etapas. O problema é que, sem contexto, qualquer decisão vira chute.

            A triagem existe para organizar o caso antes de qualquer conduta. Ela ajuda a entender objetivos, rotina, histórico e pontos de atenção.

            Quanto mais clareza no início, melhor a decisão depois.

            Se você quer sair da tentativa aleatória, comece por aqui: entenda o seu caso primeiro.

            #TriagemOnline #EmagrecimentoComAcompanhamento #SaudeMetabolica"""
        ),
        "alt_text": "Mãos segurando celular com mensagem sobre triagem online para emagrecimento.",
        "objective": "Educar sobre o primeiro passo do funil.",
        "boost_recommended": True,
    },
    {
        "post": 3,
        "grid_order": 3,
        "slug": "nada-e-decidido-no-automatico",
        "category": "SEGURANÇA",
        "title": "Nada é decidido no automático",
        "subtitle": "A avaliação médica vem antes de qualquer conduta, ajuste ou prescrição.",
        "cta": "Ver como funciona",
        "footer": "Segurança antes de velocidade.",
        "source": ROOT / "public/images/emagrecimento/medvi/journey-consulta.avif",
        "caption": dedent(
            """\
            Emagrecimento sério não é receita pronta.

            Antes de qualquer estratégia, existe uma etapa que não pode ser ignorada: avaliação clínica. É ela que ajuda a entender indicações, limites, riscos e próximos passos com responsabilidade.

            Nosso objetivo não é empurrar uma solução. É decidir com critério médico.

            Se você valoriza segurança e clareza antes de começar, esse é o tipo de processo que faz sentido conhecer.

            #AvaliacaoMedica #TratamentoDaObesidade #EmagrecimentoComAcompanhamento"""
        ),
        "alt_text": "Médico em ambiente clínico com notebook e mensagem sobre avaliação médica antes da conduta.",
        "objective": "Construir confiança e reduzir objeção de segurança.",
        "boost_recommended": True,
    },
    {
        "post": 4,
        "grid_order": 4,
        "slug": "voce-nao-precisa-fazer-isso-sozinho",
        "category": "SUPORTE",
        "title": "Você não precisa fazer isso sozinho(a)",
        "subtitle": "Nossa equipe acompanha rotina, dúvidas e próximos passos ao longo do processo.",
        "cta": "Conhecer o suporte",
        "footer": "Acompanhamento contínuo faz diferença.",
        "source": ROOT / "public/images/emagrecimento/medvi/support-whatsapp.avif",
        "caption": dedent(
            """\
            O que mais atrapalha muita gente não é falta de vontade. É fazer tudo sem direção, sem ajuste e sem apoio.

            Quando existe acompanhamento, a jornada fica mais clara: o que observar, quando ajustar, como manter adesão e como seguir sem depender de motivação do dia.

            Emagrecimento sustentável pede constância. E constância fica mais fácil quando você não carrega o processo sozinho(a).

            #AcompanhamentoContinuo #SaudeMetabolica #EmagrecimentoComAcompanhamento"""
        ),
        "alt_text": "Profissional de saúde em ambiente clínico com mensagem sobre suporte contínuo.",
        "objective": "Reforçar valor de acompanhamento e adesão.",
        "boost_recommended": False,
    },
    {
        "post": 5,
        "grid_order": 5,
        "slug": "seu-plano-precisa-caber-na-vida-real",
        "category": "ROTINA",
        "title": "Seu plano precisa caber na vida real",
        "subtitle": "Constância, adesão e ajustes bem feitos valem mais do que pressa.",
        "cta": "Buscar constância",
        "footer": "Rotina sustentável > pressa.",
        "source": ROOT / "public/images/emagrecimento/medvi/metabolism-habits.avif",
        "caption": dedent(
            """\
            Não adianta ter um plano bonito no papel se ele não cabe na sua rotina.

            Resultado sustentável costuma nascer de três coisas simples: estratégia possível, adesão consistente e ajustes ao longo do caminho.

            Por isso, a conversa aqui não é sobre pressa. É sobre construir um processo que você consiga manter.

            Quando a rotina faz sentido, o tratamento deixa de parecer castigo e começa a virar cuidado de verdade.

            #Constancia #EmagrecimentoComAcompanhamento #SaudeMetabolica"""
        ),
        "alt_text": "Mulher sorrindo em roupa esportiva com mensagem sobre rotina sustentável.",
        "objective": "Conectar com dor de aderência e rotina.",
        "boost_recommended": False,
    },
    {
        "post": 6,
        "grid_order": 6,
        "slug": "pessoas-reais-evolucao-real",
        "category": "HISTÓRIAS REAIS",
        "title": "Pessoas reais. Evolução real.",
        "subtitle": "Com identidade preservada, cuidado individual e expectativas mais honestas.",
        "cta": "Ver histórias reais",
        "footer": "Cada caso evolui de um jeito.",
        "source": ROOT / "public/images/emagrecimento/medvi/reviews-01.webp",
        "caption": dedent(
            """\
            Aqui a gente não trabalha com comparação injusta nem promessa vazia.

            O que importa é respeitar a história de cada pessoa, o tempo de cada organismo e a necessidade de acompanhar com responsabilidade.

            Mostrar evolução real é, para nós, falar com honestidade: existe caminho, existe processo e existe individualidade.

            Se você busca um cuidado mais sério e menos performático, esse é o ponto de vista da casa.

            #HistoriasReais #TratamentoDaObesidade #EmagrecimentoComAcompanhamento"""
        ),
        "alt_text": "Mulher sorrindo com mensagem sobre histórias reais e evolução real.",
        "objective": "Prova social com tom humano e preservação de identidade.",
        "boost_recommended": False,
    },
    {
        "post": 7,
        "grid_order": 7,
        "slug": "resultado-sustentavel-e-o-que-continua",
        "category": "RESULTADOS",
        "title": "Resultado sustentável é o que continua",
        "subtitle": "Sem promessa milagrosa. Com acompanhamento responsável e metas possíveis.",
        "cta": "Entender o processo",
        "footer": "Resultados variam de pessoa para pessoa.",
        "source": ROOT / "public/images/emagrecimento/medvi/reviews-04.avif",
        "caption": dedent(
            """\
            O resultado que mais interessa não é o que impressiona por alguns dias. É o que continua fazendo sentido depois.

            Emagrecimento sustentável passa por acompanhamento, ajuste e expectativa realista. Sem atalho emocional. Sem discurso de milagre.

            Nosso papel é ajudar você a construir um processo mais seguro, mais claro e mais honesto.

            Porque manter progresso vale mais do que correr atrás de promessa.

            #ResultadosSustentaveis #SaudeMetabolica #EmagrecimentoComAcompanhamento"""
        ),
        "alt_text": "Mulher grisalha sorrindo com mensagem sobre resultados sustentáveis.",
        "objective": "Posicionar contra promessas milagrosas e a favor de sustentabilidade.",
        "boost_recommended": True,
    },
    {
        "post": 8,
        "grid_order": 8,
        "slug": "quando-o-processo-faz-sentido-a-rotina-muda",
        "category": "BEM-ESTAR",
        "title": "Quando o processo faz sentido, a rotina muda",
        "subtitle": "Mais clareza, mais confiança e menos culpa para cuidar da saúde.",
        "cta": "Cuidar com mais clareza",
        "footer": "Cuidado médico também é alívio mental.",
        "source": ROOT / "public/images/emagrecimento/medvi/reviews-03.avif",
        "caption": dedent(
            """\
            Tem uma parte do emagrecimento que quase não aparece nas promessas da internet: o alívio de finalmente ter direção.

            Quando você entende o processo, sabe o que observar e sente que existe acompanhamento, a rotina deixa de ser guerra diária.

            Menos culpa. Menos confusão. Mais clareza para cuidar da saúde com constância.

            Esse tipo de transformação também importa.

            #BemEstar #SaudeMetabolica #EmagrecimentoComAcompanhamento"""
        ),
        "alt_text": "Mulher de cabelos cacheados sorrindo com mensagem sobre mudança de rotina e clareza.",
        "objective": "Conectar com benefício emocional e clareza.",
        "boost_recommended": False,
    },
    {
        "post": 9,
        "grid_order": 9,
        "slug": "quer-saber-o-que-faz-sentido-pra-voce",
        "category": "PRÓXIMO PASSO",
        "title": "Quer saber o que faz sentido pra você?",
        "subtitle": "Comece pela triagem e receba um direcionamento inicial com privacidade.",
        "cta": "Fazer minha triagem",
        "footer": "Primeiro clareza. Depois decisão.",
        "source": ROOT / "public/images/emagrecimento/medvi/hero-secondary.webp",
        "caption": dedent(
            """\
            Nem toda pessoa precisa da mesma estratégia. E esse é exatamente o ponto.

            Antes de pensar em qualquer próximo passo, vale entender melhor o seu contexto, seus objetivos e o que é viável para você hoje.

            A triagem ajuda a organizar isso com mais clareza e privacidade.

            Se você quer sair do modo tentativa e erro, esse pode ser um bom primeiro passo.

            #TriagemOnline #TratamentoDaObesidade #EmagrecimentoComAcompanhamento"""
        ),
        "alt_text": "Mulher em roupa esportiva sorrindo com chamada para fazer triagem.",
        "objective": "CTA principal do grid inicial.",
        "boost_recommended": True,
    },
    {
        "post": 10,
        "grid_order": None,
        "slug": "nem-todo-caso-precisa-da-mesma-estrategia",
        "category": "INDIVIDUALIZAÇÃO",
        "title": "Nem todo caso precisa da mesma estratégia",
        "subtitle": "Cuidado individual significa observar histórico, rotina, objetivos e indicações clínicas.",
        "cta": "Avaliar meu caso",
        "footer": "Decisão boa é decisão individualizada.",
        "source": ROOT / "public/images/emagrecimento/medvi/reviews-07.webp",
        "caption": dedent(
            """\
            O erro de muita comunicação em emagrecimento é tratar todo mundo como se fosse igual.

            Não é.

            Por isso a individualização importa tanto: histórico, rotina, sintomas, objetivos e indicações clínicas mudam a decisão.

            Se você procura uma abordagem mais séria e menos genérica, acompanhe este perfil e comece pelo entendimento do seu caso.

            #CuidadoIndividual #SaudeMetabolica #EmagrecimentoComAcompanhamento"""
        ),
        "alt_text": "Mulher jovem sorrindo com mensagem sobre individualização do cuidado.",
        "objective": "Post extra para continuidade após o grid inicial.",
        "boost_recommended": True,
    },
]


def ensure_dirs() -> None:
    for path in [OUT_DIR, FINAL_DIR, SOURCE_DIR, REVIEW_DIR]:
        path.mkdir(parents=True, exist_ok=True)


def font(size: int, *, bold: bool = False) -> ImageFont.FreeTypeFont:
    path = FONT_BOLD if bold else FONT_REGULAR
    return ImageFont.truetype(path, size=size)


def lerp_color(a: str, b: str, t: float) -> tuple[int, int, int]:
    ca = ImageColor.getrgb(a)
    cb = ImageColor.getrgb(b)
    return tuple(int(ca[i] + (cb[i] - ca[i]) * t) for i in range(3))


def rounded_panel_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
    return mask


def cover(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    return ImageOps.fit(im, size, method=Image.Resampling.LANCZOS)


def contain(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    return ImageOps.contain(im, size, method=Image.Resampling.LANCZOS)


def add_shadow(base: Image.Image, box: tuple[int, int, int, int], radius: int = 26, alpha: int = 65) -> None:
    x0, y0, x1, y1 = box
    shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(shadow)
    draw.rounded_rectangle((x0, y0, x1, y1), radius=radius, fill=(0, 0, 0, alpha))
    shadow = shadow.filter(ImageFilter.GaussianBlur(16))
    base.alpha_composite(shadow)


def draw_wrapped_text(
    draw: ImageDraw.ImageDraw,
    text: str,
    xy: tuple[int, int],
    max_width: int,
    font_obj: ImageFont.FreeTypeFont,
    fill: str,
    line_spacing: int = 8,
) -> tuple[int, int]:
    words = text.split()
    lines: list[str] = []
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

    x, y = xy
    height = 0
    for idx, line in enumerate(lines):
        bbox = draw.textbbox((x, y), line, font=font_obj)
        draw.text((x, y), line, font=font_obj, fill=fill)
        line_h = bbox[3] - bbox[1]
        height += line_h
        if idx < len(lines) - 1:
            y += line_h + line_spacing
            height += line_spacing
    return max_width, height


def draw_brand_pill(draw: ImageDraw.ImageDraw) -> None:
    pill = (BODY_X, 58, BODY_X + 255, 108)
    draw.rounded_rectangle(pill, radius=24, fill=ORANGE)
    draw.text((BODY_X + 28, 70), "ME JOY FARMA", font=font(28, bold=True), fill="white")


def draw_post_index(draw: ImageDraw.ImageDraw, index: int) -> None:
    label = f"{index:02d}/10"
    bbox = draw.textbbox((0, 0), label, font=font(28, bold=True))
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    x0 = CANVAS_W - 72 - w - 30
    y0 = 58
    x1 = x0 + w + 30
    y1 = y0 + h + 18
    draw.rounded_rectangle((x0, y0, x1, y1), radius=22, fill=EMERALD_SOFT)
    draw.text((x0 + 15, y0 + 8), label, font=font(28, bold=True), fill=EMERALD)


def render_background() -> Image.Image:
    bg = Image.new("RGBA", (CANVAS_W, CANVAS_H))
    px = bg.load()
    for y in range(CANVAS_H):
        t = y / max(1, CANVAS_H - 1)
        color = lerp_color(BG_TOP, BG_BOTTOM, t)
        for x in range(CANVAS_W):
            px[x, y] = (*color, 255)

    overlay = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.ellipse((740, -80, 1180, 360), fill=(17, 75, 69, 22))
    draw.ellipse((-120, 980, 320, 1420), fill=(249, 122, 16, 18))
    draw.rounded_rectangle((36, 36, CANVAS_W - 36, CANVAS_H - 36), radius=36, outline=LINE, width=2)
    bg.alpha_composite(overlay)
    return bg


def render_image_card(base: Image.Image, source_path: Path) -> None:
    with Image.open(source_path) as raw:
        im = raw.convert("RGB")
    outer = cover(im, (CARD_W, CARD_H)).filter(ImageFilter.GaussianBlur(18))
    outer = ImageEnhance.Brightness(outer).enhance(0.72)
    outer = ImageEnhance.Contrast(outer).enhance(1.02)
    card = Image.new("RGBA", (CARD_W, CARD_H), (255, 255, 255, 0))
    card_bg = outer.convert("RGBA")

    vignette = Image.new("RGBA", (CARD_W, CARD_H), (0, 0, 0, 0))
    vdraw = ImageDraw.Draw(vignette)
    vdraw.rounded_rectangle((0, 0, CARD_W, CARD_H), radius=50, fill=(0, 0, 0, 24))
    vdraw.rectangle((0, int(CARD_H * 0.58), CARD_W, CARD_H), fill=(0, 0, 0, 36))
    card_bg.alpha_composite(vignette)

    inner = contain(im, (CARD_W - 84, CARD_H - 84))
    inner_rgba = inner.convert("RGBA")
    inner_mask = rounded_panel_mask(inner_rgba.size, 32)

    base_mask = rounded_panel_mask((CARD_W, CARD_H), 52)
    card.paste(card_bg, (0, 0), base_mask)

    inner_x = (CARD_W - inner_rgba.width) // 2
    inner_y = (CARD_H - inner_rgba.height) // 2
    shadow_box = (
        CARD_X + inner_x + 6,
        CARD_Y + inner_y + 12,
        CARD_X + inner_x + inner_rgba.width + 6,
        CARD_Y + inner_y + inner_rgba.height + 12,
    )
    add_shadow(base, shadow_box, radius=32, alpha=60)
    card.paste(inner_rgba, (inner_x, inner_y), inner_mask)

    card_mask = rounded_panel_mask((CARD_W, CARD_H), 52)
    base.paste(card, (CARD_X, CARD_Y), card_mask)


def render_post(post: dict) -> Path:
    base = render_background()
    render_image_card(base, post["source"])
    draw = ImageDraw.Draw(base)

    draw_brand_pill(draw)
    draw_post_index(draw, post["post"])

    draw.text((BODY_X, BODY_Y), post["category"], font=font(24, bold=True), fill=EMERALD)

    draw_wrapped_text(
        draw,
        post["title"],
        (BODY_X, BODY_Y + 38),
        BODY_W,
        font(68, bold=True),
        TEXT,
        line_spacing=6,
    )

    draw.rounded_rectangle((BODY_X, BODY_Y + 224, BODY_X + 146, BODY_Y + 232), radius=4, fill=ORANGE)

    draw_wrapped_text(
        draw,
        post["subtitle"],
        (BODY_X, BODY_Y + 270),
        BODY_W - 70,
        font(32),
        TEXT_MUTED,
        line_spacing=8,
    )

    cta_bbox = draw.textbbox((0, 0), post["cta"], font=font(28, bold=True))
    cta_w = cta_bbox[2] - cta_bbox[0]
    cta_h = cta_bbox[3] - cta_bbox[1]
    cta_x0 = BODY_X
    cta_y0 = FOOTER_Y
    cta_x1 = cta_x0 + cta_w + 42
    cta_y1 = cta_y0 + cta_h + 18
    draw.rounded_rectangle((cta_x0, cta_y0, cta_x1, cta_y1), radius=28, fill=EMERALD)
    draw.text((cta_x0 + 21, cta_y0 + 9), post["cta"], font=font(28, bold=True), fill="white")

    footer_text = post["footer"]
    footer_font = font(22)
    footer_bbox = draw.textbbox((0, 0), footer_text, font=footer_font)
    footer_w = footer_bbox[2] - footer_bbox[0]
    draw.text((CANVAS_W - 72 - footer_w, FOOTER_Y + 10), footer_text, font=footer_font, fill=TEXT_MUTED)

    out_path = FINAL_DIR / f"{post['post']:02d}-{post['slug']}.jpg"
    base.convert("RGB").save(out_path, quality=90, subsampling=0)
    return out_path


def copy_sources() -> None:
    for post in POSTS:
        suffix = post["source"].suffix.lower()
        target = SOURCE_DIR / f"{post['post']:02d}-{post['slug']}{suffix}"
        target.write_bytes(post["source"].read_bytes())


def write_manifest(output_paths: list[Path]) -> None:
    manifest = []
    for post, image_path in zip(POSTS, output_paths):
        manifest.append(
            {
                "post": post["post"],
                "grid_order": post["grid_order"],
                "slug": post["slug"],
                "category": post["category"],
                "title": post["title"],
                "subtitle": post["subtitle"],
                "cta": post["cta"],
                "footer": post["footer"],
                "source_image": str(post["source"].relative_to(ROOT)),
                "final_image": str(image_path.relative_to(ROOT)),
                "caption": post["caption"],
                "alt_text": post["alt_text"],
                "objective": post["objective"],
                "boost_recommended": post["boost_recommended"],
            }
        )
    (OUT_DIR / "post-manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")

    with (OUT_DIR / "post-manifest.csv").open("w", newline="", encoding="utf-8") as fp:
        writer = csv.DictWriter(
            fp,
            fieldnames=[
                "post",
                "grid_order",
                "slug",
                "category",
                "title",
                "subtitle",
                "cta",
                "footer",
                "source_image",
                "final_image",
                "objective",
                "boost_recommended",
                "alt_text",
                "caption",
            ],
        )
        writer.writeheader()
        for row in manifest:
            writer.writerow(row)


def write_markdown(output_paths: list[Path]) -> None:
    lines = [
        "# Plano de lançamento orgânico - Instagram/Facebook",
        "",
        "Primeiros 9 posts: pensados para formar o grid inicial do Instagram e servir também no feed do Facebook.",
        "",
        "Formato final: `1080x1350` (4:5), pronto para feed e boost posterior.",
        "",
        "## Ordem do grid inicial",
        "",
    ]
    for post in POSTS:
        if post["grid_order"] is None:
            continue
        image_path = output_paths[post["post"] - 1]
        lines.extend(
            [
                f"### Post {post['post']:02d} | Grid {post['grid_order']}",
                "",
                f"- Arquivo final: `{image_path.relative_to(ROOT)}`",
                f"- Fonte: `{post['source'].relative_to(ROOT)}`",
                f"- Categoria: `{post['category']}`",
                f"- Título na arte: `{post['title']}`",
                f"- Subtítulo na arte: `{post['subtitle']}`",
                f"- CTA sugerido: `{post['cta']}`",
                f"- Objetivo: {post['objective']}",
                f"- Impulsionar depois: `{'sim' if post['boost_recommended'] else 'não'}`",
                "",
                "**Legenda pronta**",
                "",
                post["caption"],
                "",
            ]
        )

    bonus = POSTS[-1]
    bonus_path = output_paths[-1]
    lines.extend(
        [
            "## Post 10",
            "",
            f"- Arquivo final: `{bonus_path.relative_to(ROOT)}`",
            f"- Fonte: `{bonus['source'].relative_to(ROOT)}`",
            f"- Objetivo: {bonus['objective']}",
            "",
            "**Legenda pronta**",
            "",
            bonus["caption"],
            "",
            "## Observações",
            "",
            "- Os textos na arte foram mantidos curtos para preservar leitura e desempenho em feed.",
            "- O visual foi mantido consistente para os primeiros 9 posts parecerem uma coleção, não peças isoladas.",
            "- A linguagem evita promessa garantida, antes/depois e chamada agressiva relacionada a atributo pessoal.",
            "",
        ]
    )
    (OUT_DIR / "plano-lancamento-emagrecimento.md").write_text("\n".join(lines) + "\n")


def write_preview(output_paths: list[Path]) -> None:
    thumbs = [Image.open(path).convert("RGB") for path in output_paths]
    cols = 3
    pad = 30
    thumb_w = 300
    thumb_h = 375
    rows = math.ceil(len(thumbs) / cols)
    sheet = Image.new("RGB", (cols * thumb_w + (cols + 1) * pad, rows * thumb_h + (rows + 1) * pad), "#efe9de")
    for idx, im in enumerate(thumbs):
        tile = cover(im, (thumb_w, thumb_h))
        x = pad + (idx % cols) * (thumb_w + pad)
        y = pad + (idx // cols) * (thumb_h + pad)
        sheet.paste(tile, (x, y))
    sheet.save(REVIEW_DIR / "feed-preview.jpg", quality=90)


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
