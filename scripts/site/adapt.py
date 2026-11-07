"""Rebuild public/gk/{index,about}.html for Geetha Krishna from pristine Webflow copies.

Every replacement asserts its expected count so a missed string fails loudly.
Usage: python3 -I adapt.py <pristine_dir> <public/gk dir>
"""
import os, re, sys

PRISTINE, OUT = sys.argv[1], sys.argv[2]
EMAIL = "geethakrishna.designer@gmail.com"
WA = "https://wa.me/917989228383"
PHONE_HREF, PHONE_TXT = "tel:+917989228383", "+91 79892 28383"
RESUME = "/resume/geetha-krishna-resume.pdf"
TITLE = "Geetha Krishna | Freelance Graphic Designer in Bengaluru"
DESC = ("Geetha Krishna is a freelance graphic designer and video editor in Bengaluru, India, "
        "creating logo design, brand identity, posters, social media creatives, packaging, "
        "magazines, motion graphics and AI video for brands.")
CTA = "Let’s Talk"


class Doc:
    def __init__(self, name):
        self.name = name
        self.h = open(os.path.join(PRISTINE, name), encoding="utf-8").read()

    def rep(self, old, new, count=1):
        n = self.h.count(old)
        assert n == count, f"{self.name}: expected {count}x {old[:70]!r}, found {n}"
        self.h = self.h.replace(old, new)

    def rx(self, pat, new, count=1):
        self.h, n = re.subn(pat, new, self.h, flags=re.S)
        assert n == count, f"{self.name}: expected {count}x /{pat[:70]}/, found {n}"

    def region(self, start, end, pairs):
        """Ordered single replacements inside h[start:end] (for repeated short words)."""
        i = self.h.index(start); j = self.h.index(end, i)
        seg = self.h[i:j]
        for old, new in pairs:
            k = seg.find(old)
            assert k >= 0, f"{self.name}: {old!r} not found in region {start!r}"
            seg = seg[:k] + new + seg[k + len(old):]
        self.h = self.h[:i] + seg + self.h[j:]


def shared(d, n_footer_name=1):
    """Nav, mobile menu, modal form, footer: identical on both pages."""
    d.rep('data-wf-domain="superconscious-app.webflow.io"', 'data-wf-domain="localhost"')
    # Brand logo -> GK wordmark
    d.rx(r'<img src="/gk/images/682d7c4461a6cad665ede871_brand\.png"[^>]*/>',
         '<span class="gk-wordmark">GK</span>')
    d.rx(r'<img src="/gk/images/682d7c4461a6cad665ede8a1_brand-logo-mpb\.svg"[^>]*/>',
         '<span class="gk-wordmark">GK</span>')
    d.rep('</head>', '<style>.gk-wordmark{display:flex;align-items:center;justify-content:center;'
          'width:100%;height:100%;font-family:"Wix Madefor Display",sans-serif;font-weight:700;'
          'font-size:0.95rem;letter-spacing:-0.02em;line-height:1;color:#fff}'
          '.gk-nw{display:inline-block;white-space:nowrap}'
          '@media (max-width:479px){.footer-mail-link{font-size:clamp(1.15rem,5.6vw,2rem);overflow-wrap:anywhere}}'
          '</style></head>')
    # Nav links
    d.rep('href="/#how-it-works"', 'href="/#work"')
    d.rep('>How it Works<', '>Work<', 2)
    d.rep('href="/mission"', 'href="/about"')
    d.rep('class="nav-link-text original">Mission<', 'class="nav-link-text original">About<')
    d.rep('class="nav-link-text clone">Mission<', 'class="nav-link-text clone">About<')
    # Mobile menu
    d.rep('Unlock Your Limitless Potential', 'Turning Ideas Into Visuals')
    d.rep('mailto:hello@superconscious.io', f'mailto:{EMAIL}', 2)
    d.rep('>hello@superconscious.io<', f'>{EMAIL}<', 2)
    # Socials (mobile menu + footer): Instagram->Email, TikTok->WhatsApp, Twitter->Behance, LinkedIn->LinkedIn
    d.rep('href="https://www.instagram.com/superconscious.io" target="_blank"', f'href="mailto:{EMAIL}"', 2)
    d.rep('href="https://www.tiktok.com/@superconscious.io"', f'href="{WA}"', 2)
    d.rep('href="https://www.twitter.com/superconsciousx" target="_blank"', 'href="#"', 2)  # TODO: Behance URL
    d.rep('href="https://www.linkedin.com/company/superconscious/" target="_blank"', 'href="#"', 2)  # TODO: LinkedIn URL
    d.rep('>Instagram<', '>Email<', 3)
    d.rep('>Tik Tok<', '>WhatsApp<', 3)
    d.rep('>Twitter X<', '>Behance<', 3)
    d.rep('>Linkedin<', '>LinkedIn<', 3)
    # Modal form -> email enquiry
    d.rx(r'Start(\s*)<br/>Manifesting Today', r'Start\1<br/>Your Project')
    d.rep('Be the first in line! Join the waitlist', 'Leave your name and email to send me a quick note.')
    d.rep('Thanks for Joining!', 'Thank You!')
    d.rep('We’ll send updates as soon as we’re ready for you',
          'Your email app is opening. Send the note and I’ll get back to you.')
    d.rep("if (!formErrors) $(this).parents('form').submit()",
          "if (!formErrors) gkSendEnquiry($(this).parents('form'))")
    d.rep('</body>', '<script>function gkSendEnquiry(f){var n=f.find(\'[name="Name"]\').val()||"",'
          'e=f.find(\'[name="Email"]\').val()||"";'
          f'window.location.href="mailto:{EMAIL}?subject="+encodeURIComponent("Project enquiry from "+n)'
          '+"&body="+encodeURIComponent("Hi Geetha,\\n\\nName: "+n+"\\nEmail: "+e+"\\n\\nProject details:\\n");'
          'f.hide();f.siblings(".w-form-done").show();}</script></body>')
    # Footer
    d.rep('>Live Limitless<', '>Let’s Create<')
    d.rep('>Upgrade Your Reality<', '>Have a Project in Mind?<')
    d.rep('Join the waitlist and get priority access', 'Freelance work in Bengaluru and remote')
    d.rep('>Join Waitlist<', f'>{CTA}<', n_footer_name)
    d.rep('class="footer-name">SUPERCONSCIOUS<', 'class="footer-name">GEETHA KRISHNA<')
    d.rep('© 2025 Superconscious. All Rights Reserved.', '© 2026 Geetha Krishna. All Rights Reserved.')
    d.rep('<a href="#" class="policy-link">Privacy policy</a>',
          f'<a href="{RESUME}" target="_blank" class="policy-link">Resume</a>')
    d.rep('<a href="#" class="policy-link">Terms and conditions</a>',
          f'<a href="{PHONE_HREF}" class="policy-link">{PHONE_TXT}</a>')


