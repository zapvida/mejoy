from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
OUT_PATH = ROOT / "tmp" / "imagegen" / "mejoy-producao-first-2026-05-09.jsonl"

NEGATIVE = (
    "watermark, brand logo, text overlay, fake badge, fake diploma, stock-photo stiffness, "
    "plastic skin, duplicate limbs, distorted hands, exaggerated weight-loss transformation, "
    "before-and-after split frame, sexualized pose, foreign-looking generic stock cast, "
    "medical device branding, unreadable cluttered UI, meme aesthetic, harsh flash"
)

PALETTE = "warm neutrals, pale sage, paper white, soft beige, muted teal accents"
STYLE = (
    "premium Brazilian health-tech editorial photography, photorealistic, real skin texture, "
    "calm telehealth landing page, luxury clinic without ostentation"
)
LIGHTING = "large diffused window light, soft bounced fill, warm-neutral grade, gentle contrast"
CONSTRAINTS = (
    "Brazilian-looking adults only, completely new people, original scene, no competitor likeness, "
    "no logos, no readable sensitive data, no product packaging, no in-image headline text"
)


@dataclass(frozen=True)
class Job:
    slot_id: str
    prompt: str
    size: str
    subject: str
    scene: str
    composition: str
    use_case: str = "mejoy premium landing image"
    out_name: str | None = None

    def to_payload(self) -> dict[str, str]:
        return {
            "prompt": self.prompt,
            "use_case": self.use_case,
            "subject": self.subject,
            "scene": self.scene,
            "style": STYLE,
            "composition": self.composition,
            "lighting": LIGHTING,
            "palette": PALETTE,
            "constraints": CONSTRAINTS,
            "negative": NEGATIVE,
            "size": self.size,
            "out": self.out_name or f"{self.slot_id}.png",
        }


