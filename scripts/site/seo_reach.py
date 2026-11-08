"""Final SEO pass: position the portfolio for clients AND recruiters, worldwide.

- titles/descriptions (incl. Open Graph / Twitter) for Home, Work, About aimed at freelance, full-time and
  part-time work, remote worldwide or in Bengaluru
- project pages: complete meta descriptions (no more mid-phrase cut-offs)
- JSON-LD: Person gets sameAs (LinkedIn), hasOccupation (+skills), seeks (kind of work wanted), a
  description; ProfessionalService serves Worldwide; WebSite language "en"
- visible About text says the same (search engines weigh on-page copy)

Idempotent; run after polish.py:  python3 -I seo_reach.py <repo root>
"""
import glob
import html
import json
import os
import re
import sys

ROOT = sys.argv[1]
SP = os.path.join(ROOT, 'site-pages')
LINKEDIN = 'https://www.linkedin.com/in/krishnadezyner'

PAGES = {
    'index.html': (
        'Geetha Krishna | Graphic Designer & Video Editor for Hire',
        'Senior graphic designer & video editor in Bengaluru, India. Available worldwide for freelance, '
        'full-time & part-time work: logos, branding, posters, video.'),
    'about.html': (
        'About Geetha Krishna | Senior Graphic Designer & Video Editor',
        'Geetha Krishna, senior graphic designer & video editor (5+ years, 100+ projects). Open to freelance, '
        'full-time and part-time roles, remote or in Bengaluru.'),
    'work.html': (
        'Graphic Design & Video Portfolio | Geetha Krishna',
        None),  # description keeps its project count; set below
}

PERSON_EXTRA = {
    'jobTitle': 'Senior Graphic Designer & Video Editor',
    'description': ('Senior graphic designer and video editor based in Bengaluru, India, with 5+ years and 100+ '
                    'projects in brand identity, logo design, posters, social media creatives, editorial design and '
                    'video editing. Open to freelance, full-time and part-time work, remote worldwide or on-site in '
                    'Bengaluru.'),
    'sameAs': [LINKEDIN],
    'hasOccupation': [
        {'@type': 'Occupation', 'name': 'Graphic Designer', 'occupationalCategory': '27-1024.00',
         'skills': ('Brand identity, logo design, poster design, social media creatives, editorial and magazine '
                    'design, menu cards, hoardings and web banners, Adobe Photoshop, Adobe Illustrator, Figma, Adobe XD'),
         'occupationLocation': [{'@type': 'City', 'name': 'Bengaluru'}, {'@type': 'Country', 'name': 'India'}]},
        {'@type': 'Occupation', 'name': 'Video Editor', 'occupationalCategory': '27-4032.00',
         'skills': 'Video editing, motion graphics, product films, AI video, Adobe Premiere Pro, After Effects, DaVinci Resolve',
         'occupationLocation': [{'@type': 'City', 'name': 'Bengaluru'}, {'@type': 'Country', 'name': 'India'}]},
    ],
    'seeks': {'@type': 'Demand', 'name': 'Freelance, full-time or part-time graphic design and video editing work',
              'description': 'Freelance projects and full-time or part-time roles, remote worldwide or on-site in Bengaluru, India.'},
}
SERVICE_DESC = ('Graphic design and video editing by Geetha Krishna, a senior designer in Bengaluru, India, '
                'working with clients worldwide.')
WORLDWIDE = {'@type': 'Place', 'name': 'Worldwide'}


def esc(s):
    return html.escape(s, quote=True)


def set_meta(h, title, desc):
    if title:
        h = re.sub(r'<title>[^<]*</title>', f'<title>{esc(title)}</title>', h, count=1)
        for attr in ('property="og:title"', 'name="twitter:title"'):
            h = re.sub(r'(<meta ' + attr + r' content=")[^"]*(")', lambda m: m.group(1) + esc(title) + m.group(2), h, count=1)
    if desc:
        for attr in ('name="description"', 'property="og:description"', 'name="twitter:description"'):
            h = re.sub(r'(<meta ' + attr + r' content=")[^"]*(")', lambda m: m.group(1) + esc(desc) + m.group(2), h, count=1)
    return h


def enrich_ld(h):
    def fix(m):
        data = json.loads(m.group(1))
        nodes = data.get('@graph', []) if isinstance(data, dict) else data
        for n in nodes:
            t = n.get('@type')
            if t == 'Person' and n.get('name') == 'Geetha Krishna':
                n.update(PERSON_EXTRA)
            elif t == 'ProfessionalService':
                n['description'] = SERVICE_DESC
                area = n.setdefault('areaServed', [])
                if WORLDWIDE not in area:
                    area.append(WORLDWIDE)
            elif t == 'WebSite':
                n['inLanguage'] = 'en'
        return '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False) + '</script>'
    return re.sub(r'<script type="application/ld\+json">(.*?)</script>', fix, h, flags=re.S)


def project_desc(item):
    tail = f" {html.unescape(item['category'])} by Geetha Krishna, graphic designer & video editor."
    d = html.unescape(item['description']).strip()
    room = 158 - len(tail)
    if len(d) > room:
        d = d[:room - 1].rsplit(' ', 1)[0].rstrip(',.;:') + '…'
    return d + tail


VISIBLE = [  # About page CTA + screen-reader heading
    ('<h2>Open to freelance projects</h2>', '<h2>Open to freelance, full-time &amp; part-time work</h2>'),
    ('Based in Bengaluru, working with clients across India.',
     'Based in Bengaluru, working with clients across India and worldwide, remote or on-site.'),
    ('<span class="gk-sr">Geetha Krishna, freelance graphic designer in Bengaluru</span>',
     '<span class="gk-sr">Geetha Krishna, senior graphic designer and video editor in Bengaluru, available worldwide</span>'),
]

work = json.load(open(os.path.join(SP, 'work.json'), encoding='utf-8'))
PAGES['work.html'] = (PAGES['work.html'][0],
                      f'{len(work)} projects by Geetha Krishna: brand identity, logos, posters, magazines, billboards '
                      'and AI video. Hire for freelance, full-time or part-time work.')

changed = 0
for f in glob.glob(os.path.join(SP, '*.html')) + glob.glob(os.path.join(SP, 'work', '*.html')):
    h0 = h = open(f, encoding='utf-8').read()
    name = os.path.basename(f)
    if os.path.dirname(f).endswith('work'):
        item = next((w for w in work if w['slug'] == name[:-5]), None)
        if item:
            h = set_meta(h, None, project_desc(item))
    elif name in PAGES:
        h = set_meta(h, *PAGES[name])
    for a, b in VISIBLE:
        h = h.replace(a, b)
    h = enrich_ld(h)
    if h != h0:
        open(f, 'w', encoding='utf-8', newline='').write(h)
        changed += 1
print(f'seo_reach: {changed} pages updated')
