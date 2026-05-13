import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_CATS, DEFAULT_PRODS, DEFAULT_STORE, DEFAULT_PRICING } from '../data/products';

const AppContext = createContext(null);

const ls = {
  get: (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  raw: (k, fb) => { try { return localStorage.getItem(k) || fb; } catch { return fb; } },
  setRaw: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
};

// env vars take priority over localStorage — works on every device automatically
const cfg = {
  supaUrl: () => import.meta.env.VITE_SUPA_URL || ls.raw('nxt_supa_url', ''),
  supaKey: () => import.meta.env.VITE_SUPA_KEY || ls.raw('nxt_supa_key', ''),
  stripePk: () => import.meta.env.VITE_STRIPE_PK || ls.raw('nxt_stripe_pk', ''),
  tgToken: () => import.meta.env.VITE_TG_TOKEN || ls.raw('nxt_tg_token', ''),
  tgChat:  () => import.meta.env.VITE_TG_CHAT  || ls.raw('nxt_tg_chatid', ''),
  ejsSvc:  () => import.meta.env.VITE_EJS_SVC  || ls.raw('nxt_ejs_svc', ''),
  ejsTpl:  () => import.meta.env.VITE_EJS_TPL  || ls.raw('nxt_ejs_tpl', ''),
  ejsKey:  () => import.meta.env.VITE_EJS_KEY  || ls.raw('nxt_ejs_key', ''),
  ejsTo:   () => import.meta.env.VITE_EJS_TO   || ls.raw('nxt_ejs_to', ''),
};

function isSupaReady() {
  return cfg.supaUrl().length > 10 && cfg.supaKey().length > 10;
}

async function supaGet(table, filter) {
  if (!isSupaReady()) return null;
  try {
    const res = await fetch(`${cfg.supaUrl()}/rest/v1/${table}?${filter}`, {
      headers: { apikey: cfg.supaKey(), Authorization: `Bearer ${cfg.supaKey()}` }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

async function supaUpsert(table, payload) {
  if (!isSupaReady()) return;
  try {
    await fetch(`${cfg.supaUrl()}/rest/v1/${table}`, {
      method: 'POST',
      headers: { apikey: cfg.supaKey(), Authorization: `Bearer ${cfg.supaKey()}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify(payload),
    });
  } catch {}
}

function applyFavicon(url) {
  if (!url) return;
  let link = document.querySelector("link[rel~='icon']");
  if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
  link.href = url;
}

function mergeOverrides(prods, overrides) {
  if (!overrides?.length) return prods;
  return prods.map(p => {
    const o = overrides.find(x => x.id === p.id);
    if (!o) return p;
    return { ...p, pricing: o.pricing || p.pricing, sqft: o.sqft ? { ...p.sqft, ...o.sqft } : p.sqft, imgs: o.imgs?.length ? o.imgs : p.imgs, badge: o.badge !== undefined ? o.badge : p.badge, name: o.name || p.name, desc: o.desc || p.desc, disabled: o.disabled || false };
  });
}

function mergeCatOverrides(cats, overrides) {
  if (!overrides?.length) return cats;
  // preserve default order unless overrides has a specific sort
  return cats.map(c => { const o = overrides.find(x => x.id === c.id); return o ? { ...c, ...o } : c; });
}

export function AppProvider({ children }) {
  const [page, setPage] = useState(() => { const h = window.location.hash.replace('#','').trim().toLowerCase(); return h || 'home'; });
  const [store, setStoreState]     = useState(() => ({ ...DEFAULT_STORE, ...ls.get('nxt_store', {}) }));
  const [cats,  setCatsState]      = useState(() => mergeCatOverrides(DEFAULT_CATS, ls.get('nxt_cats_overrides', null)));
  const [prods, setProdsState]     = useState(() => mergeOverrides(DEFAULT_PRODS, ls.get('nxt_pricing', null)));
  const [pricing, setPricingState] = useState(() => ({ ...DEFAULT_PRICING, ...ls.get('nxt_pricing_cfg', {}) }));
  const [cart,  setCart]           = useState(() => ls.get('nxt_cart', []));
  const [pages, setPages]          = useState(() => ls.get('nxt_custom_pages', []));
  const [curProd, setCurProd]      = useState(null);
  const [toast,   setToast]        = useState(null);
  const [adminAuthed, setAdminAuthed] = useState(() => ls.raw('nxt_admin_auth','') === 'true');

  useEffect(() => {
    async function syncAll() {
      if (!isSupaReady()) return;
      // store config
      const cr = await supaGet('site_config', 'id=eq.main&limit=1');
      if (cr?.length > 0 && cr[0].data) {
        const d = typeof cr[0].data === 'string' ? JSON.parse(cr[0].data) : cr[0].data;
        const m = { ...DEFAULT_STORE, ...d };
        setStoreState(m); ls.set('nxt_store', m);
        if (m.favicon_img) applyFavicon(m.favicon_img);
      }
      // category overrides
      const catr = await supaGet('site_config', 'id=eq.categories&limit=1');
      if (catr?.length > 0 && catr[0].data) {
        const d = typeof catr[0].data === 'string' ? JSON.parse(catr[0].data) : catr[0].data;
        ls.set('nxt_cats_overrides', d);
        setCatsState(mergeCatOverrides(DEFAULT_CATS, d));
      }
      // product overrides
      const pr = await supaGet('site_config', 'id=eq.products&limit=1');
      if (pr?.length > 0 && pr[0].data) {
        const d = typeof pr[0].data === 'string' ? JSON.parse(pr[0].data) : pr[0].data;
        if (Array.isArray(d)) { ls.set('nxt_pricing', d); setProdsState(mergeOverrides(DEFAULT_PRODS, d)); }
      }
      // pricing config
      const pcr = await supaGet('site_config', 'id=eq.pricing_cfg&limit=1');
      if (pcr?.length > 0 && pcr[0].data) {
        const d = typeof pcr[0].data === 'string' ? JSON.parse(pcr[0].data) : pcr[0].data;
        const m = { ...DEFAULT_PRICING, ...d };
        setPricingState(m); ls.set('nxt_pricing_cfg', m);
      }
    }
    syncAll();
  }, []);

  useEffect(() => { if (store.favicon_img) applyFavicon(store.favicon_img); }, [store.favicon_img]);
  useEffect(() => ls.set('nxt_cart', cart), [cart]);
  useEffect(() => ls.set('nxt_custom_pages', pages), [pages]);

  // Hash routing removed — using React Router now

  const setStore = useCallback((s) => {
    setStoreState(s); ls.set('nxt_store', s);
    if (s.favicon_img) applyFavicon(s.favicon_img);
    supaUpsert('site_config', { id: 'main', data: s, updated_at: new Date().toISOString() });
  }, []);

  const setCats = useCallback((updater) => {
    setCatsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const overrides = next.map(c => ({ id: c.id, l: c.l, i: c.i, img: c.img || null, hidden: c.hidden || false }));
      ls.set('nxt_cats_overrides', overrides);
      supaUpsert('site_config', { id: 'categories', data: overrides, updated_at: new Date().toISOString() });
      return next;
    });
  }, []);

  const setProds = useCallback((updater) => {
    setProdsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const overrides = next.map(p => ({ id: p.id, name: p.name, desc: p.desc, badge: p.badge, disabled: p.disabled || false, imgs: p.imgs || [], pricing: p.pricing, sqft: p.sqft || null }));
      ls.set('nxt_pricing', overrides);
      supaUpsert('site_config', { id: 'products', data: overrides, updated_at: new Date().toISOString() });
      return next;
    });
  }, []);

  const setPricing = useCallback((p) => {
    setPricingState(p); ls.set('nxt_pricing_cfg', p);
    supaUpsert('site_config', { id: 'pricing_cfg', data: p, updated_at: new Date().toISOString() });
  }, []);

  // navigate is injected by useRouterSync below
  const navigateRef = { current: null };
  const go = useCallback((p) => {
    // Map internal page names to URL paths
    const URL_MAP = {
      'home': '/', 'products': '/products', 'cart': '/cart',
      'checkout': '/checkout', 'success': '/order-confirmed',
      'quote': '/quote', 'contact': '/contact', 'admin': '/admin',
      'faq': '/faq', 'shipping': '/shipping', 'returns': '/returns',
      'terms': '/terms', 'turnaround': '/turnaround',
    };
    const url = URL_MAP[p] || `/${p}`;
    if (navigateRef.current) navigateRef.current(url);
    else window.location.href = url;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const showToast = useCallback((msg) => { setToast(msg); setTimeout(() => setToast(null), 3200); }, []);
  const addToCart = useCallback((item) => { setCart(prev => [...prev, { ...item, cartId: Date.now() + Math.random() }]); showToast('✓ ' + item.name + ' added to cart'); }, [showToast]);
  const removeFromCart = useCallback((cartId) => setCart(prev => prev.filter(i => i.cartId !== cartId)), []);
  const clearCart = useCallback(() => setCart([]), []);
  const showProduct = useCallback((id) => { const p = prods.find(x => x.id === id); if (!p) return; setCurProd(p); go('detail'); }, [prods, go]);

  const calcPrice = useCallback((prod, qty, selOpts = {}) => {
    if (!prod) return { total: 0, unit: 0, sqft: 0 };
    if (prod.sqft?.enabled) {
      let sqftVal = 0;
      const selSizeId = selOpts?.size;
      if (selSizeId === 'custom') { sqftVal = (parseFloat(selOpts?._custW)||0) * (parseFloat(selOpts?._custH)||0); }
      else { sqftVal = prod.opts?.find(g => g.key==='size')?.opts?.find(o => o.id===selSizeId)?.sqft || 0; }
      let mult = 1.0;
      (prod.opts||[]).filter(g => g.key!=='size').forEach(g => { const o = g.opts?.find(o => o.id===selOpts?.[g.key]); if (o?.m) mult *= o.m; });
      const unitCost = Math.max(sqftVal, prod.sqft.min||1) * (prod.sqft.rate||6.5) * mult;
      return { total: +(unitCost * Math.max(qty||1,1)).toFixed(2), unit: +unitCost.toFixed(4), sqft: sqftVal };
    }
    const tier = prod.pricing?.find(t => t.q===qty) || prod.pricing?.[0];
    if (!tier) return { total: 0, unit: 0, sqft: 0 };
    let mult = 1.0;
    (prod.opts||[]).forEach(g => { const o = g.opts?.find(o => o.id===selOpts?.[g.key]); if (o?.m) mult *= o.m; });
    const total = +(tier.p * mult).toFixed(2);
    return { total, unit: +(total/(qty||1)).toFixed(4), sqft: 0 };
  }, []);

  const cartSubtotal = cart.reduce((s, i) => s + (i.price || 0), 0);

  return (
    <AppContext.Provider value={{ navigateRef, page: typeof window !== 'undefined' ? window.location.pathname.replace('/','') || 'home' : 'home', go, cart, addToCart, removeFromCart, clearCart, cartSubtotal, cats, setCats, prods, setProds, store, setStore, pricing, setPricing, pages, setPages, curProd, setCurProd, showProduct, toast, showToast, adminAuthed, setAdminAuthed, calcPrice, cfg, ls }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