JOBS: tuple[Job, ...] = (
    Job(
        "MJY-EMO-001",
        "Create an original chest-up portrait for the MeJoy home row about weight loss and metabolism.",
        "2880x2880",
        "Brazilian woman, 32 to 40, brunette, healthy and approachable, soft smile, mint active top",
        "clean pale studio background with a faint sage tint and no props",
        "centered chest-up portrait with generous padding for square, 4:5 and 4:3 crops",
    ),
    Job(
        "MJY-EMO-002",
        "Create an original premium portrait for the MeJoy home row about sleep and recovery.",
        "2880x2880",
        "Brazilian man, 35 to 45, relaxed expression, dark casual knit, trustworthy and calm",
        "quiet minimalist home interior with soft morning light and blurred warm background",
        "medium portrait, subject slightly left of center, safe for square, 4:5 and 4:3 crops",
    ),
    Job(
        "MJY-EMO-003",
        "Create an original lifestyle scene for mobility and joint care without looking like a gym ad.",
        "2880x2880",
        "Brazilian Black man, 35 to 45, doing controlled low-impact mobility exercise, natural smile",
        "bright physiotherapy or pilates studio with pale wood and neutral walls",
        "three-quarter body scene with clean negative space and centered action for square, 4:5 and 4:3 crops",
    ),
    Job(
        "MJY-EMO-004",
        "Create an original close lifestyle beauty-health image for hair and scalp care.",
        "2880x2880",
        "Brazilian woman, 30 to 40, soft brown hair, cream sweater, touching hair gently with a natural smile",
        "calm warm off-white interior with soft daylight",
        "close portrait with hands visible near hair, safe for square, 4:5 and 4:3 crops",
    ),
    Job(
        "MJY-EMO-005",
        "Create an original confidence portrait for the main MeJoy weight loss feature card.",
        "2880x2880",
        "Brazilian woman, 34 to 44, athletic but natural, confident expression, premium mint top",
        "soft gradient backdrop in pale green and ivory with no visible branding",
        "centered waist-up portrait with elegant posture, negative space for wide, square and portrait crops",
    ),
    Job(
        "MJY-EMO-006",
        "Create an original minimal smartphone-in-hand image for a MeJoy support thumbnail.",
        "2880x2880",
        "feminine Brazilian hand holding a modern smartphone, sleeve in knit cream fabric",
        "clean beige tabletop and warm neutral background, generic app glow without readable text",
        "close-up product-style composition with ample surrounding space for square and portrait crops",
    ),
    Job(
        "MJY-EMO-007",
        "Create an original smartphone appointment context for MeJoy app continuity.",
        "2048x3072",
        "Brazilian hand holding a smartphone showing a generic wellness appointment card with abstract UI blocks only",
        "soft off-white background with premium editorial still-life lighting",
        "vertical close-up with the device centered and safe for portrait and square crops",
    ),
    Job(
        "MJY-EMO-008",
        "Create an original triage-step visual showing real use of the phone in daily life.",
        "2880x2880",
        "Brazilian person seated at a table using a smartphone, only hands and part of torso visible",
        "bright home setting with wood surface, quiet lifestyle context, no readable text",
        "clean close-up with centered hands and comfortable margins for wide, portrait and square crops",
    ),
    Job(
        "MJY-EMO-009",
        "Create an original next-step clarity image for MeJoy with a clinical premium feel.",
        "2880x2880",
        "Brazilian male clinician, 45 to 55, silver hair, glasses, calm focus while working at a laptop",
        "airy modern clinic with softly blurred shelves in the background",
        "medium-wide desk scene with subject centered, plenty of neutral space for multiple crops",
    ),
    Job(
        "MJY-EMO-010",
        "Create an original support-channel smartphone image for MeJoy.",
        "2880x2880",
        "Brazilian hand holding a modern smartphone, warm sleeve, reassuring lifestyle tone",
        "minimal beige background and soft editorial light, generic message interface with abstract shapes only",
        "clean close-up with centered phone, safe for portrait, square and landscape crops",
    ),
    Job(
        "MJY-EMO-011",
        "Create an original testimonial avatar portrait for a MeJoy patient quote.",
        "2048x3072",
        "Brazilian woman, 28 to 38, open smile, light activewear, healthy and real, not model-perfect",
        "soft teal studio background with subtle tonal variation",
        "centered head-and-shoulders portrait with padding for square and 4:5 crops",
    ),
    Job(
        "MJY-EMO-012",
        "Create an original testimonial avatar portrait for a second MeJoy patient quote.",
        "2048x3072",
        "Brazilian man, 30 to 40, casual cream sweater, warm smile, approachable and genuine",
        "neutral beige studio background, softly graded and uncluttered",
        "centered head-and-shoulders portrait with safe margins for square and 4:5 crops",
    ),
    Job(
        "MJY-EMO-013",
        "Create an original hero portrait for the MeJoy weight loss landing page, premium and trustworthy.",
        "2048x3072",
        "Brazilian Black woman, 38 to 48, natural curls up, direct confident smile, premium activewear",
        "soft gray-green studio background with calm health-tech mood",
        "vertical chest-up portrait, centered, generous breathing room, ideal for 3:4, 4:5 and 9:16 crops",
    ),
    Job(
        "MJY-EMO-014",
        "Create an original second hero portrait for the MeJoy weight loss landing page.",
        "2048x3072",
        "Brazilian woman, 30 to 40, brunette waves, warm expression, premium neutral tank top",
        "light beige studio backdrop with subtle depth and window-light softness",
        "vertical chest-up portrait, centered, matching hero-series rhythm for 3:4, 4:5 and 9:16 crops",
    ),
    Job(
        "MJY-EMO-015",
        "Create an original third hero portrait for the MeJoy weight loss landing page.",
        "2048x3072",
        "Brazilian woman, 29 to 39, tied-back hair, bright but calm smile, light fitness top",
        "pale warm studio background with premium clinical softness",
        "vertical chest-up portrait, centered, composed to sit beside two other hero portraits",
    ),
    Job(
        "MJY-EMO-016",
        "Create an original image for the triage explanation step, showing hands using the MeJoy flow.",
        "2880x2880",
        "Brazilian hands interacting with a smartphone running a generic assessment flow with abstract UI only",
        "minimal warm background, subtle wood or stone surface, premium editorial simplicity",
        "close-up of hands and phone, centered, safe for 4:3, 4:5 and square crops",
    ),
    Job(
        "MJY-EMO-017",
        "Create an original consultation image for MeJoy showing medical authority without stiffness.",
        "2880x2880",
        "Brazilian female clinician, 45 to 55, blonde or light brown hair, glasses, white coat, calm and trustworthy",
        "bright modern clinic or pharmacy-like consultation space with soft blur",
        "medium portrait with shoulder line visible, centered for wide, square and portrait crops",
    ),
    Job(
        "MJY-EMO-018",
        "Create an original continuity image for MeJoy showing sustainable healthy routine.",
        "2880x2880",
        "Brazilian woman, 30 to 40, smiling naturally while holding a colorful everyday meal bowl",
        "warm home kitchen or dining context with soft daylight and no luxury excess",
        "medium shot with meal visible and enough headroom for square, 4:5 and 4:3 crops",
    ),
    Job(
        "MJY-EMO-019",
        "Create an original tailored-plan lifestyle image for MeJoy.",
        "2880x2880",
        "Brazilian woman, 35 to 45, calm and elegant, seated comfortably, relaxed smile",
        "contemporary home office or living room with subtle plants and warm natural light",
        "medium seated portrait with negative space around the subject for square, portrait and landscape crops",
    ),
    Job(
        "MJY-EMO-020",
        "Create an original MeJoy app context image with premium phone presentation.",
        "2048x3072",
        "Brazilian hand holding a smartphone with a clean generic wellness dashboard made of abstract shapes only",
        "soft ivory background with diffused daylight and gentle depth",
        "vertical close-up, phone centered, clean enough for 4:5, 9:16 and square crops",
    ),
    Job(
        "MJY-EMO-021",
        "Create an original story portrait for MeJoy showing relief and confidence.",
        "2048x3072",
        "Brazilian woman, 42 to 52, fuller body, shoulder-length hair, looking slightly to the side with a relieved smile",
        "soft neutral studio background with warm editorial tone",
        "vertical chest-up portrait with breathing room, safe for 4:5, square and 9:16 crops",
    ),
    Job(
        "MJY-EMO-022",
        "Create an original wide story image for MeJoy showing lightness and joy.",
        "2880x2880",
        "Brazilian woman, 30 to 40, curly hair, eyes softly closed while laughing naturally",
        "pale green-gray background with bright editorial light and premium calm",
        "slightly wider head-and-shoulders composition with space around the face for wide, square and portrait crops",
    ),
    Job(
        "MJY-EMO-023",
        "Create an original triage hero portrait for MeJoy that feels strong, kind and real.",
        "2048x3072",
        "Brazilian plus-size man, 35 to 45, short dark hair, open smile, dark neutral t-shirt",
        "clean warm-gray studio backdrop with health-tech premium mood",
        "vertical chest-up portrait centered for 4:5, square and 9:16 crops",
    ),
    Job(
        "MJY-EMO-024",
        "Create an original proof-of-flow phone image for MeJoy triage and report continuity.",
        "2048x3072",
        "Brazilian hands using a smartphone with a clean checklist-like interface made only of generic blocks and lines",
        "minimal blush-beige background, soft daylight and product-photography polish",
        "vertical close-up with the phone centered and room for portrait and square crops",
    ),
    Job(
        "MJY-EMO-025",
        "Create an original social-proof avatar portrait for MeJoy.",
        "2048x3072",
        "young Brazilian woman, 24 to 34, curly hair, energetic smile, mint activewear, natural and believable",
        "pale aqua studio background with gentle texture",
        "centered head-and-shoulders portrait with safe room for 1:1 and 4:5 crops",
    ),
    Job(
        "MJY-EMO-026",
        "Create an original decision-stage portrait for MeJoy report and checkout guidance.",
        "2880x2880",
        "Brazilian Black man, 40 to 50, warm smile, dark crewneck, composed and trustworthy",
        "soft light gray studio background with subtle depth",
        "medium close portrait centered with enough breathing room for square, 4:5 and 16:9 crops",
    ),
    Job(
        "MJY-EMO-027",
        "Create an original continuity-support portrait for MeJoy showing clinical reassurance.",
        "2048x3072",
        "Brazilian female clinician or care specialist, 40 to 50, glasses, soft confident smile, neutral clinical attire",
        "airy bright clinic background with subtle shelves, softly blurred",
        "vertical portrait centered for 4:5, square and 9:16 crops",
    ),
    Job(
        "MJY-EMO-028",
        "Create an original social-proof wide portrait for MeJoy with strong positive energy.",
        "2880x2880",
        "Brazilian man, 38 to 48, larger build, laughing naturally, pale rose or sand t-shirt",
        "warm neutral studio background with premium soft light",
        "wider chest-up portrait with subject centered and padding for wide, square and portrait crops",
    ),
    Job(
        "MJY-EMO-029",
        "Create an original checkout consultation image for MeJoy showing organized clinical care.",
        "2880x2880",
        "Brazilian male clinician, 50 to 60, silver hair, glasses, white coat, working calmly on a laptop",
        "very bright consultation room with shelves in soft blur and clean premium daylight",
        "medium-wide desk scene centered with comfortable margins for square, 4:5 and 16:9 crops",
    ),
    Job(
        "MJY-EMO-030",
        "Create an original official-support smartphone image for MeJoy post-payment continuity.",
        "2048x3072",
        "Brazilian hand holding a smartphone with a clean official support interface represented only by abstract message cards",
        "minimal warm beige set with soft editorial light and no text",
        "vertical close-up with centered phone, elegant negative space, safe for 4:5, 9:16 and square crops",
    ),
)


def main() -> None:
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    lines = [json.dumps(job.to_payload(), ensure_ascii=False) for job in JOBS]
    OUT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {len(JOBS)} jobs to {OUT_PATH}")


if __name__ == "__main__":
    main()
