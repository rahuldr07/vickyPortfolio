"""Build /work (all projects) and optimised media.

Reads the built about.html as the page shell (nav, footer, styles, scripts) and writes work.html
plus work.json (used by the sitemap). Also adds a "See all work" link under the home case studies.

Usage: python3 -I work.py <repo root> <public/gk dir>
"""
import html, json, os, re, subprocess, sys

ROOT, OUT = sys.argv[1], sys.argv[2]
PUB = os.path.join(ROOT, "public")
MEDIA = os.path.join(OUT, "work", "all")
os.makedirs(MEDIA, exist_ok=True)

P = "works/Posters_Product posters/"
M = "works/magazines&coverpages/"
CATS = ["Brand Identity", "Posters & Campaigns", "Editorial & Print", "Digital & Outdoor", "Video & Motion"]

# slug, title, client, category, description, source (relative to public), extra
WORKS = [
    ("coastal-cravings-logo", "Coastal Cravings Logo", "Coastal Cravings", "Brand Identity",
     "Primary logo for a seafood dining brand: a leaping fish mark paired with a hand-lettered script.",
     "works/Logo/Coastal Cravings Logo.png", {}),
    ("coastal-cravings-signage", "Coastal Cravings Signage", "Coastal Cravings", "Brand Identity",
     "The Coastal Cravings mark applied to outdoor restaurant signage.",
     "works/Logo/Logo mockup.png", {}),
    ("besupermind-logo", "BeSuperMind Logo", "BeSuperMind", "Brand Identity",
     "Identity mark for a self-development and learning brand, shown in three lockups.",
     "works/Logo/BeSuperMind copy.jpg", {}),
    ("brand-visit-logo", "Brand Visit Logo", "Brand Visit", "Brand Identity",
     "Fashion retail wordmark with a shopping-cart detail, built to read well on dark backgrounds.",
     "works/Logo/Logo brand visit-01.jpg.jpeg", {}),
    ("gk-constructions-logo-helmet", "GK Constructions Logo, Helmet Concept", "GK Constructions", "Brand Identity",
     "Logo direction combining a hard hat and a house silhouette for a construction firm.",
     "works/Logo/Logo 1.jpg.jpeg", {}),
    ("gk-constructions-logo-gear", "GK Constructions Logo, Gear Concept", "GK Constructions", "Brand Identity",
     "Second logo direction built around a gear and crane monogram.",
     "works/Logo/Logo 2.jpg.jpeg", {}),
    ("gk-constructions-logo-hardhat", "GK Constructions Logo, Hard Hat Concept", "GK Constructions", "Brand Identity",
     "Third logo direction: a bold yellow hard hat with a stacked wordmark.",
     "works/Logo/Logo 3.jpg.jpeg", {}),

    ("greenmonk-ice-burst", "GreenMonk Ice Burst Key Visual", "GreenMonk Energy Drink", "Posters & Campaigns",
     "Campaign key visual for an energy drink: the can bursting out of ice with sports props around it.",
     P + "WhatsApp Image 2024-11-30 at 2.07.01 AM.jpeg", {}),
    ("greenmonk-laser", "GreenMonk Laser Poster", "GreenMonk Energy Drink", "Posters & Campaigns",
     "Product poster with a laser-frame composition and smoke, built for social feeds.",
     P + "Poster_47.jpg.jpeg", {}),
    ("greenmonk-spotlight", "GreenMonk Spotlight Poster", "GreenMonk Energy Drink", "Posters & Campaigns",
     "Three-can product line-up under a single spotlight.",
     P + "Poster_31-01.jpg.jpeg", {}),
    ("greenmonk-smoke", "GreenMonk Smoke Poster", "GreenMonk Energy Drink", "Posters & Campaigns",
     "Hero can wrapped in smoke on black, with a strong brand lock-up.",
     P + "Poster_44.jpg.jpeg", {}),
    ("greenmonk-powder-burst", "GreenMonk Powder Burst Creative", "GreenMonk Energy Drink", "Posters & Campaigns",
     "Social creative with the can breaking through a white powder burst.",
     P + "WhatsApp Image 2024-11-30 at 2.07.02 AM (2).jpeg", {}),
    ("greenmonk-brand-poster", "GreenMonk Brand Poster", "GreenMonk Energy Drink", "Posters & Campaigns",
     "Logo-led brand poster in the signature GreenMonk lime and black.",
     P + "Poster_8-01.jpg.jpeg", {}),
    ("rapsoulzzz-album-launch", "Rapsoulzzz Album Launch Poster", "GreenMonk Energy Drink", "Posters & Campaigns",
     "Event poster for an album launch presented by GreenMonk, with artist line-up and venue details.",
     P + "WhatsApp Image 2024-11-30 at 2.07.02 AM (3).jpeg", {}),
    ("tecno-music-party", "Tecno Music Party Poster", "Peace City", "Posters & Campaigns",
     "Neon-green poster for the Tecno music night, with DJ line-up and venue details.",
     P + "Poster 7.jpg", {}),
    ("big-filmy-party", "Big Filmy Party Poster", "Peace City", "Posters & Campaigns",
     "Bollywood night poster with a bold red palette and live-DJ details.",
     P + "poster 1.jpg", {}),
    ("after-party", "After Party Poster", "Peace City", "Posters & Campaigns",
     "Club night poster with condensed neon type and artist feature.",
     P + "poster 2.jpg", {}),
    ("hangover-club-night", "Hangover Club Night Poster", "Peace City", "Posters & Campaigns",
     "Saturday night event poster with script lettering and a high-energy crowd shot.",
     P + "poster 3.jpg", {}),
    ("coastal-cravings-festival-poster", "Coastal Cravings Seafood Festival Poster", "Coastal Cravings", "Posters & Campaigns",
     "Festival campaign poster: coastal photography, festival dates and a clear reservation call to action.",
     P + "Posters/A4_1.jpg", {}),
    ("coastal-cravings-poster-in-situ", "Coastal Cravings Poster, In Situ", "Coastal Cravings", "Posters & Campaigns",
     "The festival poster framed on a restaurant wall.",
     P + "Posters/output in mockup.jpg", {}),

    ("buddha-ceo-purpose-issue", "Buddha-CEO Magazine, Purpose Issue", "Buddha-CEO Quantum Foundation", "Editorial & Print",
     "Full magazine edition on purpose and inner growth: cover, contents and editorial layouts.",
     M + "magazine-1-preview.webp", {"pdf": M + "Magazine 1.pdf"}),
    ("buddha-ceo-global-peace-issue", "Buddha-CEO Magazine, Global Peace Issue", "Buddha-CEO Quantum Foundation", "Editorial & Print",
     "Full magazine edition on meditation and global peace, from cover to inner spreads.",
     M + "magazine-2-preview.webp", {"pdf": M + "Magazine 2.pdf"}),
    ("buddha-ceo-inner-spread", "Buddha-CEO Inner Spread", "Buddha-CEO Quantum Foundation", "Editorial & Print",
     "Two-page feature spread pairing a full-bleed portrait with a pull quote and long-form text.",
     "gk/work/bc-spread.webp", {}),
    ("meditation-leaders-cover", "Global Conference of Meditation Leaders Cover", "Buddha-CEO Quantum Foundation", "Editorial & Print",
     "Conference issue cover built around a panoramic audience photograph.",
     M + "cover-page-march-preview.webp", {}),
    ("buddha-ceo-earth-cover", "Buddha-CEO Cover, Collective Mind Issue", "Buddha-CEO Quantum Foundation", "Editorial & Print",
     "Cover with an Earth-from-space illustration and a meditating crowd.",
     M + "q6-cover-page-preview.webp", {}),
    ("buddha-ceo-editorial-cover", "Buddha-CEO Editorial Cover", "Buddha-CEO Quantum Foundation", "Editorial & Print",
     "Illustrated cover using a head silhouette to frame a story of inner freedom.",
     M + "editorial-cover-preview.webp", {}),
    ("coastal-cravings-menu", "Coastal Cravings Menu Card", "Coastal Cravings", "Editorial & Print",
     "Restaurant menu with hand-drawn seafood illustrations, shown as a styled mockup.",
     "works/Menu card/Menu Card Mockup.jpg", {}),
    ("coastal-cravings-a5-menu", "Coastal Cravings A5 Menu", "Coastal Cravings", "Editorial & Print",
     "Print-ready A5 menu layout with clear pricing hierarchy.",
     "works/Menu card/A5 Menu card.jpg", {}),

    ("ascend-billboard", "Ascend Luxury Apartments Billboard", "Keerthi Estates", "Digital & Outdoor",
     "Large-format billboard for a luxury apartment launch.",
     P + "KE bill board.jpg", {}),
    ("klay-admissions-hoarding", "KLAY School Admissions Hoarding", "KLAY", "Digital & Outdoor",
     "Outdoor hoarding for a school admissions campaign.",
     "works/Web banner_ Hoardings/Hoarding design.jpg", {}),
    ("klay-admissions-web-banner", "KLAY Admissions Web Banner", "KLAY", "Digital & Outdoor",
     "Web banner for the same admissions campaign, built for direct response.",
     "works/Web banner_ Hoardings/web banner_1.jpg", {}),
    ("klay-admissions-leaderboard", "KLAY Admissions Leaderboard Banner", "KLAY", "Digital & Outdoor",
     "Wide leaderboard variant of the admissions banner.",
     "works/Web banner_ Hoardings/web banner_2.jpg", {}),

    ("dragon-sour-cocktail-film", "Dragon Sour Cocktail Film", "", "Video & Motion",
     "Vertical cocktail film: bartender close-ups, shaker rhythm and a clean title card.",
     "works/Videos/Final Output.mp4", {"video": True}),
    ("new-day-organics-serum-commercial", "New Day Organics Serum Commercial", "New Day Organics", "Video & Motion",
     "AI-generated skincare commercial built from prompt-driven product shots.",
     "works/ai-videos/skincare-commercial-edit.mp4", {"video": True, "ai": True}),
    ("new-day-organics-serum-finale", "New Day Organics Serum, Finale Cut", "New Day Organics", "Video & Motion",
     "AI-generated finale with floating oil droplets and glow lighting.",
     "works/ai-videos/skincare-commercial-finale.mp4", {"video": True, "ai": True}),
    ("magnetic-tool-mat-ugc-ad", "Magnetic Tool Mat UGC Ad", "", "Video & Motion",
     "AI-generated UGC-style ad with a garage host and caption pacing.",
     "works/ai-videos/ai-product-film.mp4", {"video": True, "ai": True}),
]


