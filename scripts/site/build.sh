#!/bin/sh
# Rebuild the static portfolio pages (site-pages/*.html, site-pages/work/*.html) and generated media
# (public/gk/work/all/*) from the untouched Webflow template in scripts/site/template/.
# Requires python3 and ffmpeg/ffprobe. Run from anywhere: npm run site:build
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
G="$ROOT/public/gk"

python3 -I "$HERE/adapt.py" "$HERE/template" "$G"      # template copy -> Geetha Krishna text, about page
python3 -I "$HERE/portfolio.py" "$G"                   # case studies, services, CTA portrait
python3 -I "$HERE/hero.py" "$G"                        # split hero + rotating carousel + reel dialog
python3 -I "$HERE/radii.py" "$HERE/template" "$G"      # 12px corner radius across the template CSS
python3 -I "$HERE/work.py" "$ROOT" "$G"                # /work grid, optimised media, site-pages/work.json
python3 -I "$HERE/seo.py" "$ROOT" "$G"                 # head tags, JSON-LD, nav; moves pages to site-pages/
python3 -I "$HERE/project.py" "$ROOT"                  # one page per project
python3 -I "$HERE/polish.py" "$ROOT" "$HERE/icons"     # icons, fonts, contact form, lazy video, a11y
echo "site pages rebuilt. Run 'npm run build' to prerender them."
