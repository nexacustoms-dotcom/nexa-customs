const SUPA_URL = "https://eogypbrsjfgurrobjomn.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZ3lwYnJzamZndXJyb2Jqb21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjYyODMsImV4cCI6MjA5MjgwMjI4M30.ajlCEo-TKn6qyi4GCfYNOeEpLpp5-MoJoFCKkGuRAzg";

const res = await fetch(`${SUPA_URL}/rest/v1/site_config?id=eq.products&select=data`, {
  headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` }
});
const rows = await res.json();
const arr = Object.values(rows[0].data);

// Show first disabled product's full structure
const disabled = arr.filter(p => p.disabled);
console.log('First disabled product full object:');
console.log(JSON.stringify(disabled[0], null, 2).slice(0, 500));
console.log('\nKey used in overrides map:', disabled[0]?.id);

// Check what keys the overrides map uses
const overrides = {};
arr.forEach(p => { if (p?.id) overrides[p.id] = p; });
console.log('\nSample override keys:', Object.keys(overrides).slice(0, 5));
console.log('most-popular-business-cards in overrides?', 'most-popular-business-cards' in overrides);
console.log('disabled flag:', overrides['most-popular-business-cards']?.disabled);
