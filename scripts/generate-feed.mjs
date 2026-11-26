#!/usr/bin/env node
// Regenerate Google Merchant feed with LIVE images from Supabase:
//   node scripts/generate-feed.mjs

import { writeFileSync } from "fs";
import { DOMAIN, loadDefaults, fetchProductOverrides, fetchConfig, mergeProducts, isPublishable, fromPrice } from "./lib/live-data.mjs";

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

// Live data from Supabase (prices, images, hidden products, products created in Admin)
const { prods: defaultProds } = loadDefaults(".");
console.log("📡 Fetching live products from Supabase...");
let overrides, shippingCarrier = "Canada Post", courierCarrier = "Courier";
try {
  overrides = await fetchProductOverrides();
  console.log(`✅ Loaded ${Object.keys(overrides).length} product overrides`);
  const store = (await fetchConfig("main")) || {};
  if (store.shipping_carrier) shippingCarrier = store.shipping_carrier;
  if (store.courier_carrier_name) courierCarrier = store.courier_carrier_name;
} catch (e) {
  // Never replace a good feed with one built from old code-default prices.
  console.warn(`⚠️  Could not reach Supabase (${e.message}) — keeping the existing Public/product-feed.xml unchanged.`);
  process.exit(0);
}
const prods = mergeProducts(defaultProds, overrides);

const items = [];
let withImg = 0, withFallback = 0;

for (const prod of prods) {
  if (EXCLUDED.has(prod.id) || !isPublishable(prod)) continue;   // hidden in Admin, or unfinished
  const merged = prod;

  // Same "from" price the website shows on the product card (first quantity tier)
  const lowestPrice = fromPrice(prod);
  const lowestQty   = prod.pricing[0].q;
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
      <g:shipping><g:country>CA</g:country><g:price>18.00 CAD</g:price><g:service>${esc(shippingCarrier)}</g:service></g:shipping>
      <g:shipping><g:country>CA</g:country><g:price>45.00 CAD</g:price><g:service>${esc(courierCarrier)}</g:service></g:shipping>
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
