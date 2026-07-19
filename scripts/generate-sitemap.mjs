#!/usr/bin/env node
// Regenerate sitemap.xml from LIVE Supabase data — excludes disabled products
// and includes custom pages (blog posts etc.) automatically.
//   node scripts/generate-sitemap.mjs

import { readFileSync, writeFileSync } from "fs";

const DOMAIN   = "https://nexacustoms.ca";
const SUPA_URL = "https://eogypbrsjfgurrobjomn.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZ3lwYnJzamZndXJyb2Jqb21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjYyODMsImV4cCI6MjA5MjgwMjI4M30.ajlCEo-TKn6qyi4GCfYNOeEpLpp5-MoJoFCKkGuRAzg";

const today = new Date().toISOString().slice(0, 10);

const CORE_PAGES = [
  ["/",           "1.0", "weekly"],
  ["/products",   "0.9", "weekly"],
  ["/about",      "0.6", "monthly"],
  ["/quote",      "0.7", "monthly"],
  ["/contact",    "0.6", "monthly"],
  ["/faq",        "0.5", "monthly"],
  ["/shipping",   "0.4", "monthly"],
  ["/returns",    "0.4", "monthly"],
  ["/terms",      "0.3", "yearly"],
  ["/privacy",    "0.3", "yearly"],
  ["/turnaround", "0.5", "monthly"],
];

const url = (loc, priority, changefreq) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

// Read local defaults
const src = readFileSync("src/data/products.js", "utf8");
const cs  = src.indexOf("export const DEFAULT_CATS = [");
let cd = 0, cb = src.indexOf("[", cs), ce = cb;
for (let j = cb; j < src.length; j++) { if (src[j] === "[") cd++; else if (src[j] === "]") { cd--; if (cd === 0) { ce = j + 1; break; } } }
const cats = eval(src.slice(cb, ce));

const ps = src.indexOf("export const DEFAULT_PRODS = [");
let pd = 0, pb = src.indexOf("[", ps), pe = pb;
for (let j = pb; j < src.length; j++) { if (src[j] === "[") pd++; else if (src[j] === "]") { pd--; if (pd === 0) { pe = j + 1; break; } } }
const prods = eval(src.slice(pb, pe));

console.log("📡 Fetching live product / page status from Supabase...");
let overrides = {};
let customPages = [];
try {
  const [pr, cpr] = await Promise.all([
    fetch(`${SUPA_URL}/rest/v1/site_config?id=eq.products&select=data`, { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }),
    fetch(`${SUPA_URL}/rest/v1/site_config?id=eq.custom_pages&select=data`, { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }),
  ]);
  const pdata = await pr.json();
  const rawData = pdata[0]?.data || {};
  Object.values(rawData).forEach(p => { if (p?.id) overrides[p.id] = p; });

  const cpdata = await cpr.json();
  customPages = Array.isArray(cpdata[0]?.data) ? cpdata[0].data : [];
  console.log(`✅ Loaded ${Object.keys(overrides).length} product overrides, ${customPages.length} custom pages`);
} catch (e) {
  console.warn("⚠️  Could not fetch Supabase data — using local product list only, no custom pages included");
}

const urls = [];
urls.push(`  <!-- ═══ Core pages ═══ -->`);
CORE_PAGES.forEach(([path, pr, cf]) => urls.push(url(`${DOMAIN}${path}`, pr, cf)));

urls.push(`  <!-- ═══ Category pages ═══ -->`);
cats.forEach(c => urls.push(url(`${DOMAIN}/products/${c.id}`, "0.8", "weekly")));

urls.push(`  <!-- ═══ Product pages (disabled products excluded) ═══ -->`);
let skipped = 0;
prods.forEach(p => {
  const merged = { ...p, ...(overrides[p.id] || {}) };
  if (merged.disabled) { skipped++; return; }
  urls.push(url(`${DOMAIN}/products/${p.cat}/${p.id}`, "0.7", "monthly"));
});

if (customPages.length) {
  urls.push(`  <!-- ═══ Custom pages ═══ -->`);
  customPages.forEach(p => urls.push(url(`${DOMAIN}/blog/${p.slug}`, "0.5", "monthly")));
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls.join("\n")}

</urlset>`;

writeFileSync("Public/sitemap.xml", xml, "utf8");
console.log(`\n✅ Generated sitemap.xml`);
console.log(`   ${CORE_PAGES.length} core pages, ${cats.length} categories, ${prods.length - skipped} active products (${skipped} disabled products excluded), ${customPages.length} custom pages`);
console.log(`\nNext: git add Public/sitemap.xml && git commit -m "update: regenerate sitemap, exclude disabled products" && git push`);
