"""SEO + lead-gen pass over index/about/work, then move the pages to site-pages/ (served by a
Next route handler that swaps {{SITE_URL}} for the real domain at build time).

Usage: python3 -I seo.py <repo root> <public/gk dir>
"""
import json, os, re, sys

# name lockup's spare space: pen tool, CMYK, play/timeline, registration mark cycling (home hero)
LOCK_ROLES = '<span class="gk-lock-art" aria-hidden="true"><svg viewBox="0 0 84 64" fill="none"><g class="gk-sc gk-sc1"><line class="gk-pt-h" x1="10" y1="54" x2="36" y2="54"/><line class="gk-pt-h" x1="74" y1="10" x2="48" y2="10"/><path class="gk-pt-c" pathLength="1" d="M10 54C36 54 48 10 74 10"/><circle class="gk-pt-k" cx="36" cy="54" r="2.4"/><circle class="gk-pt-k" cx="48" cy="10" r="2.4"/><rect class="gk-pt-a" x="6.5" y="50.5" width="7" height="7"/><rect class="gk-pt-a gk-pt-on" x="70.5" y="6.5" width="7" height="7"/></g><g class="gk-sc gk-sc2"><rect class="gk-sw" x="3" y="20" width="16" height="24" rx="3" fill="#00b7eb"/><rect class="gk-sw" x="23" y="20" width="16" height="24" rx="3" fill="#ec008c"/><rect class="gk-sw" x="43" y="20" width="16" height="24" rx="3" fill="#ffe600"/><rect class="gk-sw" x="63" y="20" width="16" height="24" rx="3" fill="#f4f2f6"/></g><g class="gk-sc gk-sc3"><circle cx="42" cy="24" r="15" stroke="#f4f2f6" stroke-width="1.6"/><path d="M38 17l11 7-11 7z" fill="#4ade80"/><line x1="8" y1="54" x2="76" y2="54" stroke="rgba(244,242,246,.3)" stroke-width="2.4" stroke-linecap="round"/><line class="gk-tl-fill" x1="8" y1="54" x2="76" y2="54" pathLength="1" stroke="#4ade80" stroke-width="2.4" stroke-linecap="round"/></g><g class="gk-sc gk-sc4"><path d="M4 16V4h12M68 4h12v12M80 48v12H68M16 60H4V48" stroke="rgba(244,242,246,.55)" stroke-width="1.4"/><g class="gk-reg"><circle cx="42" cy="32" r="13" stroke="#f4f2f6" stroke-width="1.4"/><path d="M42 13v38M23 32h38" stroke="#f4f2f6" stroke-width="1.4"/><circle cx="42" cy="32" r="5.5" fill="#4ade80"/></g></g></svg></span>'
LOCK_ROLES_CSS = '<style>.gk-lockup{grid-template-columns:auto 1fr auto}.gk-lock-art{display:grid;place-items:center;padding:10px 18px 10px 4px}.gk-lock-art svg{width:84px;height:64px;overflow:visible}.gk-pt-c{stroke:#f4f2f6;stroke-width:1.8;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:0}.gk-pt-h{stroke:rgba(244,242,246,.38);stroke-width:1}.gk-pt-k{fill:#0c0b0c;stroke:rgba(244,242,246,.6);stroke-width:1}.gk-pt-a{fill:#0c0b0c;stroke:#f4f2f6;stroke-width:1.3}.gk-pt-on{fill:#4ade80;stroke:#4ade80}.gk-tl-fill{stroke-dasharray:1;stroke-dashoffset:.35}.gk-sc{transform-box:view-box;transform-origin:42px 32px}.gk-sc2,.gk-sc3,.gk-sc4{opacity:0}.gk-sw,.gk-reg{transform-box:fill-box;transform-origin:center}@media (prefers-reduced-motion:no-preference){.gk-sc{opacity:0;animation:gkScene 12s cubic-bezier(.65,0,.35,1) infinite}.gk-sc2{animation-delay:3s}.gk-sc3{animation-delay:6s}.gk-sc4{animation-delay:9s}.gk-pt-c{animation:gkDraw 12s cubic-bezier(.65,0,.35,1) infinite}.gk-pt-on{animation:gkOn 12s ease-out infinite;transform-box:fill-box;transform-origin:center}.gk-sw{animation:gkSw 12s cubic-bezier(.34,1.56,.64,1) infinite}.gk-sw:nth-child(1){animation-delay:3s}.gk-sw:nth-child(2){animation-delay:3.15s}.gk-sw:nth-child(3){animation-delay:3.3s}.gk-sw:nth-child(4){animation-delay:3.45s}.gk-tl-fill{animation:gkTl 12s linear 6s infinite}.gk-reg{animation:gkReg 12s cubic-bezier(.65,0,.35,1) 9s infinite}}@keyframes gkScene{0%{opacity:0;transform:scale(.88)}4%,21%{opacity:1;transform:none}25%,100%{opacity:0;transform:scale(1.06)}}@keyframes gkDraw{0%,1%{stroke-dashoffset:1}13%,100%{stroke-dashoffset:0}}@keyframes gkOn{0%,11%{transform:scale(.3)}15%{transform:scale(1.3)}18%,100%{transform:none}}@keyframes gkSw{0%{transform:scale(0) translateY(6px)}5%,100%{transform:none}}@keyframes gkTl{0%,2%{stroke-dashoffset:1}22%,100%{stroke-dashoffset:0}}@keyframes gkReg{0%{transform:rotate(-90deg)}20%,100%{transform:rotate(90deg)}}@media (max-width:479px){.gk-lockup{grid-template-columns:auto 1fr}.gk-lock-art{display:none}}</style>'
LOCK_ROLES_JS = ''


