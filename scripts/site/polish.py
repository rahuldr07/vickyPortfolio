"""Final pass over every page in site-pages/ (index, work, about, work/*): performance, accessibility and
one consistent contact flow. Run after project.py.

Usage: python3 -I polish.py <repo root> <icons dir>
"""
import glob, os, re, sys

ROOT, ICONS = sys.argv[1], sys.argv[2]
SP = os.path.join(ROOT, "site-pages")
EMAIL = "geethakrishna.designer@gmail.com"
FOOTER_OPENER = 'data-w-id="58591140-0a5f-ec06-3962-f19e1374bc5f"'  # footer "Let's Talk": opens the project form


def svg(name):
    s = open(os.path.join(ICONS, name + ".svg")).read().strip()
    return s.replace('<svg ', '<svg class="gk-ic" aria-hidden="true" focusable="false" width="1em" height="1em" ', 1)


ICON_MAP = {f"ph ph-{n}": svg(n) for n in ("envelope-simple", "whatsapp-logo", "behance-logo", "linkedin-logo", "x",
                                            "caret-left", "caret-right", "arrow-right", "arrow-left")}
ICON_MAP["ph-fill ph-play"] = svg("play-fill")

FONTS = ('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>'
         '<link href="https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@400;500;600;700;800'
         '&amp;family=Tiro+Kannada:ital@0;1&amp;display=swap" rel="stylesheet"/>')

CSS = """<style>
.gk-ic{display:inline-block;vertical-align:-.125em;flex:none}
.gk-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.gk-avail{margin:0;display:inline-flex;align-items:center;gap:10px;justify-self:start;padding:8px 14px;border-radius:12px;
  border:1px solid rgba(74,222,128,.35);background:rgba(74,222,128,.08);font-size:14px;color:#d9fbe5}
.gk-avail-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;box-shadow:0 0 0 4px rgba(74,222,128,.18)}
.gk-btn{display:inline-flex;align-items:center;gap:10px;padding:13px 22px;border-radius:12px;font:600 15px/1 "Wix Madefor Display",sans-serif;
  white-space:nowrap;text-decoration:none;cursor:pointer}
.gk-btn-primary{background:#f4f2f6;color:#0c0b0c;border:1px solid #f4f2f6}
.gk-btn-ghost{background:transparent;color:#f4f2f6;border:1px solid rgba(244,242,246,.3)}
.gk-btn:focus-visible{outline:2px solid #a78bfa;outline-offset:3px}
.gk-cta-block{max-width:1180px;margin:0 auto;padding:40px 6vw 110px;display:grid;gap:16px;justify-items:start;color:#f4f2f6}
.gk-cta-block h2{margin:0;font:500 clamp(36px,5vw,64px)/1 "Wix Madefor Display",sans-serif;letter-spacing:-.04em}
.gk-cta-block p{margin:0;max-width:620px;color:rgba(244,242,246,.72);line-height:1.55}
.gk-cta-btns{display:flex;gap:12px;flex-wrap:wrap;margin-top:6px}
button.main-button{border:0;background-color:transparent;font:inherit;color:inherit;cursor:pointer}
button.main-button>span{display:block}
.form-pop-up .input:focus-visible,.form-pop-up button:focus-visible{outline:2px solid #a78bfa;outline-offset:2px}
.gk-select{appearance:none;cursor:pointer}
.gk-select option{color:#0c0b0c}
.gk-textarea{resize:vertical;min-height:84px;font:inherit}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;
  transition-duration:.01ms!important;scroll-behavior:auto!important}}
@media (max-width:767px){.gk-cta-block{padding:24px 20px 90px}}
</style></head>"""

FORM_FIELDS = """<div class="input-wrapper"><select class="input w-input gk-select" name="Service" aria-label="What do you need?">
<option value="">What do you need?</option><option>Logo &amp; Brand Identity</option><option>Posters &amp; Social Creatives</option>
<option>Print &amp; Editorial Design</option><option>Video Editing &amp; Motion</option><option>Something else</option></select></div>
<div class="input-wrapper"><textarea class="input w-input gk-textarea" name="Brief" rows="3" maxlength="2000"
placeholder="Brief and deadline (optional)" aria-label="Brief and deadline (optional)"></textarea></div>"""

