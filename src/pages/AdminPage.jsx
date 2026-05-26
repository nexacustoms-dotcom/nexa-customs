import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';

const TABS = [
  { id: 'orders',     label: '📦 Orders' },
  { id: 'products',   label: '🖨️ Products' },
  { id: 'categories', label: '📁 Categories' },
  { id: 'appearance', label: '🎨 Appearance' },
  { id: 'settings',   label: '⚙️ Settings' },
  { id: 'pages',      label: '📄 Pages' },
  { id: 'emails',     label: '📬 Emails' },
  { id: 'pricing',    label: '💰 Pricing' },
];

// ── SUPABASE UPLOAD ───────────────────────────────────────────────────────────
async function uploadToSupabase(file, folder, ls) {
  const supaUrl = import.meta.env.VITE_SUPA_URL || ls.raw('nxt_supa_url', '');
  const supaKey = import.meta.env.VITE_SUPA_KEY || ls.raw('nxt_supa_key', '');

  if (!supaUrl || !supaKey || supaKey.length < 10)
    return { error: 'Supabase not configured — go to Settings tab first' };

  const ext = file.name.split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const safeName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  try {
    // Try with auth header first
    const res = await fetch(`${supaUrl}/storage/v1/object/nexa-media/${safeName}`, {
      method: 'POST',
      headers: {
        apikey: supaKey,
        Authorization: `Bearer ${supaKey}`,
        'Content-Type': file.type || 'image/jpeg',
        'x-upsert': 'true',
      },
      body: file,
    });

    if (res.ok) {
      return { url: `${supaUrl}/storage/v1/object/public/nexa-media/${safeName}` };
    }

    // If auth failed, try without auth (fully public bucket)
    const res2 = await fetch(`${supaUrl}/storage/v1/object/nexa-media/${safeName}`, {
      method: 'POST',
      headers: {
        'Content-Type': file.type || 'image/jpeg',
        'x-upsert': 'true',
      },
      body: file,
    });

    if (res2.ok) {
      return { url: `${supaUrl}/storage/v1/object/public/nexa-media/${safeName}` };
    }

    const errText = await res2.text();
    let friendlyError = `Upload failed (${res2.status})`;
    if (res2.status === 400) friendlyError = 'Bucket policy error — go to Supabase → Storage → nexa-media → Edit → enable Public bucket';
    if (res2.status === 404) friendlyError = 'Bucket "nexa-media" not found — create it in Supabase Storage and set to Public';
    if (res2.status === 403) friendlyError = 'Permission denied — go to Supabase → Storage → nexa-media → Edit → enable Public bucket';
    return { error: friendlyError };

  } catch (e) {
    return { error: 'Network error: ' + e.message };
  }
}

// ── IMAGE UPLOAD COMPONENT ────────────────────────────────────────────────────
function ImageUpload({ label, value, onChange, folder, note }) {
  const { ls, showToast } = useApp();
  const [uploading, setUploading] = useState(false);
  const ref = useRef();

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { showToast('Max file size is 5MB'); return; }
    setUploading(true);
    const result = await uploadToSupabase(file, folder, ls);
    setUploading(false);
    if (result.error) { showToast('❌ Upload failed: ' + result.error); return; }
    onChange(result.url);
    showToast('✅ Image uploaded!');
  }

  return (
    <div className="afg">
      <label className="aflbl">{label}</label>
      {value ? (
        <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={value} alt="" style={{ width: 64, height: 64, objectFit: 'contain', background: 'var(--s2)', borderRadius: 8, border: '1px solid var(--bd)', padding: 4 }} onError={e => e.target.style.display = 'none'} />
          <button onClick={() => onChange('')} style={{ fontSize: 11, color: '#f87171', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>✕ Remove</button>
        </div>
      ) : null}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => ref.current?.click()} disabled={uploading} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--o)', background: 'rgba(249,115,22,.1)', color: 'var(--o)', fontSize: 12, fontWeight: 600, cursor: uploading ? 'wait' : 'pointer', fontFamily: "'DM Sans',sans-serif", opacity: uploading ? 0.6 : 1 }}>
          {uploading ? '⏳ Uploading…' : '📁 Upload Image'}
        </button>
        <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        <span style={{ fontSize: 11, color: 'var(--mu)' }}>or paste a URL below</span>
      </div>
      <input className="ainp" style={{ marginTop: 6 }} placeholder="https://…" value={value || ''} onChange={e => onChange(e.target.value)} />
      {note && <div style={{ fontSize: 10, color: 'var(--mu)', marginTop: 3 }}>{note}</div>}
    </div>
  );
}

// ── ADMIN ROOT ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { go, adminAuthed, setAdminAuthed, showToast, ls } = useApp();
  const [tab, setTab] = useState('products');
  const [pw, setPw] = useState('');

  function checkPw() {
    const saved = ls.raw('nxt_admin_pw', 'nexa2024');
    if (pw === saved) { setAdminAuthed(true); ls.setRaw('nxt_admin_auth', 'true'); }
    else showToast('❌ Incorrect password');
  }
  function logout() { setAdminAuthed(false); ls.setRaw('nxt_admin_auth', ''); go('home'); showToast('Signed out'); }

  if (!adminAuthed) return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 36, maxWidth: 380, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚙️</div>
        <h2 className="D" style={{ fontSize: 28, marginBottom: 20 }}>Admin Access</h2>
        <div className="fgrp">
          <label className="flbl">Password</label>
          <input className="finp" type="password" placeholder="Enter admin password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && checkPw()} />
        </div>
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={checkPw}>Sign In →</button>
        <div style={{ marginTop: 16 }}><span onClick={() => go('home')} style={{ fontSize: 12, color: 'var(--mu)', cursor: 'pointer' }}>← Back to Store</span></div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ background: 'var(--dk)', borderBottom: '1px solid var(--bd)' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 28px', minHeight: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 17, color: 'var(--o)', textTransform: 'uppercase', marginRight: 8 }}>⚙️ Admin</div>
            <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '7px 13px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", border: 'none', transition: 'all .15s', color: tab === t.id ? 'var(--o)' : 'var(--mu)', background: tab === t.id ? 'rgba(249,115,22,.12)' : 'none' }}>{t.label}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => go('home')} className="abtn">← Store</button>
            <button onClick={logout} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid rgba(239,68,68,.3)', background: 'rgba(239,68,68,.1)', color: '#f87171', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Sign Out</button>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '24px 28px 80px' }}>
        {tab === 'orders'     && <OrdersTab />}
        {tab === 'products'   && <ProductsTab />}
        {tab === 'categories' && <CategoriesTab />}
        {tab === 'appearance' && <AppearanceTab />}
        {tab === 'settings'   && <SettingsTab />}
        {tab === 'pages'      && <PagesTab />}
        {tab === 'emails'     && <EmailsTab />}
        {tab === 'pricing'    && <PricingTab />}
      </div>
    </div>
  );
}