def run(args):
    subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y", *args], check=True)


def probe(path, entries):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", entries,
                          "-of", "csv=p=0", path], capture_output=True, text=True, check=True).stdout.strip()
    return out


items = []
for slug, title, client, cat, desc, src, extra in WORKS:
    assert cat in CATS, cat
    path = os.path.join(PUB, src)
    assert os.path.exists(path), path
    it = {"slug": slug, "title": title, "client": client, "category": cat, "description": desc}
    if extra.get("video"):
        full = os.path.join(MEDIA, slug + ".mp4")
        poster = os.path.join(MEDIA, slug + ".webp")
        if not os.path.exists(full):
            run(["-i", path, "-vf", "scale=-2:'min(1280,ih)'", "-c:v", "libx264", "-preset", "slow", "-crf", "26",
                 "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", full])
        if not os.path.exists(poster):
            dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
                                        path], capture_output=True, text=True).stdout.strip())
            run(["-ss", str(round(dur * 0.4, 2)), "-i", path, "-frames:v", "1", "-vf", "scale=720:-2",
                 "-c:v", "libwebp", "-quality", "80", poster])
        w, hh = probe(poster, "stream=width,height").split(",")
        dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
                                    full], capture_output=True, text=True).stdout.strip())
        import datetime
        it.update(type="video", src=f"/gk/work/all/{slug}.mp4", thumb=f"/gk/work/all/{slug}.webp",
                  w=int(w), h=int(hh), duration=round(dur), ai=bool(extra.get("ai")),
                  uploaded=(subprocess.run(["git", "-C", ROOT, "log", "--diff-filter=A", "--format=%as", "--", path],
                                           capture_output=True, text=True).stdout.split() or
                            [datetime.date.fromtimestamp(os.path.getmtime(path)).isoformat()])[-1])
    else:
        thumb = os.path.join(MEDIA, slug + "-720.webp")
        large = os.path.join(MEDIA, slug + "-1600.webp")
        # PNGs may be transparent: flatten onto white so dark logos stay legible on dark tiles
        flat = (["-f", "lavfi", "-i", "color=c=white:s=16x16"], "[1][0]scale2ref[bg][fg];[bg][fg]overlay=shortest=1,")
        for out, wmax, q in ((thumb, 720, "80"), (large, 1600, "84")):
            if os.path.exists(out):
                continue
            if path.lower().endswith(".png"):
                run(["-i", path, *flat[0], "-filter_complex", flat[1] + f"scale='min({wmax},iw)':-2",
                     "-frames:v", "1", "-c:v", "libwebp", "-quality", q, out])
            else:
                run(["-i", path, "-vf", f"scale='min({wmax},iw)':-2", "-c:v", "libwebp", "-quality", q, out])
        w, hh = probe(thumb, "stream=width,height").split(",")
        it.update(type="image", src=f"/gk/work/all/{slug}-1600.webp", thumb=f"/gk/work/all/{slug}-720.webp",
                  w=int(w), h=int(hh))
        if extra.get("pdf"):
            it["pdf"] = "/" + extra["pdf"].replace("&", "%26").replace(" ", "%20")
    items.append(it)

