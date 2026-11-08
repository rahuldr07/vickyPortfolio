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
   f'<img src="{W}geetha-portrait-studio.webp" loading="lazy" width="750" height="1000" alt="Geetha Krishna, graphic designer and video editor" '
   'class="gk-shot gk-cta-shot"/>')

# portrait now lives on the About page (about_me.py): drop it from the CTA and centre the CTA text
rx(r'<div view-item="from-down" class="cta-image"><img src="/gk/work/geetha-portrait-studio\.webp"[^>]*/></div>', '')
rep('</head>', '<style>.cta-card .text-elements.cta-s{align-items:center;text-align:center;width:100%}.cta-card .name-headline-wrap.cta-s{width:auto}.cta-card .description-wrap.cta-s{margin-left:auto;margin-right:auto}.container.cta-s{padding-top:clamp(32px,4vw,64px);padding-bottom:clamp(32px,4vw,64px)}.cta-card-wrapper{height:auto}.cta-card{padding:clamp(32px,3.2vw,52px) clamp(20px,3.5vw,56px)}@media (min-width:768px){.cta-card .headline-h1 br{display:none}}.cta-card .headline-h1{font-size:clamp(30px,3vw,46px)}.cta-card .description-wrap.cta-s{padding-top:clamp(10px,1vw,16px);padding-bottom:clamp(18px,1.8vw,26px)}.cta-card-wrapper{max-width:min(760px,100%);margin-left:auto;margin-right:auto}.footer-download-app{display:none!important}@media (max-width:479px){.cta-card{padding:44px 20px 48px}}</style></head>')

