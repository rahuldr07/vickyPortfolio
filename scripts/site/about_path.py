"""About page: turn the three experience cards into a vertical career path.

The cards (logo, company, role, dates, link) are read from the page itself, so the logos and links
stay whatever the earlier passes produced. Oldest role at the top; a line fills down the path as the
visitor scrolls, and each step lights up when the line reaches it. Current role (".. - Present") pulses.

Used by adapt.py; can also be run on a built page:  python3 -I about_path.py <about.html>
"""
import re
import sys

CARD_RE = re.compile(
    r'<a data-team-trigger="" view-item="" href="(?P<href>[^"]*)" class="team-card w-inline-block">'
    r'<div data-team-trigger="" class="team-avatar">(?P<logo>.*?)</div><div class="team-person-info">'
    r'<h3 class="headline-h3">(?P<name>[^<]*)</h3><p class="body-main opacity-60">(?P<role>[^<]*)<br/>(?P<dates>[^<]*)</p></div>'
    r'<div data-team-trigger="" class="team-link"></div></a>', re.S)

CSS = """<style>
.gk-path{position:relative;margin-top:clamp(8px,2vw,24px);--rail:calc(200px + 44px)}
.gk-path-label{margin:0 0 clamp(28px,4vw,44px);font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:rgba(244,242,246,.55)}
.gk-path-list{list-style:none;margin:0;padding:0;display:grid;gap:clamp(56px,7vw,96px)}
.gk-step{display:grid;grid-template-columns:200px 88px minmax(0,1fr);align-items:center;column-gap:0}
.gk-step-when{justify-self:end;padding-right:28px;white-space:nowrap;font:600 clamp(32px,3.3vw,52px)/1 "Wix Madefor Display",sans-serif;letter-spacing:-.04em;
  color:transparent;-webkit-text-stroke:1px rgba(244,242,246,.28);transition:color .7s ease,-webkit-text-stroke-color .7s ease}
.gk-step-node{position:relative;z-index:2;justify-self:center;width:88px;aspect-ratio:1;border-radius:50%;overflow:hidden;container-type:inline-size;
  border:2px solid rgba(244,242,246,.14);background:#141215;transform:scale(.86);filter:grayscale(1) brightness(.6);
  transition:transform .7s cubic-bezier(.2,.8,.2,1),filter .7s ease,border-color .7s ease,box-shadow .7s ease}
.gk-step-node>*{width:100%;height:100%}
.gk-step-card{display:grid;gap:6px;margin-left:clamp(20px,3vw,40px);max-width:560px;padding:22px 26px;border-radius:16px;
  text-decoration:none;color:#f4f2f6;background:rgba(244,242,246,.035);border:1px solid rgba(244,242,246,.08);
  opacity:.18;transform:translateX(26px);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.8,.2,1),border-color .3s ease,background-color .3s ease}
.gk-step-card:hover{border-color:rgba(167,139,250,.45);background:rgba(167,139,250,.06)}
.gk-step-period{font-size:13px;letter-spacing:.06em;color:rgba(244,242,246,.55)}
.gk-step-card h3{margin:0;font:500 clamp(22px,2.2vw,30px)/1.15 "Wix Madefor Display",sans-serif;letter-spacing:-.02em}
.gk-step-role{margin:0;font-size:16px;color:rgba(244,242,246,.78)}
.gk-step-more{margin-top:8px;font-size:14px;color:#a78bfa;display:inline-flex;gap:6px;align-items:center}
.gk-step-more i{font-style:normal;transition:transform .3s ease}
.gk-step-card:hover .gk-step-more i{transform:translateX(4px)}
.gk-step-now{justify-self:start;display:inline-flex;align-items:center;gap:8px;margin-bottom:4px;padding:5px 12px;border-radius:999px;
  font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#d9fbe5;background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.4)}
.gk-step-now::before{content:"";width:7px;height:7px;border-radius:50%;background:#4ade80}
/* lit by the line */
.gk-step.is-on .gk-step-when{color:#f4f2f6;-webkit-text-stroke-color:transparent}
.gk-step.is-on .gk-step-node{transform:none;filter:none;border-color:rgba(167,139,250,.75);box-shadow:0 0 0 6px rgba(167,139,250,.12),0 10px 40px -10px rgba(124,58,237,.7)}
.gk-step.is-on .gk-step-card{opacity:1;transform:none}
.gk-step.is-current.is-on .gk-step-node{border-color:#4ade80;animation:gkNowPulse 2.4s ease-out infinite}
.gk-step.is-current.is-on .gk-step-when{color:#4ade80}
@keyframes gkNowPulse{0%{box-shadow:0 0 0 0 rgba(74,222,128,.45),0 10px 40px -10px rgba(74,222,128,.6)}70%,100%{box-shadow:0 0 0 16px rgba(74,222,128,0),0 10px 40px -10px rgba(74,222,128,.6)}}
/* the path */
.gk-path-rail{position:absolute;z-index:1;left:var(--rail);width:2px;margin-left:-1px;top:0;height:0;border-radius:2px;background:rgba(244,242,246,.1);pointer-events:none}
.gk-path-fill{position:absolute;inset:0;border-radius:2px;transform-origin:top;transform:scaleY(0);
  background:linear-gradient(#7c3aed,#a78bfa 55%,#4ade80);transition:transform .12s linear}
.gk-path-head{position:absolute;left:50%;top:0;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;background:#f4f2f6;opacity:0;
  box-shadow:0 0 0 4px rgba(167,139,250,.35),0 0 22px 6px rgba(167,139,250,.55);transition:transform .12s linear,opacity .3s ease}
@media (max-width:767px){
  .gk-path{--rail:32px}
  .gk-step{grid-template-columns:64px minmax(0,1fr)}
  .gk-step-when{display:none}
  .gk-step-node{width:64px}
  .gk-step-card{margin-left:16px;margin-right:16px;padding:18px 18px}
}
@media (prefers-reduced-motion:reduce){
  .gk-step-node,.gk-step-card,.gk-step-when,.gk-path-fill,.gk-path-head{transition:none}
  .gk-step.is-current.is-on .gk-step-node{animation:none}
}
</style>"""