SEND = ("""<script>function gkSendEnquiry(f){var g=function(n){return (f.find('[name="'+n+'"]').val()||'').trim();};"""
        """var n=g('Name'),e=g('Email'),s=g('Service'),b=g('Brief');"""
        f"""window.location.href='mailto:{EMAIL}?subject='+encodeURIComponent((s?s+' enquiry':'Project enquiry')+' from '+n)"""
        """+'&body='+encodeURIComponent('Hi Geetha,\\n\\nName: '+n+'\\nEmail: '+e+(s?'\\nService: '+s:'')+'\\n\\nBrief:\\n'+(b||'')+'\\n');"""
        """f.hide();f.siblings('.w-form-done').show();}</script>""")

JS = """<script>
(function(){
  // One contact action: every [data-gk-talk] opens the project form (falls back to its href).
  document.addEventListener('click',function(e){
    var t=e.target.closest&&e.target.closest('[data-gk-talk]'); if(!t||e.metaKey||e.ctrlKey||e.shiftKey) return;
    var opener=document.querySelector('[__OPENER__]'); if(!opener) return;
    e.preventDefault(); opener.click();
    setTimeout(function(){ var i=document.querySelector('.form-pop-up input[name="Name"]'); if(i) i.focus(); },450);
  });
  // Escape closes the project form
  document.addEventListener('keydown',function(e){
    if(e.key!=='Escape') return; var p=document.querySelector('.form-pop-up');
    if(p&&getComputedStyle(p).display!=='none'){ var c=p.querySelector('.close-form-s'); if(c) c.click(); }
  });
  // Lazy videos: only play while on screen
  var vids=[].slice.call(document.querySelectorAll('video[data-gk-lazy]'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(en){ var v=en.target;
      if(en.isIntersecting){ if(v.preload==='none') v.preload='auto'; var p=v.play(); if(p&&p.catch) p.catch(function(){}); } else v.pause(); }); },
      {rootMargin:'200px 0px'});
    vids.forEach(function(v){ io.observe(v); });
  } else vids.forEach(function(v){ v.autoplay=true; v.play(); });
  // Reduced motion: let GSAP reveals finish almost instantly
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches&&window.gsap){ gsap.globalTimeline.timeScale(40); }
})();
</script>""".replace("__OPENER__", FOOTER_OPENER)


def must(h, old, new, name, count=1):
    n = h.count(old)
    assert n == count, (name, old[:70], n)
    return h.replace(old, new)


