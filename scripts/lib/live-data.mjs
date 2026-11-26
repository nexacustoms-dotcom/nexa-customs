// Shared helper for the sitemap, Google Merchant feed, local-inventory feed and prerender.
// It reads the SAME live data the website uses (Supabase `site_config`), so whatever you
// change in Admin (prices, hidden products, products you created) is what Google gets.
//
// Nothing secret here: the anon key is the public key already shipped inside the website.

import { readFileSync } from "fs";

export const DOMAIN = "https://nexacustoms.ca";
const FALLBACK_URL = "https://eogypbrsjfgurrobjomn.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZ3lwYnJzamZndXJyb2Jqb21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjYyODMsImV4cCI6MjA5MjgwMjI4M30.ajlCEo-TKn6qyi4GCfYNOeEpLpp5-MoJoFCKkGuRAzg";

export function supaConfig() {
  return {
    url: process.env.VITE_SUPA_URL || process.env.VITE_SUPABASE_URL || FALLBACK_URL,
    key: process.env.VITE_SUPA_KEY || process.env.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY,
  };
}

// Pull a bracketed list (DEFAULT_PRODS / DEFAULT_CATS) out of src/data/products.js
function readList(src, name) {
  const start = src.indexOf(`export const ${name} = [`);
  let depth = 0, begin = src.indexOf("[", start), end = begin;
  for (let j = begin; j < src.length; j++) {
    if (src[j] === "[") depth++;
    else if (src[j] === "]") { depth--; if (depth === 0) { end = j + 1; break; } }
  }
  return eval(src.slice(begin, end));
}

export function loadDefaults(root = ".") {
  const src = readFileSync(`${root}/src/data/products.js`, "utf8");
  return { cats: readList(src, "DEFAULT_CATS"), prods: readList(src, "DEFAULT_PRODS") };
}

export async function fetchConfig(id) {
  const { url, key } = supaConfig();
  const res = await fetch(`${url}/rest/v1/site_config?id=eq.${id}&select=data`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Supabase answered ${res.status} for ${id}`);
  const rows = await res.json();
  if (!Array.isArray(rows)) throw new Error(`Unexpected Supabase answer for ${id}`);
  let data = rows[0]?.data;
  if (typeof data === "string") data = JSON.parse(data);
  return data ?? null;           // null = row does not exist yet
}

// Product overrides saved by Admin, as { id: product }.
// THROWS if Supabase cannot be reached — callers must then leave existing files alone
// instead of publishing code-default prices (the old "previous price" problem).
export async function fetchProductOverrides() {
  const data = await fetchConfig("products");
  const list = Array.isArray(data) ? data : Object.values(data || {});
  const map = {};
  list.forEach(p => { if (p?.id) map[p.id] = p; });
  return map;
}

// A product you created in Admin but never finished (still called "New Product" or no price).
export function isDraft(p) {
  const name = String(p?.name || "").trim();
  const first = Number(p?.pricing?.[0]?.p) || 0;
  return !name || name === "New Product" || !(first > 0);
}

// The exact list the website shows: built-in products with Admin changes applied,
// plus products created in Admin. Same rules as mergeOverrides() in AppContext.jsx.
export function mergeProducts(defaultProds, overrides) {
  const out = defaultProds.map(p => {
    const o = overrides[p.id];
    if (!o) return { ...p, disabled: !!p.disabled };
    return {
      ...p,
      pricing: o.pricing || p.pricing,
      sqft: o.sqft ? { ...p.sqft, ...o.sqft } : p.sqft,
      imgs: o.imgs?.length ? o.imgs : p.imgs,
      name: o.name || p.name,
      desc: o.desc || p.desc,
      cat: o.cat || p.cat,
      disabled: !!o.disabled,           // Admin wins — also lets you RE-enable a product hidden in code
    };
  });
  const known = new Set(defaultProds.map(p => p.id));
  Object.values(overrides).forEach(o => {
    if (!o?.id || known.has(o.id) || !o.cat) return;
    out.push({ ...o, disabled: !!o.disabled, _adminCreated: true });
  });
  return out;
}

// Products that may be shown to Google (sitemap, feeds)
export const isPublishable = p => !p.disabled && !isDraft(p);

// The price the shop shows as "from $X" on product cards (first quantity tier)
export const fromPrice = p => Number(p?.pricing?.[0]?.p) || 0;
