"""Third pass on public/gk/index.html: combined split hero.

Left: GK lockup, tagline, bio, CTAs, contact icons, clients.
Right: fanned 3-card carousel (Coastal Cravings, Buddha-CEO, New Day Organics serum) that
auto-rotates; pauses on hover/focus; dots; reduced-motion = static.
Play Reel opens the showreel in a lightbox.

Usage: python3 -I hero.py <public/gk dir>
"""
import os, sys

OUT = sys.argv[1]
path = os.path.join(OUT, "index.html")
h = open(path, encoding="utf-8").read()
W = "/gk/work/"
EMAIL = "geethakrishna.designer@gmail.com"


def rep(old, new, count=1):
    global h
    n = h.count(old)
    assert n == count, f"expected {count}x {old[:80]!r}, found {n}"
    h = h.replace(old, new)


SLIDES = [
    ("Coastal Cravings", "Brand Identity",
     f'<img src="{W}cc-poster-mockup.webp" alt="Coastal Cravings seafood festival poster framed on a restaurant wall" loading="eager"/>'),
    ("Buddha-CEO Magazines", "Editorial Design",
     f'<img src="{W}bc-cover-peace.webp" alt="Buddha-CEO Global Peace magazine cover" loading="eager"/>'),
    ("New Day Organics Serum", "AI Video &amp; Editing",
     f'<video src="{W}serum-edit-loop.mp4" poster="{W}serum-edit-poster.webp" autoplay muted loop playsinline '
     'aria-label="New Day Organics serum commercial"></video>'),
    ("Magnetic Tool Mat", "AI UGC Video Ad",  # 3.6 MB: loads only when it comes to the front
     f'<video data-src="{W}all/magnetic-tool-mat-ugc-ad.mp4" poster="{W}all/magnetic-tool-mat-ugc-ad.webp" '
     'muted loop playsinline preload="none" aria-label="Magnetic Tool Mat UGC video ad"></video>'),
]
slides = "".join(
    f'<figure class="gk-slide{" gk-slide-glass" if t == "GK Constructions" else ""}" data-title="{t}" data-kind="{k}">{m}</figure>' for t, k, m in SLIDES)
dots = "".join(
    f'<button type="button" class="gk-dot" aria-label="Show {t}"></button>' for t, _, _ in SLIDES)

HERO = f"""<section id="home" class="gk-hero">
<div class="gk-hero-glow"></div><div data-particles="" class="particles-block"></div>
<div class="gk-hero-grid">
  <div class="gk-hero-copy">
    <div class="gk-lockup gk-in"><span class="gk-lock-mark">GK</span><span class="gk-lock-name">Geetha<br/>Krishna</span></div>
    <h1 class="gk-tagline gk-in">Senior Graphic Designer &amp; Video Editor, Bengaluru</h1>
    <p class="gk-bio gk-in">Posters, brand identities, magazines and motion edits for brands that want to be noticed. <b>5+ years. 100+ projects.</b></p>
    <div class="gk-hero-btns gk-in">
      <a href="#contacts" class="gk-btn gk-btn-primary" data-gk-talk>Let’s Talk</a>
      <a href="#work" class="gk-btn gk-btn-ghost">View Work</a>
    </div>
    <div class="gk-icons gk-in">
      <a href="https://wa.me/917989228383" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="ph ph-whatsapp-logo"></i></a>
      <a href="mailto:{EMAIL}" aria-label="Email"><i class="ph ph-envelope-simple"></i></a>
      <a href="https://www.linkedin.com/in/krishnadezyner" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="ph ph-linkedin-logo"></i></a>
    </div>
    <div class="gk-clients gk-in"><small>Worked with</small>
      <div><span>Pixel Scoop Studios</span><span>GreenMonk</span><span>Buddha-CEO</span><span class="gk-clients-more">&amp; more clients</span></div>
    </div>
  </div>
  <div class="gk-carousel" role="region" aria-roledescription="carousel" aria-label="Featured work">
    <div class="gk-stage">{slides}</div>
    <div class="gk-caption" aria-live="polite"><span class="gk-cap-title"></span><span class="gk-cap-kind"></span></div>
    <div class="gk-dots">{dots}</div>
    <button type="button" class="gk-reel-btn" data-gk-reel hidden><i class="ph-fill ph-play"></i>Play showreel</button>
  </div>
</div>
</section>"""

