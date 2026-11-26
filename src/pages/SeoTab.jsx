import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { SEO_STATIC_PAGES, defaultSeo } from '../hooks/usePageSEO';

const TITLE_MAX = 60, DESC_MAX = 155;

function counterColor(len, good, max) {
  if (len === 0) return 'var(--mu)';
  if (len > max + 10) return '#f87171';
  if (len > max || len < good) return '#facc15';
  return '#22c55e';
}

export default function SeoTab() {
  const { seo, setSeo, cats, prods, showToast } = useApp();
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(seo || {})));
  const [sel, setSel] = useState({ kind: 'pages', key: '/' });
  const [q, setQ] = useState('');

  const clean = d => {
    const out = { pages: {}, categories: {}, products: {} };
    ['pages', 'categories', 'products'].forEach(k => Object.entries(d[k] || {}).forEach(([id, v]) => {
      const title = (v?.title || '').trim(), description = (v?.description || '').trim();
      if (title || description) out[k][id] = { ...(title ? { title } : {}), ...(description ? { description } : {}) };
    }));
    return out;
  };
  const dirty = useMemo(() => JSON.stringify(clean(draft)) !== JSON.stringify(clean(seo || {})), [draft, seo]);

  const activeProds = useMemo(() => (prods || []).filter(p => !p.disabled), [prods]);
  const prod = sel.kind === 'products' ? activeProds.find(p => p.id === sel.key) : null;
  const defaults = defaultSeo(sel.kind, sel.key, prod);
  const cur = draft[sel.kind]?.[sel.key] || {};
  const titleShown = cur.title || defaults.title;
  const descShown = cur.description || defaults.description;

  const setField = (field, value) => setDraft(d => ({ ...d, [sel.kind]: { ...(d[sel.kind] || {}), [sel.key]: { ...(d[sel.kind]?.[sel.key] || {}), [field]: value } } }));
  const resetItem = () => setDraft(d => { const n = { ...(d[sel.kind] || {}) }; delete n[sel.key]; return { ...d, [sel.kind]: n }; });
  const isSet = (kind, key) => { const v = draft[kind]?.[key]; return !!(v && ((v.title || '').trim() || (v.description || '').trim())); };

  const url = sel.kind === 'pages' ? sel.key : sel.kind === 'categories' ? `/products/${sel.key}` : `/products/${prod?.cat || ''}/${sel.key}`;
  const crumbs = ('nexacustoms.ca' + (url === '/' ? '' : url)).split('/').filter(Boolean).join(' › ');

  const match = t => !q.trim() || String(t).toLowerCase().includes(q.trim().toLowerCase());
  const Item = ({ kind, k, label }) => (
    <div onClick={() => setSel({ kind, key: k })} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '7px 10px', marginBottom: 3, cursor: 'pointer', borderRadius: 8, fontSize: 13,
      border: '1px solid ' + (sel.kind === kind && sel.key === k ? 'var(--o)' : 'transparent'), background: sel.kind === kind && sel.key === k ? 'rgba(249,115,22,.07)' : 'transparent',
    }}>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      {isSet(kind, k) && <span title="You wrote your own" style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', flex: 'none' }} />}
    </div>
  );
  const head = t => <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.07em', margin: '14px 0 6px' }}>{t}</div>;

  function save() { setSeo(clean(draft)); setDraft(clean(draft)); showToast('✅ SEO saved. Redeploy the site (Vercel → Redeploy) so Google sees it in the page source too.'); }

  const pages = SEO_STATIC_PAGES.filter(([p, l]) => match(l) || match(p));
  const catList = (cats || []).filter(c => match(c.name) || match(c.id));
  const prodList = activeProds.filter(p => match(p.name) || match(p.id));

  return (
    <div>
      <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 6 }}>SEO — how your pages look in Google</h2>
      <p style={{ fontSize: 13, color: 'var(--mu)', marginBottom: 14, lineHeight: 1.6 }}>
        Write the <strong>title</strong> and <strong>description</strong> Google shows for the homepage, pages, categories and products. Leave a box empty to keep the automatic one. A green dot means you wrote your own.
        The big headline (H1) on the homepage is edited in <strong>Appearance</strong> (hero lines); a product's headline is its name in <strong>Products</strong>; blog posts and custom pages have their own title and description in <strong>Pages</strong>.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>
        {/* list */}
        <div style={{ flex: '1 1 280px', maxWidth: 360, minWidth: 0 }}>
          <input className="ainp" placeholder="Search pages, categories, products…" value={q} onChange={e => setQ(e.target.value)} style={{ width: '100%', marginBottom: 6 }} />
          <div style={{ maxHeight: 560, overflowY: 'auto', paddingRight: 4 }}>
            {pages.length > 0 && head('Homepage & pages')}
            {pages.map(([p, l]) => <Item key={p} kind="pages" k={p} label={l} />)}
            {catList.length > 0 && head('Categories')}
            {catList.map(c => <Item key={c.id} kind="categories" k={c.id} label={c.name} />)}
            {prodList.length > 0 && head(`Products (${prodList.length})`)}
            {prodList.map(p => <Item key={p.id} kind="products" k={p.id} label={p.name} />)}
          </div>
        </div>

        {/* editor */}
        <div style={{ flex: '2 1 420px', minWidth: 0 }}>
          <div className="acard" style={{ marginBottom: 16 }}>
            <div className="acard-head"><span style={{ fontWeight: 700 }}>{sel.kind === 'pages' ? (SEO_STATIC_PAGES.find(([p]) => p === sel.key)?.[1] || sel.key) : sel.kind === 'categories' ? ((cats || []).find(c => c.id === sel.key)?.name || sel.key) : (prod?.name || sel.key)}</span></div>
            <div className="acard-body">
              <div className="afg">
                <label className="aflbl">Google title <span style={{ color: counterColor((cur.title || '').length, 25, TITLE_MAX), float: 'right', textTransform: 'none', letterSpacing: 0 }}>{(cur.title || '').length}/{TITLE_MAX}</span></label>
                <input className="ainp" style={{ width: '100%' }} placeholder={defaults.title} value={cur.title || ''} onChange={e => setField('title', e.target.value)} />
                <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 4 }}>Put the words people search for first, for example "Same-Day Business Cards Mississauga". About 50–60 characters.</div>
              </div>
              <div className="afg">
                <label className="aflbl">Google description <span style={{ color: counterColor((cur.description || '').length, 70, DESC_MAX), float: 'right', textTransform: 'none', letterSpacing: 0 }}>{(cur.description || '').length}/{DESC_MAX}</span></label>
                <textarea className="ainp" rows={3} style={{ width: '100%', resize: 'vertical' }} placeholder={defaults.description} value={cur.description || ''} onChange={e => setField('description', e.target.value)} />
                <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 4 }}>One or two sentences that make someone want to click. About 120–155 characters.</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="abtn" type="button" onClick={() => { setField('title', defaults.title); setField('description', defaults.description); }}>Copy the current automatic text here</button>
                <button className="abtn" type="button" onClick={resetItem} disabled={!isSet(sel.kind, sel.key)}>↺ Use the automatic text</button>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 6 }}>Preview (how it can look in Google)</div>
          <div data-testid="serp" style={{ background: '#fff', borderRadius: 10, padding: '14px 16px', maxWidth: 640, fontFamily: 'Arial, sans-serif' }}>
            <div style={{ fontSize: 12, color: '#202124', marginBottom: 4 }}>{crumbs}</div>
            <div style={{ fontSize: 20, lineHeight: 1.3, color: '#1a0dab', marginBottom: 4 }}>{titleShown.length > 66 ? titleShown.slice(0, 63) + '…' : titleShown}</div>
            <div style={{ fontSize: 14, lineHeight: 1.5, color: '#4d5156' }}>{descShown.length > 160 ? descShown.slice(0, 157) + '…' : descShown}</div>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 18, flexWrap: 'wrap' }}>
            <button className="abtn abtn-add" onClick={save} disabled={!dirty} style={{ opacity: dirty ? 1 : .55 }}>💾 Save SEO</button>
            {dirty && <span style={{ fontSize: 12, color: '#facc15' }}>Unsaved changes</span>}
          </div>
          <p style={{ fontSize: 11, color: 'var(--mu)', marginTop: 10, lineHeight: 1.6 }}>After saving, the new text shows on your site straight away. To make Google see it quickly, redeploy once from Vercel, then use "Request indexing" in Search Console for your most important pages.</p>
        </div>
      </div>
    </div>
  );
}
