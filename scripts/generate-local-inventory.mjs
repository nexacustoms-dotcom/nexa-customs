#!/usr/bin/env node
// Generate Google Merchant Center's Local Inventory feed (TSV format).
// This is a SEPARATE feed from product-feed.xml — it tells Google what's
// available for in-store pickup at your physical location, keyed by
// store_code. IDs here MUST exactly match the <g:id> values in
// product-feed.xml (format: nexa-{product-id}) or Google rejects every row
// as "item not found in primary feed" — this was almost certainly the
// cause of the errors on the manually-uploaded TSV.
//
//   node scripts/generate-local-inventory.mjs
//
// Upload the resulting Public/local-inventory.tsv in Merchant Center under
// Products → Local inventory, or host it and point Merchant Center's fetch
// URL at https://nexacustoms.ca/local-inventory.tsv for automatic refresh.

import { writeFileSync } from "fs";
import { loadDefaults, fetchProductOverrides, mergeProducts, isPublishable, fromPrice } from "./lib/live-data.mjs";

// Your store code from Google Business Profile / Merchant Center linking
const STORE_CODE = "NCI";

// Print-on-demand — there's no fixed shelf stock, production capacity is
// effectively the limit. A high placeholder quantity signals "always
// available" without literally claiming infinite stock.
const PLACEHOLDER_QTY = 1000;

const EXCLUDED = new Set([]);

const { prods: defaultProds } = loadDefaults(".");
console.log("Fetching live products from Supabase...");
let overrides;
try {
  overrides = await fetchProductOverrides();
  console.log(`Loaded ${Object.keys(overrides).length} overrides`);
} catch (e) {
  console.warn(`Could not reach Supabase (${e.message}) — keeping the existing Public/local-inventory.tsv unchanged.`);
  process.exit(0);
}
const prods = mergeProducts(defaultProds, overrides);

const rows = ["id\tstore_code\tquantity\tavailability\tprice\tpickup_method\tpickup_sla"];
let count = 0;

for (const prod of prods) {
  if (EXCLUDED.has(prod.id) || !isPublishable(prod)) continue;   // hidden in Admin, or unfinished
  const lowestPrice = fromPrice(prod);          // same "from" price as the website and the main feed

  // Same ID format as product-feed.xml's <g:id> — this match is mandatory
  const id = `nexa-${prod.id}`;

  rows.push([
    id,
    STORE_CODE,
    PLACEHOLDER_QTY,
    "in stock",
    `${lowestPrice.toFixed(2)} CAD`,
    "buy",       // customer can order online, pick up in store
    "same day",  // matches your actual same-day pickup capability
  ].join("\t"));
  count++;
}

const tsv = rows.join("\n");
writeFileSync("Public/local-inventory.tsv", tsv, "utf8");
console.log(`\nGenerated ${count} products → Public/local-inventory.tsv`);
console.log(`Store code used: ${STORE_CODE}`);
console.log(`\nTo upload manually: Merchant Center → Products → Local inventory → upload this file.`);
console.log(`To auto-refresh instead: host at https://nexacustoms.ca/local-inventory.tsv and set that as the fetch URL in Merchant Center — no more manual re-uploads when prices change.`);