# ---------------- page markup ----------------
counts = {c: sum(1 for i in items if i["category"] == c) for c in CATS}
chips = [f'<button type="button" class="gk-chip-btn on" data-filter="all" aria-pressed="true">All <span>{len(items)}</span></button>']
chips += [f'<button type="button" class="gk-chip-btn" data-filter="{html.escape(c)}" aria-pressed="false">'
          f'{html.escape(c)} <span>{counts[c]}</span></button>' for c in CATS]

cards = []
for n, it in enumerate(items):
    badge = '<span class="gk-play" aria-hidden="true"><i class="ph-fill ph-play"></i></span>' if it["type"] == "video" else ""
    meta = " · ".join(x for x in (it["client"], "AI video" if it.get("ai") else "") if x) or it["category"]
    it["meta"] = meta
    alt = f'{it["title"]} by Geetha Krishna, {it["category"].lower()}'
    cards.append(
        f'<li class="gk-w" data-cat="{html.escape(it["category"])}">'
        f'<a class="gk-w-btn" href="/work/{it["slug"]}" data-i="{n}">'
        f'<img src="{it["thumb"]}" width="{it["w"]}" height="{it["h"]}" loading="{"eager" if n < 6 else "lazy"}" '
        f'decoding="async" alt="{html.escape(alt)}"/>{badge}</a>'
        f'<div class="gk-w-cap"><h2 class="gk-w-title"><a href="/work/{it["slug"]}">{it["title"]}</a></h2>'
        f'<p class="gk-w-meta">{meta}</p><p class="gk-w-desc">{it["description"]}</p></div></li>')

