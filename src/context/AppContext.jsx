import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_CATS, DEFAULT_PRODS, DEFAULT_STORE, DEFAULT_PRICING } from '../data/products';

const AppContext = createContext(null);

const ls = {
  get: (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  raw: (k, fb) => { try { return localStorage.getItem(k) || fb; } catch { return fb; } },
  setRaw: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
};

// Merge saved per-product pricing overrides back into products
function mergeProductPricing(prods) {
  try {
    const saved = ls.get('nxt_pricing', null);
    if (!saved || !Array.isArray(saved)) return prods;
    return prods.map(p => {
      const s = saved.find(x => x.id === p.id);
      if (!s) return p;
      return {
        ...p,
        pricing: s.pricing || p.pricing,
        sqft: s.sqft ? { ...p.sqft, ...s.sqft } : p.sqft,
      };
    });
  } catch { return prods; }
}

export function AppProvider({ children }) {
  const [page, setPage] = useState(() => {
    const h = window.location.hash.replace('#', '').trim().toLowerCase();
    return h || 'home';
  });
  const [cart, setCart] = useState(() => ls.get('nxt_cart', []));
  const [cats, setCats] = useState(() => ls.get('nxt_cats', DEFAULT_CATS));
  const [prods, setProds] = useState(() => {
    const saved = ls.get('nxt_prods', null);
    const base = (saved && saved.length) ? saved : DEFAULT_PRODS;
    return mergeProductPricing(base);
  });
  const [store, setStore] = useState(() => ({ ...DEFAULT_STORE, ...ls.get('nxt_store', {}) }));
  const [pricing, setPricing] = useState(() => ({ ...DEFAULT_PRICING, ...ls.get('nxt_pricing_cfg', {}) }));
  const [pages, setPages] = useState(() => ls.get('nxt_custom_pages', []));
  const [curProd, setCurProd] = useState(null);
  const [toast, setToast] = useState(null);
  const [adminAuthed, setAdminAuthed] = useState(() => ls.raw('nxt_admin_auth', '') === 'true');

  useEffect(() => ls.set('nxt_cart', cart), [cart]);
  useEffect(() => ls.set('nxt_cats', cats), [cats]);
  useEffect(() => ls.set('nxt_prods', prods), [prods]);
  useEffect(() => ls.set('nxt_store', store), [store]);
  useEffect(() => ls.set('nxt_pricing_cfg', pricing), [pricing]);
  useEffect(() => ls.set('nxt_custom_pages', pages), [pages]);

  const go = useCallback((p) => {
    window.location.hash = p === 'home' ? '' : p;
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  }, []);

  const addToCart = useCallback((item) => {
    setCart(prev => [...prev, { ...item, cartId: Date.now() + Math.random() }]);
    showToast('✓ ' + item.name + ' added to cart');
  }, [showToast]);

  const removeFromCart = useCallback((cartId) => setCart(prev => prev.filter(i => i.cartId !== cartId)), []);
  const clearCart = useCallback(() => setCart([]), []);

  const showProduct = useCallback((id) => {
    const p = prods.find(x => x.id === id);
    if (!p) return;
    setCurProd(p);
    go('detail');
  }, [prods, go]);

  // Price calculation — matches HTML logic exactly
  const calcPrice = useCallback((prod, qty, selOpts = {}) => {
    if (!prod) return { total: 0, unit: 0, sqft: 0 };
    const isSqft = prod.sqft?.enabled;

    if (isSqft) {
      let sqftVal = 0;
      const sizeGroup = prod.opts?.find(g => g.key === 'size');
      const selSizeId = selOpts?.size;

      if (selSizeId === 'custom') {
        const w = parseFloat(selOpts?._custW) || 0;
        const h = parseFloat(selOpts?._custH) || 0;
        sqftVal = w * h;
      } else {
        const sOpt = sizeGroup?.opts?.find(o => o.id === selSizeId);
        sqftVal = sOpt?.sqft || 0;
      }

      const rate = prod.sqft.rate || 6.5;
      const minSqft = prod.sqft.min || 1.0;
      const effectiveSqft = Math.max(sqftVal, minSqft);
      const pieces = Math.max(qty || 1, 1);
      // Apply non-size option multipliers
      let mult = 1.0;
      (prod.opts || []).filter(g => g.key !== 'size').forEach(g => {
        const opt = g.opts?.find(o => o.id === selOpts?.[g.key]);
        if (opt?.m) mult *= opt.m;
      });
      const unitCost = effectiveSqft * rate * mult;
      return { total: +(unitCost * pieces).toFixed(2), unit: +unitCost.toFixed(4), sqft: sqftVal };
    }

    // Tiered
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