pages = sorted(glob.glob(os.path.join(SP, "*.html")) + glob.glob(os.path.join(SP, "work", "*.html")))
for p in pages:
    name = os.path.relpath(p, SP)
    h = open(p, encoding="utf-8").read()

    # --- icons: inline SVG instead of the 650 KB icon webfont loader
    h = h.replace('<script src="https://unpkg.com/@phosphor-icons/web@2.1.1"></script>', '')
    for cls, s in ICON_MAP.items():
        h = h.replace(f'<i class="{cls}"></i>', s)
    assert 'class="ph' not in h and 'phosphor' not in h, (name, re.findall(r'class="ph[^"]*"', h)[:3])

    # --- fonts: plain stylesheet link instead of render-blocking webfont.js
    h = re.sub(r'<script src="/gk/js/webfont\.js"[^>]*></script><script type="text/javascript">WebFont\.load\([^<]*</script>',
               FONTS, h)
    assert 'WebFont.load' not in h, name
    h = h.replace('<link href="https://cdn.prod.website-files.com" rel="preconnect"/>', '')

    # --- duplicate id
    h = must(h, '<footer id="contacts" class="footer"><section id="contacts" class="footer-sc">',
             '<footer id="contacts" class="footer"><section class="footer-sc">', name)

    # --- nav "Let's Talk" opens the form too
    h = must(h, 'href="#contacts" class="nav-link w-inline-block"', 'href="#contacts" data-gk-talk class="nav-link w-inline-block"', name)

    # --- project form: labels, fields, real buttons
    h = must(h, '<input class="input error w-input" maxlength="256" name="Name" wr-type="required-field" data-name="Name" placeholder="Name" type="text" id="Name-4" required=""/>',
             '<input class="input w-input" maxlength="256" name="Name" wr-type="required-field" data-name="Name" placeholder="Name" type="text" id="Name-4" required="" aria-label="Your name" autocomplete="name"/>', name)
    h = must(h, 'placeholder="Email" type="email" id="Email" required=""/>',
             'placeholder="Email" type="email" id="Email" required="" aria-label="Your email" autocomplete="email"/>', name)
    k = h.index('<div wr-type="error" class="input-error">Please provide a correct email.</div></div>') + \
        len('<div wr-type="error" class="input-error">Please provide a correct email.</div></div>')
    h = h[:k] + FORM_FIELDS + h[k:]
    h = must(h, 'Leave your name and email to send me a quick note.', 'Tell me what you need and I’ll reply by email.', name)
    h = must(h, '<a wr-type="submit" href="#" class="main-button w-inline-block"><div class="button-text">Submit</div><div data-hover-button="" class="button-hover-bg"></div></a>',
             '<button type="button" wr-type="submit" class="main-button w-inline-block"><span class="button-text">Send enquiry</span><span data-hover-button="" class="button-hover-bg"></span></button>', name)
    h = must(h, '<a wr-type="submit" data-w-id="a15ed872-1f81-bd24-fc2f-6dbf1423387f" href="#" class="main-button close-form-s w-inline-block"><div class="button-text">Close</div><div data-hover-button="" class="button-hover-bg close-form-s"></div></a>',
             '<button type="button" data-w-id="a15ed872-1f81-bd24-fc2f-6dbf1423387f" class="main-button close-form-s w-inline-block"><span class="button-text">Close</span><span data-hover-button="" class="button-hover-bg close-form-s"></span></button>', name)
    h = must(h, "$('input, textarea').keypress(function(e) {", "$('input').keypress(function(e) {", name)
    h, n = re.subn(r'<script>function gkSendEnquiry\(f\)\{.*?</script>', lambda m: SEND, h, flags=re.S)
    assert n == 1, (name, "send")
    h = re.sub(r'<div class="form-pop-up"', '<div class="form-pop-up" role="dialog" aria-modal="true" aria-label="Start your project"', h, count=1)

    # --- videos below the hero: load and play only when visible
    hero = (h.find('<section id="home" class="gk-hero">'), h.find('</section>', h.find('<section id="home" class="gk-hero">')))

    def lazy(m):
        tag = m.group(0)
        if hero[0] != -1 and hero[0] < m.start() < hero[1]:
            return tag
        if ' autoplay' not in tag:
            return tag
        tag = tag.replace(' autoplay', ' data-gk-lazy')
        tag = re.sub(r' preload="[^"]*"', '', tag).replace('<video', '<video preload="none"', 1)
        return tag.replace(' loading="lazy"', '')
    h = re.sub(r'<video[^>]*>', lazy, h)

    # --- home preloader: ~1 s after DOM ready, never stuck, skipped for reduced motion
    if name == "index.html":
        h = must(h, 'window.addEventListener("load", () => {', 'document.addEventListener("DOMContentLoaded", () => {', name)
        h = must(h, "if (!preloder || typeof gsap === 'undefined') {",
                 "if (!preloder || typeof gsap === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) {\n"
                 "      if (preloder) preloder.classList.add('hidden');", name)
        h = must(h, '}, 2400);', '}, 900);', name)

    h = must(h, '</head>', CSS, name)
    h = must(h, '</body>', JS + '</body>', name)
    open(p, "w", encoding="utf-8").write(h)

print("polished", len(pages), "pages")
