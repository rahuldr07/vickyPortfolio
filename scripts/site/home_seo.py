"""Homepage SEO block, the same pieces strong freelancer homepages carry:

- a visible "Freelance graphic designer & video editor in Bengaluru" About section with keyword copy,
  links to the freelance landing pages and a skills list
- a visible FAQ ("Questions clients ask") that matches FAQPage JSON-LD
- JSON-LD: WebPage, FAQPage and one VideoObject per portfolio video (video results in search)
- a meta keywords tag (Bing still reads it; Google ignores it)

Only facts already on the site. Idempotent; run after landing.py:  python3 -I home_seo.py <repo root>
"""
import html
import json
import os
import re
import sys

ROOT = sys.argv[1]
SP = os.path.join(ROOT, 'site-pages')
SITE = '{{SITE_URL}}'
EMAIL = 'geethakrishna.designer@gmail.com'
work = json.load(open(os.path.join(SP, 'work.json'), encoding='utf-8'))
path = os.path.join(SP, 'index.html')
h = open(path, encoding='utf-8').read()


def esc(s):
    return html.escape(s, quote=True)


ABOUT = ('I’m Geetha Krishna, an independent senior graphic designer and video editor based in Bengaluru (Bangalore), '
         'India, with 5+ years and 100+ projects. I design logos and brand identities, posters, social media creatives, '
         'magazines, menu cards, hoardings and web banners, and as a freelance video editor I edit reels, product films '
         'and motion graphics and create AI UGC ads and AI video ads. I also design UI and web screens in Figma, Adobe XD and Wix. I work directly with startups, small businesses, creators and brands in Bangalore, across India '
         'and worldwide. Available for freelance projects, and open to full-time and part-time roles.')
LINKS = [('freelancer-bangalore', 'Individual freelancer in Bangalore'),
         ('remote-graphic-designer', 'Remote graphic designer'),
         ('freelance-graphic-designer', 'Hire a freelance graphic designer'),
         ('freelance-logo-designer', 'Freelance logo designer'),
         ('freelance-video-editor', 'Freelance video editor'),
         ('ai-ugc-ads', 'AI UGC ads & AI video editing'),
         ('freelance-graphic-designer-bangalore', 'Graphic designer in Bangalore'),
         ('freelance-video-editor-bangalore', 'Video editor in Bangalore'),
         ('ui-designer-bangalore', 'UI designer in Bangalore')]
SKILLS = ['Logo design', 'Brand identity', 'Poster design', 'Social media creatives', 'Magazine & editorial design',
          'Menu cards & print', 'Hoardings & web banners', 'Video editing', 'Reels & shorts', 'Motion graphics',
          'AI video editing', 'AI UGC ads', 'AI product commercials', 'Photoshop', 'Illustrator', 'Premiere Pro', 'After Effects', 'DaVinci Resolve',
          'UI design', 'Web design', 'Figma', 'Adobe XD', 'Wix']
FAQ = [
    ('Are you a freelance graphic designer in Bangalore available for new projects?',
     'Yes. I’m a freelance graphic designer and video editor based in Bengaluru (Bangalore) and available for new '
     'projects, in person in Bangalore or remotely.'),
    ('Are you an individual freelancer or an agency?',
     'I’m an individual, independent freelancer in Bangalore, not an agency. You work with me directly, from brief '
     'to final files.'),
    ('Do you also do UI design?',
     'Yes. I design app and website screens in Figma and Adobe XD, and update and build Wix websites, alongside '
     'graphic design and video.'),
    ('What services do you offer?',
     'Logo design and brand identity, posters and campaign visuals, social media creatives, magazine and editorial '
     'design, menu cards and print, hoardings and web banners, and video editing: product films, reels, motion '
     'graphics, AI video and UGC ads.'),
    ('How much does a freelance graphic designer charge?',
     'It depends on the scope: a single logo or poster costs less than a full brand identity or a monthly content '
     'plan. Share your brief and deadline and I’ll send a clear quote.'),
    ('Do you make AI UGC ads?',
     'Yes. I create AI-generated UGC-style ads and AI product commercials for brands, then edit them with hooks, '
     'captions, music and colour, ready for Reels, Shorts and paid social.'),
    ('Do you work with clients outside Bangalore and India?',
     'Yes. Most projects run remotely, so I work with clients across India and worldwide.'),
    ('Which tools do you use?',
     'Photoshop, Illustrator, Figma, Adobe XD and Wix for design, and Premiere Pro, After Effects and DaVinci Resolve '
     'for video.'),
    ('How do I hire you?',
     f'Use the Let’s Talk form, message me on WhatsApp, or email {EMAIL} with your brief and deadline.'),
]

