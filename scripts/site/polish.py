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

SEND = '<script>function gkSendEnquiry(f){var g=function(n){return (f.find(\'[name="\'+n+\'"]\').val()||\'\').trim();};var btn=f.find(\'[wr-type="submit"]\'),txt=btn.find(\'.button-text\'),fail=f.siblings(\'.w-form-fail\');if(btn.prop(\'disabled\'))return;fail.hide();btn.prop(\'disabled\',true);txt.text(\'Sending…\');fetch(\'/api/enquiry\',{method:\'POST\',headers:{\'Content-Type\':\'application/json\'},body:JSON.stringify({name:g(\'Name\'),email:g(\'Email\'),service:g(\'Service\'),brief:g(\'Brief\'),website:g(\'website\')})}).then(function(r){return r.json().catch(function(){return {};}).then(function(d){if(!r.ok||!d.ok)throw d;});}).then(function(){f[0].reset();f.hide();f.siblings(\'.w-form-done\').show();clearTimeout(window.gkFormT);window.gkFormT=setTimeout(function(){gkResetForm(f);},4000);}).catch(function(d){fail.children().first().html(((d&&d.error)||\'Couldn’t send right now.\')+\' You can also <a href="mailto:geethakrishna.designer@gmail.com" style="text-decoration:underline">email me</a> or <a href="https://wa.me/917989228383" target="_blank" rel="noopener" style="text-decoration:underline">message on WhatsApp</a>.\');fail.show();}).then(function(){btn.prop(\'disabled\',false);txt.text(\'Send enquiry\');});}function gkResetForm(f){f=f||$(\'.form-pop-up form\');clearTimeout(window.gkFormT);f.siblings(\'.w-form-done,.w-form-fail\').hide();f.show();f.find(\'.error\').removeClass(\'error\');f.find(\'[wr-type="error"]\').hide();}document.addEventListener(\'click\',function(e){if(e.target.closest&&e.target.closest(\'.close-form-s,.pop-close-area\'))setTimeout(function(){gkResetForm();},450);});</script>'  # posts to /api/enquiry (Gmail), falls back to email/WhatsApp links

