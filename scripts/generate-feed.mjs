#!/usr/bin/env node
// Regenerate Google Merchant feed with LIVE images from Supabase:
//   node scripts/generate-feed.mjs

import { readFileSync, writeFileSync } from "fs";

const DOMAIN   = "https://nexacustoms.ca";
const SUPA_URL = "https://eogypbrsjfgurrobjomn.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZ3lwYnJzamZndXJyb2Jqb21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjYyODMsImV4cCI6MjA5MjgwMjI4M30.ajlCEo-TKn6qyi4GCfYNOeEpLpp5-MoJoFCKkGuRAzg";

const GLOBAL_FALLBACK = 'https://eogypbrsjfgurrobjomn.supabase.co/storage/v1/object/public/nexa-media/branding/1781759339502-jf75i43zsws.png';

const EXCLUDED = new Set([]);

const CAT_MAP = {
  // Numeric IDs from Google Product Taxonomy (more stable than text paths)
  "business-cards":   "5587",   // Office Supplies > Business Cards
  "flyers-postcards": "5587",   // Office Supplies > Business Cards (closest)
  "signs-banners":    "3559",   // Business & Industrial > Retail > Signage
  "vehicle-graphics": "3559",   // Business & Industrial > Retail > Signage
  "marketing":        "5587",   // Office Supplies > Business Cards (closest)
  "stationery":       "923",    // Office Supplies
  "restaurant":       "5587",   // Office Supplies
  "foam-boards":      "3559",   // Business & Industrial > Retail > Signage
  "labels-stickers":  "5876",   // Office Supplies > Labels & Tags > Stickers & Decals
  "real-estate":      "3559",   // Business & Industrial > Retail > Signage
  "calendars":        "612",    // Media > Calendars
  "posters-canvas":   "500044", // Arts & Entertainment > Artwork > Posters
};

const CAT_NAMES = {
  "business-cards":   "Business Cards",
  "flyers-postcards": "Flyers & Postcards",
  "signs-banners":    "Signs & Banners",
  "vehicle-graphics": "Vehicle Graphics",
  "marketing":        "Marketing Materials",
  "stationery":       "Business Stationery",
  "restaurant":       "Restaurant Printing",
  "foam-boards":      "Foam Boards & Displays",
  "labels-stickers":  "Labels & Stickers",
  "real-estate":      "Real Estate Signs",
  "calendars":        "Custom Calendars",
  "posters-canvas":   "Posters & Canvas Prints",
};

const esc = s => String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/\\/g,"");

function cleanImgUrl(url) {
  if (!url) return null;
  // Strip Supabase transform params — use raw file for Google (better compatibility)
  return url.split("?")[0];
}

// Read local products
const src = readFileSync("src/data/products.js", "utf8");
const start = src.indexOf("export const DEFAULT_PRODS = [");
let depth = 0, begin = src.indexOf("[", start), endIdx = begin;
for (let j = begin; j < src.length; j++) {
  if (src[j] === "[") depth++;
  else if (src[j] === "]") { depth--; if (depth === 0) { endIdx = j + 1; break; } }
}
const prods = eval(src.slice(begin, endIdx));

