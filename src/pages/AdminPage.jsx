import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CAT_BG } from '../data/products';

const TABS = [
  { id: 'products',    label: '🖨️ Products' },
  { id: 'categories',  label: '📁 Categories' },
  { id: 'appearance',  label: '🎨 Appearance' },
  { id: 'settings',    label: '⚙️ Settings' },
  { id: 'pages',       label: '📄 Pages' },
  { id: 'emails',      label: '📬 Emails' },
  { id: 'pricing',     label: '💰 Pricing' },
];

export default function AdminPage() {
  const { go, adminAuthed, setAdminAuthed, showToast, ls } = useApp();
  const [tab, setTab] = useState('products');
  const [pw, setPw] = useState('');

  function checkPw() {
    const saved = ls.raw('nxt_admin_pw', 'nexa2024');
    if (pw === saved) { setAdminAuthed(true); ls.setRaw('nxt_admin_auth', 'true'); }
    else showToast('❌ Incorrect password');
  }

  function logout() { setAdminAuthed(false); ls.setRaw('nxt_admin_auth', ''); go('home'); showToast('Signed out.'); }

  if (!adminAuthed) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 36, maxWidth: 380, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⚙️</div>
          <h2 className="D" style={{ fontSize: 28, marginBottom: 20 }}>Admin Access</h2>
          <div className="fgrp"><label className="flbl">Password</label>
            <input className="finp" type="password" placeholder="Enter admin password" value={pw}
              onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && checkPw()} />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={checkPw}>Sign In →</button>
          <div style={{ marginTop: 16 }}><span onClick={() => go('home')} style={{ fontSize: 12, color: 'var(--mu)', cursor: 'pointer' }}>← Back to Store</span></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Admin header */}
      <div style={{ background: 'var(--dk)', borderBottom: '1px solid var(--bd)' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 28px', minHeight: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 17, color: 'var(--o)', textTransform: 'uppercase', whiteSpace: 'nowrap', marginRight: 8 }}>⚙️ Admin</div>
            <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }} className="admin-tabs">
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
        {tab === 'products'   && <ProductsTab />}
        {tab === 'categories' && <CategoriesTab />}
        {tab === 'appearance' && <AppearanceTab />}
        {tab === 'settings'   && <SettingsTab />}
        {tab === 'pages'      && <PagesTab />}
        {tab === 'emails'     && <EmailsTab />}
        {tab === 'pricing'    && <PricingTab />}
      </div>

      <style>{`
        @media(max-width:1060px){.admin-tabs{gap:2px}.admin-tabs button{padding:5px 9px !important;font-size:11px !important}}
      `}</style>
    </div>
  );
}