JS = """<script>
(function(){
  // One contact action: every [data-gk-talk] opens the project form (falls back to its href).
  document.addEventListener('click',function(e){
    var t=e.target.closest&&e.target.closest('[data-gk-talk]'); if(!t||e.metaKey||e.ctrlKey||e.shiftKey) return;
    var opener=document.querySelector('[__OPENER__]'); if(!opener) return;
    // open the form only: no jump to #contacts behind it, the page stays exactly where it was
    e.preventDefault(); e.stopPropagation();
    var y=window.scrollY, keep=function(){
      if(location.hash==='#contacts'||location.hash==='#') history.replaceState(null,'',location.pathname+location.search);
      if(Math.abs(window.scrollY-y)>2){ if(window.SScroll&&SScroll.scrollTo) SScroll.scrollTo(y,{immediate:true,force:true}); else window.scrollTo(0,y); }
    };
    opener.click(); requestAnimationFrame(keep); setTimeout(keep,150); setTimeout(keep,500);
    setTimeout(function(){ var i=document.querySelector('.form-pop-up input[name="Name"]'); if(i) i.focus({preventScroll:true}); },450);
  },true);
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
# pinned "Available for freelance" badge: top-right on every page (bottom-right on phones), opens the project form
PIN = """<style>
/* pinned availability badge: top-right on every page, opens the project form */
.gk-pin{position:fixed;top:calc(3.46rem - max(26px,2.8rem) / 2);right:max(16px,2rem);z-index:9001;display:inline-flex;align-items:center;gap:max(6px,.55rem);height:max(26px,2.8rem);padding:0 max(11px,1rem) 0 max(9px,.85rem);border-radius:999px;background:rgba(10,32,19,.55);border:1px solid rgba(74,222,128,.42);-webkit-backdrop-filter:blur(1rem);backdrop-filter:blur(1rem);color:#d9fbe5;font-family:"Wix Madefor Display",sans-serif;font-weight:500;font-size:max(11px,.8rem);line-height:1;letter-spacing:.01em;text-decoration:none;white-space:nowrap;box-shadow:0 .6rem 2.4rem -.8rem rgba(74,222,128,.4);transition:background-color .25s ease,border-color .25s ease,transform .25s ease,opacity .4s ease}
.gk-pin:hover{background:rgba(18,58,34,.72);border-color:rgba(74,222,128,.75);transform:translateY(-1px)}
.gk-pin:focus-visible{outline:2px solid #4ade80;outline-offset:3px}
.gk-pin-dot{position:relative;flex:none;width:max(6px,.6rem);height:max(6px,.6rem);border-radius:50%;background:#4ade80}
.gk-pin-dot::after{content:"";position:absolute;inset:0;border-radius:50%;background:#4ade80;animation:gkPinPulse 2s ease-out infinite}
@keyframes gkPinPulse{0%{transform:scale(1);opacity:.7}100%{transform:scale(3);opacity:0}}
@media (prefers-reduced-motion:reduce){.gk-pin-dot::after{animation:none}}
@media (max-width:479px){
  .gk-pin{top:auto;bottom:max(16px,env(safe-area-inset-bottom));right:16px;height:30px;gap:6px;padding:0 11px 0 9px;font-size:11.5px;box-shadow:0 8px 28px -8px rgba(0,0,0,.6),0 0 0 1px rgba(74,222,128,.15)}
  .gk-pin-dot{width:6px;height:6px}
  body:has(.w-nav-overlay [data-nav-menu-open]) .gk-pin{opacity:0;pointer-events:none}
}
</style><a class="gk-pin" data-gk-talk href="mailto:geethakrishna.designer@gmail.com?subject=Project%20enquiry" aria-label="Available for freelance projects. Let’s talk"><span class="gk-pin-dot" aria-hidden="true"></span>Available for freelance</a>"""

# header: sliding current-page pill + page-to-page transitions (View Transitions, fade fallback)
NAVFX_CSS = """<style>
/* page-to-page transitions (cross-document View Transitions); the header and badge stay still */
@view-transition{navigation:auto}
.nav-container{view-transition-name:gk-nav}
.gk-pin{view-transition-name:gk-pin}
.gk-nav-pill{view-transition-name:gk-nav-pill}
::view-transition-old(root){animation:gkVtOut .2s cubic-bezier(.4,0,1,1) both}
::view-transition-new(root){animation:gkVtIn .35s cubic-bezier(0,0,.2,1) both}
::view-transition-group(gk-nav-pill){animation-duration:.32s;animation-timing-function:cubic-bezier(.65,0,.35,1)}
@keyframes gkVtOut{to{opacity:0;transform:translateY(-8px)}}
@keyframes gkVtIn{from{opacity:0;transform:translateY(12px)}}
@media (prefers-reduced-motion:reduce){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important}}
/* sliding highlight behind the current header link */
.gk-has-pill{position:relative}
.gk-has-pill .brand,.gk-has-pill .nav-link{position:relative;z-index:1}
.gk-has-pill .brand.w--current,.gk-has-pill .nav-link.w--current{background:none!important;box-shadow:none!important}
.gk-nav-pill{position:absolute;z-index:0;left:0;top:0;width:0;height:0;border-radius:8px;opacity:0;pointer-events:none;background:rgba(255,255,255,.16);box-shadow:inset 0 0 0 1px rgba(255,255,255,.22);transition:left .38s cubic-bezier(.65,0,.35,1),top .38s cubic-bezier(.65,0,.35,1),width .38s cubic-bezier(.65,0,.35,1),height .38s cubic-bezier(.65,0,.35,1),opacity .2s ease}
@media (max-width:479px){.gk-nav-pill{display:none}.gk-has-pill .brand.w--current,.gk-has-pill .nav-link.w--current{background:revert!important}}
/* fallback for browsers without cross-page transitions: quick fade out before leaving */
html.gk-leaving main,html.gk-leaving footer{opacity:0;transform:translateY(-8px);transition:opacity .15s ease,transform .15s ease}
</style>"""
NAVFX_JS = """<script>
(function(){
  // header: one highlight pill that slides to the clicked page, then the page transitions
  var nav=document.querySelector('.nav-container'); if(!nav) return;
  var wide=matchMedia('(min-width:480px)'), reduce=matchMedia('(prefers-reduced-motion: reduce)');
  var crossDoc='PageRevealEvent' in window;
  var pill=document.createElement('span'); pill.className='gk-nav-pill'; pill.setAttribute('aria-hidden','true');
  nav.insertBefore(pill,nav.firstChild); nav.classList.add('gk-has-pill');
  var links=function(){return [].slice.call(nav.querySelectorAll('a.brand,.nav-links a.nav-link'));};
  var cur=function(){return nav.querySelector('a.brand.w--current,.nav-links a.nav-link.w--current');};
  var home=cur();
  function place(el,instant){
    if(!el||!wide.matches){pill.style.opacity='0';return;}
    var c=nav.getBoundingClientRect(),r=el.getBoundingClientRect();
    if(instant) pill.style.transition='none';
    pill.style.left=(r.left-c.left)+'px'; pill.style.top=(r.top-c.top)+'px';
    pill.style.width=r.width+'px'; pill.style.height=r.height+'px'; pill.style.opacity='1';
    if(instant){void pill.offsetWidth; pill.style.transition='';}
  }
  function mark(a){
    links().forEach(function(l){l.classList.remove('w--current');l.removeAttribute('aria-current');});
    if(a){a.classList.add('w--current');a.setAttribute('aria-current','page');}
  }
  place(cur(),true);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(function(){place(cur(),true);});
  addEventListener('resize',function(){place(cur(),true);});
  addEventListener('pageshow',function(e){ // back/forward cache: restore this page's own highlight
    if(!e.persisted) return;
    document.documentElement.classList.remove('gk-leaving'); mark(home); place(home,true);
  });
  nav.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a');
    if(!a||!nav.contains(a)||a.hasAttribute('data-gk-talk')||e.defaultPrevented) return;
    if(e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==='_blank') return;
    var url=new URL(a.href,location.href);
    if(url.origin!==location.origin||url.hash) return;
    if(url.pathname===location.pathname){ // already here: just glide to the top
      e.preventDefault(); if(window.SScroll&&SScroll.scrollTo) SScroll.scrollTo(0); else scrollTo({top:0,behavior:'smooth'}); return;
    }
    if(!wide.matches) return; // phone menu: normal navigation (the page transition still plays)
    e.preventDefault();
    mark(a); place(a,false);
    var go=function(){location.href=a.href;};
    if(reduce.matches) return go();
    if(crossDoc) return go(); // the page transition slides the pill to the new link
    document.documentElement.classList.add('gk-leaving'); setTimeout(go,150);
  });
})();
</script>"""

FORM_BTN = '<span class="button-text">Send enquiry</span><span data-hover-button="" class="button-hover-bg"></span></button>'
FORM_DIRECT = '<style>.gk-form-direct{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:22px;padding-top:18px;border-top:1px solid rgba(244,242,246,.12)}.gk-form-direct>span{font-size:14px;color:rgba(244,242,246,.62)}.gk-form-direct>div{display:flex;gap:10px}.gk-form-direct a{display:grid;place-items:center;width:42px;height:42px;border-radius:12px;color:#f4f2f6;background:rgba(244,242,246,.06);border:1px solid rgba(244,242,246,.14);font-size:20px;transition:background-color .25s ease,border-color .25s ease,transform .25s ease}.gk-form-direct a:hover{background:rgba(74,222,128,.14);border-color:rgba(74,222,128,.55);transform:translateY(-2px)}.gk-form-direct a:focus-visible{outline:2px solid #4ade80;outline-offset:3px}</style><div class="gk-form-direct"><span>Or reach me directly</span><div><a href="https://wa.me/917989228383" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="ph ph-whatsapp-logo"></i></a><a href="mailto:geethakrishna.designer@gmail.com" aria-label="Email"><i class="ph ph-envelope-simple"></i></a><a href="https://www.linkedin.com/in/krishnadezyner" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="ph ph-linkedin-logo"></i></a></div></div>'

FORM_BLOCK = '<div class="form-block w-form">'
FORM_X = '<button type="button" class="gk-form-x" aria-label="Close" onclick="var c=document.querySelector(\'.form-pop-up .close-form-s\');if(c)c.click();"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'
FORM_TITLE = '<p class="headline-h3">Start your project</p>'
FORM_FIT_CSS = '<style>.form-pop-up .form-position{gap:0;width:min(580px,calc(100vw - 32px))}.form-pop-up .form-wrapper{width:100%}.form-pop-up .form-block{position:relative;width:100%;box-sizing:border-box;padding:28px 30px 24px;max-height:calc(100dvh - 32px);overflow:auto;overscroll-behavior:contain}.form-pop-up .close-form-s{display:none!important}.form-pop-up .form-title{gap:6px;padding-right:44px}.form-pop-up .form-title .headline-h3{font-size:28px;line-height:1.1}.form-pop-up .form-title .body-main{font-size:15px;line-height:1.45}.form-pop-up .form-inputs-wrapper{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:18px 0 18px}.form-pop-up .form-inputs-wrapper>.input-wrapper:nth-child(n+3){grid-column:1/-1}.form-pop-up .gk-textarea{min-height:84px}.form-pop-up form{display:grid;grid-template-columns:auto 1fr;align-items:center;column-gap:20px}.form-pop-up form>.form-title,.form-pop-up form>.form-inputs-wrapper{grid-column:1/-1}.form-pop-up .gk-form-direct{margin:0;padding:0;border:0;justify-content:flex-end;gap:12px}.gk-form-x{position:absolute;top:16px;right:16px;z-index:2;display:grid;place-items:center;width:38px;height:38px;border-radius:50%;border:1px solid rgba(244,242,246,.18);background:rgba(244,242,246,.06);color:#f4f2f6;cursor:pointer;transition:background-color .25s ease,border-color .25s ease,transform .25s ease}.gk-form-x:hover{background:rgba(244,242,246,.14);border-color:rgba(244,242,246,.4);transform:rotate(90deg)}.gk-form-x:focus-visible{outline:2px solid #4ade80;outline-offset:3px}.gk-form-x svg{width:16px;height:16px}@media (max-width:479px){.form-pop-up .form-block{padding:22px 18px 20px}.form-pop-up .form-title .headline-h3{font-size:24px}.form-pop-up .form-inputs-wrapper{grid-template-columns:1fr;gap:10px;padding:14px 0}.form-pop-up form{grid-template-columns:1fr;row-gap:16px}.form-pop-up .gk-form-direct{justify-content:space-between}.gk-form-x{top:12px;right:12px}}</style>'

# fetch a page when its link is pointed at (speculation rules; ignored where unsupported)
NAV_PREFETCH = '<script type="speculationrules">{"prefetch":[{"where":{"and":[{"href_matches":"/*"},{"not":{"href_matches":"/api/*"}},{"not":{"href_matches":"/*.pdf"}}]},"eagerness":"moderate"}]}</script>'

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

    # --- no Behance profile: drop its menu, footer and icon links
    h = h.replace('<a href="#" class="footer-media-link">Behance</a>', '')
    h = h.replace('<a text-hover-trigger="" href="#" class="footer-media-link w-inline-block"><div class="hover-link-mask">'
                  '<div hover-text="" class="media-link-text original">Behance</div><div hover-text="" class="media-link-text clone">Behance</div></div></a>', '')
    h = re.sub(r'[ \t]*<a href="#" aria-label="Behance">.*?</a>[ \t]*\r?\n?', '', h, flags=re.S)
    assert '>Behance<' not in h and 'aria-label="Behance"' not in h, name

    # --- contact order: WhatsApp, Email, LinkedIn (menu + footer)
    h = re.sub(r'(<a href="mailto:[^"]*" class="footer-media-link">Email</a>)(<a href="https://wa\.me/[^"]*"[^>]*class="footer-media-link">WhatsApp</a>)',
               lambda m: m.group(2) + m.group(1), h)
    h = re.sub(r'(<a text-hover-trigger="" href="mailto:[^"]*" class="footer-media-link w-inline-block">.*?</a>)'
               r'(<a text-hover-trigger="" href="https://wa\.me/[^"]*"[^>]*class="footer-media-link w-inline-block">.*?</a>)',
               lambda m: m.group(2) + m.group(1), h, flags=re.S)

    # --- footer: no phone number next to Resume (WhatsApp covers direct contact)
    h = re.sub(r'<a href="tel:[^"]*" class="policy-link">[^<]*</a>', '', h)

    # --- logo-rotate interaction disabled in webflow.js (a-21): bust the week-long asset cache
    h = h.replace('/gk/js/webflow.5946aeda.d175d508a3f7480e.js"', '/gk/js/webflow.5946aeda.d175d508a3f7480e.js?v=2"')

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
    # --- form popup fits one screen: compact two-column card, title on one line, x close top-right
    h = must(h, FORM_BLOCK, FORM_BLOCK + FORM_X, name)
    h, k = re.subn(r'<p class="headline-h3">Start\s*\u2028?\s*<br/>\s*Your Project</p>', FORM_TITLE, h)
    assert k == 1, (name, 'form title')
    h = must(h, '</head>', FORM_FIT_CSS + '</head>', name)

    # --- direct contact row under the form: WhatsApp, Email, LinkedIn
    h = must(h, FORM_BTN + '</form>', FORM_BTN + FORM_DIRECT + '</form>', name)
    h = must(h, '<button type="button" wr-type="submit" class="main-button w-inline-block">', '<input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0"/><button type="button" wr-type="submit" class="main-button w-inline-block">', name)  # spam honeypot
    for cls, svg_ in ICON_MAP.items():
        h = h.replace(f'<i class="{cls}"></i>', svg_)
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
        h = must(h, "        (!isBack && !isInternalReferrer) ||\n        pendingPreloader === 'true'\n      );", '        (!isBack && !isInternalReferrer)\n      );', name)  # intro only on a direct landing

    h = must(h, '</head>', NAVFX_CSS + '</head>', name)
    h = must(h, '</head>', CSS, name)
    h = must(h, '</body>', JS + PIN + '</body>', name)
    h = must(h, '</body>', NAVFX_JS + NAV_PREFETCH + '</body>', name)
    open(p, "w", encoding="utf-8").write(h)

print("polished", len(pages), "pages")