# ---------------- Home page ----------------
d = Doc("index.html")
d.rep('<title>Superconscious</title>', f'<title>{TITLE}</title>')
d.rx(r'<meta content="Superconscious explores[^"]*" name="description"/>',
     f'<meta content="{DESC}" name="description"/>')
shared(d, n_footer_name=3)  # hero badge, CTA card, footer buttons

# Preloader: the Lottie is a PNG sequence of the Superconscious wordmark, so replace it
# with a live-text intro in the same style (white, blur-in, per-letter stagger).
word = "geetha krishna"
letters = "".join(
    f'<span class="gk-pl-ch" style="--i:{i}">{"&nbsp;" if c == " " else c}</span>' for i, c in enumerate(word))
d.rx(r'<div class="lottie-preloader"[^>]*data-src="/gk/lottie/682d7c4461a6cad665ede8a6_2preloader_sqw\.json"[^>]*></div>',
     f'<div class="gk-preloader" aria-label="Geetha Krishna">{letters}</div>')
d.rep('</head>', '<style>'
      '.gk-preloader{position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;'
      'font-family:"Wix Madefor Display",sans-serif;font-weight:500;font-size:clamp(2.75rem,10.5vw,10rem);'
      'letter-spacing:-0.05em;line-height:1;color:#fff;white-space:nowrap;pointer-events:none}'
      '.gk-pl-ch{display:inline-block;opacity:0;filter:blur(0.8rem);transform:translateX(0.35em) scale(1.15);'
      'animation:gkPlIn .9s cubic-bezier(.2,.9,.3,1.15) forwards;animation-delay:calc(0.1s + var(--i) * 0.035s)}'
      '@keyframes gkPlIn{to{opacity:1;filter:blur(0);transform:none}}'
      '@media (prefers-reduced-motion:reduce){.gk-pl-ch{animation:none;opacity:1;filter:none;transform:none}}'
      '</style></head>')

# Hero
d.rep('class="headline-mega">superconscious<', 'class="headline-mega">geetha krishna<')
d.rep('>The Manifestation App<', '>Graphic Designer &amp; Video Editor<', 2)  # hero tag + name section
d.rep('>Coming in beta Spring 2025<', '>Open for Freelance Projects<')
d.rep('>Join the Waitlist Today<', '>5+ years, 100+ projects<')