ROOT, OUT = sys.argv[1], sys.argv[2]
SITE = "{{SITE_URL}}"
EMAIL = "geethakrishna.designer@gmail.com"
PHONE = "+917989228383"
OG = SITE + "/gk/og.jpg"
SERVICES = ["Graphic Design", "Logo Design", "Brand Identity Design", "Poster Design", "Social Media Creatives",
            "Magazine and Editorial Design", "Menu Card Design", "Hoarding and Web Banner Design",
            "Video Editing", "AI Video Production"]
work = json.load(open(os.path.join(ROOT, "site-pages", "work.json")))

PERSON = {
    "@type": "Person", "@id": SITE + "/#person", "name": "Geetha Krishna",
    "jobTitle": "Freelance Graphic Designer & Video Editor", "url": SITE + "/",
    "image": SITE + "/gk/work/geetha-portrait.webp", "email": EMAIL, "telephone": PHONE,
    "address": {"@type": "PostalAddress", "addressLocality": "Bengaluru", "addressRegion": "Karnataka", "addressCountry": "IN"},
    "knowsAbout": SERVICES,
    "knowsLanguage": ["en"],
}
SERVICE = {
    "@type": "ProfessionalService", "@id": SITE + "/#service", "name": "Geetha Krishna, Graphic Design & Video Editing",
    "url": SITE + "/", "image": OG, "email": EMAIL, "telephone": PHONE,
    "description": "Freelance graphic design and video editing studio of Geetha Krishna in Bengaluru.",
    "founder": {"@id": SITE + "/#person"},
    "address": PERSON["address"],
    "geo": {"@type": "GeoCoordinates", "latitude": 12.9716, "longitude": 77.5946},
    "areaServed": [{"@type": "City", "name": "Bengaluru"}, {"@type": "Country", "name": "India"}],
    "hasOfferCatalog": {"@type": "OfferCatalog", "name": "Design services", "itemListElement": [
        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": s}} for s in SERVICES]},
}
WEBSITE = {"@type": "WebSite", "@id": SITE + "/#website", "url": SITE + "/", "name": "Geetha Krishna Portfolio",
           "inLanguage": "en-IN", "publisher": {"@id": SITE + "/#person"}}


def work_item(n, it):
    node = {"@type": "CreativeWork", "name": it["title"].replace("&amp;", "&"), "description": it["description"],
            "genre": it["category"], "creator": {"@id": SITE + "/#person"},
            "image": SITE + it["thumb"], "url": SITE + "/work/" + it["slug"]}
    if it["type"] == "video":
        node["video"] = {"@type": "VideoObject", "name": node["name"], "description": it["description"],
                         "thumbnailUrl": SITE + it["thumb"], "contentUrl": SITE + it["src"],
                         "uploadDate": it["uploaded"], "duration": f"PT{it['duration']}S"}
    return {"@type": "ListItem", "position": n + 1, "item": node}


PAGES = {
    "index": dict(
        path="/", title="Geetha Krishna | Freelance Graphic Designer & Video Editor in Bengaluru",
        desc="Freelance graphic designer & video editor in Bengaluru, available for projects: logos, brand identity, "
             "posters, magazines, social creatives and video edits.",
        ld=[WEBSITE, PERSON, SERVICE]),
    "work": dict(
        path="/work", title="Work | Graphic Design & Video Portfolio of Geetha Krishna",
        desc=f"{len(work)} projects by Geetha Krishna, freelance designer in Bengaluru: brand identity, posters, "
             "magazine design, billboards and AI video for GreenMonk and more.",
        ld=[WEBSITE, PERSON, {"@type": "CollectionPage", "@id": SITE + "/work#page", "url": SITE + "/work",
                              "name": "Work by Geetha Krishna", "isPartOf": {"@id": SITE + "/#website"},
                              "about": {"@id": SITE + "/#person"},
                              "mainEntity": {"@type": "ItemList", "numberOfItems": len(work),
                                             "itemListElement": [work_item(n, it) for n, it in enumerate(work)]}}]),
    "about": dict(
        path="/about", title="About Geetha Krishna | Freelance Graphic Designer in Bengaluru",
        desc="Geetha Krishna, freelance graphic designer & video editor in Bengaluru with 5+ years in brand identity, "
             "campaigns, editorial and motion. Open to projects.",
        ld=[WEBSITE, PERSON, {"@type": "ProfilePage", "@id": SITE + "/about#page", "url": SITE + "/about",
                              "name": "About Geetha Krishna", "mainEntity": {"@id": SITE + "/#person"}}]),
}

ANALYTICS = """<script>(function(){if(/^(localhost|127\\.|\\[::1\\])/.test(location.hostname))return;
[['/_vercel/insights/script.js'],['/_vercel/speed-insights/script.js']].forEach(function(s){var e=document.createElement('script');e.defer=true;e.src=s[0];document.head.appendChild(e);});})();</script>"""

for name, cfg in PAGES.items():
    p = os.path.join(OUT, name + ".html")
    h = open(p, encoding="utf-8").read()

    # strip template / earlier head tags we now own
    h = re.sub(r'<title>[^<]*</title>', '', h)
    h = re.sub(r'<meta content="[^"]*" name="description"/>', '', h)
    h = re.sub(r'<meta content="[^"]*" (property="og:[^"]+"|name="twitter:[^"]+")/>', '', h)
    h = re.sub(r'<meta content="Webflow" name="generator"/>', '', h)
    h = re.sub(r'<link href="/gk/images/[^"]*_(favicon|webclip)\.png" rel="[^"]+"(?: type="[^"]+")?/>', '', h)
    assert 'favicon.png' not in h and 'webclip' not in h, name

    url = SITE + cfg["path"]
    ld = json.dumps({"@context": "https://schema.org", "@graph": cfg["ld"]}, ensure_ascii=False).replace("</", "<\\/")
    head = (f'<title>{cfg["title"]}</title>'
            f'<meta name="description" content="{cfg["desc"]}"/>'
            f'<link rel="canonical" href="{url}"/>'
            '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"/>'
            '<meta name="author" content="Geetha Krishna"/>'
            '<meta name="theme-color" content="#0c0b0c"/>'
            '<meta name="geo.region" content="IN-KA"/><meta name="geo.placename" content="Bengaluru"/>'
            f'<meta property="og:type" content="{"profile" if name == "about" else "website"}"/>'
            '<meta property="og:site_name" content="Geetha Krishna Portfolio"/><meta property="og:locale" content="en_IN"/>'
            f'<meta property="og:url" content="{url}"/><meta property="og:title" content="{cfg["title"]}"/>'
            f'<meta property="og:description" content="{cfg["desc"]}"/>'
            f'<meta property="og:image" content="{OG}"/><meta property="og:image:width" content="1200"/>'
            '<meta property="og:image:height" content="630"/>'
            '<meta property="og:image:alt" content="Geetha Krishna, freelance graphic designer and video editor in Bengaluru"/>'
            '<meta name="twitter:card" content="summary_large_image"/>'
            f'<meta name="twitter:title" content="{cfg["title"]}"/><meta name="twitter:description" content="{cfg["desc"]}"/>'
            f'<meta name="twitter:image" content="{OG}"/>'
            '<link rel="icon" href="/favicon.ico" sizes="any"/><link rel="manifest" href="/manifest.webmanifest"/>'
            f'<script type="application/ld+json">{ld}</script>')
    assert h.count('<meta charset="utf-8"/>') == 1, name
    h = h.replace('<meta charset="utf-8"/>', '<meta charset="utf-8"/>' + head, 1)
    h = h.replace('</body>', ANALYTICS + '</body>', 1)

    # nav: Work -> /work, add Let's Talk -> footer contacts (same label as every other contact CTA)
    n = h.count('href="/#work"')
    assert n >= 1, (name, n)
    h = h.replace('href="/#work"', 'href="/work"')
    about_link = re.search(r'<a text-hover-trigger="" href="/about"[^>]*class="nav-link w-inline-block[^"]*"[^>]*>.*?</a>', h, re.S)
    assert about_link, name
    talk = (re.sub(r' aria-current="page"| w--current', '', about_link.group(0)).replace('href="/about"', 'href="#contacts"')
            .replace('>About<', '>Let’s Talk<'))
    h = h.replace(about_link.group(0), about_link.group(0) + talk, 1)

    if name == "index":
        # one meaningful h1: the name lockup; tagline becomes a paragraph
        h = h.replace('<div class="gk-lockup gk-in"><span class="gk-lock-mark">GK</span>'
                      '<span class="gk-lock-name">Geetha<br/>Krishna</span></div>',
                      '<h1 class="gk-lockup gk-in"><span class="gk-lock-mark" aria-hidden="true">GK</span>'
                      '<span class="gk-lock-name">Geetha<br/>Krishna</span>'
                      + LOCK_ROLES +
                      '<span class="gk-sr">, freelance graphic designer and video editor in Bengaluru</span></h1>', 1)
        assert 'h1 class="gk-lockup' in h
        # fill the lockup's spare space with the pen-tool curve art
        h = h.replace('</head>', LOCK_ROLES_CSS + '</head>', 1).replace('</body>', LOCK_ROLES_JS + '</body>', 1)
        h = h.replace('<h1 class="gk-tagline gk-in">Senior Graphic Designer &amp; Video Editor, Bengaluru</h1>',
                      '<p class="gk-tagline gk-in">Senior Graphic Designer &amp; Video Editor, Bengaluru</p>', 1)
        # open-to-work signal above the lockup
        # availability now lives in the pinned top-right badge (polish.py), not in the hero
        h = h.replace('</head>', '<style>.gk-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}'
                      '.gk-lockup{margin:0;font:inherit}'
                      '.gk-avail{margin:0 0 -8px;display:inline-flex;align-items:center;gap:10px;justify-self:start;padding:8px 14px;'
                      'border-radius:12px;border:1px solid rgba(74,222,128,.35);background:rgba(74,222,128,.08);font-size:14px;color:#d9fbe5}'
                      '.gk-avail-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;box-shadow:0 0 0 4px rgba(74,222,128,.18)}'
                      '</style></head>', 1)
        # shorter intro so visitors reach the work sooner
        assert h.count('}, 4000);') == 1
        h = h.replace('}, 4000);', '}, 2400);')
    if name == "about":
        h = re.sub(r'<h1 class="headline-h3">([^<]*)</h1>', r'<h3 class="headline-h3">\1</h3>', h)
        a = '<h1 data-split="from-right-blur" class="heading-2">About</h1>'
        assert h.count(a) == 1
        h = h.replace(a, '<h1 class="heading-2"><span data-split="from-right-blur" style="display:block">About</span>'
                         '<span class="gk-sr">Geetha Krishna, freelance graphic designer in Bengaluru</span></h1>')
        k = h.index('</section>', h.index('<section class="team-sc">')) + len('</section>')
        h = h[:k] + (
            '<section class="gk-cta-block"><p class="gk-avail"><span class="gk-avail-dot" aria-hidden="true"></span>'
            'Available for freelance projects</p><h2>Open to freelance projects</h2>'
            '<p>Brand identity, campaign posters, social creatives, editorial layouts and video edits. '
            'Based in Bengaluru, working with clients across India.</p><div class="gk-cta-btns">'
            f'<a class="gk-btn gk-btn-primary" data-gk-talk href="mailto:{EMAIL}?subject=Project%20enquiry">Let’s Talk</a>'
            '<a class="gk-btn gk-btn-ghost" href="/work">See my work</a>'
            '<a class="gk-btn gk-btn-ghost" href="/resume/geetha-krishna-resume.pdf" target="_blank" rel="noopener">Résumé (PDF)</a>'
            '</div></section>') + h[k:]

    assert h.count('<h1') == 1, (name, h.count('<h1'))
    os.makedirs(os.path.join(ROOT, "site-pages"), exist_ok=True)
    open(os.path.join(ROOT, "site-pages", name + ".html"), "w", encoding="utf-8").write(h)
    os.remove(p)
print("seo ok")
