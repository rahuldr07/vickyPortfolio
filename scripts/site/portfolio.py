"""Second pass on public/gk/index.html (run after adapt.py).

Designer-led structure:
  Hero (name + showreel)  ->  Manifesto  ->  Selected Work (4 case studies, scroll stack)
  ->  What I Do (text only)  ->  Name banner  ->  CTA (portrait)  ->  Footer
Removed: flower/logo section, process section and its floating tiles.
Every image appears once; the showreel holds range pieces not used in case studies.

Usage: python3 -I portfolio.py <public/gk dir>
"""
import os, re, sys

OUT = sys.argv[1]
path = os.path.join(OUT, "index.html")
h = open(path, encoding="utf-8").read()
W = "/gk/work/"


def rx(pat, new, count=1):
    global h
    h, n = re.subn(pat, lambda m: new, h, flags=re.S)
    assert n == count, f"expected {count}x /{pat[:80]}/, found {n}"


def rep(old, new, count=1):
    global h
    n = h.count(old)
    assert n == count, f"expected {count}x {old[:80]!r}, found {n}"
    h = h.replace(old, new)


def cut_section(open_tag):
    global h
    i = h.index(open_tag)
    j = h.index("</section>", i) + len("</section>")
    h = h[:i] + h[j:]


def img(src, alt, style, cls=""):
    return (f'<img src="{W}{src}" loading="lazy" alt="{alt}" class="gk-shot gk-c-item {cls}" '
            f'style="{style}"/>')


def video(src, poster, label, style, cls=""):
    return (f'<video class="gk-shot gk-c-item {cls}" src="{W}{src}" poster="{W}{poster}" autoplay muted loop '
            f'playsinline preload="metadata" aria-label="{label}" style="{style}"></video>')


# ---------- Hero: phone mockup -> showreel ----------
rx(r'<img src="/gk/images/682d7c4461a6cad665ede87c_hero-mobile\.webp"[^>]*/>',
   f'<video class="gk-shot gk-reel" src="{W}showreel.mp4" poster="{W}showreel-poster.webp" autoplay muted loop '
   'playsinline preload="auto" aria-label="Showreel of poster, real estate and editorial work by Geetha Krishna"></video>')

# ---------- Remove template-only sections ----------
cut_section('<section class="logo-sc">')
cut_section('<section id="how-it-works" class="how-work-sc">')

# ---------- What I Do: text only (drop the app widget Lotties) ----------
rx(r'<div class="what-is-widget s\d"><div data-loading="eager" view-item="from-center" class="what-is-lottie"[^>]*></div></div>',
   '', 4)

# ---------- CTA: phone -> portrait ----------
rx(r'<img src="/gk/images/682d7c4461a6cad665ede88f_cta-mobile\.png"[^>]*/>',
   f'<img src="{W}geetha-portrait.webp" loading="lazy" alt="Geetha Krishna, graphic designer and video editor" '
   'class="gk-shot gk-cta-shot"/>')

# ---------- Selected Work: 4 case studies ----------
CASES = [
    ("Brand Identity", "Coastal Cravings",
     "Identity for a seafood restaurant: logo, menu card and festival campaign, built to feel premium and appetising.",
     img("cc-poster.webp", "Coastal Cravings seafood festival poster", "--r:-5deg;left:2%;top:3%;height:92%;z-index:1") +
     img("cc-menu.webp", "Coastal Cravings menu card mockup", "--r:4deg;right:0;bottom:3%;width:64%;z-index:2") +
     img("cc-logo.webp", "Coastal Cravings logo", "--r:3deg;right:4%;top:6%;width:38%;z-index:3", "gk-chip")),
    ("Campaign Design", "GreenMonk Energy Drink",
     "Product posters and social creatives for an energy drink brand, built to stop the scroll in a crowded feed.",
     img("gm-frost.webp", "GreenMonk frosted can poster", "--r:-9deg;left:0;top:12%;height:76%;z-index:1") +
     img("gm-laser.webp", "GreenMonk laser strike poster", "--r:9deg;right:0;top:12%;height:76%;z-index:2") +
     img("gm-ice.webp", "GreenMonk ice burst key visual", "--r:0deg;left:50%;top:3%;height:94%;z-index:3;translate:-50% 0")),
    ("Editorial Design", "Buddha-CEO Magazines",
     "Covers and inner layouts for the Buddha-CEO Quantum Foundation magazine, on purpose, meditation and global peace.",
     img("bc-spread.webp", "Buddha-CEO magazine inner spread", "--r:2deg;right:0;top:2%;width:80%;z-index:1") +
     img("bc-cover-purpose.webp", "Buddha-CEO Purpose magazine cover", "--r:6deg;right:10%;bottom:2%;height:58%;z-index:2") +
     img("bc-cover-peace.webp", "Buddha-CEO Global Peace magazine cover", "--r:-5deg;left:0;bottom:0;height:72%;z-index:3")),
    ("AI Video &amp; Editing", "New Day Organics Serum",
     "A skincare commercial built from prompt-driven product shots, with macro texture and clean studio light.",
     video("serum-finale-loop.mp4", "serum-finale-poster.webp", "New Day Organics serum commercial, finale cut",
           "--r:5deg;right:6%;top:7%;height:88%;z-index:1", "gk-v") +
     video("serum-edit-loop.mp4", "serum-edit-poster.webp", "New Day Organics serum commercial, main edit",
           "--r:-4deg;left:8%;top:0;height:96%;z-index:2", "gk-v")),
]
cards = []
for i, (tag, title, body, media) in enumerate(CASES, start=1):
    wrap = "s1" if i == 1 else "s2"
    bg = "s1" if i % 2 else "s2"
    cards.append(
        f'<div class="stack-card-wrapper {wrap} gk-card"><div view-item="from-center" class="stack-card-stroke">'
        f'<div class="card-gradient-point"><div class="card-gradient"></div></div>'
        f'<div class="stack-card {bg}"><div cursor-trigger="" class="text-elements stack-s">'
        f'<div class="stact-tag">{tag}</div>'
        f'<div class="name-headline-wrap stactk-s s1"><h2 class="headline-h2">{title}</h2></div>'
        f'<div class="description-wrap stack-s s1"><p class="body-main opacity-80">{body}</p></div></div>'
        f'<div class="stack-circle"></div><div class="gk-collage">{media}</div>'
        f'<div data-particles="" class="particles-block stack-s"></div></div></div></div>')