i = h.index('<section id="home" class="hero-sc">')
j = h.index('</section>', i) + len('</section>')
h = h[:i] + HERO + h[j:]

MODAL = f"""<dialog class="gk-reel-modal" aria-label="Showreel">
  <button type="button" class="gk-reel-close" aria-label="Close showreel"><i class="ph ph-x"></i></button>
  <video src="{W}showreel.mp4" poster="{W}showreel-poster.webp" controls playsinline preload="none"></video>
</dialog>"""

HEAD = """<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&display=swap" rel="stylesheet"/>
<script src="https://unpkg.com/@phosphor-icons/web@2.1.1"></script>
<style>
.gk-hero{position:relative;min-height:100dvh;overflow:hidden;isolation:isolate;color:#f4f2f6}
.gk-hero-glow{position:absolute;z-index:-1;right:-12%;top:-8%;width:72%;height:120%;pointer-events:none;
  background:radial-gradient(50% 50% at 50% 50%,rgba(115,34,242,.42),rgba(0,0,96,.18) 45%,transparent 72%)}
.gk-hero .particles-block{z-index:-1}
.gk-hero-grid{position:relative;max-width:1280px;margin:0 auto;min-height:100dvh;display:grid;
  grid-template-columns:minmax(0,440px) minmax(0,1fr);gap:clamp(32px,6vw,96px);align-items:center;padding:120px 6vw 64px}
.gk-hero-copy{display:grid;gap:26px}
.gk-lockup{display:inline-grid;grid-template-columns:auto 1fr;border:3px solid #f4f2f6;border-radius:12px;overflow:hidden;justify-self:start;min-width:340px}
.gk-lock-mark{background:#f4f2f6;color:#0c0b0c;font-weight:800;font-size:46px;letter-spacing:-.05em;padding:14px 18px;display:grid;place-items:center}
.gk-lock-name{font-weight:600;font-size:34px;letter-spacing:-.045em;line-height:.95;padding:12px 18px;display:grid;align-content:center}
.gk-tagline{margin:-14px 0 0;font-family:Oswald,sans-serif;font-weight:600;font-size:18.5px;letter-spacing:.02em;
  text-transform:uppercase;line-height:1.15}
.gk-bio{margin:0;font-size:16px;line-height:1.55;color:rgba(244,242,246,.72);max-width:400px}
.gk-bio b{color:#f4f2f6;font-weight:600}
.gk-hero-btns{display:flex;gap:12px;flex-wrap:wrap}
.gk-btn{display:inline-flex;align-items:center;gap:10px;padding:13px 22px;border-radius:12px;font:600 15px/1 "Wix Madefor Display",sans-serif;
  white-space:nowrap;cursor:pointer;text-decoration:none;transition:transform .25s ease,background-color .25s ease}
.gk-btn:active{transform:scale(.98)}
.gk-btn-primary{background:#f4f2f6;color:#0c0b0c;border:1px solid #f4f2f6}
.gk-btn-ghost{background:transparent;color:#f4f2f6;border:1px solid rgba(244,242,246,.3)}
.gk-btn-ghost:hover{background:rgba(244,242,246,.08)}
.gk-btn:focus-visible,.gk-icons a:focus-visible,.gk-dot:focus-visible,.gk-reel-close:focus-visible{outline:2px solid #a78bfa;outline-offset:3px}
.gk-icons{display:flex;gap:18px;font-size:26px}
.gk-icons a{color:#f4f2f6;display:inline-flex;transition:opacity .2s;text-decoration:none}
.brand,.brand *{text-decoration:none}
.gk-icons a:hover{opacity:.7}
.gk-clients{display:grid;gap:10px;border-top:1px solid rgba(244,242,246,.14);padding-top:16px}.gk-clients .gk-clients-more{font-weight:400;opacity:.55}
.gk-clients small{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:rgba(244,242,246,.6)}
.gk-clients div{display:flex;gap:8px 18px;flex-wrap:wrap;font-weight:600;font-size:15px}
.gk-carousel{position:relative;height:min(74vh,640px);display:grid;grid-template-rows:1fr auto auto auto;justify-items:center;gap:18px}
.gk-stage{position:relative;width:100%;height:100%}
.gk-slide{--w:min(25vw,330px);position:absolute;left:50%;top:50%;width:var(--w);aspect-ratio:3/4;
  margin:calc(var(--w) * -2 / 3) 0 0 calc(var(--w) / -2);border-radius:12px;overflow:hidden;background:#111;
  box-shadow:0 40px 90px -30px rgba(80,20,200,.7),0 0 0 1px rgba(255,255,255,.08);will-change:transform}
.gk-slide img,.gk-slide video{width:100%;height:100%;object-fit:cover;display:block}.gk-slide.gk-slide-glass{background:linear-gradient(150deg,rgba(255,255,255,.9) 0%,rgba(255,255,255,.74) 45%,rgba(246,243,255,.66) 100%);-webkit-backdrop-filter:blur(18px) saturate(1.5);backdrop-filter:blur(18px) saturate(1.5);box-shadow:inset 0 1px 0 rgba(255,255,255,.85),inset 0 0 0 1px rgba(255,255,255,.5),0 40px 90px -30px rgba(80,20,200,.7)}.gk-slide.gk-slide-glass img{object-fit:contain}
.gk-caption{display:flex;gap:10px;align-items:baseline;font-size:15px;min-height:22px}
.gk-cap-title{font-weight:600}
.gk-cap-kind{color:rgba(244,242,246,.6)}
.gk-dots{display:flex;gap:8px}
.gk-dot{width:28px;height:4px;border:0;border-radius:4px;background:rgba(244,242,246,.25);cursor:pointer;padding:0;transition:background .3s,width .3s}
.gk-dot.on{background:#f4f2f6;width:44px}
.gk-reel-btn[hidden]{display:none!important}.gk-reel-btn{display:inline-flex;align-items:center;gap:8px;background:none;border:0;color:#f4f2f6;font:500 14px/1 "Wix Madefor Display",sans-serif;
  cursor:pointer;opacity:.85;padding:6px 8px;border-radius:12px}
.gk-reel-btn:hover{opacity:1}
.gk-reel-btn:focus-visible{outline:2px solid #a78bfa;outline-offset:3px}
.gk-reel-modal{width:100vw;height:100dvh;max-width:none;max-height:none;margin:0;padding:0;border:0;background:rgba(8,6,10,.92);color:#fff}
.gk-reel-modal[open]{display:grid;place-items:center}
.gk-reel-modal::backdrop{background:rgba(8,6,10,.6);backdrop-filter:blur(8px)}
.gk-reel-modal video{max-height:86vh;max-width:92vw;aspect-ratio:4/5;border-radius:12px;background:#000}
.gk-reel-close{position:absolute;top:20px;right:24px;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.25);
  background:rgba(255,255,255,.06);color:#fff;font-size:20px;display:grid;place-items:center;cursor:pointer}
@media (max-width:767px){
  .gk-hero-grid{grid-template-columns:1fr;padding:110px 20px 48px;gap:40px}
  .gk-lockup{min-width:0}
  .gk-lock-mark{font-size:36px;padding:10px 14px}
  .gk-lock-name{font-size:27px}
  .gk-tagline{font-size:15px;white-space:normal}
  .gk-carousel{height:min(62vh,480px)}
  .gk-slide{--w:min(56vw,250px)}
}
</style></head>"""

