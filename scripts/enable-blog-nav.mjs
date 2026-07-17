#!/usr/bin/env node
// Flips nav:true on the 8 blog posts added by seed-blog-posts.mjs, so they
// show up on the new /blog index page (which respects the "Show in footer
// navigation" toggle as an opt-out). Safe to re-run.
//   node scripts/enable-blog-nav.mjs

const SUPA_URL = "https://eogypbrsjfgurrobjomn.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZ3lwYnJzamZndXJyb2Jqb21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjYyODMsImV4cCI6MjA5MjgwMjI4M30.ajlCEo-TKn6qyi4GCfYNOeEpLpp5-MoJoFCKkGuRAzg";

const SLUGS = [
  'real-estate-sign-regulations-gta',
  'vehicle-wrap-winter-durability',
  'banner-material-guide',
  'flyer-distribution-rules-canada',
  'restaurant-menu-redesign-guide',
  'business-card-finishes-guide',
  'custom-labels-101',
  'trade-show-display-guide',
];

async function main() {
  console.log('Fetching current custom_pages from Supabase...');
  const getRes = await fetch(`${SUPA_URL}/rest/v1/site_config?id=eq.custom_pages&select=data`, {
    headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
  });
  if (!getRes.ok) {
    console.error('❌ Failed to fetch site_config:', getRes.status, await getRes.text());
    process.exit(1);
  }
  const rows = await getRes.json();
  const existing = Array.isArray(rows?.[0]?.data) ? rows[0].data : [];

  let changed = 0;
  const updated = existing.map(p => {
    if (SLUGS.includes(p.slug) && p.nav !== true) {
      changed++;
      return { ...p, nav: true };
    }
    return p;
  });

  if (!changed) {
    console.log('Nothing to change — all 8 posts already have nav:true (or are missing entirely).');
    return;
  }

  const upsertRes = await fetch(`${SUPA_URL}/rest/v1/site_config`, {
    method: 'POST',
    headers: {
      apikey: SUPA_KEY,
      Authorization: `Bearer ${SUPA_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify({ id: 'custom_pages', data: updated, updated_at: new Date().toISOString() }),
  });

  const responseText = await upsertRes.text();
  if (!upsertRes.ok) {
    console.error('❌ Failed to write to Supabase:', upsertRes.status, responseText);
    process.exit(1);
  }

  console.log(`✅ Set nav:true on ${changed} post(s). They'll now appear on /blog.`);
}

main().catch(err => { console.error(err); process.exit(1); });
