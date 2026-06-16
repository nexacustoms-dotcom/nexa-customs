#!/usr/bin/env node
// Run this from nexa-react/ root to regenerate product-feed.xml after price changes:
//   node scripts/generate-feed.mjs

import { readFileSync, writeFileSync } from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const DOMAIN = "https://nexacustoms.ca";

// Read products from data file
const src = readFileSync("src/data/products.js", "utf8");
const match = src.match(/export const DEFAULT_PRODS = (\[[\s\S]+?\])\s*;?\s*\nexport/);
if (!match) { console.error("Could not parse DEFAULT_PRODS"); process.exit(1); }
const prods = eval(match[1]);

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

const FEATURED = {
  "business-cards":   [100, 250, 500],
  "flyers-postcards": [100, 250, 500],
  "signs-banners":    [1, 5, 10],
  "vehicle-graphics": [1],
  "marketing":        [100, 250],
  "stationery":       [25, 50, 100],
  "restaurant":       [25, 50, 100],
  "foam-boards":      [1, 3, 5],
  "labels-stickers":  [100, 250, 500],
  "real-estate":      [1, 5, 10],
  "calendars":        [25, 50, 100],
  "posters-canvas":   [1, 5, 10],
};

const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

const items = [];

for (const prod of prods) {
  if (prod.disabled) continue;
  const gcat = CAT_MAP[prod.cat] || "Business Supplies";
  const featured = FEATURED[prod.cat] || [prod.pricing?.[0]?.q || 1];
  const link = `${DOMAIN}/products/${prod.cat}/${prod.id}`;

  if (prod.sqft?.enabled) {
    const price = prod.pricing?.[0]?.p;
    if (!price) continue;
    items.push(makeItem(`nexa-${prod.id}-sqft`, `${prod.name} — Custom Printing GTA Mississauga`, prod.desc || "", link, price, gcat, prod.cat));
  } else {
    for (const qty of featured) {
      const tier = prod.pricing?.find(t => t.q === qty) || prod.pricing?.reduce((a,b) => Math.abs(b.q-qty)<Math.abs(a.q-qty)?b:a, prod.pricing[0]);
      if (!tier?.p) continue;
      const title = `${prod.name} ${qty.toLocaleString()}qty — Nexa Customs GTA`;
      const desc  = (prod.desc || "") + ` ${qty.toLocaleString()} pieces for $${tier.p.toFixed(2)}. Free proof. Ships Canada-wide.`;
      items.push(makeItem(`nexa-${prod.id}-${qty}`, title, desc, link, tier.p, gcat, prod.cat));
    }
  }
}

function makeItem(id, title, desc, link, price, gcat, cat) {
  return `    <item>
      <g:id>${esc(id)}</g:id>
      <g:title>${esc(title.slice(0,150))}</g:title>
      <g:description>${esc((desc||"").slice(0,5000))}</g:description>
      <g:link>${esc(link)}</g:link>
      <g:image_link>${DOMAIN}/og-image.svg</g:image_link>
      <g:price>${price.toFixed(2)} CAD</g:price>
      <g:brand>Nexa Customs</g:brand>
      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:google_product_category>${esc(gcat)}</g:google_product_category>
      <g:product_type>${esc(cat.replace(/-/g," "))}</g:product_type>
      <g:shipping><g:country>CA</g:country><g:price>0 CAD</g:price><g:service>Free Pickup</g:service></g:shipping>
      <g:shipping><g:country>CA</g:country><g:price>18.00 CAD</g:price><g:service>Canada Post</g:service></g:shipping>
    </item>`;
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Nexa Customs — GTA Print Shop</title>
    <link>${DOMAIN}</link>
    <description>Professional printing in Mississauga GTA. Business cards, banners, vehicle wraps, stickers. Ships Canada-wide.</description>
${items.join("\n")}
  </channel>
</rss>`;

writeFileSync("public/product-feed.xml", xml, "utf8");
console.log(`✅ Generated ${items.length} items → public/product-feed.xml`);
