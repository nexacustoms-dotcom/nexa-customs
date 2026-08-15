// scripts/prerender.mjs
//
// Runs after `vite build`. Spins up the built site locally, visits every
// public route in a real (headless) browser, waits for content to paint,
// and writes the resulting HTML to dist/<route>/index.html.
//
// Why: this site is a pure client-rendered SPA (dist/index.html is an empty
// shell — <div id="root"></div> plus script tags). Search engine crawlers
// that don't fully execute + wait on JS (or time out waiting on the
// Supabase fetch) see an empty page, which is the most likely cause of the
// "Crawled - currently not indexed" status on real pages like /about,
// /products, and /products/stationery/notepads in Search Console.
//
// After this script runs, each of those routes has a real static HTML file
// on disk. Vercel serves a matching static file before falling back to the
// SPA rewrite (see vercel.json), so crawlers get full content immediately,
// while real visitors still get the same file and then React quietly
// takes over the page exactly as it does today (main.jsx uses
// createRoot().render(), not hydrateRoot(), so there's no hydration
// mismatch risk — React just re-renders over the prerendered markup).
//
// Blog post slugs are fetched live from Supabase (same source the site
// itself reads from) so newly published posts get prerendered automatically
// on every build. If that fetch fails (no env vars, no network), it falls
// back to the known slugs from scripts/seed-blog-posts.mjs so the build
// never breaks.

import { readFileSync, existsSync, mkdirSync, writeFileSync, unlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { preview } from 'vite';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;
const require = createRequire(import.meta.url);

// ── 1. Load categories + products straight from the same file the app uses ──
function loadProductData() {
  let src = readFileSync(join(ROOT, 'src/data/products.js'), 'utf8');
  src = src.replace(/export const/g, 'const') + ';module.exports = { DEFAULT_CATS, DEFAULT_PRODS };';
  const tmp = join(ROOT, '.prerender-products.cjs');
  writeFileSync(tmp, src);
  const mod = require(tmp);
  unlinkSync(tmp);
  return mod;
}

// ── 2. Location service page slugs ───────────────────────────────────────
function loadLocationSlugs() {
  const src = readFileSync(join(ROOT, 'src/pages/LocationServicePage.jsx'), 'utf8');
  const matches = [...src.matchAll(/^\s{2}'([a-z0-9-]+)':/gm)];
  return matches.map(m => m[1]);
}

// ── 3. Blog slugs — try Supabase first, fall back to the seed script ────
async function loadBlogSlugs() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/site_config?id=eq.custom_pages&select=data`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
      });
      const rows = await res.json();
      const data = rows?.[0]?.data;
      const pages = typeof data === 'string' ? JSON.parse(data) : data;
      if (Array.isArray(pages) && pages.length) {
        console.log(`[prerender] loaded ${pages.length} blog slugs from Supabase`);
        return pages.map(p => p.slug).filter(Boolean);
      }
    } catch (e) {
      console.warn('[prerender] Supabase blog fetch failed, falling back to seed list:', e.message);
    }
  } else {
    console.warn('[prerender] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set, using seed list for blog slugs');
  }
  const seedSrc = readFileSync(join(ROOT, 'scripts/seed-blog-posts.mjs'), 'utf8');
  return [...seedSrc.matchAll(/slug:\s*'([a-z0-9-]+)'/g)].map(m => m[1]);
}

// ── 4. Build the full route list ─────────────────────────────────────────
async function buildRoutes() {
  const { DEFAULT_CATS, DEFAULT_PRODS } = loadProductData();
  const locationSlugs = loadLocationSlugs();
  const blogSlugs = await loadBlogSlugs();

  const routes = [
    '/', '/about', '/products', '/contact', '/quote', '/blog',
    '/faq', '/shipping', '/returns', '/terms', '/privacy', '/turnaround',
  ];
  for (const cat of DEFAULT_CATS) routes.push(`/products/${cat.id}`);
  for (const prod of DEFAULT_PRODS) routes.push(`/products/${prod.cat}/${prod.id}`);
  for (const slug of locationSlugs) routes.push(`/${slug}`);
  for (const slug of blogSlugs) routes.push(`/blog/${slug}`);

  return [...new Set(routes)];
}

// ── 5. Serve the build, prerender each route, write it to disk ──────────
async function main() {
  const routes = await buildRoutes();
  console.log(`[prerender] ${routes.length} routes to render`);

  const previewServer = await preview({
    root: ROOT,
    preview: { port: PORT, strictPort: true },
    logLevel: 'warn',
  });
  console.log(`[prerender] preview server listening on ${BASE_URL}`);

  let browser;
  let ok = 0, failed = [];
  try {
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

    for (const route of routes) {
      const page = await browser.newPage();
      try {
        await page.goto(BASE_URL + route, { waitUntil: 'networkidle0', timeout: 30000 });
        // Give the Supabase override fetch a moment even if networkidle0 fired early
        await page.waitForFunction(
          () => document.querySelector('h1, h2') && document.body.innerText.trim().length > 80,
          { timeout: 8000 }
        ).catch(() => {}); // best-effort — still write whatever rendered
        const html = await page.content();

        const outDir = route === '/' ? DIST : join(DIST, route.slice(1));
        if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
        writeFileSync(join(outDir, 'index.html'), html);
        ok++;
      } catch (e) {
        failed.push(`${route}: ${e.message}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    if (browser) await browser.close();
    await previewServer.close();
  }

  console.log(`[prerender] done — ${ok}/${routes.length} routes written`);
  if (failed.length) {
    console.warn('[prerender] failed routes:\n' + failed.map(f => '  ' + f).join('\n'));
  }
  // Never fail the whole Vercel build over prerendering — worst case, those
  // routes just fall back to the normal client-rendered SPA shell as before.
  if (ok === 0 && routes.length > 0) {
    console.error('[prerender] 0 routes succeeded — check the failures above');
  }
}

main().catch(e => {
  console.error('[prerender] non-fatal error, continuing build without prerendered pages:', e);
  process.exit(0);
});
