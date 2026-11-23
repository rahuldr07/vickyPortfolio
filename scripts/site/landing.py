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
from urllib.parse import quote

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
        desc=('Looking for an individual freelance graphic designer in Bangalore? Work with Geetha Krishna for branding, '
              'digital campaigns, social media graphics and creative design services. Available for remote projects.'),
        eyebrow='Independent graphic designer · Bangalore, India',
        h1='Freelance Graphic Designer in Bangalore',
        lede=('I’m Geetha Krishna, an independent freelance graphic designer in Bengaluru (Bangalore). I help businesses '
              'and brands with branding, social media graphics, digital campaigns and print design, working with you '
              'directly, in Bangalore or remotely.'),
        service='Freelance graphic design',
        place='in Bangalore',
        long=True,
        services=[('Branding & logo design', 'Logos, marks and identity systems that are easy to remember.'),
                  ('Social media graphics', 'Post, story and ad designs that keep your feed consistent and on-brand.'),
                  ('Digital campaigns', 'Key visuals adapted into posts, web banners and display ads.'),
                  ('Posters & flyers', 'Product, event and campaign posters built to stop the scroll.'),
                  ('Brochures, magazines & print', 'Brochures, standees, menu cards, magazine covers and layouts.'),
                  ('Hoardings & outdoor', 'Billboards and hoardings prepared at full print size.')],
        tools='Photoshop, Illustrator, Figma, Adobe XD and Wix',
        cats=['Brand Identity', 'Posters & Campaigns', 'Editorial & Print', 'Digital & Outdoor'],
        mix=True,
        max_cards=9,
        why=[('One designer, start to finish', 'The person you brief is the person designing. No account managers.'),
             ('5+ years, 100+ projects', 'Experience across branding, campaigns, editorial and video.'),
             ('In Bangalore or remote', 'Meet in Bengaluru, or work fully online from anywhere.'),
             ('Ready-to-use files', 'Final files prepared for print, web and every social platform.')],
        faq=[('Are you an individual freelance graphic designer in Bangalore?',
              'Yes. I’m an independent graphic designer based in Bengaluru (Bangalore), Karnataka, not an agency. You '
              'work with me directly, in person in Bangalore or remotely.'),
             ('Can I hire you as a remote graphic designer?',
              'Yes. Most of my projects are remote. Briefs, feedback and final files all happen online, for clients in '
              'Bangalore, across India and abroad.'),
             ('What graphic design services do you offer?',
              'Branding and logo design, social media graphics, digital campaign creatives, posters and flyers, '
              'brochures, magazines and other print, and hoardings and web banners.'),
             ('Do you design social media creatives every month?',
              'Yes. I take on one-off designs as well as ongoing monthly social media and campaign work.'),
             ('How much experience do you have?',
              'More than 5 years and over 100 projects, including work for GreenMonk Energy Drink and Buddha-CEO '
              'Quantum Foundation.'),
             ('How do I hire you?',
              f'Use the Let’s Talk form on this page, message me on WhatsApp, or email {EMAIL} with your brief and deadline.')],
    ),
    dict(
        slug='freelance-video-editor-bangalore',
        title='Freelance Video Editor & AI Video Editor in Bangalore | Geetha Krishna',
        desc=('Hire Geetha Krishna, a freelance video editor and AI video editor in Bangalore (Bengaluru): reels, '
              'product films, motion graphics, AI video ads and UGC ads for brands. Remote worldwide too.'),
        eyebrow='Freelance video editor & AI video editor · Bangalore',
        h1='Freelance Video Editor & AI Video Editor in Bangalore',
        lede=('I’m Geetha Krishna, a freelance video editor and AI video editor based in Bengaluru with 5+ years and '
              '100+ projects. I edit reels, product films and motion graphics, and I create AI-generated video ads and '
              'UGC-style ads for brands in Bangalore, across India and worldwide.'),
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
             ('Do you do AI video editing in Bangalore?',
              'Yes. I create AI-generated product commercials and UGC-style ads from prompt-driven shots, then edit, '
              'caption and finish them like any other video.'),
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
        lede=('Looking for a freelance graphic designer? I’m Geetha Krishna, an independent graphic designer with 5+ years '
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
        title='Freelance Video Editor & AI Video Editor for Hire | Geetha Krishna',
        desc=('Hire Geetha Krishna, an independent freelance video editor and AI video editor: reels, YouTube videos, '
              'product films, motion graphics, AI video ads and UGC ads. Remote for clients worldwide.'),
        eyebrow='Independent freelance video editor & AI video editor · Remote worldwide',
        h1='Freelance Video Editor & AI Video Editor for Hire',
        lede=('Looking for a freelance video editor or an AI video editor? I’m Geetha Krishna, an independent video '
              'editor and graphic designer with 5+ years and 100+ projects. I edit Instagram reels, YouTube videos, '
              'product films and motion graphics, and I create AI-generated video ads and UGC-style ads for brands and '
              'creators worldwide, working with you directly.'),
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
             ('Are you also an AI video editor?',
              'Yes. Alongside regular editing, I create AI-generated product commercials and UGC-style ads, directing '
              'the AI shots and editing them into finished, captioned videos.'),
             ('Which video editing software do you use?',
              'Premiere Pro, After Effects and DaVinci Resolve, with Photoshop and Illustrator for graphics and thumbnails.'),
             ('Do you edit for international clients?',
              'Yes. I work remotely with brands and creators worldwide.'),
             ('How do I hire you for video editing?',
              f'Use the Let’s Talk form on this page, message me on WhatsApp, or email {EMAIL} with your footage, '
              'brief and deadline.')],
    ),
    dict(
        slug='ai-ugc-ads',
        title='AI UGC Ads Creator & AI Video Editor for Hire | Geetha Krishna',
        desc=('Hire Geetha Krishna to create AI UGC ads and AI video ads for your brand: AI-generated UGC-style ads, '
              'product commercials and ad variants, edited and captioned. Freelance, remote worldwide.'),
        eyebrow='AI UGC ads · AI video editing · Freelance',
        h1='AI UGC Ads & AI Video Editing',
        lede=('Need AI UGC ads for your brand? I’m Geetha Krishna, a freelance video editor and AI video editor based '
              'in Bengaluru. I create AI-generated UGC-style ads and product commercials, then edit them into finished '
              'ads with hooks, captions, music and colour, without a film shoot or hiring creators.'),
        service='AI UGC ads and AI video editing',
        place='for brands worldwide',
        services=[('AI UGC ads', 'Creator-style AI ads with a host, a strong hook and caption pacing.'),
                  ('AI product commercials', 'Prompt-driven product shots edited into short, polished commercials.'),
                  ('AI ad variants', 'Several hooks and cuts of one ad, ready to test on social.'),
                  ('AI + real footage edits', 'AI shots combined with your real product footage and graphics.'),
                  ('Captions & motion graphics', 'Animated captions, titles and graphics that keep viewers watching.'),
                  ('Exports for every platform', 'Vertical, square and wide versions for Reels, Shorts and ads.')],
        tools='Premiere Pro, After Effects and DaVinci Resolve, with AI video generation tools',
        cats=['Video & Motion'],
        max_cards=6,
        ai_first=True,
        why=WHY_FREELANCER,
        process=[('Share your product', 'Send product photos, your brief, references and deadline.'),
                 ('AI shots', 'I direct and generate the AI product shots or UGC-style scenes.'),
                 ('Edit', 'I edit everything with pacing, captions, music and colour.'),
                 ('Final export', 'You get finished ads sized for every platform.')],
        faq=[('What are AI UGC ads?',
              'AI UGC ads are user-generated-content style video ads, like a creator talking about a product, made '
              'with AI video generation instead of filming real creators. They are fast to make and easy to test in '
              'several versions.'),
             ('What is an AI video editor?',
              'An AI video editor uses AI video generation for shots or scenes, then edits them like regular footage: '
              'pacing, captions, music, colour and exports.'),
             ('What AI videos have you made?',
              'AI-generated skincare commercials for New Day Organics and an AI UGC-style ad for a magnetic tool mat. '
              'See the projects on this page.'),
             ('Can you make AI UGC ads for my brand?',
              'Yes. Send your product photos and brief, and I’ll create UGC-style AI ads with hooks and captions.'),
             ('Do you also edit normal video footage?',
              'Yes. I’m a freelance video editor too: reels, YouTube videos, product films and motion graphics.'),
             ('Do you work with clients outside Bangalore and India?',
              'Yes. I work remotely with brands worldwide.'),
             ('How do I start an AI video project?',
              f'Use the Let’s Talk form on this page, message me on WhatsApp, or email {EMAIL} with your product, '
              'brief and deadline.')],
    ),
    # "freelancer in Bangalore" / "individual freelancer in Bangalore": one person, every creative skill
    dict(
        slug='freelancer-bangalore',
        title='Individual Freelancer in Bangalore: Designer, Video Editor & UI | Geetha Krishna',
        desc=('Geetha Krishna is an individual freelancer in Bangalore (Bengaluru): graphic design, logos, social '
              'media, video editing, AI UGC ads and UI design. One person, direct communication, no agency.'),
        eyebrow='Individual freelancer · Bangalore (Bengaluru)',
        h1='Individual Freelancer in Bangalore',
        lede=('Looking for a freelancer in Bangalore? I’m Geetha Krishna, an individual freelance graphic designer, '
              'video editor and UI designer based in Bengaluru with 5+ years and 100+ projects. One person for your '
              'logo, social media, posters, print, videos, AI UGC ads and web or app screens, working with you '
              'directly, in Bangalore or remotely.'),
        service='Freelance design and editing',
        place='in Bangalore',
        services=[('Graphic design', 'Logos, brand identity, posters, social media creatives and print.'),
                  ('Video editing', 'Reels, YouTube videos, product films and motion graphics.'),
                  ('AI video & AI UGC ads', 'AI-generated product commercials and UGC-style ads, edited and captioned.'),
                  ('UI & web design', 'App and website screens in Figma and Adobe XD, and Wix website updates.'),
                  ('Editorial & print', 'Magazines, brochures, flyers, standees and menu cards.'),
                  ('Banners & hoardings', 'Web banners, billboards and hoardings in every size.')],
        tools='Photoshop, Illustrator, Figma, Adobe XD, Wix, Premiere Pro, After Effects and DaVinci Resolve',
        cats=['Brand Identity', 'Posters & Campaigns', 'Video & Motion', 'Editorial & Print', 'Digital & Outdoor'],
        mix=True,
        max_cards=9,
        why=WHY_FREELANCER, process=PROCESS,
        faq=[('Are you an individual freelancer in Bangalore?',
              'Yes. I’m an individual freelancer based in Bengaluru (Bangalore), not an agency. You work with me '
              'directly, in person in Bangalore or remotely.'),
             ('What can I hire you for?',
              'Graphic design (logos, branding, posters, social media, print), video editing (reels, YouTube, product '
              'films, motion graphics), AI video and AI UGC ads, and UI and web design.'),
             ('Why hire an individual freelancer instead of an agency?',
              'You talk to the person doing the work, feedback is faster, and one freelancer can cover design, video '
              'and UI so your brand looks consistent everywhere.'),
             ('Do you take small one-off projects?',
              'Yes. A single logo, poster or reel is fine, and so is ongoing monthly work.'),
             ('Are you open to full-time or part-time roles in Bangalore?',
              'Yes. Alongside freelance projects, I’m open to full-time, part-time and contract roles, on-site in '
              'Bengaluru or remote.'),
             ('How do I contact you?',
              f'Use the Let’s Talk form on this page, message me on WhatsApp, or email {EMAIL} with your brief and deadline.')],
    ),
    dict(
        slug='ui-designer-bangalore',
        title='Freelance UI Designer & Web Designer in Bangalore | Geetha Krishna',
        desc=('Hire Geetha Krishna, a freelance UI designer and web designer in Bangalore (Bengaluru): app and website '
              'screens in Figma and Adobe XD, Wix websites, web banners and visual design.'),
        eyebrow='Freelance UI & web designer · Bangalore',
        h1='Freelance UI Designer in Bangalore',
        lede=('I’m Geetha Krishna, a graphic and web designer in Bengaluru who also designs UI. I’ve designed UI '
              'screens for GreenMonk Energy Drink and handle web design updates for Buddha-CEO Quantum Foundation. '
              'With a strong visual design background, I design app and website screens, landing pages and web '
              'banners that look on-brand and are easy to use.'),
        service='Freelance UI and web design',
        place='in Bangalore',
        services=[('App & website UI', 'Clean, on-brand screens for apps and websites, designed in Figma or Adobe XD.'),
                  ('Landing pages', 'Single-page layouts for launches, campaigns and lead generation.'),
                  ('Wix websites', 'Website updates, new pages and layouts built on Wix.'),
                  ('Prototypes', 'Clickable Figma and Adobe XD prototypes to test flows before building.'),
                  ('Web banners & ads', 'Web banners, leaderboards and display ads in every size.'),
                  ('Visual design', 'Icons, illustrations and graphics that match your brand.')],
        tools='Figma, Adobe XD, Wix, Photoshop and Illustrator',
        cats=['Digital & Outdoor'],
        max_cards=4,
        faq=[('Are you a freelance UI designer in Bangalore?',
              'Yes. I’m a freelance designer in Bengaluru (Bangalore) who designs UI and websites alongside graphic '
              'design and video, in person or remotely.'),
             ('Which UI design tools do you use?',
              'Figma and Adobe XD for UI design and prototypes, Wix for websites, and Photoshop and Illustrator for graphics.'),
             ('What UI and web work have you done?',
              'UI screens for GreenMonk Energy Drink, ongoing web design updates for Buddha-CEO Quantum Foundation, '
              'and web banners for campaigns such as Klay admissions.'),
             ('Can you design both the UI and the graphics for my brand?',
              'Yes. Because I’m also a graphic designer, the screens, logo, social media and ads can all match.'),
             ('How do I start a UI project?',
              f'Use the Let’s Talk form on this page, message me on WhatsApp, or email {EMAIL} with your app or '
              'website idea, references and deadline.')],
    ),
    # "remote graphic designer" / "remote freelance designer Bangalore / India"
    dict(
        slug='remote-graphic-designer',
        title='Remote Graphic Designer & Video Editor from Bangalore, India | Geetha Krishna',
        desc=('Hire Geetha Krishna, a remote freelance graphic designer and video editor based in Bangalore, India: '
              'logos, branding, social media, reels and AI UGC ads for clients anywhere, delivered online.'),
        eyebrow='Remote freelance designer · Bangalore, India · Worldwide',
        h1='Remote Graphic Designer from Bangalore',
        lede=('Need a remote graphic designer? I’m Geetha Krishna, a freelance graphic designer and video editor based '
              'in Bengaluru (Bangalore), India, with 5+ years and 100+ projects. I work remotely with startups, small '
              'businesses, agencies and brands across India and worldwide: brief, feedback and final files all happen '
              'online.'),
        service='Remote graphic design and video editing',
        place='for clients anywhere',
        services=[('Logo design & branding', 'Logos and brand identities, delivered as ready-to-use files.'),
                  ('Social media creatives', 'Posts, stories and ad creatives, one-off or every month.'),
                  ('Posters, print & editorial', 'Posters, brochures, magazines and menus, print-ready.'),
                  ('Video editing', 'Reels, YouTube videos, product films and motion graphics.'),
                  ('AI video & AI UGC ads', 'AI-generated product commercials and UGC-style ads.'),
                  ('UI & web design', 'App and website screens in Figma and Adobe XD, and Wix updates.')],
        tools='Photoshop, Illustrator, Figma, Adobe XD, Wix, Premiere Pro, After Effects and DaVinci Resolve',
        cats=['Brand Identity', 'Posters & Campaigns', 'Video & Motion', 'Editorial & Print', 'Digital & Outdoor'],
        mix=True,
        max_cards=9,
        why=WHY_FREELANCER,
        process=[('Share your brief online', 'Send your brief, references and deadline by email, WhatsApp or the form.'),
                 ('Concepts', 'I share first directions online for your feedback.'),
                 ('Refine', 'We polish the chosen direction together over chat or calls.'),
                 ('Final files', 'You get production-ready files by link, in every format you need.')],
        faq=[('Do you work as a remote graphic designer?',
              'Yes. I’m a freelance graphic designer and video editor based in Bangalore, India, and most of my projects '
              'are remote, for clients across India and worldwide.'),
             ('Which time zone are you in?',
              'India Standard Time (IST, UTC+5:30). I share updates by email and WhatsApp, and we can schedule calls '
              'that suit your time zone.'),
             ('Can I hire you remotely from outside India?',
              'Yes. Briefs, feedback, calls and file delivery all happen online, so I can work with you from anywhere.'),
             ('Are you open to remote full-time or part-time roles?',
              'Yes. Alongside freelance projects, I’m open to remote full-time, part-time and contract roles, or on-site '
              'in Bengaluru.'),
             ('What can I hire you for remotely?',
              'Logos and branding, social media creatives, posters and print, video editing, AI video and AI UGC ads, '
              'and UI and web design.'),
             ('How do I start a remote project?',
              f'Use the Let’s Talk form on this page, message me on WhatsApp, or email {EMAIL} with your brief and deadline.')],
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
.gk-lp-related li{max-width:100%}.gk-lp-related a{white-space:normal;max-width:100%;text-align:left;height:auto}
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


def cat_link(cat, label):
    return f'<a href="/work?category={quote(cat)}" style="color:#a78bfa">{esc(label)}</a>'


def bangalore_main(p, grid, faq, related):
    """Long-form page for /freelance-graphic-designer-bangalore, sections in the order the brief asks for.
    Facts only from the site: 5+ years, 100+ projects, real employers/clients and tools."""
    def sec(title, body):
        return f'<section class="gk-lp-sec"><h2>{esc(title)}</h2>{body}</section>'

    def text(*paras):
        gap = ' style="margin-top:14px"'
        return ''.join('<p class="gk-lp-text"' + (gap if i else '') + f'>{x}</p>' for i, x in enumerate(paras))

    def cards(items):
        return '<ul class="gk-lp-services">' + ''.join(f'<li><h3>{esc(t)}</h3><p>{esc(d)}</p></li>' for t, d in items) + '</ul>'

    cta = ('<div class="gk-lp-ctas" style="margin-top:18px">'
           f'<a class="gk-btn gk-btn-primary" data-gk-talk href="mailto:{EMAIL}?subject=Project%20enquiry">Let’s Talk</a>'
           f'<a class="gk-btn gk-btn-ghost" href="{WA}" target="_blank" rel="noopener">WhatsApp</a>'
           f'<a class="gk-btn gk-btn-ghost" href="mailto:{EMAIL}">Email</a>'
           f'<a class="gk-btn gk-btn-ghost" href="{LINKEDIN}" target="_blank" rel="noopener noreferrer">LinkedIn</a></div>')
    link = 'style="color:#a78bfa"'
    return (
        '<main class="main gk-work-main">'
        # 1. Freelance Graphic Designer in Bangalore (hero)
        '<section class="gk-work-head">'
        f'<p class="gk-lp-eyebrow">{esc(p["eyebrow"])}</p>'
        f'<h1 class="gk-work-h1" style="font-size:clamp(44px,6.4vw,96px)">{esc(p["h1"])}</h1>'
        f'<p class="gk-work-lede">{esc(p["lede"])}</p>'
        '<div class="gk-lp-ctas">'
        f'<a class="gk-btn gk-btn-primary" data-gk-talk href="mailto:{EMAIL}?subject=Project%20enquiry">Hire me</a>'
        f'<a class="gk-btn gk-btn-ghost" href="{WA}" target="_blank" rel="noopener">WhatsApp</a>'
        '<a class="gk-btn gk-btn-ghost" href="/work">See all work</a></div></section>'
        '<div class="gk-lp">'
        '<section class="gk-lp-sec"><ul class="gk-lp-facts">'
        '<li><b>5+</b>years</li><li><b>100+</b>projects</li><li><b>Bengaluru</b>Bangalore based</li>'
        '<li><b>Remote</b>India and worldwide</li></ul></section>'
        # 2. About
        + sec('About Geetha Krishna', text(
            'I’m Geetha Krishna, an independent graphic designer based in Bengaluru (Bangalore), Karnataka. I’ve spent '
            'the last 5+ years designing brand identities, campaign posters, social media creatives, magazines and '
            'video content, across more than 100 projects.',
            'I started as a graphic designer intern at Pixel Scoop Studios in 2021, then worked as graphic designer and '
            'content creator for GreenMonk Energy Drink, designing product posters, creatives and UI screens. Since '
            '2023 I’ve been the graphic and web designer for Buddha-CEO Quantum Foundation, creating flyers, brochures, '
            f'standees, banners, magazines and books. <a href="/about" {link}>More about me</a>.'))
        # 3. Independent services
        + sec('Independent Graphic Design Services', text(
            'When you hire me you work with one designer from the first brief to the final files, not an agency team. '
            'That keeps communication simple, feedback quick and your brand consistent everywhere it appears.')
            + '<div style="margin-top:22px">' + cards(p['services']) + '</div>')
        # 4. Remote
        + sec('Remote Graphic Design Services', text(
            'Most of my projects run remotely. Briefs, feedback and file delivery all happen online, so I can work with '
            'businesses across Bangalore, the rest of India and abroad. I’m on India Standard Time (IST) and share '
            'progress by email and WhatsApp, with calls planned around your schedule.',
            f'Read more about <a href="/remote-graphic-designer" {link}>working with me remotely</a>.'))
        # 5. Branding
        + sec('Branding and Visual Identity', text(
            'A brand needs a mark that is easy to remember and a look that stays consistent. I design logos, emblems and '
            'identity systems, from the leaping-fish mark for the seafood brand Coastal Cravings to crest logos for '
            'GK Constructions and marks for BeSuperMind and Brand Visit, then carry them onto signage, menus and social '
            'media.',
            f'See the {cat_link("Brand Identity", "brand identity projects")} or the '
            f'<a href="/freelance-logo-designer" {link}>freelance logo design</a> page.'))
        # 6. Social & digital campaigns
        + sec('Social Media and Digital Campaign Design', text(
            'For campaigns I design the key visual first, then adapt it into posts, stories, web banners and '
            'leaderboards so every placement feels like one campaign. My work here includes the GreenMonk Energy Drink '
            'poster series, event and club-night flyers, and a school admissions campaign that ran across a hoarding, '
            'web banners and a leaderboard.',
            f'See the {cat_link("Posters & Campaigns", "poster and campaign projects")} and '
            f'{cat_link("Digital & Outdoor", "digital and outdoor work")}.'))
        # 7. Print
        + sec('Posters, Brochures and Print Design', text(
            'Print has to look right at full size, so I prepare every file with correct dimensions, bleed and colour. '
            'I design posters, brochures, flyers, standees, menu cards and magazines, including covers and inner '
            'layouts for the Buddha-CEO magazines and print-ready menus for Coastal Cravings.',
            f'See the {cat_link("Editorial & Print", "editorial and print projects")}.'))
        # 8. Selected portfolio
        + sec('Selected Portfolio Projects', '') + '</div>'
        f'<section class="gk-work-grid-wrap"><ul class="gk-work-grid">{grid}</ul>'
        '<p class="gk-lp-more"><a class="gk-btn gk-btn-ghost" href="/work">See all projects</a></p></section>'
        '<div class="gk-lp">'
        # 9. Why
        + sec('Why Work With Me', cards(p['why']))
        # 10. FAQ
        + sec('Frequently Asked Questions', f'<div class="gk-lp-faq">{faq}</div>')
        # 11. Contact
        + sec('Contact and Hire Me', text(
            'Tell me what you need, who it is for and when you need it. Send a brief by email, message me on WhatsApp, '
            f'or use the Let’s Talk form and I’ll reply with next steps. Email: <a href="mailto:{EMAIL}" {link}>{EMAIL}</a>.')
            + cta)
        + f'<section class="gk-lp-sec"><h2>Related services</h2><ul class="gk-lp-related">{related}</ul></section>'
        '</div></main>')


def build(p):
    h = shell
    items = [w for w in work if w['category'] in p['cats']]
    if p.get('mix'):  # round-robin across categories so every skill shows
        pools = [[w for w in items if w['category'] == c] for c in p['cats']]
        items = [pool[i] for i in range(max(map(len, pools))) for pool in pools if i < len(pool)]
    if p.get('ai_first'):
        items.sort(key=lambda w: not w.get('ai'))
    items = items[:p['max_cards']]
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
        f'<section class="gk-lp-sec"><h2>{esc(p["service"][:1].upper() + p["service"][1:])} services {esc(p["place"])}</h2>'
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
    if p.get('long'):
        main = bangalore_main(p, grid, faq, related)
    # project card titles sit under a section h2 here, so they are h3 (styled by class, looks the same)
    main = main.replace('<h2 class="gk-w-title">', '<h3 class="gk-w-title">').replace(
        '</a></h2><p class="gk-w-meta">', '</a></h3><p class="gk-w-meta">')
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
         'jobTitle': 'Independent Freelance Graphic Designer', 'url': SITE + '/', 'email': EMAIL,
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
FOOTER = [('freelance-graphic-designer-bangalore', 'Freelance Graphic Designer, Bangalore'),
          ('freelancer-bangalore', 'Freelancer in Bangalore'),
          ('freelance-graphic-designer', 'Hire a Freelance Designer'),
          ('freelance-video-editor', 'Freelance Video Editor'),
          ('ai-ugc-ads', 'AI UGC Ads')]
LINKS = ''.join(f'<a href="/{slug}" class="policy-link">{esc(label)}</a>' for slug, label in FOOTER)
n = 0
for f in glob.glob(os.path.join(SP, '*.html')) + glob.glob(os.path.join(SP, 'work', '*.html')):
    h = open(f, encoding='utf-8').read()
    if 'policy-link">Freelance Graphic Designer, Bangalore</a><a href="/freelancer-bangalore"' in h:
        continue
    # replace any older set of landing-page footer links
    h = re.sub(r'(<div class="footer-policy-links">)(?:<a href="/(?:freelance|ai)-[a-z-]+" class="policy-link">[^<]*</a>)+',
               r'\1', h)
    o = '<div class="footer-policy-links">'
    if o in h:
        h = h.replace(o, o + LINKS, 1)
        open(f, 'w', encoding='utf-8', newline='').write(h)
        n += 1
print(f'landing: footer links added on {n} pages')
