"""Local landing pages for the searches clients actually type:
  /freelance-graphic-designer-bangalore   and   /freelance-video-editor-bangalore

Each page reuses the built Work page as its shell (header, footer, styles, contact form), replaces <main>
with keyword-focused content (only facts already on the site), real project cards for that field, an FAQ,
and JSON-LD (Service + FAQPage + BreadcrumbList). Also adds footer links to these pages on every page.

Idempotent; run after seo_reach.py:  python3 -I landing.py <repo root>
"""
import glob
import html
import json
import os
import re
import sys

ROOT = sys.argv[1]
SP = os.path.join(ROOT, 'site-pages')
SITE = '{{SITE_URL}}'
EMAIL = 'geethakrishna.designer@gmail.com'
WA = 'https://wa.me/917989228383'
LINKEDIN = 'https://www.linkedin.com/in/krishnadezyner'
work = json.load(open(os.path.join(SP, 'work.json'), encoding='utf-8'))
shell = open(os.path.join(SP, 'work.html'), encoding='utf-8').read()

PAGES = [
    dict(
        slug='freelance-graphic-designer-bangalore',
        title='Freelance Graphic Designer in Bangalore | Geetha Krishna',
        desc=('Hire Geetha Krishna, a senior freelance graphic designer in Bangalore (Bengaluru): logos, brand '
              'identity, posters, social media creatives and print. Remote worldwide too.'),
        eyebrow='Freelance graphic designer · Bangalore',
        h1='Freelance Graphic Designer in Bangalore',
        lede=('I’m Geetha Krishna, a senior graphic designer based in Bengaluru with 5+ years and 100+ projects. '
              'I design logos and brand identities, campaign posters, social media creatives, magazines, menu cards, '
              'hoardings and web banners for brands in Bangalore, across India and worldwide.'),
        service='Freelance graphic design',
        services=[('Logo design & brand identity', 'Logos, marks and identity systems that are easy to remember.'),
                  ('Posters & campaign key visuals', 'Product posters and campaigns built to stop the scroll.'),
                  ('Social media creatives', 'Post and story designs for consistent, on-brand feeds.'),
                  ('Magazine & editorial design', 'Covers and inner layouts for print and digital issues.'),
                  ('Menu cards & print', 'Restaurant menus, brochures and print-ready artwork.'),
                  ('Hoardings & web banners', 'Billboards, hoardings and ad banners in every size.')],
        tools='Photoshop, Illustrator, Figma, Adobe XD and Wix',
        cats=['Brand Identity', 'Posters & Campaigns', 'Editorial & Print', 'Digital & Outdoor'],
        max_cards=9,
        faq=[('Are you a freelance graphic designer based in Bangalore?',
              'Yes. I’m based in Bengaluru (Bangalore), Karnataka, and work with clients in person in Bangalore and remotely across India and worldwide.'),
             ('What graphic design services do you offer?',
              'Logo design and brand identity, posters and campaign visuals, social media creatives, magazine and editorial layouts, menu cards and print, and hoardings and web banners.'),
             ('Do you work with clients outside Bangalore or outside India?',
              'Yes. Most projects run remotely, so I work with brands anywhere. Files are delivered ready for print, web and social.'),
             ('Are you available for full-time or part-time roles?',
              'Yes. Alongside freelance projects, I’m open to full-time, part-time and contract roles, remote or on-site in Bengaluru.'),
             ('How do I start a project with you?',
              f'Use the Let’s Talk form on this page, message me on WhatsApp, or email {EMAIL} with your brief and deadline.')],
    ),
    dict(
        slug='freelance-video-editor-bangalore',
        title='Freelance Video Editor in Bangalore | Geetha Krishna',
        desc=('Hire Geetha Krishna, a freelance video editor in Bangalore (Bengaluru): product films, reels, '
              'motion graphics, AI video and UGC ads for brands. Remote worldwide too.'),
        eyebrow='Freelance video editor · Bangalore',
        h1='Freelance Video Editor in Bangalore',
        lede=('I’m Geetha Krishna, a video editor and graphic designer based in Bengaluru with 5+ years and 100+ '
              'projects. I edit product films, social reels, motion graphics, AI video and UGC-style ads for brands '
              'in Bangalore, across India and worldwide.'),
        service='Freelance video editing',
        services=[('Product films & commercials', 'Short brand films with clean pacing and studio-quality finish.'),
                  ('Reels & social video', 'Vertical edits for Instagram, YouTube Shorts and ads.'),
                  ('Motion graphics', 'Animated titles, captions and graphics that carry the story.'),
                  ('AI video production', 'Prompt-driven product shots and AI-assisted commercials.'),
                  ('UGC-style ads', 'Creator-style ads with caption pacing built for conversions.'),
                  ('Colour & finishing', 'Colour, sound clean-up and exports for every platform.')],
        tools='Premiere Pro, After Effects and DaVinci Resolve',
        cats=['Video & Motion'],
        max_cards=6,
        faq=[('Are you a freelance video editor based in Bangalore?',
              'Yes. I’m based in Bengaluru (Bangalore) and edit for brands in Bangalore, across India and worldwide, remotely or on-site.'),
             ('What kind of videos do you edit?',
              'Product films and commercials, social reels and shorts, motion graphics, AI video and UGC-style ads.'),
             ('Which software do you use for video editing?',
              'Premiere Pro, After Effects and DaVinci Resolve, alongside Photoshop and Illustrator for graphics.'),
             ('Do you work with international clients?',
              'Yes. Projects run remotely, so I edit for brands anywhere, with exports ready for every platform.'),
             ('Are you available for full-time or part-time video editing roles?',
              'Yes. I’m open to freelance projects as well as full-time, part-time and contract roles, remote or in Bengaluru.'),
             ('How do I start a video project with you?',
              f'Use the Let’s Talk form on this page, message me on WhatsApp, or email {EMAIL} with your brief, footage and deadline.')],
    ),
]

