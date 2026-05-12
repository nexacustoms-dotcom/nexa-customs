import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_CATS, DEFAULT_PRODS, DEFAULT_STORE, DEFAULT_PRICING } from '../data/products';

const AppContext = createContext(null);

const ls = {
  get: (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  raw: (k, fb) => { try { return localStorage.getItem(k) || fb; } catch { return fb; } },
  setRaw: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
};

// ── SUPABASE HELPERS ──────────────────────────────────────────────────────────
function getSupaCreds() {
  return { url: ls.raw('nxt_supa_url', ''), key: ls.raw('nxt_supa_key', '') };
}

function isSupaReady() {
  const { url, key } = getSupaCreds();
  return url.length > 10 && key.length > 10;
}

async function supaGet(table, filter) {
  if (!isSupaReady()) return null;
  const { url, key } = getSupaCreds();
  try {
    const res = await fetch(`${url}/rest/v1/${table}?${filter}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

async function supaUpsert(table, payload) {
  if (!isSupaReady()) return;
  const { url, key } = getSupaCreds();
  try {
    await fetch(`${url}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify(payload),
    });
  } catch { /* silent */ }
}

// Apply favicon to browser tab
function applyFavicon(url) {
  if (!url) return;
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = url;
}

// Merge saved product overrides into default products
function mergeOverrides(prods, overrides) {
  if (!overrides || !Array.isArray(overrides)) return prods;
  return prods.map(p => {
    const o = overrides.find(x => x.id === p.id);
    if (!o) return p;
    return {
      ...p,
      pricing: o.pricing || p.pricing,
      sqft: o.sqft ? { ...p.sqft, ...o.sqft } : p.sqft,
      imgs: o.imgs?.length ? o.imgs : p.imgs,
      badge: o.badge !== undefined ? o.badge : p.badge,
      name: o.name || p.name,
      desc: o.desc || p.desc,
      disabled: o.disabled || false,
    };
  });
}

