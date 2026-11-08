// 404 for unknown /p/* pages. The route handlers check names themselves (dynamicParams = true) so the
// dev server doesn't re-run generateStaticParams on every request; production still prerenders every page.
export function notFoundResponse() {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="robots" content="noindex,follow"/>
<title>Page not found | Geetha Krishna</title></head>
<body style="margin:0;min-height:100dvh;display:grid;place-content:center;gap:20px;padding:48px 20px;background:#0c0b0c;color:#f4f2f6;font-family:system-ui,sans-serif;text-align:center">
<h1 style="margin:0;font-size:32px">Page not found</h1>
<p style="margin:0;opacity:.7">That page doesn't exist or has moved.</p>
<p style="margin:0;display:flex;gap:12px;justify-content:center">
<a href="/" style="padding:13px 22px;border-radius:12px;background:#f4f2f6;color:#0c0b0c;font-weight:600;text-decoration:none">Home</a>
<a href="/work" style="padding:13px 22px;border-radius:12px;border:1px solid rgba(244,242,246,.3);color:#f4f2f6;font-weight:600;text-decoration:none">See work</a></p>
</body></html>`;
  return new Response(html, { status: 404, headers: { "content-type": "text/html; charset=utf-8" } });
}