CSS = """<style>
.gk-lp{max-width:1280px;margin:0 auto;padding:0 6vw 40px}
.gk-lp-eyebrow{margin:0;font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:#a78bfa}
.gk-lp-ctas{display:flex;gap:12px;flex-wrap:wrap;margin-top:8px}
.gk-lp-sec{padding:clamp(40px,6vw,72px) 0 0}
.gk-lp-sec>h2{margin:0 0 22px;font:500 clamp(28px,3.4vw,44px)/1.1 "Wix Madefor Display",sans-serif;letter-spacing:-.03em}
.gk-lp-services{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}
.gk-lp-services li{padding:22px;border-radius:14px;background:rgba(244,242,246,.035);border:1px solid rgba(244,242,246,.09)}
.gk-lp-services h3{margin:0 0 6px;font:500 19px/1.25 "Wix Madefor Display",sans-serif}
.gk-lp-services p{margin:0;color:rgba(244,242,246,.7);line-height:1.5}
.gk-lp-facts{display:flex;flex-wrap:wrap;gap:12px 40px;margin:0;padding:0;list-style:none;color:rgba(244,242,246,.7)}
.gk-lp-facts b{display:block;font:600 clamp(26px,2.6vw,36px)/1.1 "Wix Madefor Display",sans-serif;color:#f4f2f6}
.gk-lp-text{max-width:760px;color:rgba(244,242,246,.78);line-height:1.6;font-size:17px;margin:0}
.gk-lp-faq{display:grid;gap:10px;max-width:860px}
.gk-lp-faq details{border-radius:12px;border:1px solid rgba(244,242,246,.1);background:rgba(244,242,246,.03);padding:16px 20px}
.gk-lp-faq summary{cursor:pointer;font-weight:500;font-size:17px;list-style:none;display:flex;justify-content:space-between;gap:16px}
.gk-lp-faq summary::-webkit-details-marker{display:none}
.gk-lp-faq summary::after{content:"+";color:#a78bfa;font-size:22px;line-height:1;transition:transform .25s}
.gk-lp-faq details[open] summary::after{transform:rotate(45deg)}
.gk-lp-faq p{margin:10px 0 0;color:rgba(244,242,246,.75);line-height:1.6}
.gk-lp-more{margin-top:18px}
@media (max-width:479px){.gk-lp{padding:0 20px 24px}}
</style>"""