// ── PROVIDER ──────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {

  // Routing
  const [page, setPage] = useState(() => {
    const h = window.location.hash.replace('#', '').trim().toLowerCase();
    return h || 'home';
  });

  // Core state — load from localStorage first (fast), then sync from Supabase
  const [store, setStoreState] = useState(() => ({ ...DEFAULT_STORE, ...ls.get('nxt_store', {}) }));
  const [prods, setProdsState] = useState(() => {
    const saved = ls.get('nxt_prods', null);
    const base = saved?.length ? saved : DEFAULT_PRODS;
    const overrides = ls.get('nxt_pricing', null);
    return mergeOverrides(base, overrides);
  });
  const [pricing, setPricingState] = useState(() => ({ ...DEFAULT_PRICING, ...ls.get('nxt_pricing_cfg', {}) }));
  const [cart, setCart] = useState(() => ls.get('nxt_cart', []));
  const [cats, setCats] = useState(() => ls.get('nxt_cats', DEFAULT_CATS));
  const [pages, setPages] = useState(() => ls.get('nxt_custom_pages', []));
  const [curProd, setCurProd] = useState(null);
  const [toast, setToast] = useState(null);
  const [adminAuthed, setAdminAuthed] = useState(() => ls.raw('nxt_admin_auth', '') === 'true');

  // ── Sync from Supabase on every page load ─────────────────────────────────
  useEffect(() => {
    async function syncAll() {
      if (!isSupaReady()) return;

      // 1. Store config — logo, favicon, store name, hours, social links
      const configRows = await supaGet('site_config', 'id=eq.main&limit=1');
      if (configRows?.length > 0 && configRows[0].data) {
        const remote = typeof configRows[0].data === 'string'
          ? JSON.parse(configRows[0].data)
          : configRows[0].data;
        const merged = { ...DEFAULT_STORE, ...remote };
        setStoreState(merged);
        ls.set('nxt_store', merged);
        if (merged.favicon_img) applyFavicon(merged.favicon_img);
      }

      // 2. Product overrides — images, prices, badges, disabled
      const prodRows = await supaGet('site_config', 'id=eq.products&limit=1');
      if (prodRows?.length > 0 && prodRows[0].data) {
        const overrides = typeof prodRows[0].data === 'string'
          ? JSON.parse(prodRows[0].data)
          : prodRows[0].data;
        if (Array.isArray(overrides)) {
          ls.set('nxt_pricing', overrides);
          setProdsState(() => mergeOverrides(DEFAULT_PRODS, overrides));
        }
      }

      // 3. Pricing config — HST, shipping, rush rates
      const pricingRows = await supaGet('site_config', 'id=eq.pricing_cfg&limit=1');
      if (pricingRows?.length > 0 && pricingRows[0].data) {
        const remote = typeof pricingRows[0].data === 'string'
          ? JSON.parse(pricingRows[0].data)
          : pricingRows[0].data;
        const merged = { ...DEFAULT_PRICING, ...remote };
        setPricingState(merged);
        ls.set('nxt_pricing_cfg', merged);
      }
    }

    syncAll();
  }, []);

  // Apply favicon whenever store changes
  useEffect(() => {
    if (store.favicon_img) applyFavicon(store.favicon_img);
  }, [store.favicon_img]);

  // Persist to localStorage
  useEffect(() => ls.set('nxt_cart', cart), [cart]);
  useEffect(() => ls.set('nxt_cats', cats), [cats]);
  useEffect(() => ls.set('nxt_store', store), [store]);
  useEffect(() => ls.set('nxt_pricing_cfg', pricing), [pricing]);
  useEffect(() => ls.set('nxt_custom_pages', pages), [pages]);

  // Hash routing
  useEffect(() => {
    function onHash() {
      const h = window.location.hash.replace('#', '').trim().toLowerCase();
      setPage(h || 'home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // ── Synced setters — localStorage + Supabase ──────────────────────────────

  // setStore: saves appearance — logo, favicon, store name, address, social, hero
  const setStore = useCallback((newStore) => {
    setStoreState(newStore);
    ls.set('nxt_store', newStore);
    if (newStore.favicon_img) applyFavicon(newStore.favicon_img);
    supaUpsert('site_config', {
      id: 'main',
      data: newStore,
      updated_at: new Date().toISOString(),
    });
  }, []);

  // setProds: saves product images, prices, badges, disabled
  const setProds = useCallback((updater) => {
    setProdsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      ls.set('nxt_prods', next);
      // Build overrides — everything that can be changed per product
      const overrides = next.map(p => ({
        id: p.id,
        name: p.name,
        desc: p.desc,
        badge: p.badge,
        disabled: p.disabled || false,
        imgs: p.imgs || [],
        pricing: p.pricing,
        sqft: p.sqft || null,
      }));
      ls.set('nxt_pricing', overrides);
      supaUpsert('site_config', {
        id: 'products',
        data: overrides,
        updated_at: new Date().toISOString(),
      });
      return next;
    });
  }, []);

  // setPricing: saves HST, shipping, rush rates
  const setPricing = useCallback((newPricing) => {
    setPricingState(newPricing);
    ls.set('nxt_pricing_cfg', newPricing);
    supaUpsert('site_config', {
      id: 'pricing_cfg',
      data: newPricing,
      updated_at: new Date().toISOString(),
    });
  }, []);

  // ── Navigation ──
  const go = useCallback((p) => {
    window.location.hash = p === 'home' ? '' : p;
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ── Toast ──
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  }, []);

  // ── Cart ──
  const addToCart = useCallback((item) => {
    setCart(prev => [...prev, { ...item, cartId: Date.now() + Math.random() }]);
    showToast('✓ ' + item.name + ' added to cart');
  }, [showToast]);

  const removeFromCart = useCallback((cartId) => {
    setCart(prev => prev.filter(i => i.cartId !== cartId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const showProduct = useCallback((id) => {
    const p = prods.find(x => x.id === id);
    if (!p) return;
    setCurProd(p);
    go('detail');
  }, [prods, go]);

  // ── Price calculation ──
  const calcPrice = useCallback((prod, qty, selOpts = {}) => {
    if (!prod) return { total: 0, unit: 0, sqft: 0 };
    const isSqft = prod.sqft?.enabled;

    if (isSqft) {
      let sqftVal = 0;
      const sizeGroup = prod.opts?.find(g => g.key === 'size');
      const selSizeId = selOpts?.size;
      if (selSizeId === 'custom') {
        sqftVal = (parseFloat(selOpts?._custW) || 0) * (parseFloat(selOpts?._custH) || 0);
      } else {
        sqftVal = sizeGroup?.opts?.find(o => o.id === selSizeId)?.sqft || 0;
      }
      const rate = prod.sqft.rate || 6.5;
      const minSqft = prod.sqft.min || 1.0;
      const effectiveSqft = Math.max(sqftVal, minSqft);
      const pieces = Math.max(qty || 1, 1);
      let mult = 1.0;
      (prod.opts || []).filter(g => g.key !== 'size').forEach(g => {
        const opt = g.opts?.find(o => o.id === selOpts?.[g.key]);
        if (opt?.m) mult *= opt.m;
      });
      const unitCost = effectiveSqft * rate * mult;
      return { total: +(unitCost * pieces).toFixed(2), unit: +unitCost.toFixed(4), sqft: sqftVal };
    }

    const tier = prod.pricing?.find(t => t.q === qty) || prod.pricing?.[0];
    if (!tier) return { total: 0, unit: 0, sqft: 0 };
    let mult = 1.0;
    (prod.opts || []).forEach(g => {
      const opt = g.opts?.find(o => o.id === selOpts?.[g.key]);
      if (opt?.m) mult *= opt.m;
    });
    const total = +(tier.p * mult).toFixed(2);
    return { total, unit: +(total / (qty || 1)).toFixed(4), sqft: 0 };
  }, []);

  const cartSubtotal = cart.reduce((s, i) => s + (i.price || 0), 0);

  return (
    <AppContext.Provider value={{
      page, go,
      cart, addToCart, removeFromCart, clearCart, cartSubtotal,
      cats, setCats,
      prods, setProds,
      store, setStore,
      pricing, setPricing,
      pages, setPages,
      curProd, setCurProd, showProduct,
      toast, showToast,
      adminAuthed, setAdminAuthed,
      calcPrice,
      ls,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
