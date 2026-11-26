"""
subset-fonts.py: rebuilds the self-hosted fonts in src/styles/fonts/.

Each face gets two files. `<name>.core.woff2` holds only the characters the site
uses (CORE below), so it is small. `<name>.woff2` is Fontsource's full Latin
file. fonts.config.mjs declares the full file first and the core last, each with its
unicode-range, so browsers download the full file only when a page holds a
character outside CORE (an accented name in the guestbook, say).

Needs fontTools (pip install fonttools brotli). Run from the repo root after a
font update, or when copy starts using a new symbol:
    python3 scripts/subset-fonts.py
"""

import shutil
import subprocess
from pathlib import Path

# Every character the site's copy uses: printable ASCII plus the symbols below.
CORE = (
    'U+0020-007E,U+00A0,U+00A9,U+00B7,U+00BD,U+00D7,U+2013,U+2014,U+2018,U+2019,'
    'U+201C,U+201D,U+2026,U+2033,U+2153,U+2190-2193,U+2197,U+21B5,U+2212,U+2318,U+2715'
)

FACES = [
    'geist/files/geist-latin-400-normal',
    'geist/files/geist-latin-500-normal',
    'geist/files/geist-latin-600-normal',
    'geist-mono/files/geist-mono-latin-400-normal',
    'geist-mono/files/geist-mono-latin-500-normal',
    'instrument-serif/files/instrument-serif-latin-400-normal',
]

out = Path('src/styles/fonts')
out.mkdir(parents=True, exist_ok=True)
for face in FACES:
    source = Path('node_modules/@fontsource') / f'{face}.woff2'
    name = source.stem.replace('-latin', '').replace('-normal', '')
    shutil.copyfile(source, out / f'{name}.woff2')
    subprocess.run(
        [
            'pyftsubset', str(source), f'--unicodes={CORE}',
            # Hinting stays: without it, glyphs render at slightly different widths.
            '--layout-features=kern,liga,calt,tnum,case', '--flavor=woff2',
            f'--output-file={out / f"{name}.core.woff2"}',
        ],
        check=True,
    )
    print(name, (out / f'{name}.core.woff2').stat().st_size, 'bytes (core)')
