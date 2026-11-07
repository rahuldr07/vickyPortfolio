"""Normalise every non-circular border radius in the template CSS to 12px.
Keeps circles (50%/100%), 0/unset, and tiny 3px UI internals. Rebuilt from the pristine CSS each run.
Usage: python3 -I radii.py <pristine dir> <public/gk dir>"""
import os, re, sys
P, OUT = sys.argv[1], sys.argv[2]
name = "superconscious-app.webflow.shared.c41a94ea2.css"
css = open(os.path.join(P, name), encoding="utf-8").read()
KEEP = re.compile(r'^\s*(50%|100%|0|unset|3px( !important)?)\s*$')
n = 0
def fix(m):
    global n
    if KEEP.match(m.group(2)): return m.group(0)
    n += 1
    return f"{m.group(1)}12px"
css = re.sub(r'(border(?:-(?:top|bottom)-(?:left|right))?-radius:\s*)([^;}]+)', fix, css)
open(os.path.join(OUT, "css", name), "w", encoding="utf-8").write(css)
print("radii normalised:", n)
