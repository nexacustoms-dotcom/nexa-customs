#!/usr/bin/env node
// Regenerate sitemap.xml from LIVE Supabase data — excludes disabled products
// and includes custom pages (blog posts etc.) automatically.
//   node scripts/generate-sitemap.mjs

import { readFileSync, writeFileSync } from "fs";
import { DOMAIN, loadDefaults, fetchProductOverrides, fetchConfig, mergeProducts, isPublishable } from "./lib/live-data.mjs";

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

const { cats, prods: defaultProds } = loadDefaults(".");

console.log("📡 Fetching live product / page status from Supabase...");
let overrides, customPages, hiddenCats = new Set();
try {
  overrides = await fetchProductOverrides();
  const cp = await fetchConfig("custom_pages");
  const catCfg = await fetchConfig("categories");
  hiddenCats = new Set((Array.isArray(catCfg) ? catCfg : Object.values(catCfg || {})).filter(c => c?.hidden).map(c => c.id));
  customPages = Array.isArray(cp) ? cp : [];
  console.log(`✅ Loaded ${Object.keys(overrides).length} product overrides, ${customPages.length} custom pages`);
} catch (e) {
  // Never replace a good sitemap with one built from outdated code defaults.
  console.warn(`⚠️  Could not reach Supabase (${e.message}) — keeping the existing Public/sitemap.xml unchanged.`);
  process.exit(0);
}
const prods = mergeProducts(defaultProds, overrides);

const urls = [];
urls.push(`  <!-- ═══ Core pages ═══ -->`);
CORE_PAGES.forEach(([path, pr, cf]) => urls.push(url(`${DOMAIN}${path}`, pr, cf)));

urls.push(`  <!-- ═══ Category pages ═══ -->`);
cats.filter(c => !hiddenCats.has(c.id)).forEach(c => urls.push(url(`${DOMAIN}/products/${c.id}`, "0.8", "weekly")));

urls.push(`  <!-- ═══ Product pages (hidden and unfinished products excluded) ═══ -->`);
let skipped = 0, adminAdded = 0, listed = 0;
prods.forEach(p => {
  if (!isPublishable(p)) { skipped++; return; }
  urls.push(url(`${DOMAIN}/products/${p.cat}/${p.id}`, "0.7", "monthly"));
  listed++;
  if (p._adminCreated) adminAdded++;
});
if (adminAdded) console.log(`   + ${adminAdded} product(s) you created in Admin included`);

if (customPages.length) {
  urls.push(`  <!-- ═══ Custom pages ═══ -->`);
  customPages.forEach(p => urls.push(url(`${DOMAIN}/blog/${p.slug}`, "0.5", "monthly")));
}

// Location + service landing pages — read straight from the page file so a
// new page is never missed, and listed even when there are no blog pages.
{
  const locSrc = readFileSync(new URL("../src/pages/LocationServicePage.jsx", import.meta.url), "utf8");
  const locSlugs = [...locSrc.matchAll(/^\s{2}'([a-z0-9-]+)':/gm)].map(m => m[1]);
  urls.push(`  <!-- ═══ Location & service pages ═══ -->`);
  locSlugs.forEach(slug => urls.push(url(`${DOMAIN}/${slug}`, "0.6", "monthly")));
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls.join("\n")}

</urlset>`;

writeFileSync("Public/sitemap.xml", xml, "utf8");
console.log(`\n✅ Generated sitemap.xml`);
console.log(`   ${CORE_PAGES.length} core pages, ${cats.length} categories, ${listed} active products (${skipped} hidden/unfinished products excluded), ${customPages.length} custom pages`);