def esc(s):
    return html.escape(s, quote=True)


def card_html():
    """the Work page's own <li class="gk-w"> cards, keyed by slug"""
    cards = {}
    for m in re.finditer(r'<li class="gk-w"[^>]*>.*?</li>', shell, re.S):
        slug = re.search(r'href="/work/([^"]+)"', m.group(0))
        if slug:
            cards[slug.group(1)] = m.group(0).replace(' loading="eager"', ' loading="lazy"')
    return cards


CARDS = card_html()


def build(p):
    h = shell
    items = [w for w in work if w['category'] in p['cats']][:p['max_cards']]
    grid = ''.join(CARDS[w['slug']] for w in items if w['slug'] in CARDS)
    services = ''.join(f'<li><h3>{esc(t)}</h3><p>{esc(d)}</p></li>' for t, d in p['services'])
    faq = ''.join(f'<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>' for q, a in p['faq'])
    other = PAGES[1] if p is PAGES[0] else PAGES[0]
    main = (
        '<main class="main gk-work-main">'
        '<section class="gk-work-head">'
        f'<p class="gk-lp-eyebrow">{esc(p["eyebrow"])}</p>'
        f'<h1 class="gk-work-h1" style="font-size:clamp(44px,6.4vw,96px)">{esc(p["h1"])}</h1>'
        f'<p class="gk-work-lede">{esc(p["lede"])}</p>'
        '<div class="gk-lp-ctas">'
        f'<a class="gk-btn gk-btn-primary" data-gk-talk href="mailto:{EMAIL}?subject=Project%20enquiry">Let’s Talk</a>'
        f'<a class="gk-btn gk-btn-ghost" href="{WA}" target="_blank" rel="noopener">WhatsApp</a>'
        '<a class="gk-btn gk-btn-ghost" href="/work">See all work</a></div></section>'
        '<div class="gk-lp">'
        '<section class="gk-lp-sec"><ul class="gk-lp-facts">'
        '<li><b>5+</b>years</li><li><b>100+</b>projects</li><li><b>Bengaluru</b>Bangalore based</li>'
        '<li><b>Worldwide</b>remote clients</li></ul></section>'
        f'<section class="gk-lp-sec"><h2>{esc(p["service"].capitalize())} services in Bangalore</h2>'
        f'<ul class="gk-lp-services">{services}</ul></section>'
        f'<section class="gk-lp-sec"><h2>Selected work</h2></section></div>'
        f'<section class="gk-work-grid-wrap"><ul class="gk-work-grid">{grid}</ul>'
        '<p class="gk-lp-more"><a class="gk-btn gk-btn-ghost" href="/work">See all projects</a></p></section>'
        '<div class="gk-lp">'
        '<section class="gk-lp-sec"><h2>Why work with me</h2>'
        '<p class="gk-lp-text">Every project starts with a clear brief and ends with files that are ready for print, web '
        'and social. I’ve worked with brands such as GreenMonk Energy Drink, Buddha-CEO Quantum Foundation and Coastal '
        f'Cravings, and with Pixel Scoop Studios. My tools: {esc(p["tools"])}.</p></section>'
        f'<section class="gk-lp-sec"><h2>Frequently asked questions</h2><div class="gk-lp-faq">{faq}</div></section>'
        '<section class="gk-lp-sec"><h2>Start your project</h2>'
        '<p class="gk-lp-text">Available now for freelance projects, and open to full-time and part-time roles, '
        f'remote worldwide or on-site in Bengaluru. Also see: <a href="/{other["slug"]}" style="color:#a78bfa">'
        f'{esc(other["h1"])}</a>.</p>'
        '<div class="gk-lp-ctas" style="margin-top:18px">'
        f'<a class="gk-btn gk-btn-primary" data-gk-talk href="mailto:{EMAIL}?subject=Project%20enquiry">Let’s Talk</a>'
        f'<a class="gk-btn gk-btn-ghost" href="mailto:{EMAIL}">Email</a>'
        f'<a class="gk-btn gk-btn-ghost" href="{LINKEDIN}" target="_blank" rel="noopener noreferrer">LinkedIn</a>'
        '</div></section></div></main>')
    a, b = h.index('<main class="main gk-work-main">'), h.index('</main>') + len('</main>')
    h = h[:a] + main + h[b:]
    # drop the Work page's filter/lightbox script and dialog (not on this page)
    h = re.sub(r'<script>\s*\(function\(\)\{\s*var DATA=.*?</script>', '', h, count=1, flags=re.S)
    h = re.sub(r'<dialog class="gk-lb".*?</dialog>', '', h, count=1, flags=re.S)
    # no header item is "current" here
    h = h.replace(' aria-current="page" class="nav-link w-inline-block w--current"', ' class="nav-link w-inline-block"')
    # head: title, description, canonical, social, JSON-LD
    url = f'{SITE}/{p["slug"]}'
    h = re.sub(r'<title>[^<]*</title>', f'<title>{esc(p["title"])}</title>', h, count=1)
    for attr, val in (('name="description"', p['desc']), ('property="og:title"', p['title']),
                      ('property="og:description"', p['desc']), ('name="twitter:title"', p['title']),
                      ('name="twitter:description"', p['desc']), ('property="og:url"', url)):
        h = re.sub(r'(<meta ' + attr + r' content=")[^"]*(")', lambda m: m.group(1) + esc(val) + m.group(2), h, count=1)
    h = re.sub(r'<link rel="canonical" href="[^"]*"/>', f'<link rel="canonical" href="{url}"/>', h, count=1)
    ld = {'@context': 'https://schema.org', '@graph': [
        {'@type': 'Service', '@id': url + '#service', 'name': f'{p["service"]} in Bangalore',
         'serviceType': p['service'], 'url': url, 'description': p['desc'],
         'provider': {'@id': SITE + '/#person'},
         'areaServed': [{'@type': 'City', 'name': 'Bengaluru', 'alternateName': 'Bangalore'},
                        {'@type': 'Country', 'name': 'India'}, {'@type': 'Place', 'name': 'Worldwide'}],
         'hasOfferCatalog': {'@type': 'OfferCatalog', 'name': p['service'], 'itemListElement': [
             {'@type': 'Offer', 'itemOffered': {'@type': 'Service', 'name': t, 'description': d}} for t, d in p['services']]}},
        {'@type': 'Person', '@id': SITE + '/#person', 'name': 'Geetha Krishna',
         'jobTitle': 'Senior Graphic Designer & Video Editor', 'url': SITE + '/', 'email': EMAIL,
         'sameAs': [LINKEDIN], 'address': {'@type': 'PostalAddress', 'addressLocality': 'Bengaluru',
                                           'addressRegion': 'Karnataka', 'addressCountry': 'IN'}},
        {'@type': 'FAQPage', '@id': url + '#faq', 'mainEntity': [
            {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in p['faq']]},
        {'@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE + '/'},
            {'@type': 'ListItem', 'position': 2, 'name': p['h1'], 'item': url}]},
    ]}
    h = re.sub(r'<script type="application/ld\+json">.*?</script>',
               '<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False) + '</script>', h, count=1, flags=re.S)
    h = h.replace('</head>', CSS + '</head>', 1)
    out = os.path.join(SP, p['slug'] + '.html')
    open(out, 'w', encoding='utf-8', newline='').write(h)
    return len(items)


for p in PAGES:
    n = build(p)
    print(f'landing: /{p["slug"]} ({n} project cards, {len(p["faq"])} FAQs)')

# footer links to the landing pages on every page (internal links help them rank)
LINKS = ''.join(f'<a href="/{p["slug"]}" class="policy-link">{esc(p["h1"].replace(" in Bangalore", ", Bangalore"))}</a>'
                for p in PAGES)
n = 0
for f in glob.glob(os.path.join(SP, '*.html')) + glob.glob(os.path.join(SP, 'work', '*.html')):
    h = open(f, encoding='utf-8').read()
    if 'href="/freelance-graphic-designer-bangalore" class="policy-link"' in h:
        continue
    o = '<div class="footer-policy-links">'
    if o in h:
        h = h.replace(o, o + LINKS, 1)
        open(f, 'w', encoding='utf-8', newline='').write(h)
        n += 1
print(f'landing: footer links added on {n} pages')
