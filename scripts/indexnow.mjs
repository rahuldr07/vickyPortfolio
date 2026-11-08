// Tell Bing, Yandex, Seznam, Naver (IndexNow) that the site's pages changed. Bing's index also feeds
// ChatGPT search, DuckDuckGo and Yahoo. Run after each deploy:
//   node scripts/indexnow.mjs https://your-domain.com
const KEY = "0b582ffe8f4556a96f6a96b75460784c"; // public/0b582ffe8f4556a96f6a96b75460784c.txt proves we own the key

const site = (process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
if (!/^https:\/\//.test(site)) {
  console.error("Usage: node scripts/indexnow.mjs https://your-domain.com");
  process.exit(1);
}
const xml = await (await fetch(site + "/sitemap.xml")).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urls.length) { console.error("No URLs found in " + site + "/sitemap.xml"); process.exit(1); }
const host = new URL(site).host;
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key: KEY, keyLocation: site + "/" + KEY + ".txt", urlList: urls }),
});
console.log("IndexNow:", res.status, res.statusText, "-", urls.length, "URLs submitted for", host);