WORK_MAIN = f"""<main class="main gk-work-main">
<section class="gk-work-head">
  <h1 class="gk-work-h1">Work<span class="gk-sr">: graphic design and video portfolio of Geetha Krishna, freelance designer in Bengaluru</span></h1>
  <p class="gk-work-lede">Brand identity, posters, editorial design and video by Geetha Krishna, a freelance graphic designer and video editor in Bengaluru. {len(items)} projects for {len({i["client"] for i in items if i["client"]})} brands.</p>
  <div class="gk-chips" role="toolbar" aria-label="Filter work by category">{"".join(chips)}</div>
</section>
<section class="gk-work-grid-wrap" aria-label="Projects">
  <ul class="gk-work-grid">{"".join(cards)}</ul>
</section>
<section class="gk-work-cta">
  <h2>Have a project in mind?</h2>
  <p>Open to freelance work: brand identity, campaign posters, social creatives, editorial layouts and video edits. Based in Bengaluru, working with clients across India.</p>
  <div class="gk-work-cta-btns">
    <a class="gk-btn gk-btn-primary" data-gk-talk href="mailto:geethakrishna.designer@gmail.com?subject=Project%20enquiry">Let’s Talk</a>
    <a class="gk-btn gk-btn-ghost" href="https://wa.me/917989228383" target="_blank" rel="noopener"><i class="ph ph-whatsapp-logo"></i>WhatsApp</a>
  </div>
</section>
</main>
<dialog class="gk-lb" aria-label="Project viewer" data-lenis-prevent>
  <button type="button" class="gk-lb-x" aria-label="Close"><i class="ph ph-x"></i></button>
  <div class="gk-lb-stage" aria-roledescription="carousel"></div>
  <div class="gk-lb-cap"><p class="gk-lb-title" aria-live="polite"></p><p class="gk-lb-meta"></p><p class="gk-lb-desc"></p><p class="gk-lb-links"><a class="gk-lb-page">View project page</a><a class="gk-lb-pdf" target="_blank" rel="noopener" hidden>Read the full magazine (PDF)</a></p></div>
  <button type="button" class="gk-lb-nav gk-lb-prev" aria-label="Previous project"><i class="ph ph-caret-left"></i></button>
  <button type="button" class="gk-lb-nav gk-lb-next" aria-label="Next project"><i class="ph ph-caret-right"></i></button>
</dialog>"""

