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
  ejsCtTpl:() => import.meta.env.VITE_EJS_CT_TPL || ls.raw('nxt_ejs_ct_tpl', ''),
};

// Universal EmailJS sender using REST API — no library needed, shows real errors
export async function sendEmailJS(svc, tpl, key, params) {
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ service_id: svc, template_id: tpl, user_id: key, template_params: params }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`EmailJS ${res.status}: ${txt}`);
  }
  return true;
}

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
    return {
      ...p,
      pricing:        o.pricing         || p.pricing,
      sqft:           o.sqft            ? { ...p.sqft, ...o.sqft } : p.sqft,
      imgs:           o.imgs?.length    ? o.imgs : p.imgs,
      badge:          o.badge           !== undefined ? o.badge    : p.badge,
      name:           o.name            || p.name,
      desc:           o.desc            || p.desc,
      disabled:       o.disabled        || false,
      opts:           o.opts            !== undefined ? o.opts     : p.opts,
      // Turnaround availability
      rush_ok:        o.rush_ok         !== undefined ? o.rush_ok         : p.rush_ok,
      express_ok:     o.express_ok      !== undefined ? o.express_ok      : p.express_ok,
      // Label configurator fields
      label_configurator: o.label_configurator !== undefined ? o.label_configurator : p.label_configurator,
      lbl_shapes:     o.lbl_shapes      !== undefined ? o.lbl_shapes      : p.lbl_shapes,
      lbl_sizes:      o.lbl_sizes       !== undefined ? o.lbl_sizes       : p.lbl_sizes,
      lbl_stocks:     o.lbl_stocks      !== undefined ? o.lbl_stocks      : p.lbl_stocks,
      lbl_ink:        o.lbl_ink         !== undefined ? o.lbl_ink         : p.lbl_ink,
      lbl_finishing:  o.lbl_finishing   !== undefined ? o.lbl_finishing   : p.lbl_finishing,
    };
  });
}

function mergeCatOverrides(cats, overrides) {
  if (!overrides?.length) return cats;
  // preserve default order unless overrides has a specific sort
  return cats.map(c => { const o = overrides.find(x => x.id === c.id); return o ? { ...c, ...o } : c; });
}