JS = """<script>
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hero=document.querySelector('.gk-hero'); if(!hero) return;
  var slides=[].slice.call(hero.querySelectorAll('.gk-slide'));
  var dots=[].slice.call(hero.querySelectorAll('.gk-dot'));
  var capT=hero.querySelector('.gk-cap-title'), capK=hero.querySelector('.gk-cap-kind');
  var n=slides.length, active=0, timer=null, paused=false;
  function pose(d){ // d: 0 front, 1 right (next), 2 left (prev)
    var wide=window.innerWidth>=768;
    if(d===0) return {xPercent:0,rotation:0,scale:1,zIndex:3,opacity:1,filter:'brightness(1)'};
    if(d===1) return {xPercent:wide?46:40,rotation:11,scale:.84,zIndex:2,opacity:.95,filter:'brightness(.62)'};
    if(d===n-1) return {xPercent:wide?-46:-40,rotation:-11,scale:.84,zIndex:1,opacity:.95,filter:'brightness(.62)'};
    return {xPercent:0,rotation:0,scale:.7,zIndex:0,opacity:0,filter:'brightness(.5)'}; // waiting behind the front card
  }
  function render(animate){
    slides.forEach(function(s,k){
      var p=pose((k-active+n)%n);
      if(window.gsap&&animate&&!reduce){ gsap.to(s,Object.assign({duration:.9,ease:'power3.inOut',overwrite:true},p)); }
      else if(window.gsap){ gsap.set(s,p); }
      else { s.style.zIndex=p.zIndex; s.style.transform='translate(-50%,-50%) translateX('+p.xPercent+'%) rotate('+p.rotation+'deg) scale('+p.scale+')'; }
    });
    dots.forEach(function(d,k){ d.classList.toggle('on',k===active); d.setAttribute('aria-current',k===active?'true':'false'); });
    capT.textContent=slides[active].dataset.title; capK.textContent=slides[active].dataset.kind;
    // only the front card's video plays; a video with data-src loads the first time it comes to the front
    slides.forEach(function(s,k){ var v=s.querySelector('video'); if(!v) return;
      if(k===active){ if(v.dataset.src&&!v.getAttribute('src')){ v.src=v.dataset.src; v.preload='auto'; }
        var p=v.play(); if(p&&p.catch) p.catch(function(){}); }
      else if(!v.paused) v.pause(); });
  }
  function go(k){ active=(k+n)%n; render(true); }
  function start(){ if(reduce) return; stop(); timer=setInterval(function(){ if(!paused) go(active+1); },3200); }
  function stop(){ if(timer) clearInterval(timer); timer=null; }
  dots.forEach(function(d,k){ d.addEventListener('click',function(){ go(k); start(); }); });
  var car=hero.querySelector('.gk-carousel');
  car.addEventListener('mouseenter',function(){paused=true;}); car.addEventListener('mouseleave',function(){paused=false;});
  car.addEventListener('focusin',function(){paused=true;}); car.addEventListener('focusout',function(){paused=false;});
  hero.querySelector('.gk-stage').addEventListener('click',function(){ go(active+1); start(); });
  window.addEventListener('resize',function(){ render(false); });
  document.addEventListener('visibilitychange',function(){ paused=document.hidden; });
  render(false);

  // Intro: wait for the preloader to finish, then reveal copy and deal in the cards.
  var ins=[].slice.call(hero.querySelectorAll('.gk-in'));
  if(window.gsap&&!reduce){ gsap.set(ins,{opacity:0,y:24}); gsap.set(slides,{y:80,opacity:0}); }
  var played=false;
  function intro(){
    if(played) return; played=true;
    if(window.gsap&&!reduce){
      gsap.to(ins,{opacity:1,y:0,duration:.9,ease:'power3.out',stagger:.08});
      slides.forEach(function(s,k){ gsap.to(s,{y:0,opacity:pose((k-active+n)%n).opacity,duration:1,ease:'power3.out',delay:.25+k*.12}); });
    }
    start();
  }
  var pre=document.querySelector('.preloader');
  function preDone(){ return !pre||pre.classList.contains('hidden')||getComputedStyle(pre).visibility==='hidden'||getComputedStyle(pre).opacity==='0'; }
  if(preDone()) intro();
  else { var mo=new MutationObserver(function(){ if(preDone()){ mo.disconnect(); intro(); } });
         mo.observe(pre,{attributes:true,attributeFilter:['class','style']}); setTimeout(intro,7000); }

  // Showreel lightbox
  var modal=document.querySelector('.gk-reel-modal'), mv=modal.querySelector('video'), opener=null;
  function openReel(e){ opener=e.currentTarget; modal.showModal(); mv.currentTime=0; mv.play().catch(function(){}); }
  function closeReel(){ modal.close(); }
  modal.addEventListener('close',function(){ mv.pause(); if(opener) opener.focus(); });
  hero.querySelector('[data-gk-reel]').addEventListener('click',openReel);
  modal.querySelector('.gk-reel-close').addEventListener('click',closeReel);
  modal.addEventListener('click',function(e){ if(e.target===modal) closeReel(); });

})();
</script>"""

rep('</head>', HEAD)
rep('</body>', MODAL + JS + '</body>')
open(path, "w", encoding="utf-8").write(h)
print("ok")