CSS = """<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&display=swap" rel="stylesheet"/>
<script src="https://unpkg.com/@phosphor-icons/web@2.1.1"></script>
<style>
.gk-work-main{color:#f4f2f6;background:#0c0b0c}.gk-work-main{position:relative;isolation:isolate}.gk-work-main>section{position:relative;z-index:1}.gk-work-main::before{content:"";position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(40vw 60vh at -8% 22%,rgba(124,58,237,.24),transparent 70%),radial-gradient(36vw 58vh at 108% 64%,rgba(99,102,241,.2),transparent 70%),radial-gradient(26vw 38vh at 106% 6%,rgba(74,222,128,.09),transparent 70%);-webkit-mask-image:linear-gradient(90deg,#000 0,#000 5%,transparent 15%,transparent 85%,#000 95%,#000 100%);mask-image:linear-gradient(90deg,#000 0,#000 5%,transparent 15%,transparent 85%,#000 95%,#000 100%)}.gk-work-head::before{content:"";position:absolute;top:0;bottom:0;left:50%;width:100vw;transform:translateX(-50%);z-index:-1;pointer-events:none;background-image:linear-gradient(rgba(244,242,246,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(244,242,246,.055) 1px,transparent 1px);background-size:64px 64px;background-position:center top;-webkit-mask-image:radial-gradient(110% 95% at 50% 0%,#000 25%,transparent 78%);mask-image:radial-gradient(110% 95% at 50% 0%,#000 25%,transparent 78%)}.gk-work-head::after{content:"";position:absolute;z-index:-1;pointer-events:none;top:40px;left:0;width:min(70vw,820px);height:85%;background:radial-gradient(closest-side,rgba(139,92,246,.22),transparent)}@media (max-width:767px){.gk-work-main::before{display:none}}
.gk-work-head{max-width:1280px;margin:0 auto;padding:150px 6vw 36px;display:grid;gap:18px}
.gk-work-h1{margin:0;font:500 clamp(64px,9vw,140px)/.95 "Wix Madefor Display",sans-serif;letter-spacing:-.05em}
.gk-work-lede{margin:0;max-width:640px;font-size:17px;line-height:1.55;color:rgba(244,242,246,.72)}
.gk-avail{margin:0;display:inline-flex;align-items:center;gap:10px;justify-self:start;padding:8px 14px;border-radius:12px;
  border:1px solid rgba(74,222,128,.35);background:rgba(74,222,128,.08);font-size:14px;color:#d9fbe5}
.gk-avail-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;box-shadow:0 0 0 4px rgba(74,222,128,.18)}
.gk-chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:10px}
.gk-chip-btn{font:500 14px/1 "Wix Madefor Display",sans-serif;color:#f4f2f6;background:transparent;border:1px solid rgba(244,242,246,.22);
  padding:11px 14px;border-radius:12px;cursor:pointer;transition:background .2s,border-color .2s}
.gk-chip-btn span{opacity:.55;margin-left:4px}
.gk-chip-btn:hover{border-color:rgba(244,242,246,.5)}
.gk-chip-btn.on{background:#f4f2f6;color:#0c0b0c;border-color:#f4f2f6}
.gk-work-grid-wrap{max-width:1280px;margin:0 auto;padding:12px 6vw 40px}
.gk-work-grid{list-style:none;margin:0;padding:0;columns:3 340px;column-gap:22px}
.gk-w{break-inside:avoid;margin:0 0 30px;display:grid;gap:12px}
.gk-w[hidden]{display:none}
.gk-w-btn{position:relative;display:block;width:100%;padding:0;border:0;background:#141215;border-radius:12px;overflow:hidden;cursor:zoom-in;
  box-shadow:0 0 0 1px rgba(255,255,255,.07)}
.gk-w-btn img{display:block;width:100%;height:auto;transition:transform .6s cubic-bezier(.2,.8,.2,1)}
.gk-w-btn:hover img{transform:scale(1.03)}
.gk-play{position:absolute;left:14px;bottom:14px;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;
  background:rgba(12,11,12,.72);border:1px solid rgba(255,255,255,.2);color:#fff;font-size:16px}
.gk-w-title{margin:0;font:600 16px/1.3 "Wix Madefor Display",sans-serif;letter-spacing:-.01em}
.gk-w-meta{margin:2px 0 0;font-size:14px;color:rgba(244,242,246,.66)}
.gk-w-title a{color:inherit;text-decoration:none}
.gk-w-desc{margin:6px 0 0;font-size:14px;line-height:1.5;color:rgba(244,242,246,.72)}
.gk-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.gk-lb-links{margin:8px 0 0;display:flex;gap:18px;justify-content:center;flex-wrap:wrap}
.gk-lb-links a{color:#c4b5fd;font-size:15px}
.gk-w-btn:focus-visible,.gk-chip-btn:focus-visible,.gk-lb button:focus-visible,.gk-lb a:focus-visible{outline:2px solid #a78bfa;outline-offset:3px}
.gk-work-cta{max-width:1280px;margin:0 auto;padding:40px 6vw 120px;display:grid;gap:16px;justify-items:start}
.gk-work-cta h2{margin:0;font:500 clamp(36px,5vw,64px)/1 "Wix Madefor Display",sans-serif;letter-spacing:-.04em}
.gk-work-cta p{margin:0;max-width:620px;color:rgba(244,242,246,.72);line-height:1.55}
.gk-work-cta-btns{display:flex;gap:12px;flex-wrap:wrap;margin-top:6px}
.gk-btn{display:inline-flex;align-items:center;gap:10px;padding:13px 22px;border-radius:12px;font:600 15px/1 "Wix Madefor Display",sans-serif;
  white-space:nowrap;text-decoration:none;cursor:pointer}
.gk-btn-primary{background:#f4f2f6;color:#0c0b0c;border:1px solid #f4f2f6}
.gk-btn-ghost{background:transparent;color:#f4f2f6;border:1px solid rgba(244,242,246,.3)}
.gk-lb{width:100vw;height:100dvh;max-width:none;max-height:none;margin:0;padding:0;border:0;background:rgba(8,6,10,.94);color:#f4f2f6}
@keyframes gkLbIn{from{opacity:0}to{opacity:1}}
@keyframes gkCapIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.gk-lb[open]{animation:gkLbIn .35s ease-out}
.gk-lb-cap.in{animation:gkCapIn .45s cubic-bezier(.2,.8,.2,1)}
@media (prefers-reduced-motion:reduce){.gk-lb[open],.gk-lb-cap.in{animation:none}}
.gk-lb::backdrop{background:rgba(8,6,10,.6);backdrop-filter:blur(6px)}
.gk-lb[open]{display:grid;grid-template-rows:minmax(0,1fr) auto;overflow:hidden}
.gk-lb-stage{position:relative;min-height:0;perspective:1600px;perspective-origin:50% 45%;touch-action:pan-y;cursor:grab;
  -webkit-user-select:none;user-select:none}
.gk-lb-stage.drag{cursor:grabbing}
.gk-lb-card{position:absolute;left:50%;top:50%;border-radius:12px;overflow:hidden;background:#141215;cursor:pointer;
  will-change:transform,opacity;backface-visibility:hidden;
  box-shadow:0 40px 90px -20px rgba(0,0,0,.75),0 0 0 1px rgba(255,255,255,.08)}
.gk-lb-card.on{cursor:default}
.gk-lb-card img{display:block;width:100%;height:100%;object-fit:cover;pointer-events:none}
.gk-lb-card video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000}
.gk-lb-card.on .gk-play{display:none}
.gk-lb-cap{max-width:720px;justify-self:center;text-align:center;display:grid;gap:4px;padding:8px 20px 28px}
.gk-lb-nav{position:absolute;top:calc(50% - 70px);z-index:200}.gk-lb-prev{left:18px}.gk-lb-next{right:18px}
.gk-lb-title{margin:0;font:600 20px/1.3 "Wix Madefor Display",sans-serif}
.gk-lb-meta{margin:0;color:rgba(244,242,246,.6);font-size:14px}
.gk-lb-desc{margin:4px 0 0;color:rgba(244,242,246,.8);font-size:15px;line-height:1.5}
.gk-lb-pdf{color:#c4b5fd;font-size:15px;margin-top:6px}
.gk-lb-x{position:absolute;top:18px;right:18px;z-index:200}
.gk-lb-x,.gk-lb-nav{width:48px;height:48px;border-radius:50%;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.06);
  color:#fff;font-size:20px;display:grid;place-items:center;cursor:pointer;justify-self:center}
@media (max-width:767px){
  .gk-work-head{padding:120px 20px 24px}
  .gk-work-grid-wrap{padding:8px 20px 24px}
  .gk-work-grid{columns:2 150px;column-gap:14px}
  .gk-w{margin-bottom:20px}
  .gk-w-title{font-size:14px}.gk-w-meta{font-size:12.5px}
  .gk-work-cta{padding:24px 20px 90px}
  .gk-lb-stage{margin-top:60px}
  .gk-lb-nav{top:auto;bottom:18px}
  .gk-lb-cap{padding:6px 76px 22px}
  .gk-lb-desc{display:none}
}
</style></head>"""