// Fetch live overrides from Supabase (has real images uploaded via Admin)
console.log("📡 Fetching product images from Supabase...");
let overrides = {};
try {
  const res = await fetch(`${SUPA_URL}/rest/v1/site_config?id=eq.products&select=data`, {
    headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` }
  });
  const data = await res.json();
  // data is stored as indexed object {0:{...}, 1:{...}} — always use Object.values
  const rawData = data[0]?.data || {};
  const overrideArr = Object.values(rawData);
  overrideArr.forEach(p => { if (p?.id) overrides[p.id] = p; });
  const withImgs = Object.values(overrides).filter(p => (p.imgs||[]).filter(x=>x?.length).length > 0).length;
  console.log(`✅ Loaded ${Object.keys(overrides).length} overrides, ${withImgs} with real images`);
} catch (e) {
  console.warn("⚠️  Could not fetch Supabase overrides — using local data only");
}

const items = [];
let withImg = 0, withFallback = 0;

for (const prod of prods) {
  if (prod.disabled || EXCLUDED.has(prod.id)) continue;
  if (!prod.pricing?.length) continue;

  // Merge Supabase override
  const override = overrides[prod.id] || {};
  const merged = { ...prod, ...override };

  // Skip if hidden/disabled in Admin panel (Supabase override wins)
  if (merged.disabled) continue;

  // Use Supabase pricing if valid, otherwise fall back to local products.js pricing
  const pricingSource = (merged.pricing?.length && Math.min(...merged.pricing.map(t => t.p)) > 0)
    ? merged.pricing : prod.pricing;
  const lowestPrice = Math.min(...pricingSource.map(t => t.p));
  const lowestQty   = pricingSource.find(t => t.p === lowestPrice)?.q || pricingSource[0].q;
  const descClean   = (merged.desc || "").replace(/\\"/g, '"').replace(/\\/g, "");
  const gcat        = CAT_MAP[prod.cat] || "Business Supplies > Office Stationery";
  const catName     = CAT_NAMES[prod.cat] || prod.cat.replace(/-/g," ");
  const link        = `${DOMAIN}/products/${prod.cat}/${prod.id}`;
  const title       = `${merged.name} — Custom Printing GTA | Nexa Customs`.slice(0, 150);

  // Pick best image: product image → fallback
  const imgs = (merged.imgs || []).filter(x => x?.length);
  let imageUrl = GLOBAL_FALLBACK;
  if (imgs.length > 0) {
    imageUrl = cleanImgUrl(imgs[0]);
    withImg++;
  } else {
    withFallback++;
  }

  const desc = merged.sqft?.enabled
    ? `${descClean} Starting at $${lowestPrice.toFixed(2)}. Custom sizes available. Full colour CMYK. Free digital proof. Serving Toronto, Mississauga, Brampton, Oakville, Burlington, GTA. Ships Canada-wide. Call (437) 997-9921.`
    : `${descClean} Starting at $${lowestPrice.toFixed(2)} for ${lowestQty.toLocaleString()} pieces. More qty options on our website. Full colour CMYK. Free digital proof. Serving Toronto, Mississauga, Brampton, Oakville, Burlington, GTA. Ships Canada-wide. Call (437) 997-9921.`;

  items.push(`    <item>
      <g:id>nexa-${esc(prod.id)}</g:id>
      <g:title>${esc(title)}</g:title>
      <g:description>${esc(desc.slice(0,5000))}</g:description>
      <g:link>${esc(link)}</g:link>
      <g:image_link>${esc(imageUrl)}</g:image_link>
      <g:price>${lowestPrice.toFixed(2)} CAD</g:price>
      <g:brand>Nexa Customs</g:brand>
      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:google_product_category>${esc(gcat)}</g:google_product_category>
      <g:product_type>${esc(catName)}</g:product_type>
      <g:identifier_exists>no</g:identifier_exists>
      <g:shipping><g:country>CA</g:country><g:price>0 CAD</g:price><g:service>Free Pickup — Mississauga</g:service></g:shipping>
      <g:shipping><g:country>CA</g:country><g:price>18.00 CAD</g:price><g:service>Canada Post</g:service></g:shipping>
      <g:shipping><g:country>CA</g:country><g:price>45.00 CAD</g:price><g:service>Courier</g:service></g:shipping>
    </item>`);
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Nexa Customs — GTA Print Shop Mississauga</title>
    <link>${DOMAIN}</link>
    <description>Professional custom printing in Mississauga, GTA. Business cards, banners, vehicle wraps, stickers, flyers and more. Free proof. Ships Canada-wide.</description>
${items.join("\n")}
  </channel>
</rss>`;

writeFileSync("Public/product-feed.xml", xml, "utf8");
console.log(`\n✅ Generated ${items.length} products → Public/product-feed.xml`);
console.log(`   📸 ${withImg} products with real Supabase images`);
console.log(`   🔄 ${withFallback} products using fallback image`);
console.log(`   Feed size: ${(xml.length/1024).toFixed(1)}KB`);
console.log(`\nNext: git add Public/product-feed.xml && git commit -m "update: merchant feed with real images" && git push`);