i = h.index('<section id="for-whom" class="stack-sc">')
j = h.index('</section>', i) + len('</section>')
h = (h[:i] + '<section id="work" class="stack-sc"><div class="stack-height gk-stack"><div class="stack-sticky">'
     '<div class="container stack-s">' + "".join(cards) + '</div></div></div></section>' + h[j:])

# Work before services: move "What I Do" after the Selected Work section
i = h.index('<section class="what-is-sc">'); j = h.index('</section>', i) + len('</section>')
what = h[i:j]; h = h[:i] + h[j:]
k = h.index('</section>', h.index('<section id="work" class="stack-sc">')) + len('</section>')
h = h[:k] + what + h[k:]

CSS = """<style>
.gk-shot{display:block;border-radius:12px;background:#0f0d10;
  box-shadow:0 2.4rem 5rem -1.6rem rgba(30,6,90,.6),0 0 0 1px rgba(255,255,255,.08)}
.gk-reel{width:100%;height:auto;aspect-ratio:4/5;object-fit:cover}
.gk-cta-shot{width:23rem;height:auto;rotate:3deg;margin:0 0 4.5rem auto}
.gk-card .text-elements.stack-s{max-width:31rem}
.gk-collage{position:absolute;z-index:200;right:4.5%;top:50%;transform:translateY(-50%);width:41rem;height:35rem}
.gk-c-item{position:absolute;width:auto;max-width:none;rotate:var(--r);
  transition:rotate .7s cubic-bezier(.2,.8,.2,1),scale .7s cubic-bezier(.2,.8,.2,1)}
.gk-c-item[style*="width:"]{height:auto}
.gk-chip{background:#fff;padding:1.2rem}
.gk-v{aspect-ratio:9/16;object-fit:cover}
@media (hover:hover) and (prefers-reduced-motion:no-preference){
  .gk-card:hover .gk-c-item{rotate:calc(var(--r) * 1.6);scale:1.02}
}
@media (min-width:480px){.stack-height.gk-stack{height:400vh}}
@media screen and (max-width:479px){
  .hero-mobile{display:flex;justify-content:center;align-items:center}
  .gk-reel{width:auto;height:100%;max-width:100%}
  .stack-card-wrapper.gk-card{margin-bottom:6rem}
  .gk-card .text-elements.stack-s{max-width:none}
  .gk-collage{top:auto;bottom:9rem;right:auto;left:50%;transform:translateX(-50%);width:82rem;height:74rem}
  .gk-cta-shot{width:70%;margin:0 auto 6rem}
}
</style></head>"""
rep('</head>', CSS)

JS = """<script>
(function(){
  function initStack(){
    var h=document.querySelector('.stack-height.gk-stack');
    if(!h||!window.gsap||!window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.matchMedia().add('(min-width: 480px) and (prefers-reduced-motion: no-preference)', function(){
      var cards=gsap.utils.toArray(h.querySelectorAll('.gk-card'));
      var vh=function(v){return function(){return window.innerHeight*v;};};
      cards.forEach(function(c,i){
        gsap.set(c,{zIndex:500-i,transformOrigin:'50% 50%'});
        if(i>0) gsap.set(c,{scale:.8,y:vh(.1),opacity:i===1?.28:0});
      });
      var tl=gsap.timeline({scrollTrigger:{trigger:h,start:'top top',end:'bottom bottom',scrub:.6,invalidateOnRefresh:true}});
      var pos=.34;
      for(var i=0;i<cards.length-1;i++){
        tl.to(cards[i],{y:vh(-1),duration:.31,ease:'none'},pos)
          .to(cards[i+1],{scale:1,y:0,duration:.31,ease:'none'},pos)
          .to(cards[i+1],{opacity:1,duration:.11,ease:'none'},pos);
        if(cards[i+2]) tl.to(cards[i+2],{opacity:.28,duration:.31,ease:'none'},pos);
        pos+=.31+.35;
      }
      tl.to({},{duration:.01},pos);
    });
  }
  if(document.readyState!=='loading') initStack(); else document.addEventListener('DOMContentLoaded',initStack);
})();
</script></body>"""
rep('</body>', JS)

open(path, "w", encoding="utf-8").write(h)
print("ok")