DATA = json.dumps([{k: it.get(k) for k in ("slug", "title", "meta", "category", "description", "type", "src", "thumb", "pdf", "w", "h")}
                   for it in items]).replace("</", "<\\/")
JS = """<script>
(function(){
  var DATA=__DATA__;
  var grid=document.querySelector('.gk-work-grid'), chips=[].slice.call(document.querySelectorAll('.gk-chip-btn'));
  var cards=[].slice.call(grid.children);
  function apply(f){
    chips.forEach(function(c){var on=c.dataset.filter===f; c.classList.toggle('on',on); c.setAttribute('aria-pressed',on);});
    cards.forEach(function(li){ li.hidden=!(f==='all'||li.dataset.cat===f); });
    try{ history.replaceState(null,'',f==='all'?location.pathname:location.pathname+'?category='+encodeURIComponent(f)); }catch(e){}
  }
  chips.forEach(function(c){ c.addEventListener('click',function(){ apply(c.dataset.filter); }); });
  var q=new URLSearchParams(location.search).get('category'); if(q&&chips.some(function(c){return c.dataset.filter===q;})) apply(q);

  // 3D stacked carousel viewer: the current project in front, neighbours fanned and stacked behind it.
  var lb=document.querySelector('.gk-lb'), stage=lb.querySelector('.gk-lb-stage');
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var list=[], els={}, pos=0, target=0, raf=0, active=-1, capK=-1, opener=null, spread=1;
  var cap=lb.querySelector('.gk-lb-cap');
  var PLAY=document.querySelector('.gk-play');
  function visible(){ return cards.filter(function(li){return !li.hidden;}).map(function(li){return +li.querySelector('.gk-w-btn').dataset.i;}); }
  function mod(k){ var n=list.length; return ((k%n)+n)%n; }
  function wrap(d){ var n=list.length; d=mod(d); return d>n/2?d-n:d; }
  function mobile(){ return innerWidth<768; }
  function gap(){ return mobile()? innerWidth*.6 : Math.min(innerWidth*.3,480); }
  // the front card fits the full box; side cards fit a smaller one so tall posters never dwarf the active project
  function size(d,a){
    var mw=mobile()? innerWidth*.74 : Math.min(innerWidth*.56,1100), mh=stage.clientHeight-(mobile()?40:70), t=Math.min(a,1);
    mw*=1-t*.45; mh*=1-t*.3;
    var s=Math.min(mw/d.w, mh/d.h); return [Math.round(d.w*s), Math.round(d.h*s)];
  }
  function card(k){
    var i=list[k]; if(els[i]) return els[i];
    var d=DATA[i], el=document.createElement('div'), img=new Image();
    el.className='gk-lb-card'; el.dataset.k=k; img.alt=''; img.draggable=false; img.decoding='async'; img.src=d.thumb;
    el.appendChild(img); if(d.type==='video'&&PLAY) el.appendChild(PLAY.cloneNode(true));
    stage.appendChild(el); return els[i]=el;
  }
  function caption(k){
    var d=DATA[list[k]];
    lb.querySelector('.gk-lb-title').innerHTML=d.title;
    lb.querySelector('.gk-lb-meta').innerHTML=d.meta+(d.meta===d.category?'':' · '+d.category);
    lb.querySelector('.gk-lb-page').href='/work/'+d.slug;
    lb.querySelector('.gk-lb-desc').textContent=d.description;
    var pdf=lb.querySelector('.gk-lb-pdf'); if(d.pdf){pdf.href=d.pdf;pdf.hidden=false;} else pdf.hidden=true;
    if(!RM){ cap.classList.remove('in'); void cap.offsetWidth; cap.classList.add('in'); }
  }
  function render(){
    if(!list.length) return; var G=gap();
    for(var k=0;k<list.length;k++){
      var raw=wrap(k-pos), d=raw*spread, a=Math.abs(d), s=d<0?-1:1, el=els[list[k]];
      if(Math.abs(raw)>3.6){ if(el) el.style.visibility='hidden'; continue; }
      el=card(k); var sz=size(DATA[list[k]],a);
      var x=s*(a<=1? a*G : G+(a-1)*G*.36), ry=-s*Math.min(a,1)*34, z=-Math.min(a,3.6)*190, sc=1-Math.min(a,3)*.05;
      el.style.width=sz[0]+'px'; el.style.height=sz[1]+'px'; el.style.marginLeft=-sz[0]/2+'px'; el.style.marginTop=-sz[1]/2+'px';
      el.style.transform='translate3d('+x.toFixed(1)+'px,0,'+z.toFixed(1)+'px) rotateY('+ry.toFixed(2)+'deg) scale('+sc.toFixed(3)+')';
      el.style.zIndex=100-Math.round(a*10);
      el.style.opacity=(a>2.6? Math.max(0,1-(a-2.6)) : 1)*(.35+.65*spread);
      // depth of field: cards behind the front one soften with distance
      var bl=Math.min(a,3)*3.2;
      el.style.filter=a<.02? 'none' : 'blur('+bl.toFixed(1)+'px) brightness('+(1-Math.min(a,3)*.2).toFixed(2)+')';
      el.style.visibility='visible';
    }
    var c=mod(Math.round(pos)); if(c!==capK){ capK=c; caption(c); }
  }
  function unsettle(){
    if(active<0) return; var el=els[list[active]];
    if(el){ var v=el.querySelector('video'); if(v){ v.pause(); v.remove(); } el.classList.remove('on'); el.setAttribute('aria-hidden','true'); }
    active=-1;
  }
  function settle(){
    var k=mod(Math.round(target)); if(k===active) return; unsettle(); active=k;
    var el=card(k), d=DATA[list[k]], img=el.querySelector('img');
    el.classList.add('on'); el.removeAttribute('aria-hidden'); img.alt=d.title.replace(/<[^>]*>/g,'');
    if(d.type==='video'){
      var v=document.createElement('video'); v.src=d.src; v.poster=d.thumb; v.controls=true; v.autoplay=true; v.playsInline=true;
      el.appendChild(v);
    } else if(img.getAttribute('src')!==d.src){ var hi=new Image(); hi.onload=function(){ img.src=d.src; }; hi.src=d.src; }
  }
  function tick(){
    var dp=target-pos; spread+=(1-spread)*.11;
    if(Math.abs(dp)<.002&&spread>.998){ pos=target; spread=1; raf=0; render(); settle(); return; }
    pos+=dp*.13; render(); raf=requestAnimationFrame(tick);
  }
  function go(t){
    if(!list.length) return; target=t; if(mod(Math.round(t))!==active) unsettle();
    if(RM){ pos=t; render(); settle(); return; }
    if(!raf) raf=requestAnimationFrame(tick);
  }
  function step(dir){ go(Math.round(target)+dir); }

  // drag / swipe
  var drag=null, moved=false;
  stage.addEventListener('pointerdown',function(e){
    if(e.button!==0||e.target.tagName==='VIDEO') return;
    drag={x:e.clientX, p:pos, lx:e.clientX, lt:e.timeStamp, v:0}; moved=false;
    if(raf){ cancelAnimationFrame(raf); raf=0; }
  });
  addEventListener('pointermove',function(e){
    if(!drag) return; var dx=e.clientX-drag.x;
    if(!moved&&Math.abs(dx)>6){ moved=true; stage.classList.add('drag'); unsettle(); }
    if(!moved) return;
    var dt=e.timeStamp-drag.lt; if(dt>0) drag.v=(e.clientX-drag.lx)/dt; drag.lx=e.clientX; drag.lt=e.timeStamp;
    pos=drag.p-dx/gap(); target=pos; render();
  });
  addEventListener('pointerup',function(){
    if(!drag) return; var v=drag.v; drag=null; stage.classList.remove('drag');
    if(moved) go(Math.round(pos-Math.max(-2,Math.min(2,v*220/gap())))); else if(!raf&&active<0) go(Math.round(pos));
  });
  stage.addEventListener('click',function(e){
    if(moved){ moved=false; return; }
    var el=e.target.closest('.gk-lb-card'); if(!el) return;
    var d=Math.round(wrap(+el.dataset.k-target)); if(d) go(Math.round(target)+d);
  });
  var wacc=0, wlast=0;
  stage.addEventListener('wheel',function(e){
    var dx=Math.abs(e.deltaX)>Math.abs(e.deltaY)? e.deltaX : e.deltaY; e.preventDefault();
    wacc+=dx; if(Math.abs(wacc)>50&&e.timeStamp-wlast>260){ step(wacc>0?1:-1); wacc=0; wlast=e.timeStamp; }
  },{passive:false});

  grid.addEventListener('click',function(e){ var b=e.target.closest('.gk-w-btn'); if(!b||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0) return;
    e.preventDefault(); opener=b; list=visible(); stage.innerHTML=''; els={}; active=-1; capK=-1;
    pos=target=list.indexOf(+b.dataset.i); spread=RM?1:0; lb.showModal(); render(); settle();
    if(!RM&&!raf) raf=requestAnimationFrame(tick); });
  lb.querySelector('.gk-lb-x').addEventListener('click',function(){ lb.close(); });
  lb.querySelector('.gk-lb-prev').addEventListener('click',function(){ step(-1); });
  lb.querySelector('.gk-lb-next').addEventListener('click',function(){ step(1); });
  lb.addEventListener('keydown',function(e){ if(e.key==='ArrowLeft') step(-1); if(e.key==='ArrowRight') step(1); });
  lb.addEventListener('close',function(){ if(raf){cancelAnimationFrame(raf);raf=0;} unsettle(); stage.innerHTML=''; els={}; if(opener) opener.focus(); });
  addEventListener('resize',function(){ if(lb.open) render(); });
})();
</script>""".replace("__DATA__", DATA)

