"""About page: group the portrait with the "about me" text.

Wraps the existing bio paragraphs (description-wrap team-s) in a two-column group: studio portrait on the
left, label + bio + a facts row (figures taken from the bio itself) on the right. Stacks on phones.

Used by adapt.py; can also be run on a built page:  python3 -I about_me.py <about.html>
"""
import re
import sys

PORTRAIT = "/gk/work/geetha-portrait-studio.webp"

CSS = """<style>
.gk-aboutme{display:grid;grid-template-columns:minmax(260px,5fr) 7fr;gap:clamp(36px,6vw,96px);align-items:center;
  margin:clamp(36px,5vw,72px) 0 clamp(64px,8vw,120px)}
.gk-me{position:relative;margin:0;justify-self:center;width:min(100%,440px)}
.gk-me::before{content:"";position:absolute;inset:8% -10% -6% -10%;z-index:-1;border-radius:50%;
  background:radial-gradient(closest-side,rgba(124,58,237,.42),rgba(124,58,237,0));filter:blur(8px)}
.gk-me img{display:block;width:100%;height:auto;aspect-ratio:3/4;object-fit:cover;border-radius:18px;
  border:1px solid rgba(244,242,246,.14);box-shadow:0 30px 70px -30px rgba(0,0,0,.85);
  transform:rotate(-2deg);transition:transform .6s cubic-bezier(.2,.8,.2,1)}
.gk-me:hover img{transform:rotate(0) scale(1.01)}
.gk-me figcaption{position:absolute;left:16px;bottom:18px;display:inline-flex;align-items:center;gap:8px;padding:8px 14px;
  border-radius:999px;font-size:13px;line-height:1;color:#f4f2f6;background:rgba(12,11,12,.62);
  -webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border:1px solid rgba(244,242,246,.16);transform:rotate(-2deg)}
.gk-me figcaption::before{content:"";width:7px;height:7px;border-radius:50%;background:#4ade80}
.gk-aboutme-text{display:grid;gap:18px}
.gk-aboutme-label{margin:0;font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:#a78bfa}
.gk-aboutme .description-wrap.team-s{display:grid;grid-template-columns:1fr;gap:18px;width:auto;max-width:620px;margin:0;padding:0;justify-self:start}
.gk-aboutme .description-wrap.team-s .view-from-center{width:auto}
.gk-facts{list-style:none;margin:8px 0 0;padding:18px 0 0;border-top:1px solid rgba(244,242,246,.12);
  display:flex;flex-wrap:wrap;gap:12px 36px;font-size:15px;color:rgba(244,242,246,.7)}
.gk-facts b{display:block;font:600 clamp(26px,2.6vw,36px)/1.1 "Wix Madefor Display",sans-serif;letter-spacing:-.02em;color:#f4f2f6}
@media (max-width:767px){
  .gk-aboutme{grid-template-columns:1fr;gap:32px}
  .gk-me{width:min(100%,340px)}
}
@media (prefers-reduced-motion:reduce){.gk-me img{transition:none}}
</style>"""


def _close_div(h, i):
    depth = 0
    for m in re.finditer(r'<div\b|</div>', h[i:]):
        depth += 1 if m.group(0) == '<div' else -1
        if depth == 0:
            return i + m.end()
    raise ValueError('unbalanced div')


def build(h):
    i = h.index('<div class="description-wrap team-s">')
    j = _close_div(h, i)
    desc = h[i:j]
    group = (CSS + '<div class="gk-aboutme">'
             f'<figure class="gk-me"><img src="{PORTRAIT}" width="750" height="1000" loading="lazy" '
             'alt="Geetha Krishna, senior graphic designer and video editor"/>'
             '<figcaption>Senior Graphic Designer &amp; Video Editor</figcaption></figure>'
             '<div class="gk-aboutme-text"><p class="gk-aboutme-label">About me</p>' + desc +
             '<ul class="gk-facts"><li><b>5+</b>years</li><li><b>100+</b>projects</li><li><b>Bengaluru</b>based</li></ul>'
             '</div></div>')
    return h[:i] + group + h[j:]


if __name__ == '__main__':
    f = sys.argv[1]
    html = open(f, encoding='utf-8').read()
    if 'class="gk-aboutme"' in html:
        print('already grouped')
    else:
        open(f, 'w', encoding='utf-8', newline='').write(build(html))
        print('about me grouped')
