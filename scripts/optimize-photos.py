"""Regenerate smaller WebP variants without changing the five archive originals.
Optional maintainer tool: python -m pip install Pillow; python scripts/optimize-photos.py
The image licenses and attribution in public/photos/CREDITS.md apply to all variants.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / 'public' / 'photos'
for source in sorted(ROOT.glob('*.webp')):
    if source.stem.rsplit('-', 1)[-1].isdigit() and source.stem.rsplit('-', 1)[-1] in {'320', '480', '768'}:
        continue
    with Image.open(source) as image:
        for width in (320, 480, 768):
            if width >= image.width:
                continue
            height = round(image.height * width / image.width)
            target = source.with_name(f'{source.stem}-{width}.webp')
            image.resize((width, height), Image.Resampling.LANCZOS).save(target, 'WEBP', quality=80, method=6)
            print(f'{target.name}: {width} x {height}, {target.stat().st_size} bytes')