# ---------------- assemble work.html from the built about page ----------------
shell = open(os.path.join(OUT, "about.html"), encoding="utf-8").read()
i = shell.index('<section class="mission-hero-sc">')
j = shell.index('</section>', shell.index('<section class="team-sc">')) + len('</section>')
# the about page wraps sections in <main class="main">; replace that main entirely
mi = shell.rfind('<main', 0, i)
mj = shell.index('</main>', j) + len('</main>')
page = shell[:mi] + WORK_MAIN + shell[mj:]
page = page.replace('</head>', CSS, 1)
page = page.replace('</body>', JS + '</body>', 1)
page = re.sub(r'<title>[^<]*</title>', '<title>Work</title>', page, count=1)
page = page.replace('href="/about" aria-current="page" class="nav-link w-inline-block w--current"',
                    'href="/about" class="nav-link w-inline-block"')
assert page.count('href="/#work" class="nav-link w-inline-block"') == 1
page = page.replace('href="/#work" class="nav-link w-inline-block"',
                    'href="/#work" aria-current="page" class="nav-link w-inline-block w--current"')
open(os.path.join(OUT, "work.html"), "w", encoding="utf-8").write(page)

json.dump(items, open(os.path.join(ROOT, "site-pages", "work.json"), "w"), indent=1)

# ---------------- home: link from case studies to the full archive ----------------
idx_path = os.path.join(OUT, "index.html")
idx = open(idx_path, encoding="utf-8").read()
k = idx.index('</section>', idx.index('<section id="work" class="stack-sc">')) + len('</section>')
ALL = (f'<div class="gk-all-work"><a class="gk-btn gk-btn-ghost" href="/work" aria-label="Show more: all {len(items)} projects">Show more'
       '<i class="ph ph-arrow-right"></i></a></div>')
idx = idx[:k] + ALL + idx[k:]
idx = idx.replace('</head>', '<style>.gk-all-work{display:flex;justify-content:center;padding:10px 0 90px}</style></head>', 1)
open(idx_path, "w", encoding="utf-8").write(idx)
print("work items:", len(items), counts)