// ── PRODUCTS TAB ──────────────────────────────────────────────────────────────
function ProductsTab() {
  const { prods, setProds, cats, showToast } = useApp();
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  const filtered = prods.filter(p =>
    (filterCat === 'all' || p.cat === filterCat) &&
    (!search.trim() || p.name.toLowerCase().includes(search.toLowerCase()))
  );

  function saveEdit(updated) { setProds(prev => prev.map(p => p.id === updated.id ? updated : p)); setEditing(null); showToast('✅ Product saved!'); }
  function toggleDisable(id) { setProds(prev => prev.map(p => p.id === id ? { ...p, disabled: !p.disabled } : p)); }

  if (editing) return <ProductEditor prod={editing} cats={cats} onSave={saveEdit} onCancel={() => setEditing(null)} />;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 24 }}>Products ({filtered.length} / {prods.length})</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select className="finp" style={{ width: 170, fontSize: 12, padding: '8px 10px' }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="all">All Categories</option>
            {cats.map(c => <option key={c.id} value={c.id}>{c.l}</option>)}
          </select>
          <input className="finp" style={{ width: 200, fontSize: 12 }} placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="atable">
            <thead><tr><th>Product</th><th>Category</th><th>Image</th><th>From Price</th><th>Badge</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(p => {
                const cat = cats.find(c => c.id === p.cat);
                const img = p.imgs?.find(x => x?.length) || '';
                return (
                  <tr key={p.id} style={{ opacity: p.disabled ? 0.45 : 1 }}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td style={{ color: 'var(--mu)', fontSize: 12 }}>{cat?.l || p.cat}</td>
                    <td>
                      {img
                        ? <img src={img} alt="" style={{ width: 38, height: 38, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--bd)' }} />
                        : <span style={{ fontSize: 10, color: 'var(--mu)', background: 'var(--s2)', padding: '3px 7px', borderRadius: 4 }}>No img</span>}
                    </td>
                    <td style={{ color: 'var(--o)', fontFamily: "'DM Mono',monospace" }}>${p.pricing[0]?.p.toFixed(2)}</td>
                    <td>{p.badge && <span className="badge-orange">{p.badge}</span>}</td>
                    <td><span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 700, background: p.disabled ? 'rgba(239,68,68,.1)' : 'rgba(34,197,94,.1)', color: p.disabled ? '#f87171' : 'var(--gr)', border: `1px solid ${p.disabled ? 'rgba(239,68,68,.2)' : 'rgba(34,197,94,.2)'}` }}>{p.disabled ? 'Hidden' : 'Active'}</span></td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      <button className="abtn" onClick={() => setEditing({ ...p, imgs: [...(p.imgs || [])] })}>✏️ Edit</button>
                      <button className="abtn" onClick={() => toggleDisable(p.id)} style={{ color: p.disabled ? 'var(--gr)' : '#f87171', borderColor: p.disabled ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)' }}>{p.disabled ? 'Show' : 'Hide'}</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── PRODUCT EDITOR ────────────────────────────────────────────────────────────
function ProductEditor({ prod, cats, onSave, onCancel }) {
  const { ls, showToast } = useApp();
  const [p, setP] = useState({ ...prod, imgs: [...(prod.imgs || [])], pricing: prod.pricing.map(t => ({ ...t })) });
  const [uploading, setUploading] = useState(false);
  const imgRef = useRef();
  const upd = k => v => setP(prev => ({ ...prev, [k]: v }));

  async function handleImgUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { showToast('Max 5MB per image'); return; }
    setUploading(true);
    const result = await uploadToSupabase(file, 'products', ls);
    setUploading(false);
    if (result.error) { showToast('❌ ' + result.error); return; }
    setP(prev => ({ ...prev, imgs: [result.url, ...(prev.imgs || []).filter(x => x?.length).slice(0, 3)] }));
    showToast('✅ Image uploaded!');
    e.target.value = '';
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <button className="abtn" onClick={onCancel}>← Back</button>
        <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 22 }}>Edit: {prod.name}</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="ed-grid">
        {/* Left */}
        <div>
          <div className="aform-section">
            <div className="aform-title">Basic Info</div>
            <div className="afg"><label className="aflbl">Product Name</label><input className="ainp" value={p.name} onChange={e => upd('name')(e.target.value)} /></div>
            <div className="afg"><label className="aflbl">Description</label><textarea className="ainp" rows="3" style={{ resize: 'vertical', minHeight: 70 }} value={p.desc || ''} onChange={e => upd('desc')(e.target.value)} /></div>
            <div className="afg"><label className="aflbl">Badge (optional)</label><input className="ainp" placeholder="Most Popular, Premium, 30% OFF…" value={p.badge || ''} onChange={e => upd('badge')(e.target.value)} /></div>
            <div className="afg"><label className="aflbl">Category</label>
              <select className="ainp" value={p.cat} onChange={e => upd('cat')(e.target.value)}>
                {cats.map(c => <option key={c.id} value={c.id}>{c.l}</option>)}
              </select>
            </div>
          </div>
          {/* Product Images */}
          <div className="aform-section" style={{ marginTop: 16 }}>
            <div className="aform-title">📸 Product Images</div>
            <p style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 12, lineHeight: 1.6 }}>Upload up to 4 photos. First image is the main display image shown on the product card and detail page.</p>
            {/* Current images grid */}
            {(p.imgs || []).filter(x => x?.length).length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                {(p.imgs || []).filter(x => x?.length).map((img, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={img} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: `2px solid ${i === 0 ? 'var(--o)' : 'var(--bd)'}`, display: 'block' }} />
                    {i === 0 && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--o)', color: '#000', fontSize: 8, fontWeight: 800, textAlign: 'center', borderRadius: '0 0 6px 6px', padding: '2px 0' }}>MAIN</div>}
                    <button onClick={() => setP(prev => ({ ...prev, imgs: prev.imgs.filter((_, idx) => idx !== i) }))} style={{ position: 'absolute', top: -6, right: -6, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>✕</button>
                  </div>
                ))}
              </div>
            )}
            {/* Upload button */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
              <button onClick={() => imgRef.current?.click()} disabled={uploading} style={{ padding: '9px 16px', borderRadius: 8, border: '1px solid var(--o)', background: 'rgba(249,115,22,.1)', color: 'var(--o)', fontSize: 12, fontWeight: 600, cursor: uploading ? 'wait' : 'pointer', fontFamily: "'DM Sans',sans-serif", opacity: uploading ? 0.6 : 1 }}>
                {uploading ? '⏳ Uploading…' : '📁 Upload Photo'}
              </button>
              <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImgUpload} />
              <span style={{ fontSize: 11, color: 'var(--mu)' }}>JPG, PNG, WebP · max 5MB</span>
            </div>
            {/* Paste URL */}
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="ainp" placeholder="Or paste image URL and press Enter" onKeyDown={e => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  setP(prev => ({ ...prev, imgs: [e.target.value.trim(), ...(prev.imgs || []).filter(x => x?.length).slice(0, 3)] }));
                  e.target.value = '';
                }
              }} />
            </div>
            <div style={{ fontSize: 10, color: 'var(--mu)', marginTop: 4 }}>💡 Requires Supabase storage bucket "nexa-media" to be set up (see Settings)</div>
          </div>
        </div>
        {/* Right — pricing */}
        <div className="aform-section">
          <div className="aform-title">Pricing Tiers</div>
          <p style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 12 }}>Base prices per quantity. Option multipliers apply on top at checkout.</p>
          {p.pricing.map((tier, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--mu)', width: 64, flexShrink: 0, fontFamily: "'DM Mono',monospace" }}>Qty {tier.q >= 1000 ? (tier.q / 1000) + 'K' : tier.q}</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--bd)', borderRadius: 7, overflow: 'hidden', background: 'var(--dk)', flex: 1 }}>
                <span style={{ padding: '0 8px', color: 'var(--mu)', fontSize: 13 }}>$</span>
                <input type="number" step="0.01" min="0" value={tier.p.toFixed(2)} className="ainp" style={{ border: 'none', background: 'transparent', borderRadius: 0 }}
                  onChange={e => { const np = [...p.pricing]; np[i] = { ...tier, p: parseFloat(e.target.value) || 0 }; upd('pricing')(np); }} />
              </div>
            </div>
          ))}
          {p.sqft?.enabled && (
            <>
              <div style={{ height: 1, background: 'var(--bd)', margin: '14px 0' }} />
              <div className="aform-title" style={{ fontSize: 14 }}>Sq Ft Pricing</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div className="afg"><label className="aflbl">Rate ($/sq ft)</label><input type="number" step="0.25" className="ainp" value={p.sqft.rate} onChange={e => upd('sqft')({ ...p.sqft, rate: parseFloat(e.target.value) || p.sqft.rate })} /></div>
                <div className="afg"><label className="aflbl">Min Sq Ft</label><input type="number" step="0.5" className="ainp" value={p.sqft.min} onChange={e => upd('sqft')({ ...p.sqft, min: parseFloat(e.target.value) || p.sqft.min })} /></div>
              </div>
            </>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
        <button className="abtn abtn-add" onClick={() => onSave(p)}>💾 Save Product</button>
        <button className="abtn" onClick={onCancel}>Cancel</button>
      </div>
      <style>{`.ed-grid{@media(max-width:640px){grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}

// ── CATEGORIES TAB ────────────────────────────────────────────────────────────
function CategoriesTab() {
  const { cats, setCats, showToast, ls } = useApp();
  const [editingCat, setEditingCat] = useState(null); // category id being edited
  const [uploading, setUploading] = useState(null);   // category id being uploaded
  const fileRefs = useRef({});

  function move(i, dir) {
    const arr = [...cats]; const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]]; setCats(arr); showToast('Order updated.');
  }

  async function handleCatImg(e, catId) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Please select an image'); return; }
    if (file.size > 5 * 1024 * 1024) { showToast('Max 5MB'); return; }
    setUploading(catId);
    const result = await uploadToSupabase(file, 'categories', ls);
    setUploading(null);
    if (result.error) { showToast('❌ ' + result.error); return; }
    setCats(prev => prev.map(c => c.id === catId ? { ...c, img: result.url } : c));
    showToast('✅ Category image uploaded!');
    e.target.value = '';
  }

  function removeCatImg(catId) {
    setCats(prev => prev.map(c => c.id === catId ? { ...c, img: null } : c));
    showToast('Image removed.');
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 24 }}>Categories ({cats.length})</h2>
        <div style={{ fontSize: 12, color: 'var(--mu)' }}>Use ↑↓ to reorder · Upload images for each category</div>
      </div>
      <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', overflow: 'hidden' }}>
        {cats.map((c, i) => (
          <div key={c.id} style={{ borderBottom: i < cats.length - 1 ? '1px solid var(--bd)' : 'none', opacity: c.hidden ? 0.45 : 1 }}>
            {/* Main row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
              {/* Category image thumbnail */}
              <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--bd)', background: 'var(--s2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}
                onClick={() => fileRefs.current[c.id]?.click()}
                title="Click to upload category image"
              >
                {c.img
                  ? <img src={c.img} alt={c.l} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 22 }}>{uploading === c.id ? '⏳' : c.i}</span>}
              </div>
              <input ref={el => fileRefs.current[c.id] = el} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleCatImg(e, c.id)} />

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{c.l}</div>
                <div style={{ fontSize: 10, color: 'var(--mu)', fontFamily: "'DM Mono',monospace" }}>{c.id}</div>
              </div>

              {/* Status badge */}
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 700, background: c.hidden ? 'rgba(239,68,68,.1)' : 'rgba(34,197,94,.1)', color: c.hidden ? '#f87171' : 'var(--gr)', border: `1px solid ${c.hidden ? 'rgba(239,68,68,.2)' : 'rgba(34,197,94,.2)'}` }}>{c.hidden ? 'Hidden' : 'Visible'}</span>
              {c.img && <span className="badge-green" style={{ fontSize: 9 }}>Has Image</span>}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="abtn" onClick={() => move(i, -1)}>↑</button>
                <button className="abtn" onClick={() => move(i, 1)}>↓</button>
                <button className="abtn" onClick={() => fileRefs.current[c.id]?.click()} style={{ color: 'var(--o)', borderColor: 'rgba(249,115,22,.3)' }} title="Upload image">📁</button>
                {c.img && <button className="abtn" onClick={() => removeCatImg(c.id)} style={{ color: '#f87171', borderColor: 'rgba(239,68,68,.3)' }} title="Remove image">✕</button>}
                <button className="abtn" onClick={() => setCats(prev => prev.map(x => x.id === c.id ? { ...x, hidden: !x.hidden } : x))} style={{ color: c.hidden ? 'var(--gr)' : '#f87171', borderColor: c.hidden ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)' }}>{c.hidden ? 'Show' : 'Hide'}</button>
              </div>
            </div>
            {/* Image URL input (expanded) */}
            {editingCat === c.id && (
              <div style={{ padding: '0 16px 14px', display: 'flex', gap: 8 }}>
                <input className="ainp" style={{ flex: 1, fontSize: 12 }} placeholder="Or paste image URL here" defaultValue={c.img || ''}
                  onKeyDown={e => { if (e.key === 'Enter') { setCats(prev => prev.map(x => x.id === c.id ? { ...x, img: e.target.value } : x)); setEditingCat(null); showToast('✅ Image URL saved!'); }}}
                />
                <button className="abtn" onClick={() => setEditingCat(null)}>✕</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--mu)' }}>
        💡 Click the emoji/thumbnail to upload a photo, or click 📁 button. Images show on the category grid on the homepage and products page. Recommended: square images, min 400×400px.
      </div>
    </div>
  );
}

// ── APPEARANCE TAB ────────────────────────────────────────────────────────────
function AppearanceTab() {
  const { store, setStore, showToast } = useApp();
  const [s, setS] = useState({ ...store });
  const upd = k => v => setS(prev => ({ ...prev, [k]: v }));
  const updE = k => e => setS(prev => ({ ...prev, [k]: e.target.value }));
  function save() { setStore(s); showToast('✅ Appearance saved!'); }

  return (
    <div>
      <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 20 }}>Appearance & Branding</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="ap-grid">

        {/* Logo & Favicon */}
        <div className="aform-section">
          <div className="aform-title">🎨 Logo & Favicon</div>
          <ImageUpload label="Store Logo" value={s.logo_img || ''} onChange={v => upd('logo_img')(v)} folder="branding" note="Square PNG recommended, min 200×200px. Displays in navbar and footer." />
          <div style={{ height: 1, background: 'var(--bd)', margin: '14px 0' }} />
          <ImageUpload label="Favicon (browser tab icon)" value={s.favicon_img || ''} onChange={v => upd('favicon_img')(v)} folder="branding" note="32×32 or 64×64 PNG. Shows in browser tab." />
          <div style={{ height: 1, background: 'var(--bd)', margin: '14px 0' }} />
          <div className="afg">
            <label className="aflbl">Logo Text (used if no logo image)</label>
            <input className="ainp" maxLength="2" value={s.logo_text || ''} onChange={updE('logo_text')} placeholder="N" />
          </div>
          {/* Live preview */}
          <div style={{ marginTop: 14, background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', marginBottom: 10 }}>Live Preview</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, background: s.logo_img ? 'transparent' : 'var(--o)', clipPath: s.logo_img ? 'none' : 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 17, color: '#000', borderRadius: s.logo_img ? 8 : 0, overflow: 'hidden', flexShrink: 0 }}>
                {s.logo_img ? <img src={s.logo_img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={e => e.target.style.display = 'none'} /> : (s.logo_text || 'N')}
              </div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 17 }}>{s.name}</div>
                <div style={{ fontSize: 10, color: 'var(--mu)' }}>{s.tagline}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Store Info */}
        <div className="aform-section">
          <div className="aform-title">🏪 Store Info</div>
          <div className="afg"><label className="aflbl">Store Name</label><input className="ainp" value={s.name} onChange={updE('name')} /></div>
          <div className="afg"><label className="aflbl">Tagline</label><input className="ainp" value={s.tagline} onChange={updE('tagline')} /></div>
          <div className="afg"><label className="aflbl">Phone (display)</label><input className="ainp" placeholder="(437) 997-9921" value={s.phone} onChange={updE('phone')} /></div>
          <div className="afg"><label className="aflbl">Phone (digits only for tel: links)</label><input className="ainp" placeholder="14379979921" value={s.phone_raw} onChange={updE('phone_raw')} /></div>
          <div className="afg"><label className="aflbl">Email</label><input className="ainp" value={s.email} onChange={updE('email')} /></div>
          <div className="afg"><label className="aflbl">Address</label><input className="ainp" value={s.address} onChange={updE('address')} /></div>
          <div className="afg"><label className="aflbl">City / Province / Postal</label><input className="ainp" value={s.city} onChange={updE('city')} /></div>
          <div className="afg"><label className="aflbl">Business Hours</label><textarea className="ainp" rows="4" style={{ resize: 'vertical' }} value={s.hours} onChange={updE('hours')} /></div>
        </div>

        {/* Hero */}
        <div className="aform-section">
          <div className="aform-title">🦸 Hero Section</div>
          <div className="afg"><label className="aflbl">Line 1</label><input className="ainp" value={s.hero1} onChange={updE('hero1')} /></div>
          <div className="afg"><label className="aflbl">Accent Line (orange colour)</label><input className="ainp" value={s.hero_accent} onChange={updE('hero_accent')} /></div>
          <div className="afg"><label className="aflbl">Line 2</label><input className="ainp" value={s.hero2} onChange={updE('hero2')} /></div>
          <div className="afg"><label className="aflbl">Sub-headline</label><textarea className="ainp" rows="2" style={{ resize: 'vertical' }} value={s.hero_sub} onChange={updE('hero_sub')} /></div>
          <ImageUpload label="Hero Background Image (optional)" value={s.hero_bg || ''} onChange={v => upd('hero_bg')(v)} folder="branding" note="Wide banner, min 1400px wide. Used as hero section background." />
        </div>

        {/* Social */}
        <div className="aform-section">
          <div className="aform-title">📱 Social & Footer</div>
          <div className="afg"><label className="aflbl">Instagram URL</label><input className="ainp" placeholder="https://instagram.com/nexacustoms" value={s.social_ig} onChange={updE('social_ig')} /></div>
          <div className="afg"><label className="aflbl">Facebook URL</label><input className="ainp" placeholder="https://facebook.com/nexacustoms" value={s.social_fb} onChange={updE('social_fb')} /></div>
          <div className="afg"><label className="aflbl">WhatsApp (digits only)</label><input className="ainp" placeholder="14379979921" value={s.social_wa} onChange={updE('social_wa')} /></div>
          <div className="afg"><label className="aflbl">Footer Copyright Text</label><input className="ainp" value={s.footer_copy} onChange={updE('footer_copy')} /></div>
        </div>
      </div>
      <button className="abtn abtn-add" style={{ marginTop: 20 }} onClick={save}>💾 Save All Appearance</button>
      <style>{`.ap-grid{@media(max-width:640px){grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}

// ── SETTINGS TAB ──────────────────────────────────────────────────────────────
function SettingsTab() {
  const { showToast, ls } = useApp();
  const [v, setV] = useState({
    supaUrl: ls.raw('nxt_supa_url',''),
    supaKey: ls.raw('nxt_supa_key',''),
    stripePk: ls.raw('nxt_stripe_pk',''),
    adminPw: ''
  });
  const envSupaUrl = import.meta.env.VITE_SUPA_URL;
  const envSupaKey = import.meta.env.VITE_SUPA_KEY;
  const envStripePk = import.meta.env.VITE_STRIPE_PK;
  const upd = k => e => setV(prev => ({ ...prev, [k]: e.target.value }));

  function save() {
    if (v.supaUrl) ls.setRaw('nxt_supa_url', v.supaUrl);
    if (v.supaKey) ls.setRaw('nxt_supa_key', v.supaKey);
    if (v.stripePk) ls.setRaw('nxt_stripe_pk', v.stripePk);
    if (v.adminPw.trim()) ls.setRaw('nxt_admin_pw', v.adminPw.trim());
    showToast('✅ Settings saved!');
  }

  async function testSupabase() {
    const url = import.meta.env.VITE_SUPA_URL || ls.raw('nxt_supa_url','');
    const key = import.meta.env.VITE_SUPA_KEY || ls.raw('nxt_supa_key','');
    if (!url || !key) { showToast('Enter URL and key first, then Save'); return; }
    const res = await fetch(`${url}/rest/v1/orders?limit=1`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (res.ok) showToast('✅ Supabase connected! orders table found.');
    else if (res.status === 404) showToast('⚠️ Connected but orders table missing — run the SQL setup');
    else showToast('❌ Error ' + res.status + ' — check URL and key');
  }

  async function testStorage() {
    const url = import.meta.env.VITE_SUPA_URL || ls.raw('nxt_supa_url','');
    const key = import.meta.env.VITE_SUPA_KEY || ls.raw('nxt_supa_key','');
    if (!url || !key) { showToast('Enter URL and key first, then Save'); return; }
    // Test by listing objects in bucket (correct endpoint)
    const res = await fetch(`${url}/storage/v1/object/list/nexa-media`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit: 1, offset: 0 }),
    });
    if (res.ok) showToast('✅ Storage bucket "nexa-media" is working! Image upload ready.');
    else if (res.status === 404) showToast('❌ Bucket "nexa-media" not found — go to Supabase → Storage → create it (public)');
    else if (res.status === 400) showToast('⚠️ Bucket exists but needs policy fix — run the SQL in Supabase SQL Editor');
    else showToast('❌ Storage error ' + res.status + ' — check your Supabase URL and key');
  }

  return (
    <div>
      <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 20 }}>Integrations & Settings</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="st-grid">
        <div className="aform-section">
          <div className="aform-title">🗄️ Supabase</div>
          {envSupaUrl ? (
            <div style={{ background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 12 }}>
              <div style={{ color: 'var(--gr)', fontWeight: 700, marginBottom: 4 }}>✅ Connected via Vercel Environment Variable</div>
              <div style={{ color: 'var(--mu)', fontSize: 11 }}>URL: {envSupaUrl.replace('https://','').slice(0,20)}…</div>
            </div>
          ) : (
            <div style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 12, color: '#f87171' }}>
              ⚠️ Not connected via env vars — add VITE_SUPA_URL and VITE_SUPA_KEY in Vercel dashboard
            </div>
          )}
          <p style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 14, lineHeight: 1.65 }}>If not using Vercel env vars, enter keys manually below:</p>
          <div className="afg"><label className="aflbl">Project URL (manual fallback)</label><input className="ainp" placeholder="https://xxxx.supabase.co" value={v.supaUrl} onChange={upd('supaUrl')} /></div>
          <div className="afg"><label className="aflbl">Anon / Public Key (manual fallback)</label><input className="ainp" placeholder="eyJhbGci…" value={v.supaKey} onChange={upd('supaKey')} /></div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
            <button className="abtn abtn-add" onClick={save}>💾 Save Manual Keys</button>
            <button className="abtn" onClick={testSupabase} style={{ color: 'var(--gr)', borderColor: 'rgba(34,197,94,.3)' }}>🔌 Test Orders DB</button>
            <button className="abtn" onClick={testStorage} style={{ color: '#60a5fa', borderColor: 'rgba(96,165,250,.3)' }}>🗂️ Test Storage</button>
          </div>
        </div>
        <div className="aform-section">
          <div className="aform-title">💳 Stripe</div>
          {envStripePk ? (
            <div style={{ background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 12 }}>
              <div style={{ color: 'var(--gr)', fontWeight: 700 }}>✅ Connected via Vercel Environment Variable</div>
            </div>
          ) : (
            <div style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 12, color: '#f87171' }}>
              ⚠️ Not connected — add VITE_STRIPE_PK in Vercel dashboard
            </div>
          )}
          <div className="afg"><label className="aflbl">Publishable Key (manual fallback)</label><input className="ainp" placeholder="pk_live_… or pk_test_…" value={v.stripePk} onChange={upd('stripePk')} /></div>
          <div style={{ fontSize: 11, color: '#f87171', marginBottom: 10 }}>⚠️ Only use the publishable key, never the secret key.</div>
          <button className="abtn abtn-add" onClick={save}>💾 Save</button>
        </div>
        <div className="aform-section">
          <div className="aform-title">🔐 Admin Password</div>
          <div className="afg"><label className="aflbl">New Password</label><input className="ainp" type="password" placeholder="Leave blank to keep current" value={v.adminPw} onChange={upd('adminPw')} /></div>
          <div style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 10 }}>Default: <code style={{ background: 'var(--s2)', padding: '1px 4px', borderRadius: 3 }}>nexa2024</code></div>
          <button className="abtn abtn-add" onClick={save}>💾 Save</button>
        </div>
        <div className="aform-section">
          <div className="aform-title">🗃️ Data Reset</div>
          <p style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 14, lineHeight: 1.65 }}>Resets products, categories, and store settings to defaults. Does NOT delete orders in Supabase or uploaded images.</p>
          <button onClick={() => { if (!window.confirm('Reset all data to defaults?')) return; ['nxt_prods','nxt_cats','nxt_store','nxt_pricing_cfg','nxt_pricing','nxt_custom_pages'].forEach(k => localStorage.removeItem(k)); showToast('✅ Reset done — reloading…'); setTimeout(() => window.location.reload(), 1200); }} style={{ padding: '9px 16px', borderRadius: 8, border: '1px solid rgba(239,68,68,.3)', background: 'rgba(239,68,68,.08)', color: '#f87171', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>⚠️ Reset All Data to Defaults</button>
        </div>
      </div>
      <style>{`.st-grid{@media(max-width:640px){grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}

// ── PAGES TAB ─────────────────────────────────────────────────────────────────
function PagesTab() {
  const { pages, setPages, showToast } = useApp();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title:'', slug:'', nav:false, content:'' });
  const BUILTIN = ['home','products','detail','cart','checkout','success','quote','contact','admin','faq','turnaround','shipping','returns','terms'];

  function startEdit(pg, idx) { setForm({ title:pg.title, slug:pg.slug, nav:pg.nav||false, content:pg.content||'' }); setEditing(idx); }
  function save() {
    if (!form.title.trim() || !form.slug.trim()) { showToast('Title and slug required'); return; }
    const slug = form.slug.toLowerCase().replace(/[^a-z0-9-]/g,'-');
    if (editing === 'new') setPages(prev => [...prev, { id:'cp-'+Date.now(), title:form.title, slug, nav:form.nav, content:form.content }]);
    else setPages(prev => prev.map((p,i) => i===editing ? {...p, title:form.title, slug, nav:form.nav, content:form.content} : p));
    showToast('✅ Page saved!'); setEditing(null);
  }

  if (editing !== null) return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
        <button className="abtn" onClick={() => setEditing(null)}>← Back</button>
        <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:22 }}>{editing==='new' ? 'New Page' : `Edit: ${form.title}`}</h2>
      </div>
      <div className="aform-section" style={{ maxWidth:720 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
          <div className="afg"><label className="aflbl">Page Title *</label><input className="ainp" placeholder="FAQ" value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} /></div>
          <div className="afg"><label className="aflbl">URL Slug * (e.g. faq)</label><input className="ainp" placeholder="faq" value={form.slug} onChange={e => setForm(f=>({...f,slug:e.target.value}))} /></div>
        </div>
        <div className="afg" style={{ display:'flex', alignItems:'center', gap:10 }}>
          <input type="checkbox" id="pg-nav" style={{ width:16,height:16 }} checked={form.nav} onChange={e => setForm(f=>({...f,nav:e.target.checked}))} />
          <label htmlFor="pg-nav" style={{ fontSize:13 }}>Show in footer navigation</label>
        </div>
        <div className="afg"><label className="aflbl">Content (HTML supported)</label>
          <textarea className="ainp" rows="12" style={{ fontFamily:"'DM Mono',monospace", fontSize:12, resize:'vertical' }} value={form.content} onChange={e => setForm(f=>({...f,content:e.target.value}))} />
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="abtn abtn-add" onClick={save}>💾 Save Page</button>
          <button className="abtn" onClick={() => setEditing(null)}>Cancel</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:24 }}>Pages</h2>
        <button className="abtn abtn-add" onClick={() => { setForm({title:'',slug:'',nav:false,content:''}); setEditing('new'); }}>+ New Page</button>
      </div>
      <div style={{ background:'var(--sf)', border:'1px solid var(--bd)', borderRadius:'var(--rl)', overflow:'hidden', marginBottom:16 }}>
        <div style={{ padding:'10px 16px', borderBottom:'1px solid var(--bd)', fontSize:10, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--mu)' }}>Built-in Pages</div>
        <table className="atable"><thead><tr><th>Page</th><th>URL</th><th>Type</th></tr></thead>
          <tbody>{BUILTIN.map(slug => (<tr key={slug}><td style={{ fontWeight:600, textTransform:'capitalize' }}>{slug.replace(/-/g,' ')}</td><td style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'var(--mu)' }}>/#{ slug}</td><td><span style={{ fontSize:10, padding:'2px 8px', borderRadius:10, background:'rgba(249,115,22,.1)', color:'var(--o)', border:'1px solid rgba(249,115,22,.2)', fontWeight:700 }}>Built-in</span></td></tr>))}</tbody>
        </table>
      </div>
      {pages.length > 0 && (
        <div style={{ background:'var(--sf)', border:'1px solid var(--bd)', borderRadius:'var(--rl)', overflow:'hidden' }}>
          <div style={{ padding:'10px 16px', borderBottom:'1px solid var(--bd)', fontSize:10, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--mu)' }}>Custom Pages ({pages.length})</div>
          <table className="atable"><thead><tr><th>Title</th><th>Slug</th><th>In Nav</th><th>Actions</th></tr></thead>
            <tbody>{pages.map((pg,i) => (<tr key={pg.id}><td style={{ fontWeight:600 }}>{pg.title}</td><td style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'var(--mu)' }}>/#{ pg.slug}</td><td>{pg.nav ? <span className="badge-green">Yes</span> : <span style={{ color:'var(--mu)',fontSize:12 }}>No</span>}</td>
              <td style={{ display:'flex', gap:6 }}><button className="abtn" onClick={() => startEdit(pg,i)}>✏️ Edit</button><button className="abtn" onClick={() => { if(window.confirm('Delete this page?')) { setPages(prev=>prev.filter((_,pi)=>pi!==i)); showToast('Deleted.'); }}} style={{ color:'#f87171', borderColor:'rgba(239,68,68,.3)' }}>Delete</button></td>
            </tr>))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── EMAILS TAB ────────────────────────────────────────────────────────────────
function EmailsTab() {
  const { showToast, ls } = useApp();
  const [v, setV] = useState({ tgToken:ls.raw('nxt_tg_token',''), tgChat:ls.raw('nxt_tg_chatid',''), ejsSvc:ls.raw('nxt_ejs_svc',''), ejsTpl:ls.raw('nxt_ejs_tpl',''), ejsKey:ls.raw('nxt_ejs_key',''), ejsTo:ls.raw('nxt_ejs_to',''), sendCust:ls.raw('nxt_send_cust','')==='1' });
  const upd = k => e => setV(prev => ({ ...prev, [k]: e.target.type==='checkbox' ? e.target.checked : e.target.value }));

  function save() {
    ls.setRaw('nxt_tg_token',v.tgToken); ls.setRaw('nxt_tg_chatid',v.tgChat);
    ls.setRaw('nxt_ejs_svc',v.ejsSvc); ls.setRaw('nxt_ejs_tpl',v.ejsTpl);
    ls.setRaw('nxt_ejs_key',v.ejsKey); ls.setRaw('nxt_ejs_to',v.ejsTo);
    ls.setRaw('nxt_send_cust',v.sendCust?'1':'0');
    showToast('✅ Email settings saved!');
  }

  function testTelegram() {
    if (!v.tgToken||!v.tgChat) { showToast('Enter Bot Token and Chat ID first'); return; }
    fetch(`https://api.telegram.org/bot${v.tgToken}/sendMessage?chat_id=${v.tgChat}&text=${encodeURIComponent('✅ Test from Nexa Customs! Notifications working.')}`)
      .then(r=>r.json()).then(d => d.ok ? showToast('✅ Test sent to Telegram!') : showToast('❌ '+(d.description||'check token/chat ID')))
      .catch(() => showToast('❌ Network error'));
  }

  return (
    <div>
      <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:24, marginBottom:8 }}>Order Notifications & Email</h2>
      <p style={{ fontSize:13, color:'var(--mu)', marginBottom:24 }}>Set up Telegram for instant phone alerts on every new order. Optional EmailJS for confirmation emails.</p>
      <div className="acard">
        <div className="acard-head"><span style={{ background:'rgba(0,136,204,.15)', color:'#0af', padding:'3px 10px', borderRadius:6, fontSize:10, fontWeight:800, textTransform:'uppercase' }}>Recommended · Free</span><span style={{ fontWeight:700, fontSize:14, marginLeft:8 }}>Telegram — Instant Order Notifications</span></div>
        <div className="acard-body">
          <div className="acard-steps">
            <div className="astep"><span className="astep-n">1</span><span>Open Telegram → search <code>@BotFather</code> → send <code>/newbot</code> → copy the <strong>Bot Token</strong></span></div>
            <div className="astep"><span className="astep-n">2</span><span>Search <code>@userinfobot</code> → send any message → copy your <strong>Chat ID</strong></span></div>
            <div className="astep"><span className="astep-n">3</span><span>Paste below → Save → click Send Test to verify it works</span></div>
          </div>
          <div className="aform-row">
            <div className="aform-grp"><label className="aform-lbl">Bot Token</label><input className="ainp" value={v.tgToken} onChange={upd('tgToken')} placeholder="123456789:ABCdef…" /></div>
            <div className="aform-grp"><label className="aform-lbl">Your Chat ID</label><input className="ainp" value={v.tgChat} onChange={upd('tgChat')} placeholder="123456789" /></div>
          </div>
          <div style={{ display:'flex', gap:10, marginTop:14 }}>
            <button className="abtn abtn-add" onClick={save} style={{ flex:1 }}>💾 Save</button>
            <button className="abtn" onClick={testTelegram} style={{ background:'rgba(0,170,255,.1)', color:'#0af', borderColor:'rgba(0,170,255,.3)' }}>▶ Send Test Message</button>
          </div>
        </div>
      </div>
      <div className="acard">
        <div className="acard-head"><span style={{ background:'var(--ol)', color:'var(--o)', padding:'3px 10px', borderRadius:6, fontSize:10, fontWeight:800, textTransform:'uppercase' }}>Optional</span><span style={{ fontWeight:700, fontSize:14, marginLeft:8 }}>EmailJS — Order Confirmation Emails</span><span style={{ fontSize:11, color:'var(--mu)', marginLeft:6 }}>Free up to 200/month · emailjs.com</span></div>
        <div className="acard-body">
          <div className="acard-steps">
            <div className="astep"><span className="astep-n">1</span><span>Sign up at <code>emailjs.com</code> → Email Services → Add Service → connect Gmail/Outlook → copy <strong>Service ID</strong></span></div>
            <div className="astep"><span className="astep-n">2</span><span>Email Templates → Create → use <code>{'{{order_id}}'}</code> <code>{'{{customer_name}}'}</code> <code>{'{{order_items}}'}</code> <code>{'{{total}}'}</code> → copy <strong>Template ID</strong></span></div>
            <div className="astep"><span className="astep-n">3</span><span>Account → General → Public Key → copy it</span></div>
          </div>
          <div className="aform-row" style={{ marginBottom:10 }}>
            <div className="aform-grp"><label className="aform-lbl">Service ID</label><input className="ainp" value={v.ejsSvc} onChange={upd('ejsSvc')} placeholder="service_abc123" /></div>
            <div className="aform-grp"><label className="aform-lbl">Template ID</label><input className="ainp" value={v.ejsTpl} onChange={upd('ejsTpl')} placeholder="template_xyz789" /></div>
          </div>
          <div className="aform-row" style={{ marginBottom:10 }}>
            <div className="aform-grp"><label className="aform-lbl">Public Key</label><input className="ainp" value={v.ejsKey} onChange={upd('ejsKey')} placeholder="user_abc…" /></div>
            <div className="aform-grp"><label className="aform-lbl">Notify Email (your inbox)</label><input className="ainp" value={v.ejsTo} onChange={upd('ejsTo')} placeholder="info@nexacustoms.ca" /></div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
            <input type="checkbox" id="send-cust" style={{ width:16,height:16 }} checked={v.sendCust} onChange={upd('sendCust')} />
            <label htmlFor="send-cust" style={{ fontSize:13 }}>Also email confirmation to the customer</label>
          </div>
          <button className="abtn abtn-add" onClick={save}>💾 Save Email Settings</button>
        </div>
      </div>
    </div>
  );
}

