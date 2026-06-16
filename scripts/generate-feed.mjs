#!/usr/bin/env node
// Regenerate Google Merchant feed after price changes or hiding products:
//   node scripts/generate-feed.mjs

import { readFileSync, writeFileSync } from "fs";

const DOMAIN = "https://nexacustoms.ca";

// ── Products to EXCLUDE from feed (hidden/unavailable) ──────────────────────
// Add product IDs here when you hide them in Admin → Products
const EXCLUDED = new Set([
  // example: "vehicle-wrap-suv",
]);

const src = readFileSync("src/data/products.js", "utf8");

// Parse DEFAULT_PRODS
const start = src.indexOf("export const DEFAULT_PRODS = [");
let depth = 0, begin = src.indexOf("[", start), endIdx = begin;
for (let j = begin; j < src.length; j++) {
  if (src[j] === "[") depth++;
  else if (src[j] === "]") { depth--; if (depth === 0) { endIdx = j + 1; break; } }
}
const prods = eval(src.slice(begin, endIdx));

const CAT_MAP = {
  "business-cards":   "Business Supplies > Office Stationery",
  "flyers-postcards": "Business Supplies > Office Stationery",
  "signs-banners":    "Business Supplies > Banners & Pennants",
  "vehicle-graphics": "Arts & Entertainment > Hobbies & Creative Arts",
  "marketing":        "Business Supplies > Office Stationery",
  "stationery":       "Business Supplies > Office Stationery",
  "restaurant":       "Business Supplies > Office Stationery",
  "foam-boards":      "Arts & Entertainment > Party & Celebration",
  "labels-stickers":  "Office Supplies > Labels > Stickers",
  "real-estate":      "Business Supplies > Office Stationery",
  "calendars":        "Media > Books > Calendars",
  "posters-canvas":   "Arts & Entertainment > Artwork > Posters",
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

const items = [];

for (const prod of prods) {
  if (prod.disabled || EXCLUDED.has(prod.id)) continue;
  if (!prod.pricing?.length) continue;

  const lowestPrice = Math.min(...prod.pricing.map(t => t.p));
  const lowestQty   = prod.pricing.find(t => t.p === lowestPrice)?.q || prod.pricing[0].q;
  const descClean   = (prod.desc || "").replace(/\\"/g, '"').replace(/\\/g, "");
  const gcat        = CAT_MAP[prod.cat] || "Business Supplies > Office Stationery";
  const catName     = CAT_NAMES[prod.cat] || prod.cat.replace(/-/g," ");
  const link        = `${DOMAIN}/products/${prod.cat}/${prod.id}`;
  const title       = `${prod.name} — Custom Printing GTA | Nexa Customs Mississauga`.slice(0, 150);

  const desc = prod.sqft?.enabled
    ? `${descClean} Starting at $${lowestPrice.toFixed(2)}. Custom sizes available. Full colour CMYK. Free digital proof. Serving Toronto, Mississauga, Brampton, Oakville, Burlington, GTA. Ships Canada-wide. Call (437) 997-9921.`
    : `${descClean} Starting at $${lowestPrice.toFixed(2)} for ${lowestQty.toLocaleString()} pieces. More qty options on our website. Full colour CMYK. Free digital proof. Serving Toronto, Mississauga, Brampton, Oakville, Burlington, GTA. Ships Canada-wide. Call (437) 997-9921.`;

  items.push(`    <item>
      <g:id>nexa-${esc(prod.id)}</g:id>
      <g:title>${esc(title)}</g:title>
      <g:description>${esc(desc.slice(0,5000))}</g:description>
      <g:link>${esc(link)}</g:link>
      <g:image_link>${DOMAIN}/og-image.svg</g:image_link>
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
console.log(`✅ Generated ${items.length} products → Public/product-feed.xml`);
console.log(`   Feed size: ${(xml.length/1024).toFixed(1)}KB`);
console.log(`\nTo hide a product from feed: add its ID to EXCLUDED set in this script`);
