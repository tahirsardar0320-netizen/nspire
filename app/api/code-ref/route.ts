import { NextRequest, NextResponse } from 'next/server';

// Every NSPIRE code in a generated report links here so the inspector can read
// the full standard behind the short code. The route was referenced by
// nspirePDFService but never created, so all of those links 404'd.

// Both values arrive from the query string and are rendered into HTML, so they
// are escaped rather than interpolated raw.
function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = escapeHtml((searchParams.get('code') || '').slice(0, 200));
  const reference = escapeHtml((searchParams.get('ref') || '').slice(0, 20000));

  const body = reference
    ? `<p class="ref">${reference.replace(/\n/g, '<br>')}</p>`
    : `<p class="empty">No reference text was provided for this code.</p>`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${code || 'NSPIRE Code'} — NSPIRE Reference</title>
<style>
  :root { color-scheme: light dark; }
  body {
    margin: 0; padding: 32px 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: #E8F4F8; color: #1F2937; line-height: 1.6;
  }
  .card {
    max-width: 760px; margin: 0 auto; background: #fff;
    border-radius: 16px; padding: 28px 32px;
    box-shadow: 0 4px 24px rgba(0,0,0,.08);
  }
  .label { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: #6B7280; font-weight: 700; }
  h1 { margin: 6px 0 20px; font-size: 26px; color: #0E7490; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; word-break: break-word; }
  .ref { margin: 0; font-size: 15px; white-space: pre-wrap; }
  .empty { margin: 0; font-size: 15px; color: #6B7280; font-style: italic; }
  @media (prefers-color-scheme: dark) {
    body { background: #0F172A; color: #E2E8F0; }
    .card { background: #1E293B; box-shadow: none; }
    h1 { color: #38BDF8; }
    .label { color: #94A3B8; }
    .empty { color: #94A3B8; }
  }
</style>
</head>
<body>
  <div class="card">
    <div class="label">NSPIRE Code</div>
    <h1>${code || '—'}</h1>
    ${body}
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // Purely a function of the query string, so it is safe to cache.
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
