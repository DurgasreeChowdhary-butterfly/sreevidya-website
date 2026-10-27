"""Generate home-page placeholder JPGs in img/. Run: py tools/make_placeholders.py
Soft peach->blue gradient with a centred "<filename> · <W>×<H>" label. Replace a photo by overwriting the same filename."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

IMG = Path(__file__).resolve().parent.parent / "img"
SIZES = {
    "hero-child.jpg": (1600, 900),
    "legacy-building.jpg": (1000, 700),
    "campus-serilingampally.jpg": (600, 450),
    "campus-attapur.jpg": (600, 450),
    "campus-kothagudem.jpg": (600, 450),
    "campus-palvancha.jpg": (600, 450),
    "campus-bhadrachalam.jpg": (600, 450),
    "holistic-lab.jpg": (1000, 700),
    "campus-life-sports.jpg": (900, 650),
    "testimonial-parent.jpg": (800, 600),
    "cta-books.jpg": (800, 300),
}
PEACH, BLUE, NAVY = (255, 226, 196), (206, 222, 242), (15, 42, 85)


def font(size):
    for f in ("C:/Windows/Fonts/segoeui.ttf", "C:/Windows/Fonts/arial.ttf", "DejaVuSans.ttf"):
        try:
            return ImageFont.truetype(f, size)
        except OSError:
            pass
    return ImageFont.load_default()


def make(name, w, h):
    # Diagonal gradient: build a 2-pixel ramp per row is slow, so blend two solid images with a gradient mask
    mask = Image.linear_gradient("L").rotate(-35, expand=True).resize((w, h))
    im = Image.composite(Image.new("RGB", (w, h), BLUE), Image.new("RGB", (w, h), PEACH), mask)
    d = ImageDraw.Draw(im)
    label = f"{name} · {w}×{h}"
    f = font(max(16, w // 28))
    box = d.textbbox((0, 0), label, font=f)
    tw, th = box[2] - box[0], box[3] - box[1]
    d.text(((w - tw) / 2, (h - th) / 2 - box[1]), label, font=f, fill=NAVY)
    im.save(IMG / name, "JPEG", quality=82)


if __name__ == "__main__":
    for n, (w, h) in SIZES.items():
        make(n, w, h)
        print("wrote", n)
