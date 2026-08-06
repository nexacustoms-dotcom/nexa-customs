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

import { readFileSync, writeFileSync } from "fs";

const SUPA_URL = "https://eogypbrsjfgurrobjomn.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZ3lwYnJzamZndXJyb2Jqb21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjYyODMsImV4cCI6MjA5MjgwMjI4M30.ajlCEo-TKn6qyi4GCfYNOeEpLpp5-MoJoFCKkGuRAzg";

// Your store code from Google Business Profile / Merchant Center linking
const STORE_CODE = "l5899834319943270243";

// Print-on-demand — there's no fixed shelf stock, production capacity is
// effectively the limit. A high placeholder quantity signals "always
// available" without literally claiming infinite stock.
const PLACEHOLDER_QTY = 1000;

const EXCLUDED = new Set([]);

// Read local products
const src = readFileSync("src/data/products.js", "utf8");
const start = src.indexOf("export const DEFAULT_PRODS = [");
let depth = 0, begin = src.indexOf("[", start), endIdx = begin;
for (let j = begin; j < src.length; j++) {
  if (src[j] === "[") depth++;
  else if (src[j] === "]") { depth--; if (depth === 0) { endIdx = j + 1; break; } }
}
const prods = eval(src.slice(begin, endIdx));

console.log("Fetching live pricing overrides from Supabase...");
let overrides = {};
try {
  const res = await fetch(`${SUPA_URL}/rest/v1/site_config?id=eq.products&select=data`, {
    headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` }
  });
  const data = await res.json();
  const rawData = data[0]?.data || {};
  Object.values(rawData).forEach(p => { if (p?.id) overrides[p.id] = p; });
  console.log(`Loaded ${Object.keys(overrides).length} overrides`);
} catch (e) {
  console.warn("Could not fetch Supabase overrides — using local data only");
}

const rows = ["id\tstore_code\tquantity\tavailability\tprice\tpickup_method\tpickup_sla"];
let count = 0;

for (const prod of prods) {
  if (prod.disabled || EXCLUDED.has(prod.id)) continue;
  if (!prod.pricing?.length) continue;

  const override = overrides[prod.id] || {};
  const merged = { ...prod, ...override };
  if (merged.disabled) continue;

  const pricingSource = (merged.pricing?.length && Math.min(...merged.pricing.map(t => t.p)) > 0)
    ? merged.pricing : prod.pricing;
  const lowestPrice = Math.min(...pricingSource.map(t => t.p));

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
console.log(`\nNext: git add Public/local-inventory.tsv && git commit -m "update: local inventory feed" && git push`);