export function AppProvider({ children }) {
  // page state kept for backwards compat but routing is handled by React Router
  const [page, setPage] = useState('home');
  const [store, setStoreState]     = useState(() => ({ ...DEFAULT_STORE, ...ls.get('nxt_store', {}) }));
  const [cats,  setCatsState]      = useState(() => mergeCatOverrides(DEFAULT_CATS, ls.get('nxt_cats_overrides', null)));
  const [prods, setProdsState]     = useState(() => mergeOverrides(DEFAULT_PRODS, ls.get('nxt_pricing', null)));
  const [pricing, setPricingState] = useState(() => ({ ...DEFAULT_PRICING, ...ls.get('nxt_pricing_cfg', {}) }));
  const [cart,  setCart]           = useState(() => ls.get('nxt_cart', []));
  const [pages, setPages]          = useState(() => ls.get('nxt_custom_pages', []));
  const [builtinPages, setBuiltinPagesState] = useState(() => ({ ...DEFAULT_BUILTIN_PAGES, ...ls.get('nxt_builtin_pages', {}) }));
  const [curProd, setCurProd]      = useState(null);
  const [toast,   setToast]        = useState(null);
  const [adminAuthed, setAdminAuthed] = useState(() => ls.raw('nxt_admin_auth','') === 'true');
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    async function syncAll() {
      if (!isSupaReady()) return;
      setSyncing(true);
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
      // builtin pages
      supaGet('site_config', 'id=eq.builtin_pages').then(d => {
        if (d?.[0]?.data) { const merged = { ...DEFAULT_BUILTIN_PAGES, ...d[0].data }; ls.set('nxt_builtin_pages', merged); setBuiltinPagesState(merged); }
      });
      // pricing config
      const pcr = await supaGet('site_config', 'id=eq.pricing_cfg&limit=1');
      if (pcr?.length > 0 && pcr[0].data) {
        const d = typeof pcr[0].data === 'string' ? JSON.parse(pcr[0].data) : pcr[0].data;
        const m = { ...DEFAULT_PRICING, ...d };
        setPricingState(m); ls.set('nxt_pricing_cfg', m);
      }
      setSyncing(false);
    }
    syncAll();
  }, []);

  useEffect(() => { if (store.favicon_img) applyFavicon(store.favicon_img); }, [store.favicon_img]);
  useEffect(() => ls.set('nxt_cart', cart), [cart]);
  useEffect(() => ls.set('nxt_custom_pages', pages), [pages]);

  const setBuiltinPages = useCallback((updater) => {
    setBuiltinPagesState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      ls.set('nxt_builtin_pages', next);
      supaUpsert('site_config', { id: 'builtin_pages', data: next, updated_at: new Date().toISOString() });
      return next;
    });
  }, []);



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
      const overrides = next.map(p => ({
        id:                 p.id,
        name:               p.name,
        desc:               p.desc,
        badge:              p.badge,
        disabled:           p.disabled || false,
        imgs:               p.imgs || [],
        pricing:            p.pricing,
        sqft:               p.sqft || null,
        opts:               p.opts || [],
        // Turnaround
        rush_ok:            p.rush_ok,
        express_ok:         p.express_ok,
        // Label configurator
        label_configurator: p.label_configurator,
        lbl_shapes:         p.lbl_shapes,
        lbl_sizes:          p.lbl_sizes,
        lbl_stocks:         p.lbl_stocks,
        lbl_ink:            p.lbl_ink,
        lbl_finishing:      p.lbl_finishing,
      }));
      ls.set('nxt_pricing', overrides);
      supaUpsert('site_config', { id: 'products', data: overrides, updated_at: new Date().toISOString() });
      return next;
    });
  }, []);

  const setPricing = useCallback((p) => {
    setPricingState(p); ls.set('nxt_pricing_cfg', p);
    supaUpsert('site_config', { id: 'pricing_cfg', data: p, updated_at: new Date().toISOString() });
  }, []);

  const navigateRef = { current: null };
  const go = useCallback((p) => {
    const URL_MAP = { 'home':'/', 'products':'/products', 'cart':'/cart', 'checkout':'/checkout', 'success':'/order-confirmed', 'quote':'/quote', 'contact':'/contact', 'admin':'/admin', 'faq':'/faq', 'shipping':'/shipping', 'returns':'/returns', 'terms':'/terms', 'turnaround':'/turnaround' };
    const url = URL_MAP[p] || `/${p}`;
    if (navigateRef.current) navigateRef.current(url);
    else window.location.href = url;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const showToast = useCallback((msg) => { setToast(msg); setTimeout(() => setToast(null), 3200); }, []);
  const addToCart = useCallback((item) => { setCart(prev => [...prev, { ...item, cartId: Date.now() + Math.random() }]); showToast('✓ ' + item.name + ' added to cart'); }, [showToast]);
  const removeFromCart = useCallback((cartId) => setCart(prev => prev.filter(i => i.cartId !== cartId)), []);
  const clearCart = useCallback(() => setCart([]), []);
  const showProduct = useCallback((id) => {
    const p = prods.find(x => x.id === id);
    if (!p) return;
    setCurProd(p);
    const url = `/products/${p.cat}/${p.id}`;
    if (navigateRef.current) navigateRef.current(url);
    else window.location.href = url;
  }, [prods]);

  const calcPrice = useCallback((prod, qty, selOpts = {}) => {
    if (!prod) return { total: 0, unit: 0, sqft: 0 };

    // Helper: apply option add-ons to a base price
    function applyOpts(base, opts, selOpts, skipKey, sqftW, sqftH, qty) {
      let total = base;
      (opts||[]).filter(g => g.key !== skipKey).forEach(g => {
        const o = g.opts?.find(o => o.id === selOpts?.[g.key]);
        if (!o) return;
        const t = o.price_type || 'multiplier';
        const v = parseFloat(o.price_val ?? o.m ?? 1) || 0;
        if      (t === 'multiplier') total *= v;
        else if (t === 'percent')    total += base * (v / 100);
        else if (t === 'fixed')      total += v;
        else if (t === 'linear_ft') {
          // Linear footage = perimeter of the banner/sign: 2×(W+H)
          const custW = parseFloat(selOpts?._custW) || 0;
          const custH = parseFloat(selOpts?._custH) || 0;
          const w = custW || sqftW || 0;
          const h = custH || sqftH || 0;
          const perimeter = (w > 0 && h > 0) ? 2 * (w + h) : (w || h || qty || 1);
          total += v * perimeter;
        }
      });
      return total;
    }

    if (prod.sqft?.enabled) {
      let sqftVal = 0;
      let sqftW = 0, sqftH = 0;
      const selSizeId = selOpts?.size;
      if (selSizeId === 'custom') {
        sqftW = parseFloat(selOpts?._custW) || 0;
        sqftH = parseFloat(selOpts?._custH) || 0;
        sqftVal = sqftW * sqftH;
      } else {
        const sizeOpt = prod.opts?.find(g => g.key==='size')?.opts?.find(o => o.id===selSizeId);
        sqftVal = sizeOpt?.sqft || 0;
        if (sizeOpt?.w) {
          // Explicit w/h stored in admin
          sqftW = sizeOpt.w;
          sqftH = sizeOpt.h || (sqftVal / sqftW);
        } else {
          // Parse from label e.g. "2×4 ft", "2x4", "2×4"
          const match = (sizeOpt?.l || sizeOpt?.id || '').match(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)/i);
          if (match) {
            sqftW = parseFloat(match[1]);
            sqftH = parseFloat(match[2]);
          } else {
            sqftW = 0;
            sqftH = 0;
          }
        }
      }
      const baseUnit = Math.max(sqftVal, prod.sqft.min||1) * (prod.sqft.rate||6.5);
      const unitCost = applyOpts(baseUnit, prod.opts, selOpts, 'size', sqftW, sqftH, sqftW);
      return { total: +(unitCost * Math.max(qty||1,1)).toFixed(2), unit: +unitCost.toFixed(4), sqft: sqftVal };
    }
    const tier = prod.pricing?.find(t => t.q===qty) || prod.pricing?.[0];
    if (!tier) return { total: 0, unit: 0, sqft: 0 };
    const ti = prod.pricing?.indexOf(tier) ?? 0;
    // Check if selected size has its own direct prices
    const sizeGroup = prod.opts?.find(g => g.key === 'size');
    const sizeOpt = sizeGroup?.opts?.find(o => o.id === selOpts?.size);
    const sizePrice = sizeOpt?.size_prices?.[ti];
    if (sizePrice > 0) {
      // Use direct size price, then apply non-size option multipliers
      const base = sizePrice;
      const total = +applyOpts(base, prod.opts, selOpts, 'size', 0, 0, qty).toFixed(2);
      return { total, unit: +(total/(qty||1)).toFixed(4), sqft: 0 };
    }
    const total = +applyOpts(tier.p, prod.opts, selOpts, null, 0, 0, qty).toFixed(2);
    return { total, unit: +(total/(qty||1)).toFixed(4), sqft: 0 };
  }, []);

  const cartSubtotal = cart.reduce((s, i) => s + (i.price || 0), 0);

  return (
    <AppContext.Provider value={{ page, go, syncing, cart, addToCart, removeFromCart, clearCart, cartSubtotal, cats, setCats, prods, setProds, store, setStore, pricing, setPricing, pages, setPages, builtinPages, setBuiltinPages, curProd, setCurProd, showProduct, toast, showToast, adminAuthed, setAdminAuthed, calcPrice, cfg, ls }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

export const DEFAULT_BUILTIN_PAGES = {
  about: {
    title: 'About Nexa Customs', slug: 'about', nav: true,
    body: `Nexa Customs Inc. is a full-service commercial print shop proudly serving the Greater Toronto Area (GTA) and all of Canada since 2010. We are located in Mississauga, Ontario — centrally positioned to serve clients across the entire GTA with free same-day pickup.

Our Locations We Serve (Local Pickup Available)
We are based in Mississauga and offer free same-day pickup for clients throughout the GTA including Toronto, Brampton, Oakville, Burlington, Milton, Vaughan, Woodbridge, Etobicoke, North York, Scarborough, Markham, Richmond Hill, Pickering, Ajax, and Hamilton. Most orders placed before 10:30 AM are available for same-day pickup.

Canada-Wide Shipping
Can't make it in person? No problem. We ship to every province and territory across Canada including British Columbia, Alberta, Saskatchewan, Manitoba, Quebec, Nova Scotia, New Brunswick, Newfoundland, Prince Edward Island, and the Territories. We use Canada Post and FedEx/UPS to ensure fast, reliable delivery nationwide.

What We Print
We specialize in the full range of commercial print including business cards, vinyl banners, vehicle wraps and fleet graphics, window graphics, custom stickers and labels, flyers, postcards, foam boards, real estate signs, restaurant menus, posters, canvas prints, and calendars.

Our Equipment
Our Epson SureColor R5070 wide-format resin printer delivers vivid, long-lasting colours for banners, signs, and large-format work. Combined with precision digital printing for business cards and marketing materials, every job meets commercial quality standards.

Our Promise
Every order includes a free digital proof — we never go to press without your approval. Quality is guaranteed: if there is a manufacturing defect on our end, we reprint at no charge. No questions asked.

Contact Us
Phone: (437) 997-9921
Email: info@nexacustoms.ca
Address: 6033 Shawson Dr, Unit 40, Mississauga, ON L5T 1J6
Hours: Monday to Friday 9AM-6PM, Saturday by appointment`,
  },
  faq: {
    title: 'Frequently Asked Questions', slug: 'faq', nav: true,
    faqs: [
      { q: 'What file formats do you accept?', a: 'We accept PDF, AI, EPS, PSD, PNG (300dpi+), and high-res JPG. PDF is preferred for print-ready files.' },
      { q: 'Do you offer design services?', a: 'Yes! Free basic layout adjustments and affordable custom design. Email info@nexacustoms.ca with details.' },
      { q: 'What is your standard turnaround time?', a: 'Standard is 5-7 business days from proof approval. Rush (2-3 days) and Express (same/next day) available at a surcharge.' },
      { q: 'Do you ship across Canada?', a: 'Yes. We ship via Canada Post and courier. Local pickup is always free at our Mississauga location.' },
      { q: 'What is your quality guarantee?', a: 'If there is a print defect on our end, we reprint at no charge. We send a free proof before every order.' },
      { q: 'Can I get a proof before printing?', a: 'Absolutely - a digital PDF proof is free with every order. We print only after you approve it.' },
      { q: 'What is the minimum order?', a: 'Business cards start at 100. Banners at 1 piece. Stickers at 10. Check each product page for specifics.' },
      { q: 'Do you do same-day rush orders?', a: 'Yes! Call (437) 997-9921 to confirm availability before ordering.' },
      { q: 'Can you match Pantone colours?', a: 'We print in CMYK. Provide your Pantone or hex codes and we adjust your proof accordingly.' },
      { q: 'How do I send my artwork?', a: 'After placing your order, email files to info@nexacustoms.ca with your order number in the subject line.' },
    ],
  },
  turnaround: { title: 'Turnaround Times', slug: 'turnaround', nav: true, body: 'Standard turnaround is 5-7 business days from proof approval.\n\nRush (2-3 business days) and Express (same/next day) options are available at an additional fee applied at checkout.\n\nTurnaround begins after artwork approval, not order placement. Complex projects may require additional time.\n\nSame-day pickup available for orders placed before 10:30 AM with artwork approved by noon.' },
  shipping: { title: 'Shipping Policy', slug: 'shipping', nav: true, body: 'We ship across Ontario and Canada via Canada Post and FedEx/UPS courier.\n\nFree local pickup at 6033 Shawson Dr, Unit 40, Mississauga (Mon-Fri 9AM-6PM).\n\nFlat-rate shipping: Canada Post $18 · Courier $45\n\nNexa Customs is not responsible for carrier delays once the package is in transit. Contact us within 5 business days if your order arrives damaged.' },
  returns: { title: 'Return Policy', slug: 'returns', nav: true, body: 'Due to the custom-printed nature of our products, we do not accept returns or exchanges.\n\nIf there is a manufacturing defect or error on our part, we will reprint at no charge.\n\nClaims must be made within 5 business days of delivery. Email info@nexacustoms.ca with photos.\n\nWe cannot reprint for customer-supplied artwork errors - this is why we always send a free proof first.' },
  terms: { title: 'Terms & Conditions', slug: 'terms', nav: false, body: 'By placing an order with Nexa Customs Inc., you agree to the following:\n\n1. Artwork Rights: You confirm you own or have rights to all artwork submitted.\n\n2. Colour Accuracy: Colours may vary slightly from screen due to CMYK printing. Review your proof carefully.\n\n3. Payment: All prices are in CAD. Orders are confirmed once payment is received or invoice is approved.\n\n4. Turnaround: Production begins after proof approval.\n\n5. Liability: Nexa Customs liability is limited to the value of the order.' },
};