CSS = """<style id="gk-home-seo-css">
.gk-hs{max-width:1280px;margin:0 auto;padding:clamp(56px,8vw,112px) 6vw 0;color:#f4f2f6}
.gk-hs h2{margin:0 0 20px;font:500 clamp(30px,3.8vw,52px)/1.08 "Wix Madefor Display",sans-serif;letter-spacing:-.03em}
.gk-hs-eyebrow{margin:0 0 14px;font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:#a78bfa}
.gk-hs-text{max-width:820px;margin:0;color:rgba(244,242,246,.78);font-size:17px;line-height:1.65}
.gk-hs-links,.gk-hs-skills{display:flex;flex-wrap:wrap;gap:10px;margin:22px 0 0;padding:0;list-style:none}
.gk-hs-links a{display:inline-block;padding:10px 16px;border-radius:999px;border:1px solid rgba(167,139,250,.45);
  color:#f4f2f6;text-decoration:none;font-size:15px;transition:background .2s}
.gk-hs-links a:hover{background:rgba(167,139,250,.14)}
.gk-hs-skills li{padding:7px 13px;border-radius:999px;background:rgba(244,242,246,.06);color:rgba(244,242,246,.82);font-size:14px}
.gk-hs-faq{display:grid;gap:10px;max-width:880px}
.gk-hs-faq details{border-radius:12px;border:1px solid rgba(244,242,246,.1);background:rgba(244,242,246,.03);padding:16px 20px}
.gk-hs-faq summary{cursor:pointer;font-weight:500;font-size:17px;list-style:none;display:flex;justify-content:space-between;gap:16px}
.gk-hs-faq summary::-webkit-details-marker{display:none}
.gk-hs-faq summary::after{content:"+";color:#a78bfa;font-size:22px;line-height:1;transition:transform .25s}
.gk-hs-faq details[open] summary::after{transform:rotate(45deg)}
.gk-hs-faq p{margin:10px 0 0;color:rgba(244,242,246,.75);line-height:1.6;font-size:16px}
@media (max-width:479px){.gk-hs{padding:56px 20px 0}}
</style>"""

section = (
    '<section class="gk-hs" id="hire" aria-labelledby="gk-hs-title">'
    '<p class="gk-hs-eyebrow">Available for freelance · Remote · Bengaluru</p>'
    '<h2 id="gk-hs-title">Freelance graphic designer, video editor &amp; AI UGC ads creator in Bengaluru</h2>'
    f'<p class="gk-hs-text">{esc(ABOUT)}</p>'
    '<ul class="gk-hs-links">' + ''.join(f'<li><a href="/{s}">{esc(t)}</a></li>' for s, t in LINKS) + '</ul>'
    '<ul class="gk-hs-skills" aria-label="Skills">' + ''.join(f'<li>{esc(s)}</li>' for s in SKILLS) + '</ul>'
    '</section>'
    '<section class="gk-hs" id="faq" aria-labelledby="gk-hs-faq-title">'
    '<h2 id="gk-hs-faq-title">Questions clients ask</h2><div class="gk-hs-faq">'
    + ''.join(f'<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>' for q, a in FAQ)
    + '</div></section>')

videos = [w for w in work if w['type'] == 'video']
ld = {'@context': 'https://schema.org', '@graph': [
    {'@type': 'WebPage', '@id': SITE + '/#webpage', 'url': SITE + '/',
     'name': 'Geetha Krishna | Freelance Graphic Designer in Bangalore',
     'description': re.search(r'<meta name="description" content="([^"]*)"', h).group(1).replace('&amp;', '&'),
     'inLanguage': 'en-IN', 'isPartOf': {'@id': SITE + '/#website'}, 'about': {'@id': SITE + '/#person'},
     'primaryImageOfPage': {'@type': 'ImageObject', 'url': SITE + '/gk/og.jpg', 'width': 1200, 'height': 630}},
    {'@type': 'FAQPage', '@id': SITE + '/#faq', 'mainEntity': [
        {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in FAQ]},
] + [
    {'@type': 'VideoObject', '@id': f'{SITE}/work/{v["slug"]}#video', 'name': v['title'].replace('&amp;', '&'),
     'description': v['description'].replace('&amp;', '&'), 'thumbnailUrl': SITE + v['thumb'],
     'contentUrl': SITE + v['src'], 'url': f'{SITE}/work/{v["slug"]}', 'uploadDate': v['uploaded'],
     'duration': f'PT{int(v["duration"])}S', 'inLanguage': 'en', 'creator': {'@id': SITE + '/#person'}}
    for v in videos if v.get('uploaded') and v.get('duration')]}
LD = '<script type="application/ld+json" id="gk-home-seo-ld">' + json.dumps(ld, ensure_ascii=False).replace('</', '<\\/') + '</script>'
KEYWORDS = ('freelance graphic designer, freelance graphic designer Bangalore, freelance graphic designer Bengaluru, '
            'graphic designer for hire, independent graphic designer, freelance logo designer, brand identity designer, '
            'freelance video editor, freelance video editor Bangalore, AI UGC ads, AI UGC ad creator, AI video ads, AI video editing, social media designer, poster designer, '
            'AI video editor, UGC ad editor, freelancer in Bangalore, individual freelancer Bangalore, remote graphic designer, remote freelance designer India, '
            'UI designer Bangalore, web designer Bangalore, Geetha Krishna')

# idempotent: drop anything a previous run added
h = re.sub(r'<style id="gk-home-seo-css">.*?</style>', '', h, flags=re.S)
h = re.sub(r'<script type="application/ld\+json" id="gk-home-seo-ld">.*?</script>', '', h, flags=re.S)
h = re.sub(r'<section class="gk-hs".*?</section>(?=<section class="gk-hs"|<section class="cta-sc")', '', h, flags=re.S)
h = re.sub(r'<meta name="keywords" content="[^"]*"/>', '', h)

assert h.count('<section class="cta-sc">') == 1, 'CTA section not found'
h = h.replace('<section class="cta-sc">', section + '<section class="cta-sc">', 1)
h = h.replace('</head>', f'<meta name="keywords" content="{esc(KEYWORDS)}"/>' + CSS + LD + '</head>', 1)
open(path, 'w', encoding='utf-8', newline='').write(h)
print(f'home_seo: about + skills + {len(FAQ)} FAQs, {len(ld["@graph"]) - 2} VideoObjects')