// ── PRICING TAB ───────────────────────────────────────────────────────────────
function PricingTab() {
  const { prods, setProds, pricing, setPricing, showToast } = useApp();
  const [cfg, setCfg] = useState({ ...pricing });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  function saveCfg() { setPricing(cfg); showToast('✅ Global config saved!'); }

  const filtered = prods.filter(p =>
    !search.trim() || p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (editingId) {
    const prod = prods.find(p => p.id === editingId);
    if (!prod) return null;
    return (
      <FullProductEditor
        prod={prod}
        onSave={updated => {
          setProds(prev => prev.map(p => p.id === updated.id ? updated : p));
          setEditingId(null);
          showToast('✅ Product saved!');
        }}
        onCancel={() => setEditingId(null)}
      />
    );
  }

  return (
    <div>
      <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:24, marginBottom:20 }}>Pricing & Options Editor</h2>
      <div className="aform-section" style={{ maxWidth:560, marginBottom:28 }}>
        <div className="aform-title">⚙️ Global Settings</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {[['hst','HST Rate','0.13 = 13%'],['shipping_post','Canada Post ($)','flat'],['shipping_courier','Courier ($)','FedEx/UPS'],['rush_pct','Rush Surcharge','0.25=25%'],['express_pct','Express Surcharge','0.50=50%']].map(([k,l,n]) => (
            <div key={k} className="afg">
              <label className="aflbl">{l} <span style={{ color:'var(--mu)', fontWeight:400, textTransform:'none' }}>({n})</span></label>
              <input type="number" step="0.01" className="ainp" value={cfg[k]} onChange={e => setCfg(c=>({...c,[k]:parseFloat(e.target.value)||0}))} />
            </div>
          ))}
        </div>
        <button className="abtn abtn-add" style={{ marginTop:8 }} onClick={saveCfg}>💾 Save Global Config</button>
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, gap:12, flexWrap:'wrap' }}>
        <div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:20 }}>Product Pricing & Options — {prods.length} Products</div>
          <div style={{ fontSize:11, color:'var(--mu)', marginTop:2 }}>Click Full Edit on any product to control prices, qty tiers, options and multipliers.</div>
        </div>
        <input className="finp" style={{ width:220, fontSize:12 }} placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div style={{ background:'var(--sf)', border:'1px solid var(--bd)', borderRadius:'var(--rl)', overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table className="atable">
            <thead><tr><th>Product</th><th>Qty Tiers</th><th>Option Groups</th><th>Base Price</th><th>Type</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight:600 }}>{p.name}</td>
                  <td style={{ color:'var(--mu)', fontSize:12 }}>{p.pricing.length} tiers</td>
                  <td style={{ color:'var(--mu)', fontSize:12 }}>{(p.opts||[]).length} groups · {(p.opts||[]).reduce((s,g)=>s+(g.opts||[]).length,0)} total options</td>
                  <td style={{ color:'var(--o)', fontFamily:"'DM Mono',monospace" }}>${p.pricing[0]?.p.toFixed(2)}</td>
                  <td><span style={{ fontSize:10, padding:'2px 7px', borderRadius:6, background:p.sqft?.enabled?'rgba(96,165,250,.1)':'rgba(249,115,22,.1)', color:p.sqft?.enabled?'#60a5fa':'var(--o)', border:`1px solid ${p.sqft?.enabled?'rgba(96,165,250,.3)':'rgba(249,115,22,.3)'}`, fontWeight:700 }}>{p.sqft?.enabled?'Sq Ft':'Tiered'}</span></td>
                  <td><button className="abtn abtn-add" onClick={() => setEditingId(p.id)}>✏️ Full Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── FULL PRODUCT EDITOR ────────────────────────────────────────────────────────
