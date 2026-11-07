"""Generate one page per project: site-pages/work/<slug>.html, using the finished /work page as the shell
(nav, footer, fonts, scripts, SEO head layout). Run after seo.py.

Usage: python3 -I project.py <repo root>
"""
import html, json, os, re, sys
from urllib.parse import quote

ROOT = sys.argv[1]
SP = os.path.join(ROOT, "site-pages")
SITE = "{{SITE_URL}}"
work = json.load(open(os.path.join(SP, "work.json")))
shell = open(os.path.join(SP, "work.html"), encoding="utf-8").read()

# drop the grid page's main, lightbox and its data script
mi, mj = shell.index('<main class="main gk-work-main">'), shell.index('</dialog>') + len('</dialog>')
shell = shell[:mi] + "@@MAIN@@" + shell[mj:]
shell = re.sub(r'<script>\s*\(function\(\)\{\s*var DATA=.*?</script>', '', shell, count=1, flags=re.S)
assert 'var DATA=' not in shell
# the Work nav item stays "current" (we are inside Work)

CSS = """<style>
.gk-proj{color:#f4f2f6;background:#0c0b0c}
.gk-proj-wrap{max-width:1180px;margin:0 auto;padding:140px 6vw 40px;display:grid;gap:26px}
.gk-crumbs{font-size:14px;color:rgba(244,242,246,.66)}
.gk-crumbs a{color:inherit}
.gk-proj-h1{margin:0;font:500 clamp(40px,5.6vw,84px)/1 "Wix Madefor Display",sans-serif;letter-spacing:-.045em}
.gk-proj-grid{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:clamp(24px,4vw,56px);align-items:start}
.gk-proj-media img,.gk-proj-media video{display:block;width:100%;height:auto;max-height:82vh;object-fit:contain;border-radius:12px;background:#141215;
  box-shadow:0 0 0 1px rgba(255,255,255,.07)}
.gk-proj-side{display:grid;gap:18px;position:sticky;top:120px}
.gk-proj-desc{margin:0;font-size:17px;line-height:1.6;color:rgba(244,242,246,.82)}
.gk-proj-facts{margin:0;display:grid;grid-template-columns:auto 1fr;gap:8px 18px;font-size:15px;border-top:1px solid rgba(244,242,246,.14);padding-top:16px}
.gk-proj-facts dt{color:rgba(244,242,246,.6)}
.gk-proj-facts dd{margin:0}
.gk-proj-facts a{color:#c4b5fd}
.gk-proj-btns{display:flex;gap:12px;flex-wrap:wrap}
.gk-proj-pn{max-width:1180px;margin:0 auto;padding:10px 6vw 30px;display:flex;justify-content:space-between;gap:16px}
.gk-proj-pn a{color:#f4f2f6;text-decoration:none;display:inline-flex;gap:8px;align-items:center;font-size:15px;opacity:.85}
.gk-proj-pn a:hover{opacity:1}
.gk-related{max-width:1180px;margin:0 auto;padding:20px 6vw 30px}
.gk-related h2{margin:0 0 18px;font:500 28px/1.1 "Wix Madefor Display",sans-serif;letter-spacing:-.03em}
.gk-related ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}
.gk-related a{color:#f4f2f6;text-decoration:none;display:grid;gap:10px;font-size:14px}
.gk-related img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:12px;box-shadow:0 0 0 1px rgba(255,255,255,.07)}
@media (max-width:767px){
  .gk-proj-wrap{padding:110px 20px 24px}
  .gk-proj-grid{grid-template-columns:1fr}
  .gk-proj-side{position:static}
  .gk-proj-pn,.gk-related{padding-left:20px;padding-right:20px}
  .gk-related ul{grid-template-columns:repeat(2,minmax(0,1fr))}
}
</style></head>"""
shell = shell.replace('</head>', CSS, 1)


def esc(s):
    return html.escape(html.unescape(s), quote=True)


def clip(s, n=158):
    s = html.unescape(s)
    return s if len(s) <= n else s[:n - 1].rsplit(" ", 1)[0].rstrip(",.;:") + "."


out_dir = os.path.join(SP, "work")
os.makedirs(out_dir, exist_ok=True)
for f in os.listdir(out_dir):
    if f.endswith(".html"):
        os.remove(os.path.join(out_dir, f))