# Pinned about headline (desktop): Control [i] Your / Mind [i] Manifest / Your [i] Reality
d.region('class="about-headline-d"', 'class="about-headline-p"', [
    ('>Control<', '>Turning<'), ('>Your<', '>Ideas<'), ('>Mind<', '>Into<'),
    ('>Manifest<', '>Bold<'), ('>Your<', '>Brand<'), ('>Reality<', '>Stories<')])
# Mobile version
d.region('class="about-headline-p"', 'class="about-pg-area"', [
    ('>Control Your <', '>Turning Ideas <'), ('>Mind<', '>Into<'),
    ('>Manifest<', '>Bold<'), ('>Your<', '>Brand<'), ('>Reality<', '>Stories<')])
# About paragraph (desktop + mobile copies, first letter split)
d.rx(r'<span class="about-space-span">E</span>verything you seek[^<]*',
     '<span class="about-space-span">I</span>’m Geetha Krishna, a graphic designer and video editor '
     'with 5+ years of turning briefs into logos, posters, magazines, menus and motion edits. '
     'On-brand work that looks right in print, on screen and across social.', 2)

# How it works -> process
d.rep('class="how-work-headline">Upgrade<span class="your-space-span">Your</span> <span class="hw-italic">Reality</span>',
      'class="how-work-headline">Shaping<span class="your-space-span">Your</span> <span class="hw-italic">Brand</span>')
d.rep('>Input Your Current Reality &amp; Desired Results<', '>Share Your Brief &amp; Goals<')
d.rx(r'>Reflect on where you are\s+and where you want to be\.<', '>Tell me about your brand, audience and deadline.<')
d.rep('>Superconscious AI Analyzes Subconscious Patterns &amp; Beliefs<', '>Research, Moodboards &amp; First Concepts<')
d.rx(r'>Receive tailored meditations, journaling prompts, and insights\.?<', '>Directions explored in your brand voice before any polish.<')
d.rep('>Superconscious AI Creates Your Personalized Manifestation Journey<', '>Design, Edit &amp; Refine Together<')
d.rx(r'>Experience a personalized path to clarity, focus, and manifestation\.?<', '>Layouts and edits revised until every detail fits.<')
d.rep('>Adapt and Grow with Superconscious<', '>Final Files, Ready to Use<')
d.rx(r'>Transform Your Mindset\s+and Results<', '>Print-ready, web and social formats delivered.<')

# Services widgets
d.rep('>Hyper-Personalized Imagination Sessions<', '>Logo &amp; Brand Identity<')
d.rx(r'>Tap into the frequency of your highest self\.?<', '>Marks and brand systems people remember<')
d.rep('>Superconscious <br/>Activations<', '>Posters &amp; <br/>Social Creatives<')
d.rx(r'>AI-guided activations to shift your energy instantly\.?<', '>Campaign posters, ads and scroll-stopping posts<')
d.rep('>AI-Powered Vibrational Intelligence<', '>Print &amp; Editorial Design<')
d.rx(r'>Track and elevate your frequency for faster manifestation\.?<', '>Magazines, menus, brochures and hoardings<')
d.rep('>Daily Journals &amp; AI Feedback<', '>Video Editing &amp; Motion<')
d.rx(r'>Reflect, reframe, and grow every day\.?<', '>Product films, reels and AI video edits<')

# Stack cards (phone + tablet mockups kept)
d.rep('>For Individuals<', '>For Brands &amp; Startups<')
d.rep('>Manifest Your Dream Life<', '>Build a Brand People Remember<')
d.rx(r'>Superconscious helps you break through[^<]*<',
     '>From the first logo to launch posters and social creatives, I help new brands look '
     'consistent and confident everywhere they show up.<')
d.rep('>For Business<', '>For Agencies &amp; Teams<')
d.rx(r'>Empower Your Team\s+to\s+Achieve More<', '>Extra Design Hands, On Demand<')
d.rx(r'>Superconscious for Business helps[^<]*<',
     '>Reliable support for print, digital and video work. Clear briefs in, on-brand files out, '
     'delivered in the formats your team needs.<')

# Name marquee
d.rep('>The Ultimate Manifestation Tool<', '>Designs That Get Noticed<')
n = d.h.count('class="name-headline">superconscious<')
assert n >= 4, n
d.rep('class="name-headline">superconscious<', 'class="name-headline">geetha krishna<', n)

# CTA card
d.rep('>Your Dream <br/>Life Starts Here<', '>Your Project <br/>Starts Here<')
d.rep('>Download Superconscious and begin manifesting your dream reality today.<',
      '>Share your brief and let’s make something people remember.<')
index_html = d.h

