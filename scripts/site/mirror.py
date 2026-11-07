"""Mirror superconscious-app.webflow.io into public/gk with all assets localized."""
import hashlib, os, re, sys, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor

OUT = sys.argv[1]  # e.g. <repo>/public/gk
BASE = "https://superconscious-app.webflow.io"
PAGES = {"/": "index.html", "/mission": "mission.html"}
PREFIX = "/gk/"
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130 Safari/537.36"}
URL_RE = re.compile(r'https://(?:cdn\.prod\.website-files\.com|d3e54v103j8qbb\.cloudfront\.net|cdn\.jsdelivr\.net|dl\.dropboxusercontent\.com|ajax\.googleapis\.com)/[^\s"\'()<>,]+')

def fetch(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read()

def local_name(url):
    p = urllib.parse.urlparse(url)
    path = urllib.parse.unquote(p.path)
    base = os.path.basename(path) or "file"
    base = re.sub(r"[^A-Za-z0-9._-]", "_", base)
    if p.netloc == "dl.dropboxusercontent.com":
        return "media/" + base
    if "particles-js.txt" in base:
        base = base.replace(".txt", ".js")
    h = hashlib.md5(url.encode()).hexdigest()[:6] if p.query and p.netloc != "d3e54v103j8qbb.cloudfront.net" else ""
    ext = os.path.splitext(base)[1].lower()
    folder = {".css": "css", ".js": "js", ".json": "lottie", ".woff": "fonts", ".woff2": "fonts", ".ttf": "fonts", ".otf": "fonts"}.get(ext, "images")
    return f"{folder}/{h + '_' if h else ''}{base}"

done = {}

def get(url):
    url = url.replace("&amp;", "&")
    if url in done:
        return done[url]
    name = local_name(url)
    done[url] = name
    dest = os.path.join(OUT, name)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    if not os.path.exists(dest):
        fetch_url = url.replace("dl=0", "dl=1") if "dropbox" in url else url
        try:
            data = fetch(fetch_url)
        except Exception as e:
            print("FAIL", url, e)
            return name
        if name.endswith(".css"):
            data = rewrite(data.decode("utf-8"), css_base=url).encode()
        with open(dest, "wb") as f:
            f.write(data)
    return name

def rewrite(text, css_base=None):
    urls = set(m.group(0) for m in URL_RE.finditer(text))
    if css_base:  # relative url(...) in CSS
        for m in re.finditer(r'url\(["\']?([^"\')]+)["\']?\)', text):
            u = m.group(1)
            if not u.startswith(("data:", "http", "#")):
                urls.add(urllib.parse.urljoin(css_base, u))
                text = text.replace(m.group(0), f'url("{urllib.parse.urljoin(css_base, u)}")')
    clean = {u.replace("&amp;", "&"): u for u in urls}
    with ThreadPoolExecutor(16) as ex:
        names = dict(zip(clean, ex.map(get, clean)))
    for u in sorted(clean, key=len, reverse=True):
        text = text.replace(clean[u], PREFIX + names[u])
    return text

for route, fname in PAGES.items():
    html = fetch(BASE + route).decode("utf-8")
    html = re.sub(r'\s(integrity|crossorigin)="[^"]*"', "", html)
    html = rewrite(html)
    html = html.replace('href="/mission"', 'href="/mission"')
    with open(os.path.join(OUT, fname), "w") as f:
        f.write(html)
    print("page", route, len(html))
print("assets", len(done))