# ---------- Selected Work: 4 case studies ----------
CASES = [
    ("Brand Identity", "Coastal Cravings",
     "Identity for a seafood restaurant: logo, menu card and festival campaign, built to feel premium and appetising.",
     img("cc-poster.webp", "Coastal Cravings seafood festival poster", "--r:-5deg;left:2%;top:3%;height:92%;z-index:1") +
     img("cc-menu.webp", "Coastal Cravings menu card mockup", "--r:4deg;right:0;bottom:3%;width:64%;z-index:2") +
     img("cc-logo.webp", "Coastal Cravings logo", "--r:3deg;right:4%;top:6%;width:38%;z-index:3", "gk-chip")),
    ("Campaign Design", "GreenMonk Energy Drink",
     "Product posters and social creatives for an energy drink brand, built to stop the scroll in a crowded feed.",
     img("gm-frost.webp", "GreenMonk frosted can poster", "--r:-2deg;left:67.26%;top:52.03%;width:30.7%;z-index:1") +
     img("gm-laser.webp", "GreenMonk laser strike poster", "--r:2deg;left:67.26%;top:0;width:30.7%;z-index:2") +
     img("gm-ice.webp", "GreenMonk ice burst key visual", "--r:-1deg;left:0;top:0;width:64%;z-index:3")),
    ("Editorial Design", "Buddha-CEO Magazines",
     "Covers and inner layouts for the Buddha-CEO Quantum Foundation magazine, on purpose, meditation and global peace.",
     img("bc-spread.webp", "Buddha-CEO magazine inner spread", "--r:1.5deg;left:62.2%;top:0;width:37.8%;z-index:1") +
     img("bc-cover-purpose.webp", "Buddha-CEO Purpose magazine cover", "--r:2deg;left:62.2%;top:36%;width:37.8%;z-index:2") +
     img("bc-cover-peace.webp", "Buddha-CEO Global Peace magazine cover", "--r:-1.5deg;left:0;top:0;width:59.1%;z-index:3")),
    ("AI Video &amp; Editing", "New Day Organics Serum",
     "A skincare commercial built from prompt-driven product shots, with macro texture and clean studio light.",
     video("serum-finale-loop.mp4", "serum-finale-poster.webp", "New Day Organics serum commercial, finale cut",
           "--r:2deg;left:52%;top:6.13%;width:44%;z-index:1", "gk-v") +
     video("serum-edit-loop.mp4", "serum-edit-poster.webp", "New Day Organics serum commercial, main edit",
           "--r:-2deg;left:4%;top:0;width:44%;z-index:2", "gk-v")),
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
        f'<div class="stack-circle"></div><div class="gk-collage{ {"Campaign Design": " gk-collage-trio", "Editorial Design": " gk-collage-ed", "AI Video &amp; Editing": " gk-collage-vid"}.get(tag, "") }">{media}</div>'
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
.gk-collage{position:absolute;z-index:200;right:4.5%;top:50%;transform:translateY(-50%);width:41rem;height:35rem}.gk-collage.gk-collage-trio{width:auto;height:min(32rem,80%);aspect-ratio:5/4;right:5%}.gk-collage-trio .gk-c-item{border-radius:14px;aspect-ratio:900/1126;height:auto;object-fit:cover}.gk-collage.gk-collage-ed{width:auto;height:min(30.5rem,80%);aspect-ratio:1311/1000;right:5%}.gk-collage-ed .gk-c-item{border-radius:12px;height:auto;object-fit:cover}.gk-collage-ed .gk-c-item[src*="bc-spread"]{aspect-ratio:1400/904}.gk-collage-ed .gk-c-item[src*="bc-cover"]{aspect-ratio:900/1160}.gk-collage.gk-collage-vid{width:auto;height:min(32rem,80%);aspect-ratio:6/5;right:5%}.gk-collage-vid .gk-c-item{border-radius:16px;height:auto;aspect-ratio:9/16}
.gk-c-item{position:absolute;width:auto;max-width:none;rotate:var(--r);
  transition:rotate .7s cubic-bezier(.2,.8,.2,1),scale .7s cubic-bezier(.2,.8,.2,1)}
.gk-c-item[style*="width:"]{height:auto}
.gk-chip{background:#fff;padding:1.2rem}
.gk-v{aspect-ratio:9/16;object-fit:cover}
@media (hover:hover) and (prefers-reduced-motion:no-preference){
  .gk-card:hover .gk-c-item{rotate:calc(var(--r) * 1.6);scale:1.02}
}
@media (min-width:480px){.stack-height.gk-stack{height:280vh}}
/* gentle idle float on collage pieces (CSS translate composes with the GSAP transform) */
@keyframes gkFloat{0%,100%{translate:0 0}50%{translate:0 -10px}}
@media (prefers-reduced-motion:no-preference){
  .gk-c-item{animation:gkFloat 6s ease-in-out infinite}
  .gk-c-item:nth-child(2){animation-duration:7s;animation-delay:-2s}
  .gk-c-item:nth-child(3){animation-duration:8s;animation-delay:-4s}
}
@media screen and (max-width:479px){
  .hero-mobile{display:flex;justify-content:center;align-items:center}
  .gk-reel{width:auto;height:100%;max-width:100%}
  .stack-card-wrapper.gk-card{margin-bottom:6rem}
  .gk-card .text-elements.stack-s{max-width:none}
  .gk-collage{top:auto;bottom:9rem;right:auto;left:50%;transform:translateX(-50%);width:82rem;height:74rem}
  .gk-collage.gk-collage-trio{width:82rem;height:auto}
  .gk-collage.gk-collage-ed,.gk-collage.gk-collage-vid{width:82rem;height:auto}
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
      var items=function(c){return c.querySelectorAll('.gk-c-item');};
      var texts=function(c){return c.querySelectorAll('.text-elements > *');};
      // the first card's collage flies in when the section arrives
      gsap.from(items(cards[0]),{y:120,x:function(k){return k%2?60:-60;},opacity:0,scale:.9,duration:1.2,stagger:.1,ease:'expo.out',
        scrollTrigger:{trigger:h,start:'top 78%',once:true}});
      gsap.from(texts(cards[0]),{y:40,opacity:0,duration:1,stagger:.08,ease:'expo.out',scrollTrigger:{trigger:h,start:'top 78%',once:true}});
      cards.forEach(function(c,i){
        // every card starts from the same filter so each hand-off dims and blurs identically
        gsap.set(c,{zIndex:500-i,transformOrigin:'50% 50%',filter:'blur(0px) brightness(1)'});
        if(i>0){
          // waiting cards sit behind, small and out of focus
          gsap.set(c,{scale:.8,y:vh(.1),opacity:i===1?.28:0,filter:'blur(14px) brightness(.7)'});
          gsap.set(items(c),{y:function(k){return 90+k*50;},x:function(k){return k%2?70:-70;},opacity:0,scale:.9});
          gsap.set(texts(c),{y:50,opacity:0});
        }
      });
      // Scroll drives the hand-offs directly (like the "bold brand stories" section): instant and exact in
      // both directions, nothing hijacked. Short pauses between cards so every scroll visibly does something.
      var tl=gsap.timeline({scrollTrigger:{trigger:h,start:'top top',end:'bottom bottom',scrub:true,invalidateOnRefresh:true}});
      var T=.31,HOLD=.12,pos=.16,rests=[.08],zones=[];
      for(var i=0;i<cards.length-1;i++){
        tl.to(cards[i],{y:vh(-1),scale:.96,filter:'blur(6px) brightness(.75)',duration:T,ease:'none'},pos)
          .to(cards[i+1],{scale:1,y:0,filter:'blur(0px) brightness(1)',duration:T,ease:'none'},pos)
          .to(cards[i+1],{opacity:1,duration:.11,ease:'none'},pos)
          .to(items(cards[i+1]),{y:0,x:0,opacity:1,scale:1,duration:.24,stagger:.05,ease:'power3.out'},pos+.08)
          .to(texts(cards[i+1]),{y:0,opacity:1,duration:.2,stagger:.04,ease:'power3.out'},pos+.12);
        if(cards[i+2]) tl.to(cards[i+2],{opacity:.28,duration:T,ease:'none'},pos);
        zones.push([pos,pos+T]);            // a hand-off is in progress between these times
        rests.push(pos+T+HOLD/2);           // each card rests in the middle of its short pause
        pos+=T+HOLD;
      }
      tl.to({},{duration:.08},pos);

      // Polite landing: only when scrolling has fully stopped part-way through a hand-off, ease onto the
      // nearest card (~0.4 s). Any new scroll input takes over immediately; nothing is ever blocked.
      var idle=null, landing=false;
      var span=function(){var s=tl.scrollTrigger;return s.end-s.start;};
      var restY=function(t){return tl.scrollTrigger.start+(t/tl.duration())*span();};
      var timeAt=function(y){return (y-tl.scrollTrigger.start)/span()*tl.duration();};
      function land(){
        if(landing) return; var s=tl.scrollTrigger, y=window.scrollY;
        if(y<=s.start||y>=s.end) return;
        var t=timeAt(y); if(!zones.some(function(z){return t>z[0]+.004&&t<z[1]-.004;})) return; // already on a card
        var ys=rests.map(restY), near=ys.reduce(function(a,b){return Math.abs(b-y)<Math.abs(a-y)?b:a;});
        var L=window.SScroll; landing=true; setTimeout(function(){landing=false;},460);
        if(L&&L.scrollTo) L.scrollTo(near,{duration:.42,easing:function(x){return 1-Math.pow(1-x,3);}});
        else window.scrollTo({top:near,behavior:'smooth'});
      }
      function onScroll(){ clearTimeout(idle); idle=setTimeout(land,160); }
      window.addEventListener('scroll',onScroll,{passive:true});
      return function(){window.removeEventListener('scroll',onScroll);clearTimeout(idle);};
    });
  }
  if(document.readyState!=='loading') initStack(); else document.addEventListener('DOMContentLoaded',initStack);
})();
</script></body>"""
rep('</body>', JS)

open(path, "w", encoding="utf-8").write(h)
print("ok")