JS = """<script>
(function(){
  // Experience path: the line fills with scroll; each step lights up when the line reaches its node.
  var p=document.querySelector('[data-gk-path]'); if(!p) return;
  var rail=p.querySelector('.gk-path-rail'), fill=p.querySelector('.gk-path-fill'), head=p.querySelector('.gk-path-head');
  var steps=[].slice.call(p.querySelectorAll('.gk-step')), nodes=steps.map(function(s){return s.querySelector('.gk-step-node');});
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches, top=0, h=1, tick=false;
  function mid(el){ var r=el.getBoundingClientRect(); return r.top+r.height/2; }
  function measure(){
    var pt=p.getBoundingClientRect().top; top=mid(nodes[0])-pt; h=Math.max(1,mid(nodes[nodes.length-1])-mid(nodes[0]));
    rail.style.top=top+'px'; rail.style.height=h+'px'; update();
  }
  function update(){
    var anchor=window.innerHeight*0.62, pt=p.getBoundingClientRect().top;
    var prog=reduce?1:Math.max(0,Math.min(1,(anchor-(pt+top))/h));
    fill.style.transform='scaleY('+prog+')';
    head.style.transform='translateY('+(prog*h)+'px)'; head.style.opacity=(prog>0&&prog<1)?'1':'0';
    steps.forEach(function(s,i){ s.classList.toggle('is-on', reduce || mid(nodes[i])<=anchor+1); });
  }
  addEventListener('scroll',function(){ if(tick) return; tick=true; requestAnimationFrame(function(){ tick=false; update(); }); },{passive:true});
  addEventListener('resize',measure); addEventListener('load',measure);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(measure);
  measure();
})();
</script>"""


def build(h):
    i = h.index('<div view-list="" class="team-cards">')
    depth, j = 0, None
    for m in re.finditer(r'<div\b|</div>', h[i:]):
        depth += 1 if m.group(0) == '<div' else -1
        if depth == 0:
            j = i + m.end()
            break
    cards = [m.groupdict() for m in CARD_RE.finditer(h[i:j])]
    assert len(cards) == 3, len(cards)

    def year(dates):
        a, b = [x.strip() for x in re.split(r'\s+-\s+', dates)]
        y1 = a.split()[-1]
        if b == 'Present':
            return y1  # the card's "Now" badge says it is ongoing
        return y1 if b.split()[-1] == y1 else f'{y1}–{b.split()[-1][-2:]}'

    items = []
    for c in cards:  # already oldest first
        current = c['dates'].strip().endswith('Present')
        period = c['dates'].replace(' - ', ' – ')
        items.append(
            f'<li class="gk-step{" is-current" if current else ""}">'
            f'<div class="gk-step-when" aria-hidden="true">{year(c["dates"])}</div>'
            f'<div class="gk-step-node">{c["logo"]}</div>'
            f'<a class="gk-step-card" href="{c["href"]}">'
            + ('<span class="gk-step-now">Now</span>' if current else '') +
            f'<span class="gk-step-period">{period}</span>'
            f'<h3>{c["name"]}</h3><p class="gk-step-role">{c["role"]}</p>'
            f'<span class="gk-step-more">See the work <i aria-hidden="true">→</i></span></a></li>')

    path = (CSS + '<div class="gk-path" data-gk-path><p class="gk-path-label">Experience</p>'
            '<div class="gk-path-rail" aria-hidden="true"><span class="gk-path-fill"></span><span class="gk-path-head"></span></div>'
            '<ol class="gk-path-list">' + ''.join(items) + '</ol></div>')
    h = h[:i] + path + h[j:]
    assert h.count('</body>') == 1
    return h.replace('</body>', JS + '</body>')


if __name__ == '__main__':
    f = sys.argv[1]
    html = open(f, encoding='utf-8').read()
    if 'data-gk-path' in html:
        print('already has the path')
    else:
        open(f, 'w', encoding='utf-8', newline='').write(build(html))
        print('path built')