// ── PRODUCTS TAB ─────────────────────────────────────────────────────────────
function ProductsTab() {
  const { prods, setProds, cats, showToast } = useApp();
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  const filtered = prods.filter(p =>
    (filterCat === 'all' || p.cat === filterCat) &&
    (!search.trim() || p.name.toLowerCase().includes(search.toLowerCase()))
  );

  function saveEdit(updated) {
    setProds(prev => prev.map(p => p.id === updated.id ? updated : p));
    setEditing(null);
    showToast('✅ Product saved!');
  }

  function toggleDisable(id) {
    setProds(prev => prev.map(p => p.id === id ? { ...p, disabled: !p.disabled } : p));
    showToast('Updated.');
  }

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
            <thead><tr><th>Product</th><th>Category</th><th>From Price</th><th>Badge</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(p => {
                const cat = cats.find(c => c.id === p.cat);
                return (
                  <tr key={p.id} style={{ opacity: p.disabled ? 0.45 : 1 }}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td style={{ color: 'var(--mu)', fontSize: 12 }}>{cat?.l || p.cat}</td>
                    <td style={{ color: 'var(--o)', fontFamily: "'DM Mono',monospace" }}>${p.pricing[0]?.p.toFixed(2)}</td>
                    <td>{p.badge && <span className="badge-orange">{p.badge}</span>}</td>
                    <td><span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 700, background: p.disabled ? 'rgba(239,68,68,.1)' : 'rgba(34,197,94,.1)', color: p.disabled ? '#f87171' : 'var(--gr)', border: `1px solid ${p.disabled ? 'rgba(239,68,68,.2)' : 'rgba(34,197,94,.2)'}` }}>{p.disabled ? 'Hidden' : 'Active'}</span></td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      <button className="abtn" onClick={() => setEditing({ ...p })}>Edit</button>
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

function ProductEditor({ prod, cats, onSave, onCancel }) {
  const [p, setP] = useState({ ...prod, pricing: prod.pricing.map(t => ({ ...t })) });
  const upd = k => v => setP(prev => ({ ...prev, [k]: v }));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <button className="abtn" onClick={onCancel}>← Back</button>
        <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 22 }}>Edit: {prod.name}</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="ed-grid">
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
        <div className="aform-section">
          <div className="aform-title">Pricing Tiers</div>
          <p style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 12 }}>Edit base price for each quantity tier. Option multipliers apply on top.</p>
          {p.pricing.map((tier, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--mu)', width: 64, flexShrink: 0, fontFamily: "'DM Mono',monospace" }}>Qty {tier.q >= 1000 ? (tier.q / 1000) + 'K' : tier.q}</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--bd)', borderRadius: 7, overflow: 'hidden', background: 'var(--dk)', flex: 1 }}>
                <span style={{ padding: '0 8px', color: 'var(--mu)', fontSize: 13 }}>$</span>
                <input type="number" step="0.01" min="0" value={tier.p.toFixed(2)} className="ainp"
                  style={{ border: 'none', background: 'transparent', borderRadius: 0 }}
                  onChange={e => {
                    const newP = [...p.pricing];
                    newP[i] = { ...tier, p: parseFloat(e.target.value) || 0 };
                    upd('pricing')(newP);
                  }} />
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
        <button className="abtn abtn-add" onClick={() => onSave(p)}>💾 Save Changes</button>
        <button className="abtn" onClick={onCancel}>Cancel</button>
      </div>
      <style>{`.ed-grid{@media(max-width:640px){grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}

// ── CATEGORIES TAB ────────────────────────────────────────────────────────────
function CategoriesTab() {
  const { cats, setCats, showToast } = useApp();

  function move(i, dir) {
    const arr = [...cats]; const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setCats(arr); showToast('Order updated.');
  }

  function toggleVis(id) {
    setCats(prev => prev.map(c => c.id === id ? { ...c, hidden: !c.hidden } : c));
  }

  return (
    <div>
      <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 16 }}>Categories ({cats.length})</h2>
      <p style={{ fontSize: 12, color: 'var(--mu)', marginBottom: 16 }}>Drag to reorder using ↑↓ buttons. Hidden categories won't appear on the storefront.</p>
      <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', overflow: 'hidden' }}>
        {cats.map((c, i) => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i < cats.length - 1 ? '1px solid var(--bd)' : 'none', opacity: c.hidden ? 0.45 : 1 }}>
            <span style={{ fontSize: 20, width: 28, textAlign: 'center', flexShrink: 0 }}>{c.i}</span>
            <span style={{ flex: 1, fontWeight: 600, fontSize: 13 }}>{c.l}</span>
            <span style={{ fontSize: 10, color: 'var(--mu)', fontFamily: "'DM Mono',monospace" }}>{c.id}</span>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 700, background: c.hidden ? 'rgba(239,68,68,.1)' : 'rgba(34,197,94,.1)', color: c.hidden ? '#f87171' : 'var(--gr)', border: `1px solid ${c.hidden ? 'rgba(239,68,68,.2)' : 'rgba(34,197,94,.2)'}` }}>{c.hidden ? 'Hidden' : 'Visible'}</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="abtn" onClick={() => move(i, -1)}>↑</button>
              <button className="abtn" onClick={() => move(i, 1)}>↓</button>
              <button className="abtn" onClick={() => toggleVis(c.id)} style={{ color: c.hidden ? 'var(--gr)' : '#f87171', borderColor: c.hidden ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)' }}>{c.hidden ? 'Show' : 'Hide'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── APPEARANCE TAB ────────────────────────────────────────────────────────────
function AppearanceTab() {
  const { store, setStore, showToast } = useApp();
  const [s, setS] = useState({ ...store });
  const upd = k => e => setS(prev => ({ ...prev, [k]: e.target.value }));
  function save() { setStore(s); showToast('✅ Appearance saved!'); }

  return (
    <div>
      <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 20 }}>Appearance & Branding</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="ap-grid">
        <div className="aform-section">
          <div className="aform-title">Store Identity</div>
          <div className="afg"><label className="aflbl">Store Name</label><input className="ainp" value={s.name} onChange={upd('name')} /></div>
          <div className="afg"><label className="aflbl">Tagline</label><input className="ainp" value={s.tagline} onChange={upd('tagline')} /></div>
          <div className="afg"><label className="aflbl">Logo Text (if no image)</label><input className="ainp" maxLength="2" value={s.logo_text} onChange={upd('logo_text')} /></div>
          <div className="afg"><label className="aflbl">Logo Image URL</label><input className="ainp" placeholder="https://… (leave blank for text logo)" value={s.logo_img} onChange={upd('logo_img')} /></div>
        </div>
        <div className="aform-section">
          <div className="aform-title">Contact Info</div>
          <div className="afg"><label className="aflbl">Phone (display)</label><input className="ainp" placeholder="(437) 997-9921" value={s.phone} onChange={upd('phone')} /></div>
          <div className="afg"><label className="aflbl">Phone (digits only for tel: links)</label><input className="ainp" placeholder="14379979921" value={s.phone_raw} onChange={upd('phone_raw')} /></div>
          <div className="afg"><label className="aflbl">Email</label><input className="ainp" value={s.email} onChange={upd('email')} /></div>
          <div className="afg"><label className="aflbl">Address Line 1</label><input className="ainp" value={s.address} onChange={upd('address')} /></div>
          <div className="afg"><label className="aflbl">City / Province / Postal</label><input className="ainp" value={s.city} onChange={upd('city')} /></div>
          <div className="afg"><label className="aflbl">Business Hours</label><textarea className="ainp" rows="4" style={{ resize: 'vertical' }} value={s.hours} onChange={upd('hours')} /></div>
        </div>
        <div className="aform-section">
          <div className="aform-title">Hero Section</div>
          <div className="afg"><label className="aflbl">Line 1</label><input className="ainp" value={s.hero1} onChange={upd('hero1')} /></div>
          <div className="afg"><label className="aflbl">Accent Line (orange)</label><input className="ainp" value={s.hero_accent} onChange={upd('hero_accent')} /></div>
          <div className="afg"><label className="aflbl">Line 2</label><input className="ainp" value={s.hero2} onChange={upd('hero2')} /></div>
          <div className="afg"><label className="aflbl">Sub-headline</label><textarea className="ainp" rows="2" style={{ resize: 'vertical' }} value={s.hero_sub} onChange={upd('hero_sub')} /></div>
        </div>
        <div className="aform-section">
          <div className="aform-title">Social Links</div>
          <div className="afg"><label className="aflbl">Instagram URL</label><input className="ainp" placeholder="https://instagram.com/…" value={s.social_ig} onChange={upd('social_ig')} /></div>
          <div className="afg"><label className="aflbl">Facebook URL</label><input className="ainp" placeholder="https://facebook.com/…" value={s.social_fb} onChange={upd('social_fb')} /></div>
          <div className="afg"><label className="aflbl">WhatsApp (digits only)</label><input className="ainp" placeholder="14379979921" value={s.social_wa} onChange={upd('social_wa')} /></div>
          <div className="afg"><label className="aflbl">Footer Copyright</label><input className="ainp" value={s.footer_copy} onChange={upd('footer_copy')} /></div>
        </div>
      </div>
      <button className="abtn abtn-add" style={{ marginTop: 20 }} onClick={save}>💾 Save Appearance</button>
      {/* Live preview */}
      <div style={{ marginTop: 22, background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--o)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Live Preview</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, background: s.logo_img ? 'transparent' : 'var(--o)', clipPath: s.logo_img ? 'none' : 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 17, color: '#000', borderRadius: s.logo_img ? 8 : 0, overflow: 'hidden', flexShrink: 0 }}>
            {s.logo_img ? <img src={s.logo_img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={e => e.target.style.display = 'none'} /> : (s.logo_text || 'N')}
          </div>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 18 }}>{s.name || 'Store Name'}</div>
            <div style={{ fontSize: 11, color: 'var(--mu)' }}>{s.tagline || 'Tagline'}</div>
          </div>
        </div>
      </div>
      <style>{`.ap-grid{@media(max-width:640px){grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}

// ── SETTINGS TAB ─────────────────────────────────────────────────────────────
function SettingsTab() {
  const { showToast, ls } = useApp();
  const [v, setV] = useState({
    supaUrl: ls.raw('nxt_supa_url', ''),
    supaKey: ls.raw('nxt_supa_key', ''),
    stripePk: ls.raw('nxt_stripe_pk', ''),
    adminPw: '',
  });
  const upd = k => e => setV(prev => ({ ...prev, [k]: e.target.value }));

  function save() {
    if (v.supaUrl) ls.setRaw('nxt_supa_url', v.supaUrl);
    if (v.supaKey) ls.setRaw('nxt_supa_key', v.supaKey);
    if (v.stripePk) ls.setRaw('nxt_stripe_pk', v.stripePk);
    if (v.adminPw.trim()) ls.setRaw('nxt_admin_pw', v.adminPw.trim());
    showToast('✅ Settings saved!');
  }

  function resetAllData() {
    if (!window.confirm('This will reset all products, categories, and store settings back to defaults. Are you sure?')) return;
    ['nxt_prods','nxt_cats','nxt_store','nxt_pricing_cfg','nxt_pricing','nxt_custom_pages'].forEach(k => localStorage.removeItem(k));
    showToast('✅ Data reset. Reload the page.');
    setTimeout(() => window.location.reload(), 1500);
  }

  return (
    <div>
      <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 20 }}>Integrations & Settings</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="st-grid">
        <div className="aform-section">
          <div className="aform-title">🗄️ Supabase (Orders & Storage)</div>
          <p style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 14, lineHeight: 1.6 }}>All website orders are saved to your Supabase <code style={{ background: 'var(--s2)', padding: '1px 5px', borderRadius: 4, fontSize: 11 }}>orders</code> table.</p>
          <div className="afg"><label className="aflbl">Supabase Project URL</label><input className="ainp" placeholder="https://xxxx.supabase.co" value={v.supaUrl} onChange={upd('supaUrl')} /></div>
          <div className="afg"><label className="aflbl">Anon / Public Key</label><input className="ainp" placeholder="eyJhbGci…" value={v.supaKey} onChange={upd('supaKey')} /></div>
          <div style={{ fontSize: 11, color: 'var(--mu)', lineHeight: 1.65 }}>
            Required table fields: <code style={{ background: 'var(--s2)', padding: '1px 4px', borderRadius: 3, fontSize: 10 }}>id, order_number, customer_name, customer_email, customer_phone, company, items, total, delivery, turnaround, status, source, payment_method, created_at</code>
          </div>
        </div>
        <div className="aform-section">
          <div className="aform-title">💳 Stripe (Card Payments)</div>
          <p style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 14, lineHeight: 1.6 }}>Enables the "Pay by Card" option at checkout. Use your live key for production.</p>
          <div className="afg"><label className="aflbl">Publishable Key</label><input className="ainp" placeholder="pk_live_… or pk_test_…" value={v.stripePk} onChange={upd('stripePk')} /></div>
          <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 8 }}>⚠️ Never enter your secret key here. Only the publishable key.</div>
        </div>
        <div className="aform-section">
          <div className="aform-title">🔐 Admin Password</div>
          <div className="afg"><label className="aflbl">New Password</label><input className="ainp" type="password" placeholder="Leave blank to keep current password" value={v.adminPw} onChange={upd('adminPw')} /></div>
          <div style={{ fontSize: 11, color: 'var(--mu)' }}>Default password: <code style={{ background: 'var(--s2)', padding: '1px 4px', borderRadius: 3 }}>nexa2024</code> — change this!</div>
        </div>
        <div className="aform-section">
          <div className="aform-title">🗃️ Data Management</div>
          <p style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 14, lineHeight: 1.6 }}>All store data (products, settings, pricing) is saved in your browser's localStorage.</p>
          <button onClick={resetAllData} style={{ padding: '9px 16px', borderRadius: 8, border: '1px solid rgba(239,68,68,.3)', background: 'rgba(239,68,68,.08)', color: '#f87171', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>⚠️ Reset All Data to Defaults</button>
        </div>
      </div>
      <button className="abtn abtn-add" style={{ marginTop: 20 }} onClick={save}>💾 Save Settings</button>
      <style>{`.st-grid{@media(max-width:640px){grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}

// ── PAGES TAB ─────────────────────────────────────────────────────────────────
function PagesTab() {
  const { pages, setPages, showToast } = useApp();
  const [editing, setEditing] = useState(null); // null | 'new' | index
  const [form, setForm] = useState({ title: '', slug: '', nav: false, content: '' });

  const BUILTIN = ['home','products','detail','cart','checkout','success','quote','contact','admin','faq','turnaround','shipping','returns','terms'];

  function startEdit(page, idx) {
    setForm({ title: page.title, slug: page.slug, nav: page.nav || false, content: page.content || '' });
    setEditing(idx);
  }

  function startNew() {
    setForm({ title: '', slug: '', nav: false, content: '' });
    setEditing('new');
  }

  function save() {
    if (!form.title.trim() || !form.slug.trim()) { showToast('Title and slug required'); return; }
    const clean = form.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (editing === 'new') {
      setPages(prev => [...prev, { id: 'cp-' + Date.now(), title: form.title, slug: clean, nav: form.nav, content: form.content }]);
    } else {
      setPages(prev => prev.map((p, i) => i === editing ? { ...p, title: form.title, slug: clean, nav: form.nav, content: form.content } : p));
    }
    showToast('✅ Page saved!'); setEditing(null);
  }

  function deletePage(i) {
    if (!window.confirm('Delete this page?')) return;
    setPages(prev => prev.filter((_, pi) => pi !== i));
    showToast('Page deleted.');
  }

  if (editing !== null) return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <button className="abtn" onClick={() => setEditing(null)}>← Back</button>
        <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 22 }}>{editing === 'new' ? 'New Page' : `Edit: ${form.title}`}</h2>
      </div>
      <div className="aform-section" style={{ maxWidth: 720 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div className="afg"><label className="aflbl">Page Title *</label><input className="ainp" placeholder="FAQ" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div className="afg"><label className="aflbl">URL Slug * (e.g. faq)</label><input className="ainp" placeholder="faq" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} /></div>
        </div>
        <div className="afg" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="checkbox" id="pg-nav" style={{ width: 16, height: 16 }} checked={form.nav} onChange={e => setForm(f => ({ ...f, nav: e.target.checked }))} />
          <label htmlFor="pg-nav" style={{ fontSize: 13 }}>Show in footer navigation</label>
        </div>
        <div className="afg"><label className="aflbl">Content (HTML supported)</label>
          <textarea className="ainp" rows="14" style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, resize: 'vertical' }} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button className="abtn abtn-add" onClick={save}>💾 Save Page</button>
          <button className="abtn" onClick={() => setEditing(null)}>Cancel</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 24 }}>Pages</h2>
        <button className="abtn abtn-add" onClick={startNew}>+ New Page</button>
      </div>
      {/* Built-in pages */}
      <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--bd)', fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mu)' }}>Built-in Pages</div>
        <table className="atable">
          <thead><tr><th>Page</th><th>URL</th><th>Type</th></tr></thead>
          <tbody>
            {BUILTIN.map(slug => (
              <tr key={slug}><td style={{ fontWeight: 600, textTransform: 'capitalize' }}>{slug.replace(/-/g, ' ')}</td><td style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'var(--mu)' }}>/{slug}</td><td><span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(249,115,22,.1)', color: 'var(--o)', border: '1px solid rgba(249,115,22,.2)', fontWeight: 700 }}>Built-in</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Custom pages */}
      {pages.length > 0 && (
        <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--bd)', fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mu)' }}>Custom Pages ({pages.length})</div>
          <table className="atable">
            <thead><tr><th>Title</th><th>Slug</th><th>In Nav</th><th>Actions</th></tr></thead>
            <tbody>
              {pages.map((pg, i) => (
                <tr key={pg.id}><td style={{ fontWeight: 600 }}>{pg.title}</td><td style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'var(--mu)' }}>/{pg.slug}</td>
                  <td>{pg.nav ? <span className="badge-green">Yes</span> : <span style={{ color: 'var(--mu)', fontSize: 12 }}>No</span>}</td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="abtn" onClick={() => startEdit(pg, i)}>✏️ Edit</button>
                    <button className="abtn" onClick={() => deletePage(i)} style={{ color: '#f87171', borderColor: 'rgba(239,68,68,.3)' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pages.length === 0 && <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--mu)', fontSize: 13 }}>No custom pages yet. Click "+ New Page" to create one.</div>}
    </div>
  );
}

// ── EMAILS TAB ───────────────────────────────────────────────────────────────
function EmailsTab() {
  const { showToast, ls } = useApp();
  const [v, setV] = useState({
    tgToken: ls.raw('nxt_tg_token', ''),
    tgChat: ls.raw('nxt_tg_chatid', ''),
    ejsSvc: ls.raw('nxt_ejs_svc', ''),
    ejsTpl: ls.raw('nxt_ejs_tpl', ''),
    ejsKey: ls.raw('nxt_ejs_key', ''),
    ejsTo: ls.raw('nxt_ejs_to', ''),
    sendCust: ls.raw('nxt_send_cust', '') === '1',
  });
  const upd = k => e => setV(prev => ({ ...prev, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  function save() {
    ls.setRaw('nxt_tg_token', v.tgToken);
    ls.setRaw('nxt_tg_chatid', v.tgChat);
    ls.setRaw('nxt_ejs_svc', v.ejsSvc);
    ls.setRaw('nxt_ejs_tpl', v.ejsTpl);
    ls.setRaw('nxt_ejs_key', v.ejsKey);
    ls.setRaw('nxt_ejs_to', v.ejsTo);
    ls.setRaw('nxt_send_cust', v.sendCust ? '1' : '0');
    showToast('✅ Email settings saved!');
  }

  function testTelegram() {
    if (!v.tgToken || !v.tgChat) { showToast('Enter Bot Token and Chat ID first'); return; }
    fetch(`https://api.telegram.org/bot${v.tgToken}/sendMessage?chat_id=${v.tgChat}&text=${encodeURIComponent('✅ Test message from Nexa Customs! Telegram notifications are working.')}`)
      .then(r => r.json()).then(d => { if (d.ok) showToast('✅ Test message sent!'); else showToast('❌ Error: ' + (d.description || 'check token/chat ID')); })
      .catch(() => showToast('❌ Network error'));
  }

  return (
    <div>
      <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 8 }}>Order Notifications & Email</h2>
      <p style={{ fontSize: 13, color: 'var(--mu)', marginBottom: 24 }}>Set up Telegram for instant phone alerts, and EmailJS to send confirmation emails on every order.</p>

      {/* Telegram */}
      <div className="acard">
        <div className="acard-head">
          <span style={{ background: 'rgba(0,136,204,.15)', color: '#0af', padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>Recommended</span>
          <span style={{ fontWeight: 700, fontSize: 14, marginLeft: 8 }}>Telegram — Instant Phone Notifications</span>
          <span style={{ fontSize: 11, color: 'var(--gr)', marginLeft: 6 }}>Free</span>
        </div>
        <div className="acard-body">
          <div className="acard-steps">
            <div className="astep"><span className="astep-n">1</span><span>Open Telegram → search <code>@BotFather</code> → send <code>/newbot</code> → copy the <strong>Bot Token</strong></span></div>
            <div className="astep"><span className="astep-n">2</span><span>Search <code>@userinfobot</code> → send any message → copy your <strong>Chat ID</strong></span></div>
            <div className="astep"><span className="astep-n">3</span><span>Paste both below and click Save. Every new order will instantly message your phone.</span></div>
          </div>
          <div className="aform-row">
            <div className="aform-grp"><label className="aform-lbl">Bot Token</label><input id="ab-tg-tok" className="ainp" value={v.tgToken} onChange={upd('tgToken')} placeholder="123456789:ABCdef…" /></div>
            <div className="aform-grp"><label className="aform-lbl">Your Chat ID</label><input id="ab-tg-cid" className="ainp" value={v.tgChat} onChange={upd('tgChat')} placeholder="123456789" /></div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button className="abtn abtn-add" onClick={save} style={{ flex: 1 }}>💾 Save</button>
            <button className="abtn" onClick={testTelegram} style={{ background: 'rgba(0,170,255,.1)', color: '#0af', borderColor: 'rgba(0,170,255,.3)' }}>▶ Send Test</button>
          </div>
        </div>
      </div>

      {/* EmailJS */}
      <div className="acard">
        <div className="acard-head">
          <span style={{ background: 'var(--ol)', color: 'var(--o)', padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>Email</span>
          <span style={{ fontWeight: 700, fontSize: 14, marginLeft: 8 }}>EmailJS — Order Confirmation Emails</span>
          <span style={{ fontSize: 11, color: 'var(--mu)', marginLeft: 6 }}>Free up to 200/month · emailjs.com</span>
        </div>
        <div className="acard-body">
          <div className="acard-steps">
            <div className="astep"><span className="astep-n">1</span><span>Sign up at <code>emailjs.com</code> → create an Email Service (Gmail, Outlook, etc.) → copy <strong>Service ID</strong></span></div>
            <div className="astep"><span className="astep-n">2</span><span>Create an Email Template → use variables like <code>{'{{order_id}}'}</code>, <code>{'{{customer_name}}'}</code>, <code>{'{{order_items}}'}</code>, <code>{'{{total}}'}</code> → copy <strong>Template ID</strong></span></div>
            <div className="astep"><span className="astep-n">3</span><span>Go to Account → API Keys → copy your <strong>Public Key</strong></span></div>
          </div>
          <div className="aform-row" style={{ marginBottom: 10 }}>
            <div className="aform-grp"><label className="aform-lbl">Service ID</label><input className="ainp" value={v.ejsSvc} onChange={upd('ejsSvc')} placeholder="service_abc123" /></div>
            <div className="aform-grp"><label className="aform-lbl">Template ID</label><input className="ainp" value={v.ejsTpl} onChange={upd('ejsTpl')} placeholder="template_xyz789" /></div>
          </div>
          <div className="aform-row" style={{ marginBottom: 10 }}>
            <div className="aform-grp"><label className="aform-lbl">Public Key</label><input className="ainp" value={v.ejsKey} onChange={upd('ejsKey')} placeholder="user_abc…" /></div>
            <div className="aform-grp"><label className="aform-lbl">Notify Email (your email)</label><input className="ainp" value={v.ejsTo} onChange={upd('ejsTo')} placeholder="info@nexacustoms.ca" /></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <input type="checkbox" id="send-cust" style={{ width: 16, height: 16 }} checked={v.sendCust} onChange={upd('sendCust')} />
            <label htmlFor="send-cust" style={{ fontSize: 13 }}>Also send confirmation email to customer</label>
          </div>
          <div style={{ background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 8, padding: '10px 13px', fontSize: 11, color: 'var(--mu)', marginBottom: 14, fontFamily: "'DM Mono',monospace", lineHeight: 1.7 }}>
            Available template variables:<br />
            {'{{order_id}}'} · {'{{customer_name}}'} · {'{{customer_email}}'} · {'{{customer_phone}}'} · {'{{order_items}}'} · {'{{total}}'} · {'{{payment_method}}'}
          </div>
          <button className="abtn abtn-add" onClick={save}>💾 Save Email Settings</button>
        </div>
      </div>
    </div>
  );
}

// ── PRICING TAB ───────────────────────────────────────────────────────────────
function PricingTab() {
  const { prods, setProds, pricing, setPricing, showToast, ls } = useApp();
  const [cfg, setCfg] = useState({ ...pricing });
  const [prodPrices, setProdPrices] = useState(() =>
    prods.map(p => ({ id: p.id, name: p.name, pricing: p.pricing.map(t => ({ ...t })), sqft: p.sqft ? { ...p.sqft } : null }))
  );

  function saveCfg() { setPricing(cfg); showToast('✅ Config saved!'); }

  function saveAllPrices() {
    const updated = prods.map(p => {
      const override = prodPrices.find(x => x.id === p.id);
      if (!override) return p;
      return { ...p, pricing: override.pricing, sqft: override.sqft || p.sqft };
    });
    setProds(updated);
    // Persist separately so it survives a products reset
    ls.set('nxt_pricing', prodPrices.map(p => ({ id: p.id, pricing: p.pricing, sqft: p.sqft })));
    showToast('✅ All prices saved!');
  }

  function updTier(prodId, ti, val) {
    setProdPrices(prev => prev.map(p => p.id !== prodId ? p : { ...p, pricing: p.pricing.map((t, i) => i === ti ? { ...t, p: parseFloat(val) || 0 } : t) }));
  }

  function updSqft(prodId, field, val) {
    setProdPrices(prev => prev.map(p => p.id !== prodId ? p : { ...p, sqft: { ...p.sqft, [field]: parseFloat(val) || p.sqft[field] } }));
  }

  return (
    <div>
      <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 20 }}>Pricing Configuration</h2>

      {/* Global config */}
      <div className="aform-section" style={{ maxWidth: 560, marginBottom: 28 }}>
        <div className="aform-title">Global Pricing Settings</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { k: 'hst', l: 'HST Rate', note: '0.13 = 13%' },
            { k: 'shipping_post', l: 'Canada Post ($)', note: 'Flat rate' },
            { k: 'shipping_courier', l: 'Courier ($)', note: 'FedEx/UPS flat' },
            { k: 'rush_pct', l: 'Rush Surcharge', note: '0.25 = 25%' },
            { k: 'express_pct', l: 'Express Surcharge', note: '0.50 = 50%' },
          ].map(f => (
            <div key={f.k} className="afg">
              <label className="aflbl">{f.l} <span style={{ color: 'var(--mu)', fontWeight: 400, textTransform: 'none' }}>({f.note})</span></label>
              <input type="number" step="0.01" className="ainp" value={cfg[f.k]} onChange={e => setCfg(c => ({ ...c, [f.k]: parseFloat(e.target.value) || 0 }))} />
            </div>
          ))}
        </div>
        <button className="abtn abtn-add" style={{ marginTop: 8 }} onClick={saveCfg}>💾 Save Config</button>
      </div>

      {/* Per-product prices */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 20 }}>Quick Price Editor</div>
          <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 2 }}>Edit base prices for all {prods.length} products. Option multipliers apply on top at checkout.</div>
        </div>
        <button className="abtn abtn-add" onClick={saveAllPrices}>💾 Save All Prices</button>
      </div>

      {prodPrices.map(p => (
        <div key={p.id} style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
            <div style={{ fontSize: 10, color: 'var(--mu)', marginTop: 2, fontFamily: "'DM Mono',monospace" }}>{p.id}{p.sqft ? ' · sq-ft pricing' : ''}</div>
          </div>
          {p.sqft ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(120px,200px))', gap: 10 }}>
              {[['rate','Rate ($/sq ft)'],['min','Min Sq Ft']].map(([field, lbl]) => (
                <div key={field}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', marginBottom: 4 }}>{lbl}</div>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--bd)', borderRadius: 7, overflow: 'hidden', background: 'var(--dk)' }}>
                    <span style={{ padding: '0 8px', color: 'var(--mu)', fontSize: 12 }}>$</span>
                    <input type="number" step="0.25" min="0.5" value={p.sqft[field]} onChange={e => updSqft(p.id, field, e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--tx)', padding: '8px 6px', fontSize: 13, outline: 'none' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {p.pricing.map((tier, ti) => {
                const disp = tier.q >= 1000 ? (tier.q / 1000).toFixed(tier.q % 1000 ? 1 : 0) + 'K' : String(tier.q);
                return (
                  <div key={ti} style={{ minWidth: 88 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', marginBottom: 4 }}>Qty {disp}</div>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--bd)', borderRadius: 7, overflow: 'hidden', background: 'var(--dk)' }}>
                      <span style={{ padding: '0 7px', color: 'var(--mu)', fontSize: 12 }}>$</span>
                      <input type="number" step="0.01" min="0" value={tier.p.toFixed(2)} onChange={e => updTier(p.id, ti, e.target.value)} style={{ width: 70, background: 'transparent', border: 'none', color: 'var(--tx)', padding: '7px 5px', fontSize: 12, outline: 'none' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