n = len(work)
for i, it in enumerate(work):
    slug, title, cat = it["slug"], it["title"], it["category"]
    url = f"{SITE}/work/{slug}"
    cat_url = "/work?category=" + quote(cat)
    plain_title = html.unescape(title)
    page_title = next(t for t in (f"{plain_title} | {cat} by Geetha Krishna", f"{plain_title} | Geetha Krishna, Designer",
                                  f"{plain_title} | Geetha Krishna", plain_title) if len(t) <= 65 or t == plain_title)
    desc = clip(f"{html.unescape(it['description'])} {cat} by Geetha Krishna, freelance graphic designer in Bengaluru.")
    image = SITE + (it["thumb"] if it["type"] == "video" else it["src"])
    alt = f"{plain_title} by Geetha Krishna"

    if it["type"] == "video":
        media = (f'<video src="{it["src"]}" poster="{it["thumb"]}" controls playsinline preload="metadata" '
                 f'width="{it["w"]}" height="{it["h"]}" aria-label="{esc(alt)}"></video>')
        main_entity = {"@type": "VideoObject", "@id": url + "#video", "name": plain_title,
                       "description": html.unescape(it["description"]), "thumbnailUrl": SITE + it["thumb"],
                       "contentUrl": SITE + it["src"], "uploadDate": it["uploaded"],
                       "duration": f"PT{it['duration']}S", "creator": {"@id": SITE + "/#person"}}
    else:
        media = (f'<img src="{it["src"]}" alt="{esc(alt)}" width="{it["w"]}" height="{it["h"]}" '
                 f'fetchpriority="high" decoding="async"/>')
        main_entity = {"@type": "CreativeWork", "@id": url + "#work", "name": plain_title,
                       "description": html.unescape(it["description"]), "genre": cat,
                       "image": SITE + it["src"], "url": url, "creator": {"@id": SITE + "/#person"}}
    if it.get("client"):
        main_entity["sourceOrganization"] = {"@type": "Organization", "name": html.unescape(it["client"])}

    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "Person", "@id": SITE + "/#person", "name": "Geetha Krishna",
         "jobTitle": "Freelance Graphic Designer & Video Editor", "url": SITE + "/"},
        main_entity,
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": "Work", "item": SITE + "/work"},
            {"@type": "ListItem", "position": 3, "name": plain_title, "item": url}]},
    ]}

    facts = []
    if it.get("client"):
        facts.append(f'<dt>Client</dt><dd>{it["client"]}</dd>')
    facts.append(f'<dt>Category</dt><dd><a href="{cat_url}">{cat}</a></dd>')
    if it.get("ai"):
        facts.append('<dt>Made with</dt><dd>AI-generated footage, edited by Geetha Krishna</dd>')
    if it.get("pdf"):
        facts.append(f'<dt>Full issue</dt><dd><a href="{it["pdf"]}" target="_blank" rel="noopener">Read the magazine (PDF)</a></dd>')

    related = [w for w in work if w["category"] == cat and w["slug"] != slug][:4]
    rel = "".join(f'<li><a href="/work/{w["slug"]}"><img src="{w["thumb"]}" alt="" loading="lazy" decoding="async" '
                  f'width="{w["w"]}" height="{w["h"]}"/><span>{w["title"]}</span></a></li>' for w in related)
    prev_it, next_it = work[(i - 1) % n], work[(i + 1) % n]

    MAIN = f"""<main class="main gk-proj">
<article class="gk-proj-wrap">
  <nav class="gk-crumbs" aria-label="Breadcrumb"><a href="/work">Work</a> / <a href="{cat_url}">{cat}</a></nav>
  <h1 class="gk-proj-h1">{title}</h1>
  <div class="gk-proj-grid">
    <figure class="gk-proj-media" style="margin:0">{media}</figure>
    <div class="gk-proj-side">
      <p class="gk-proj-desc">{it["description"]}</p>
      <dl class="gk-proj-facts">{"".join(facts)}</dl>
      <p class="gk-avail"><span class="gk-avail-dot" aria-hidden="true"></span>Available for freelance projects</p>
      <div class="gk-proj-btns">
        <a class="gk-btn gk-btn-primary" data-gk-talk href="mailto:geethakrishna.designer@gmail.com?subject={quote('Project like ' + plain_title)}">Let’s Talk</a>
        <a class="gk-btn gk-btn-ghost" href="https://wa.me/917989228383" target="_blank" rel="noopener"><i class="ph ph-whatsapp-logo"></i>WhatsApp</a>
      </div>
    </div>
  </div>
</article>
<nav class="gk-proj-pn" aria-label="More projects">
  <a href="/work/{prev_it["slug"]}" rel="prev"><i class="ph ph-arrow-left"></i>{prev_it["title"]}</a>
  <a href="/work/{next_it["slug"]}" rel="next">{next_it["title"]}<i class="ph ph-arrow-right"></i></a>
</nav>
{f'<section class="gk-related"><h2>More {cat}</h2><ul>{rel}</ul></section>' if rel else ''}
</main>"""

    page = shell.replace("@@MAIN@@", MAIN, 1)
    # rewrite the SEO head for this project
    page = re.sub(r'<title>[^<]*</title>', f'<title>{esc(page_title)}</title>', page, count=1)
    page = re.sub(r'<meta name="description" content="[^"]*"/>', f'<meta name="description" content="{esc(desc)}"/>', page, count=1)
    page = re.sub(r'<link rel="canonical" href="[^"]*"/>', f'<link rel="canonical" href="{url}"/>', page, count=1)
    for prop, val in (("og:url", url), ("og:title", page_title), ("og:description", desc), ("og:image", image),
                      ("og:image:alt", alt)):
        page = re.sub(rf'<meta property="{prop}" content="[^"]*"/>', f'<meta property="{prop}" content="{esc(val)}"/>', page, count=1)
    page = re.sub(r'<meta property="og:image:(width|height)" content="[^"]*"/>', '', page)
    for name, val in (("twitter:title", page_title), ("twitter:description", desc), ("twitter:image", image)):
        page = re.sub(rf'<meta name="{name}" content="[^"]*"/>', f'<meta name="{name}" content="{esc(val)}"/>', page, count=1)
    page = re.sub(r'<script type="application/ld\+json">.*?</script>',
                  lambda m: '<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False).replace("</", "<\\/") + '</script>',
                  page, count=1, flags=re.S)
    assert page.count("<h1") == 1, slug
    open(os.path.join(out_dir, slug + ".html"), "w", encoding="utf-8").write(page)

print("project pages:", n)
