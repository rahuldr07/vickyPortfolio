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
        place='in Bangalore',
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
        place='in Bangalore',
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

# Location-free pages for clients anywhere who search "freelance graphic designer", "hire a freelancer",
# "freelance logo designer" or "freelance video editor": an individual freelancer, not an agency.
WHY_FREELANCER = [
    ('You work directly with the designer', 'No account managers or hand-offs: the person you brief is the person designing.'),
    ('One-off or ongoing', 'A single logo or poster, a campaign, or a monthly retainer for social and print.'),
    ('Remote, worldwide', 'Brief, feedback and delivery happen online, so location is never a problem.'),
    ('Ready-to-use files', 'Final files prepared for print, web and every social platform.'),
]
PROCESS = [
    ('Share your brief', 'Tell me what you need, who it is for, and your deadline.'),
    ('Concepts', 'I share first directions based on your brand and goals.'),
    ('Refine', 'We polish the chosen direction together with your feedback.'),
    ('Final files', 'You get production-ready files in the formats you need.'),
]
PAGES += [
    dict(
        slug='freelance-graphic-designer',
        title='Freelance Graphic Designer for Hire | Geetha Krishna',
        desc=('Hire Geetha Krishna, an independent freelance graphic designer (5+ years, 100+ projects) for logos, '
              'branding, posters, social media and print. Remote for clients worldwide, based in India.'),
        eyebrow='Independent freelance graphic designer · Remote worldwide',
        h1='Freelance Graphic Designer for Hire',
        lede=('Looking for a freelance graphic designer? I’m Geetha Krishna, an independent senior designer with 5+ years '
              'and 100+ projects. I design logos, brand identities, posters, social media creatives, magazines and print '
              'for startups, small businesses and brands across India and worldwide, working with you directly.'),
        service='Freelance graphic design',
        place='for clients worldwide',
        services=[('Logo design & brand identity', 'Logos, marks and identity systems that are easy to remember.'),
                  ('Social media creatives', 'Post, story and ad designs for consistent, on-brand feeds.'),
                  ('Posters & campaigns', 'Product posters and campaign key visuals built to stop the scroll.'),
                  ('Brochures, flyers & print', 'Brochures, flyers, standees, menus and print-ready artwork.'),
                  ('Magazine & editorial design', 'Covers and inner layouts for print and digital issues.'),
                  ('Banners & hoardings', 'Web banners, billboards and hoardings in every size.')],
        tools='Photoshop, Illustrator, Figma, Adobe XD and Wix',
        cats=['Brand Identity', 'Posters & Campaigns', 'Editorial & Print', 'Digital & Outdoor'],
        max_cards=9,
        why=WHY_FREELANCER, process=PROCESS,
        faq=[('Are you an individual freelancer or an agency?',
              'I’m an individual, independent freelance graphic designer. You work with me directly from brief to final files.'),
             ('Do you work with clients outside India?',
              'Yes. I work remotely with clients worldwide. Briefs, feedback and file delivery all happen online.'),
             ('What can I hire you for?',
              'Logo design and brand identity, social media creatives, posters and campaigns, brochures, flyers and print, '
              'magazine and editorial layouts, and web banners and hoardings.'),
             ('Can I hire you for a single small project?',
              'Yes. I take on one-off projects like a logo or a poster, as well as ongoing monthly design work.'),
             ('Which tools do you use?',
              'Adobe Photoshop, Illustrator, Figma, Adobe XD and Wix, plus Premiere Pro, After Effects and DaVinci Resolve for video.'),
             ('How do I hire you?',
              f'Use the Let’s Talk form on this page, message me on WhatsApp, or email {EMAIL} with your brief and deadline.')],
    ),
    dict(
        slug='freelance-logo-designer',
        title='Freelance Logo Designer & Brand Identity Designer | Geetha Krishna',
        desc=('Hire Geetha Krishna, a freelance logo designer and brand identity designer for startups and small '
              'businesses. Logos, emblems and brand marks, remote for clients worldwide.'),
        eyebrow='Freelance logo & brand identity designer',
        h1='Freelance Logo Designer',
        lede=('I’m Geetha Krishna, an independent graphic designer who creates logos and brand identities for startups, '
              'restaurants, construction firms and growing brands. From a single logo to a full identity with signage '
              'and print, you work with me directly, remotely from anywhere.'),
        service='Freelance logo design',
        place='for startups and small businesses',
        services=[('Logo design', 'Wordmarks, symbols and combination marks that stay clear at every size.'),
                  ('Emblems & crests', 'Badge and crest logos for firms, clubs and institutions.'),
                  ('Brand identity', 'Colours, type and usage so the brand looks the same everywhere.'),
                  ('Signage & applications', 'Logos applied to signboards, menus, packaging and stationery.'),
                  ('Logo refresh', 'Modernising an existing logo without losing recognition.'),
                  ('Brand launch creatives', 'Launch posters and social posts that introduce the new identity.')],
        tools='Illustrator, Photoshop and Figma',
        cats=['Brand Identity'],
        max_cards=7,
        why=WHY_FREELANCER, process=PROCESS,
        faq=[('Are you a freelance logo designer?',
              'Yes. I’m an independent freelance graphic designer, and logo design and brand identity are a core part of my work.'),
             ('What kinds of logos have you designed?',
              'Restaurant and food brand logos, construction firm emblems, tech marks and editorial brand marks. '
              'See the projects on this page.'),
             ('What files do I get with my logo?',
              'Print and web ready files of the final logo for signage, packaging, documents and social media.'),
             ('Do you design logos for clients outside India?',
              'Yes. I work remotely with clients worldwide.'),
             ('How do I start a logo project?',
              f'Use the Let’s Talk form on this page, message me on WhatsApp, or email {EMAIL} with your business name, '
              'what you do and any references you like.')],
    ),
    dict(
        slug='freelance-video-editor',
        title='Freelance Video Editor for Hire | Geetha Krishna',
        desc=('Hire Geetha Krishna, an independent freelance video editor for product films, reels, YouTube videos, '
              'motion graphics, AI video and UGC ads. Remote for clients worldwide.'),
        eyebrow='Independent freelance video editor · Remote worldwide',
        h1='Freelance Video Editor for Hire',
        lede=('Looking for a freelance video editor? I’m Geetha Krishna, an independent video editor and graphic designer '
              'with 5+ years and 100+ projects. I edit product films, Instagram reels, YouTube videos, motion graphics, '
              'AI video and UGC-style ads for brands and creators worldwide, working with you directly.'),
        service='Freelance video editing',
        place='for brands and creators',
        services=[('Reels & shorts', 'Vertical edits for Instagram Reels, YouTube Shorts and ads.'),
                  ('YouTube videos', 'Edits with pacing, captions, titles and thumbnails.'),
                  ('Product films & commercials', 'Short brand films with clean pacing and a polished finish.'),
                  ('Motion graphics', 'Animated titles, captions and graphics that carry the story.'),
                  ('AI video & UGC ads', 'AI-assisted product shots and creator-style ads built to convert.'),
                  ('Colour & finishing', 'Colour, sound clean-up and exports for every platform.')],
        tools='Premiere Pro, After Effects and DaVinci Resolve',
        cats=['Video & Motion'],
        max_cards=6,
        why=WHY_FREELANCER,
        process=[('Share your footage', 'Send your clips, brief, references and deadline.'),
                 ('First cut', 'I edit a first version with pacing, music and captions.'),
                 ('Revisions', 'We refine the edit together with your feedback.'),
                 ('Final export', 'You get final videos sized for every platform.')],
        faq=[('Are you an individual freelance video editor?',
              'Yes. I’m an independent freelance video editor, so you work with me directly from footage to final export.'),
             ('What videos do you edit?',
              'Instagram reels and YouTube Shorts, YouTube videos, product films and commercials, motion graphics, '
              'AI video and UGC-style ads.'),
             ('Which video editing software do you use?',
              'Premiere Pro, After Effects and DaVinci Resolve, with Photoshop and Illustrator for graphics and thumbnails.'),
             ('Do you edit for international clients?',
              'Yes. I work remotely with brands and creators worldwide.'),
             ('How do I hire you for video editing?',
              f'Use the Let’s Talk form on this page, message me on WhatsApp, or email {EMAIL} with your footage, '
              'brief and deadline.')],
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
.gk-lp-steps{counter-reset:s}.gk-lp-steps li{counter-increment:s}
.gk-lp-steps h3::before{content:counter(s,decimal-leading-zero) "  ";color:#a78bfa}
.gk-lp-related{display:flex;flex-wrap:wrap;gap:10px;margin:0;padding:0;list-style:none}
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
    related = ''.join(f'<li><a class="gk-btn gk-btn-ghost" href="/{o["slug"]}">{esc(o["h1"])}</a></li>'
                      for o in PAGES if o is not p)
    local = p['place'] == 'in Bangalore'
    extra = ''
    if p.get('why'):
        extra += ('<section class="gk-lp-sec"><h2>Why hire an independent freelancer</h2><ul class="gk-lp-services">'
                  + ''.join(f'<li><h3>{esc(t)}</h3><p>{esc(d)}</p></li>' for t, d in p['why']) + '</ul></section>')
    if p.get('process'):
        extra += ('<section class="gk-lp-sec"><h2>How it works</h2><ul class="gk-lp-services gk-lp-steps">'
                  + ''.join(f'<li><h3>{esc(t)}</h3><p>{esc(d)}</p></li>' for t, d in p['process']) + '</ul></section>')
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
        '<li><b>5+</b>years</li><li><b>100+</b>projects</li>'
        + ('<li><b>Bengaluru</b>Bangalore based</li>' if local else '<li><b>1:1</b>you work directly with me</li>')
        + '<li><b>Worldwide</b>remote clients</li></ul></section>'
        f'<section class="gk-lp-sec"><h2>{esc(p["service"].capitalize())} services {esc(p["place"])}</h2>'
        f'<ul class="gk-lp-services">{services}</ul></section>' + extra +
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
        'remote worldwide or on-site in Bengaluru.</p>'
        '<div class="gk-lp-ctas" style="margin-top:18px">'
        f'<a class="gk-btn gk-btn-primary" data-gk-talk href="mailto:{EMAIL}?subject=Project%20enquiry">Let’s Talk</a>'
        f'<a class="gk-btn gk-btn-ghost" href="mailto:{EMAIL}">Email</a>'
        f'<a class="gk-btn gk-btn-ghost" href="{LINKEDIN}" target="_blank" rel="noopener noreferrer">LinkedIn</a>'
        '</div></section>'
        f'<section class="gk-lp-sec"><h2>Related services</h2><ul class="gk-lp-related">{related}</ul></section>'
        '</div></main>')
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
        {'@type': 'Service', '@id': url + '#service', 'name': f'{p["service"]} {p["place"]}',
         'serviceType': p['service'], 'url': url, 'description': p['desc'],
         'provider': {'@id': SITE + '/#person'},
         'areaServed': ([{'@type': 'City', 'name': 'Bengaluru', 'alternateName': 'Bangalore'}] if local else [])
                       + [{'@type': 'Country', 'name': 'India'}, {'@type': 'Place', 'name': 'Worldwide'}],
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
FOOTER = [('freelance-graphic-designer', 'Hire a Freelance Designer'),
          ('freelance-graphic-designer-bangalore', 'Freelance Graphic Designer, Bangalore'),
          ('freelance-video-editor-bangalore', 'Freelance Video Editor, Bangalore')]
LINKS = ''.join(f'<a href="/{slug}" class="policy-link">{esc(label)}</a>' for slug, label in FOOTER)
n = 0
for f in glob.glob(os.path.join(SP, '*.html')) + glob.glob(os.path.join(SP, 'work', '*.html')):
    h = open(f, encoding='utf-8').read()
    if 'href="/freelance-graphic-designer" class="policy-link"' in h:
        continue
    # replace any older set of landing-page footer links
    h = re.sub(r'(<div class="footer-policy-links">)(?:<a href="/freelance-[a-z-]+" class="policy-link">[^<]*</a>)+',
               r'\1', h)
    o = '<div class="footer-policy-links">'
    if o in h:
        h = h.replace(o, o + LINKS, 1)
        open(f, 'w', encoding='utf-8', newline='').write(h)
        n += 1
print(f'landing: footer links added on {n} pages')