function FullProductEditor({ prod, onSave, onCancel }) {
  const [p, setP] = useState(JSON.parse(JSON.stringify(prod)));
  const upd = k => v => setP(prev => ({ ...prev, [k]: v }));

  function updTierPrice(ti, val) { const np=[...p.pricing]; np[ti]={...np[ti],p:parseFloat(val)||0}; upd('pricing')(np); }
  function updTierQty(ti, val) { const np=[...p.pricing]; np[ti]={...np[ti],q:parseInt(val)||0}; upd('pricing')(np); }
  function addTier() { upd('pricing')([...p.pricing, { q:0, p:0 }]); }
  function removeTier(ti) { upd('pricing')(p.pricing.filter((_,i)=>i!==ti)); }

  function addGroup() { upd('opts')([...(p.opts||[]), { key:'group-'+Date.now(), label:'New Group', opts:[{id:'opt1',l:'Option 1',m:1.0}] }]); }
  function removeGroup(gi) { upd('opts')((p.opts||[]).filter((_,i)=>i!==gi)); }
  function updGroup(gi, field, val) { const ng=[...(p.opts||[])]; ng[gi]={...ng[gi],[field]:val}; upd('opts')(ng); }
  function addOption(gi) { const ng=[...(p.opts||[])]; ng[gi]={...ng[gi],opts:[...ng[gi].opts,{id:'opt-'+Date.now(),l:'New Choice',m:1.0}]}; upd('opts')(ng); }
  function removeOption(gi, oi) { const ng=[...(p.opts||[])]; ng[gi]={...ng[gi],opts:ng[gi].opts.filter((_,i)=>i!==oi)}; upd('opts')(ng); }
  function updOption(gi, oi, field, val) { const ng=[...(p.opts||[])]; const no=[...ng[gi].opts]; no[oi]={...no[oi],[field]:field==='m'?(parseFloat(val)||1.0):val}; ng[gi]={...ng[gi],opts:no}; upd('opts')(ng); }

  const inp = { width:'100%', background:'var(--s2)', border:'1px solid var(--bd)', color:'var(--tx)', padding:'7px 10px', borderRadius:6, fontSize:12, outline:'none', fontFamily:"'DM Sans',sans-serif" };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
        <button className="abtn" onClick={onCancel}>← Back to List</button>
        <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:22 }}>Editing: {prod.name}</h2>
      </div>

      {/* Rush / Express availability */}
      <div className="aform-section" style={{ marginBottom:18 }}>
        <div className="aform-title">⚡ Turnaround Availability</div>
        <p style={{ fontSize:11, color:'var(--mu)', marginBottom:12, lineHeight:1.65 }}>
          Control which turnaround options customers can select for this product on the product page.
        </p>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
          {[
            { key:'rush_ok',    label:'Rush (2–3 days)',    ico:'⚡', pct: Math.round((pricing?.rush_pct??0.25)*100) },
            { key:'express_ok', label:'Express (same/next day)', ico:'🚀', pct: Math.round((pricing?.express_pct??0.50)*100) },
          ].map(({ key, label, ico, pct }) => {
            const val = p[key] !== false;
            return (
              <div key={key} onClick={() => upd(key)(!val)}
                style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 18px', borderRadius:10, border:`2px solid ${val ? 'var(--o)' : 'var(--bd)'}`, background: val ? 'rgba(249,115,22,.08)' : 'var(--s2)', cursor:'pointer', transition:'all .15s', userSelect:'none' }}>
                <div style={{ fontSize:22 }}>{ico}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:13 }}>{label}</div>
                  <div style={{ fontSize:11, color:'var(--mu)' }}>+{pct}% surcharge</div>
                </div>
                <div style={{ marginLeft:8, width:22, height:22, borderRadius:6, background: val ? 'var(--o)' : 'var(--bd)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, color: val ? '#000' : 'var(--mu)', fontWeight:800, transition:'all .15s' }}>
                  {val ? '✓' : '✗'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }} className="ed-grid">

        {/* Left — qty tiers */}
        <div>
          <div className="aform-section">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <div className="aform-title" style={{ marginBottom:0 }}>📦 Quantity Tiers & Prices</div>
              <button className="abtn abtn-add" style={{ fontSize:11 }} onClick={addTier}>+ Add Tier</button>
            </div>
            <p style={{ fontSize:11, color:'var(--mu)', marginBottom:14, lineHeight:1.65 }}>
              Base price per quantity. Option multipliers stack on top at checkout.<br/>
              Example: $49.92 base × Double Sided (1.22) = $60.90
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:8, marginBottom:6 }}>
              <div style={{ fontSize:9, color:'var(--mu)', textTransform:'uppercase', fontWeight:700, letterSpacing:'.06em' }}>Quantity</div>
              <div style={{ fontSize:9, color:'var(--mu)', textTransform:'uppercase', fontWeight:700, letterSpacing:'.06em' }}>Base Price ($)</div>
              <div></div>
            </div>
            {p.pricing.map((tier, ti) => (
              <div key={ti} style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:8, marginBottom:8, alignItems:'center' }}>
                <input type="number" min="1" value={tier.q} onChange={e => updTierQty(ti, e.target.value)} style={inp} placeholder="e.g. 100" />
                <div style={{ display:'flex', alignItems:'center', border:'1px solid var(--bd)', borderRadius:6, overflow:'hidden', background:'var(--s2)' }}>
                  <span style={{ padding:'0 8px', color:'var(--mu)', fontSize:12 }}>$</span>
                  <input type="number" step="0.01" min="0" value={tier.p} onChange={e => updTierPrice(ti, e.target.value)} style={{ flex:1, background:'transparent', border:'none', color:'var(--tx)', padding:'7px 5px', fontSize:12, outline:'none' }} />
                </div>
                <button onClick={() => removeTier(ti)} style={{ padding:'6px 9px', borderRadius:6, border:'1px solid rgba(239,68,68,.3)', background:'rgba(239,68,68,.08)', color:'#f87171', cursor:'pointer', fontSize:12 }}>✕</button>
              </div>
            ))}
          </div>

          {p.sqft?.enabled && (
            <div className="aform-section" style={{ marginTop:14 }}>
              <div className="aform-title">📐 Sq Ft Pricing</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <div className="afg">
                  <label className="aflbl">Rate per Sq Ft ($)</label>
                  <div style={{ display:'flex', alignItems:'center', border:'1px solid var(--bd)', borderRadius:6, overflow:'hidden', background:'var(--s2)' }}>
                    <span style={{ padding:'0 8px', color:'var(--mu)', fontSize:12 }}>$</span>
                    <input type="number" step="0.25" value={p.sqft.rate} onChange={e => upd('sqft')({...p.sqft, rate:parseFloat(e.target.value)||p.sqft.rate})} style={{ flex:1, background:'transparent', border:'none', color:'var(--tx)', padding:'7px 5px', fontSize:12, outline:'none' }} />
                  </div>
                </div>
                <div className="afg">
                  <label className="aflbl">Min Sq Ft</label>
                  <input type="number" step="0.5" value={p.sqft.min} onChange={e => upd('sqft')({...p.sqft, min:parseFloat(e.target.value)||p.sqft.min})} style={inp} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right — option groups */}
        <div>
          <div className="aform-section">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <div className="aform-title" style={{ marginBottom:0 }}>🎛️ Option Groups</div>
              <button className="abtn abtn-add" style={{ fontSize:11 }} onClick={addGroup}>+ Add Group</button>
            </div>
            <p style={{ fontSize:11, color:'var(--mu)', marginBottom:14, lineHeight:1.65 }}>
              Each group = choices shown to customer (Coating, Size, Sides, etc.).<br/>
              Multiplier: 1.0 = no change · 1.22 = +22% · 0.95 = -5%
            </p>

            {(p.opts||[]).length === 0 && (
              <div style={{ textAlign:'center', padding:'20px 0', color:'var(--mu)', fontSize:13 }}>No option groups. Click "+ Add Group" to create one.</div>
            )}

            {(p.opts||[]).map((g, gi) => (
              <div key={gi} style={{ background:'var(--dk)', border:'1px solid var(--bd)', borderRadius:10, padding:14, marginBottom:12 }}>
                <div style={{ display:'flex', gap:8, marginBottom:10, alignItems:'flex-end' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:9, color:'var(--mu)', marginBottom:3, textTransform:'uppercase', letterSpacing:'.05em', fontWeight:700 }}>Group Label</div>
                    <input value={g.label} onChange={e => updGroup(gi,'label',e.target.value)} style={inp} placeholder="e.g. Coating" />
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:9, color:'var(--mu)', marginBottom:3, textTransform:'uppercase', letterSpacing:'.05em', fontWeight:700 }}>Key (no spaces)</div>
                    <input value={g.key} onChange={e => updGroup(gi,'key',e.target.value.toLowerCase().replace(/\s+/g,'-'))} style={{...inp, fontFamily:"'DM Mono',monospace"}} placeholder="e.g. coat" />
                  </div>
                  <button onClick={() => removeGroup(gi)} style={{ padding:'7px 10px', borderRadius:6, border:'1px solid rgba(239,68,68,.3)', background:'rgba(239,68,68,.08)', color:'#f87171', cursor:'pointer', fontSize:12, flexShrink:0 }}>✕ Remove</button>
                </div>
                <div style={{ marginBottom:8 }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr 70px auto', gap:5, marginBottom:5, padding:'0 2px' }}>
                    <div style={{ fontSize:9, color:'var(--mu)', textTransform:'uppercase', fontWeight:700 }}>Option Label</div>
                    <div style={{ fontSize:9, color:'var(--mu)', textTransform:'uppercase', fontWeight:700 }}>ID Key</div>
                    <div style={{ fontSize:9, color:'var(--mu)', textTransform:'uppercase', fontWeight:700 }}>Mult</div>
                    <div></div>
                  </div>
                  {g.opts.map((o, oi) => (
                    <div key={oi} style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr 70px auto', gap:5, marginBottom:6, alignItems:'center' }}>
                      <input value={o.l} onChange={e => updOption(gi,oi,'l',e.target.value)} style={{...inp,fontSize:11}} placeholder="UV Gloss" />
                      <input value={o.id} onChange={e => updOption(gi,oi,'id',e.target.value.toLowerCase().replace(/\s+/g,'-'))} style={{...inp,fontSize:10,fontFamily:"'DM Mono',monospace"}} placeholder="uv" />
                      <input type="number" step="0.01" value={o.m} onChange={e => updOption(gi,oi,'m',e.target.value)} style={{...inp,fontSize:11,textAlign:'center'}} />
                      <button onClick={() => removeOption(gi,oi)} style={{ padding:'5px 7px', borderRadius:5, border:'1px solid rgba(239,68,68,.3)', background:'rgba(239,68,68,.08)', color:'#f87171', cursor:'pointer', fontSize:11 }}>✕</button>
                    </div>
                  ))}
                </div>
                <button className="abtn" style={{ fontSize:11, padding:'4px 12px' }} onClick={() => addOption(gi)}>+ Add Choice</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background:'var(--sf)', border:'1px solid var(--bd)', borderRadius:10, padding:'12px 16px', marginTop:14, fontSize:11, color:'var(--mu)', lineHeight:1.7 }}>
        <strong style={{ color:'var(--tx)' }}>💡 Multiplier Reference:</strong>{" "}
        1.0 = no change · 1.05 = +5% · 1.10 = +10% · 1.15 = +15% · 1.22 = +22% · 1.25 = +25% · 1.50 = +50% · 0.95 = -5% · 0.90 = -10%
      </div>

      <div style={{ display:'flex', gap:10, marginTop:18 }}>
        <button className="abtn abtn-add" onClick={() => onSave(p)} style={{ fontSize:14, padding:'10px 24px' }}>💾 Save All Changes</button>
        <button className="abtn" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ── ORDERS TAB ────────────────────────────────────────────────────────────────
function OrdersTab() {
  const { ls, showToast } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  async function loadOrders() {
    const url = import.meta.env.VITE_SUPA_URL || ls.raw('nxt_supa_url', '');
    const key = import.meta.env.VITE_SUPA_KEY || ls.raw('nxt_supa_key', '');
    if (!url || !key || key.length < 10) {
      showToast('⚠️ Configure Supabase in Settings tab or Vercel env vars');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${url}/rest/v1/orders?order=created_at.desc&limit=200`, {
        headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        const err = await res.text();
        showToast('❌ Error loading orders: ' + res.status);
        console.error(err);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      showToast('❌ Network error: ' + e.message);
    }
    setLoading(false);
  }

  async function updateStatus(id, status) {
    const url = import.meta.env.VITE_SUPA_URL || ls.raw('nxt_supa_url', '');
    const key = import.meta.env.VITE_SUPA_KEY || ls.raw('nxt_supa_key', '');
    await fetch(`${url}/rest/v1/orders?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ status }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
    showToast('✅ Status updated to ' + status);
  }

  const STATUS_COLORS = {
    'New':        { bg: 'rgba(249,115,22,.15)', color: 'var(--o)',  border: 'rgba(249,115,22,.3)' },
    'In Progress':{ bg: 'rgba(96,165,250,.15)', color: '#60a5fa',   border: 'rgba(96,165,250,.3)' },
    'Ready':      { bg: 'rgba(34,197,94,.15)',  color: 'var(--gr)', border: 'rgba(34,197,94,.3)' },
    'Completed':  { bg: 'rgba(100,100,100,.15)',color: '#888',      border: 'rgba(100,100,100,.3)' },
    'Cancelled':  { bg: 'rgba(239,68,68,.15)',  color: '#f87171',   border: 'rgba(239,68,68,.3)' },
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + (parseFloat(o.total) || 0), 0);
  const newCount = orders.filter(o => o.status === 'New').length;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 24 }}>Orders</h2>
        <button className="abtn abtn-add" onClick={loadOrders} disabled={loading}>
          {loading ? '⏳ Loading…' : '🔄 Load / Refresh Orders'}
        </button>
      </div>

      {/* Stats */}
      {orders.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }} className="ord-stats">
          {[
            ['📦', 'Total Orders', orders.length, ''],
            ['🆕', 'New', newCount, newCount > 0 ? 'var(--o)' : 'var(--mu)'],
            ['💰', 'Total Revenue', `$${totalRevenue.toFixed(2)}`, 'var(--gr)'],
            ['✅', 'Completed', orders.filter(o => o.status === 'Completed').length, ''],
          ].map(([ico, label, val, color]) => (
            <div key={label} style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 12, padding: '16px 18px' }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{ico}</div>
              <div style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 2 }}>{label}</div>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 24, color: color || 'var(--tx)' }}>{val}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      {orders.length > 0 && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
          {['all', 'New', 'In Progress', 'Ready', 'Completed', 'Cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", border: `1px solid ${filter === f ? 'var(--o)' : 'var(--bd)'}`, background: filter === f ? 'rgba(249,115,22,.12)' : 'var(--s2)', color: filter === f ? 'var(--o)' : 'var(--mu)' }}>
              {f === 'all' ? `All (${orders.length})` : `${f} (${orders.filter(o => o.status === f).length})`}
            </button>
          ))}
        </div>
      )}

      {orders.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--mu)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>No orders loaded yet</div>
          <div style={{ fontSize: 13, marginBottom: 20 }}>Click "Load / Refresh Orders" to fetch from Supabase</div>
          <div style={{ fontSize: 12, background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 10, padding: '14px 18px', maxWidth: 420, margin: '0 auto', textAlign: 'left', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--o)' }}>⚠️ No orders showing?</strong><br />
            Make sure you've:<br />
            1. Added Supabase URL + key in Settings tab<br />
            2. Created the <code style={{ background: 'var(--s2)', padding: '1px 4px', borderRadius: 3 }}>orders</code> table (see SQL below)
          </div>
        </div>
      )}

      {/* Orders table */}
      {filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 16 }} className="ord-layout">
          <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="atable">
                <thead>
                  <tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {filtered.map(o => {
                    const sc = STATUS_COLORS[o.status] || STATUS_COLORS['New'];
                    const date = o.created_at ? new Date(o.created_at).toLocaleDateString('en-CA', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }) : '—';
                    return (
                      <tr key={o.id} onClick={() => setSelected(selected?.id === o.id ? null : o)} style={{ cursor: 'pointer', background: selected?.id === o.id ? 'rgba(249,115,22,.06)' : 'transparent' }}>
                        <td style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: 'var(--o)', fontWeight: 700 }}>{o.order_number || o.id}</td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{o.customer_name}</div>
                          <div style={{ fontSize: 11, color: 'var(--mu)' }}>{o.customer_email}</div>
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--mu)', maxWidth: 180 }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.items}</div>
                        </td>
                        <td style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 18, color: 'var(--o)' }}>${parseFloat(o.total || 0).toFixed(2)}</td>
                        <td><span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 6, background: o.payment_method === 'stripe' ? 'rgba(99,102,241,.15)' : 'rgba(34,197,94,.1)', color: o.payment_method === 'stripe' ? '#818cf8' : 'var(--gr)', border: `1px solid ${o.payment_method === 'stripe' ? 'rgba(99,102,241,.3)' : 'rgba(34,197,94,.2)'}`, fontWeight: 700 }}>{o.payment_method === 'stripe' ? '💳 Card' : '🏪 Pickup'}</span></td>
                        <td><span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 700, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>{o.status || 'New'}</span></td>
                        <td style={{ fontSize: 11, color: 'var(--mu)', whiteSpace: 'nowrap' }}>{date}</td>
                        <td><button className="abtn" onClick={e => { e.stopPropagation(); setSelected(selected?.id === o.id ? null : o); }}>View</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order detail panel */}
          {selected && (
            <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 22, position: 'sticky', top: 76, alignSelf: 'start', maxHeight: '85vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 20 }}>Order Detail</div>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--mu)', fontSize: 18, cursor: 'pointer' }}>✕</button>
              </div>

              {/* Order number */}
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 16, color: 'var(--o)', fontWeight: 700, marginBottom: 14, background: 'rgba(249,115,22,.08)', border: '1px solid rgba(249,115,22,.2)', borderRadius: 8, padding: '8px 12px' }}>{selected.order_number || selected.id}</div>

              {/* Customer info */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>Customer</div>
                {[['Name', selected.customer_name], ['Email', selected.customer_email], ['Phone', selected.customer_phone], ['Company', selected.company]].filter(([,v]) => v).map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6, gap: 12 }}>
                    <span style={{ color: 'var(--mu)', flexShrink: 0 }}>{l}</span>
                    <span style={{ fontWeight: 600, textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ height: 1, background: 'var(--bd)', margin: '12px 0' }} />

              {/* Order info */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>Order Info</div>
                <div style={{ fontSize: 12, color: 'var(--mu)', marginBottom: 8, lineHeight: 1.6 }}><strong style={{ color: 'var(--tx)' }}>Items:</strong> {selected.items}</div>
                {[['Delivery', selected.delivery], ['Turnaround', selected.turnaround], ['Payment', selected.payment_method], ['Source', selected.source]].filter(([,v]) => v).map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                    <span style={{ color: 'var(--mu)' }}>{l}</span>
                    <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>Total</span>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 26, color: 'var(--o)' }}>${parseFloat(selected.total || 0).toFixed(2)}</span>
                </div>
              </div>

              <div style={{ height: 1, background: 'var(--bd)', margin: '12px 0' }} />

              {/* Update status */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>Update Status</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {['New', 'In Progress', 'Ready', 'Completed', 'Cancelled'].map(s => {
                    const sc = STATUS_COLORS[s];
                    const isActive = selected.status === s;
                    return (
                      <button key={s} onClick={() => updateStatus(selected.id, s)} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${isActive ? sc.border : 'var(--bd)'}`, background: isActive ? sc.bg : 'var(--s2)', color: isActive ? sc.color : 'var(--mu)', fontWeight: isActive ? 700 : 500, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", textAlign: 'left', transition: 'all .15s' }}>
                        {isActive ? '● ' : '○ '}{s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick actions */}
              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <a href={`mailto:${selected.customer_email}?subject=Your Nexa Customs Order ${selected.order_number}`} style={{ flex: 1, padding: '9px 12px', borderRadius: 8, border: '1px solid var(--bd)', background: 'var(--s2)', color: 'var(--tx)', fontSize: 12, fontWeight: 600, textAlign: 'center', cursor: 'pointer', textDecoration: 'none', display: 'block' }}>✉️ Email</a>
                <a href={`tel:${selected.customer_phone}`} style={{ flex: 1, padding: '9px 12px', borderRadius: 8, border: '1px solid var(--bd)', background: 'var(--s2)', color: 'var(--tx)', fontSize: 12, fontWeight: 600, textAlign: 'center', cursor: 'pointer', textDecoration: 'none', display: 'block' }}>📞 Call</a>
              </div>
            </div>
          )}
        </div>
      )}
      <style>{`
        .ord-stats { @media(max-width:640px) { grid-template-columns:1fr 1fr !important; } }
        .ord-layout { @media(max-width:1060px) { grid-template-columns:1fr !important; } }
      `}</style>
    </div>
  );
}