# ---------------- About page (was /mission) ----------------
m = Doc("mission.html")
m.rep('<title>Mission</title>', f'<title>About | {TITLE}</title><meta content="{DESC}" name="description"/>')
m.rep('content="Mission" property="og:title"', 'content="About Geetha Krishna" property="og:title"')
m.rep('content="Mission" name="twitter:title"', 'content="About Geetha Krishna" name="twitter:title"')
shared(m, n_footer_name=1)
m.rep('class="heading-2">Mission<', 'class="heading-2">About<')
m.rep('>Elevating Global Consciousness<', '>Designer, Editor, Storyteller<')
m.rep('<span class="span-padding">O</span>ur mission is to elevate global consciousness.',
      '<span class="gk-nw"><span class="span-padding">D</span>esign</span> '
      '<span class="gk-nw">that</span> <span class="gk-nw">makes</span> <span class="gk-nw">brands</span> <span class="gk-nw">easy</span> <span class="gk-nw">to</span> <span class="gk-nw">remember.</span>')
m.rx(r'>Humanity is at a crossroads\..*?consciously create their reality\.<',
     '>I’m Geetha Krishna, a freelance graphic designer and video editor based in Bengaluru. '
     'For 5+ years I have worked across graphic design, visual content creation, motion edits '
     'and brand storytelling, with 100+ projects across print, digital and motion.'
     '  <br/>‍<br/>My production stack is Photoshop, Illustrator, Premiere Pro, After Effects '
     'and DaVinci Resolve, with Figma, Adobe XD, Wix and Articulate 360 for UI, web and e-learning work.<')
m.rx(r'>As the ultimate tool for manifestation.*?the future\s+of humanity itself\.<',
     '>Logos and brand identities, posters and social creatives, magazines and cover pages, '
     'menu cards, hoardings and web banners, plus product films and AI video edits.'
     '  <br/>‍<br/>Every project starts with a clear brief and ends with files that are ready '
     'for print, web and social.<')

CARDS = [  # (pristine linkedin url, image, title, role line 1, role line 2)
    ("https://www.linkedin.com/in/tommy-mccarthy", "/gk/work/geetha-portrait.webp",
     "Pixel Scoop Studios", "Graphic Designer Intern", "Jan 2021 - Dec 2021"),
    ("https://www.linkedin.com/in/tom-mccarthy-breakthrough", "/gk/work/all/greenmonk-spotlight-720.webp",
     "GreenMonk Energy Drink", "Graphic Designer &amp; Content Creator", "Jan 2022 - Feb 2023"),
    ("https://www.linkedin.com/in/healthydoc", "/gk/work/all/buddha-ceo-purpose-issue-720.webp",
     "Buddha-CEO Quantum Foundation", "Graphic &amp; Web Designer", "Mar 2023 - Present"),
]
OLD = [("Tommy McCarthy", "Co-Chief Executive Officer"), ("Tom McCarthy", "Chief Learning Officer"),
       ("Cheng Ruan, MD", "Co-Chief Executive Officer")]
for (url, img, title, r1, r2), (oname, orole) in zip(CARDS, OLD):
    start = m.h.index(f'href="{url}"')
    end = m.h.index('</a>', start)
    seg = m.h[start:end]
    link = {"Pixel Scoop Studios": "/work", "GreenMonk Energy Drink": "/work?category=Posters%20%26%20Campaigns",
            "Buddha-CEO Quantum Foundation": "/work?category=Editorial%20%26%20Print"}[title]
    seg = seg.replace(f'href="{url}" target="_blank"', f'href="{link}"')
    seg, k = re.subn(r'<img src="[^"]*team-person[^"]*"[^>]*class="image-cover"/>',
                     f'<img src="{img}" loading="lazy" width="720" height="900" alt="{"Geetha Krishna" if "portrait" in img else title + " work by Geetha Krishna"}" class="image-cover"/>', seg)
    assert k == 1, title
    seg = seg.replace(f'>{oname}<', f'>{title}<', 1)
    assert title in seg, oname
    seg = seg.replace(f'>{orole}<br/>Co-Founder<', f'>{r1}<br/>{r2}<', 1)
    assert r2 in seg, orole
    seg, k = re.subn(r'<img src="/gk/images/682d7c4461a6cad665ede8a4_linked-iocn\.png"[^>]*/>', '', seg)
    assert k == 1
    m.h = m.h[:start] + seg + m.h[end:]
m.rep('class="image-cover"/></div><div class="team-person-info">',
      'class="image-cover"/></div><div class="team-person-info">', 3)
about_html = m.h

with open(os.path.join(OUT, "index.html"), "w", encoding="utf-8") as f:
    f.write(index_html)
with open(os.path.join(OUT, "about.html"), "w", encoding="utf-8") as f:
    f.write(about_html)
print("ok")
