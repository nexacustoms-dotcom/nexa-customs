// Run after locking the database:  node scripts/security-check.mjs
// Plays the part of a stranger with only the public key, and checks the doors are shut.
const SUPA_URL = process.env.VITE_SUPA_URL || 'https://eogypbrsjfgurrobjomn.supabase.co';
const SUPA_KEY = process.env.VITE_SUPA_KEY || (await import('node:fs')).readFileSync(new URL('./generate-sitemap.mjs', import.meta.url), 'utf8').match(/const SUPA_KEY = "([^"]+)"/)[1];
const H = { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, 'Content-Type': 'application/json' };
let bad = 0;
const check = (name, ok, extra = '') => { console.log((ok ? '✅ ' : '❌ ') + name + (extra ? '  ' + extra : '')); if (!ok) bad++; };
const j = async r => { try { return await r.json(); } catch { return null; } };

// 1. Public things must still work
let r = await fetch(`${SUPA_URL}/rest/v1/site_config?id=eq.main&select=id`, { headers: H });
let d = await j(r);
check('Website can still read its settings', r.ok && Array.isArray(d) && d.length > 0);

// 2. Orders must be invisible to strangers
r = await fetch(`${SUPA_URL}/rest/v1/orders?select=id,customer_email&limit=5`, { headers: H }); d = await j(r);
check('Strangers cannot read customer orders', !(r.ok && Array.isArray(d) && d.length > 0), r.ok ? `(returned ${d?.length ?? 0} rows)` : `(status ${r.status})`);

// 3. Strangers must not be able to change site settings
r = await fetch(`${SUPA_URL}/rest/v1/site_config`, { method: 'POST', headers: { ...H, Prefer: 'return=representation,resolution=merge-duplicates' }, body: JSON.stringify({ id: '__security_test__', data: {}, updated_at: new Date().toISOString() }) });
check('Strangers cannot write site settings', !r.ok, `(status ${r.status})`);
r = await fetch(`${SUPA_URL}/rest/v1/site_config?id=eq.main`, { method: 'PATCH', headers: { ...H, Prefer: 'return=representation' }, body: JSON.stringify({ updated_at: new Date().toISOString() }) }); d = await j(r);
check('Strangers cannot edit existing settings', !(r.ok && Array.isArray(d) && d.length > 0), `(status ${r.status})`);

// 4. Strangers must not delete or edit orders
r = await fetch(`${SUPA_URL}/rest/v1/orders?id=eq.__none__`, { method: 'DELETE', headers: { ...H, Prefer: 'return=representation' } });
check('Strangers cannot delete orders', !r.ok || (await j(r))?.length === 0, `(status ${r.status})`);

// 5. File uploads: only customer folders allowed
r = await fetch(`${SUPA_URL}/storage/v1/object/nexa-media/branding/__security_test__.txt`, { method: 'POST', headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, 'Content-Type': 'text/plain' }, body: 'x' });
check('Strangers cannot upload into your branding/product folders', !r.ok, `(status ${r.status})`);
r = await fetch(`${SUPA_URL}/storage/v1/object/list/nexa-media`, { method: 'POST', headers: H, body: JSON.stringify({ prefix: 'artwork', limit: 5 }) }); d = await j(r);
check('Strangers cannot list customer artwork files', !(r.ok && Array.isArray(d) && d.length > 0), `(status ${r.status})`);

// 6. Order tracking works only with the right pair
r = await fetch(`${SUPA_URL}/rest/v1/rpc/track_order`, { method: 'POST', headers: H, body: JSON.stringify({ p_order: 'NCX-0000000', p_email: 'nobody@example.com' }) }); d = await j(r);
check('Order tracking lookup exists and rejects a wrong guess', r.ok && (d === null || !d?.order_number), `(status ${r.status})`);

console.log(bad === 0 ? '\n🔒 All checks passed.' : `\n⚠️  ${bad} check(s) failed — do not rely on the lock yet. Send this output to Claude.`);
process.exit(bad ? 1 : 0);
