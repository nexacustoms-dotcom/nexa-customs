import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_CATS, DEFAULT_PRODS, DEFAULT_STORE, DEFAULT_PRICING } from '../data/products';

// ── IMAGE OPTIMISATION ────────────────────────────────────────────────────────
// Supabase storage supports on-the-fly resize + WebP conversion
// Usage: imgUrl(src, 800) → appends ?width=800&quality=75&format=origin
export function imgUrl(src, width = 800, quality = 75) {
  if (!src || !src.includes('supabase.co/storage')) return src;
  const sep = src.includes('?') ? '&' : '?';
  return `${src}${sep}width=${width}&quality=${quality}&resize=contain`;
}


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
  const merged = prods.map(p => {
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
      cat:            o.cat             || p.cat,
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
      // Specs & extended description
      specs:          o.specs           !== undefined ? o.specs           : p.specs,
      long_desc:      o.long_desc       !== undefined ? o.long_desc       : p.long_desc,
    };
  });
  // Brand-new products created in Admin won't exist in the base default list —
  // append them as-is so they survive a page refresh instead of vanishing.
  const knownIds = new Set(prods.map(p => p.id));
  const newOnes = overrides.filter(o => !knownIds.has(o.id));
  return newOnes.length ? [...merged, ...newOnes] : merged;
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
      // Fetch all 6 config rows in parallel — saves ~1s vs sequential awaits
      const [cr, catr, pr, pager, pcr, cpr] = await Promise.all([
        supaGet('site_config', 'id=eq.main&limit=1'),
        supaGet('site_config', 'id=eq.categories&limit=1'),
        supaGet('site_config', 'id=eq.products&limit=1'),
        supaGet('site_config', 'id=eq.builtin_pages&limit=1'),
        supaGet('site_config', 'id=eq.pricing_cfg&limit=1'),
        supaGet('site_config', 'id=eq.custom_pages&limit=1'),
      ]);
      // store config
      if (cr?.length > 0 && cr[0].data) {
        const d = typeof cr[0].data === 'string' ? JSON.parse(cr[0].data) : cr[0].data;
        const m = { ...DEFAULT_STORE, ...d };
        setStoreState(m); ls.set('nxt_store', m);
        if (m.favicon_img) applyFavicon(m.favicon_img);
      }
      // category overrides
      if (catr?.length > 0 && catr[0].data) {
        const d = typeof catr[0].data === 'string' ? JSON.parse(catr[0].data) : catr[0].data;
        ls.set('nxt_cats_overrides', d);
        setCatsState(mergeCatOverrides(DEFAULT_CATS, d));
      }
      // product overrides
      if (pr?.length > 0 && pr[0].data) {
        const d = typeof pr[0].data === 'string' ? JSON.parse(pr[0].data) : pr[0].data;
        if (Array.isArray(d)) { ls.set('nxt_pricing', d); setProdsState(mergeOverrides(DEFAULT_PRODS, d)); }
      }
      // builtin pages
      if (pager?.[0]?.data) {
        const merged = { ...DEFAULT_BUILTIN_PAGES, ...pager[0].data };
        ls.set('nxt_builtin_pages', merged); setBuiltinPagesState(merged);
      }
      // pricing config
      if (pcr?.length > 0 && pcr[0].data) {
        const d = typeof pcr[0].data === 'string' ? JSON.parse(pcr[0].data) : pcr[0].data;
        const m = { ...DEFAULT_PRICING, ...d };
        setPricingState(m); ls.set('nxt_pricing_cfg', m);
      }
      // custom pages (e.g. blog posts) — falls back to whatever is in localStorage if none saved yet
      if (cpr?.length > 0 && cpr[0].data) {
        const d = typeof cpr[0].data === 'string' ? JSON.parse(cpr[0].data) : cpr[0].data;
        if (Array.isArray(d)) { ls.set('nxt_custom_pages', d); setPages(d); }
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

  const setPagesSynced = useCallback((updater) => {
    setPages(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      ls.set('nxt_custom_pages', next);
      supaUpsert('site_config', { id: 'custom_pages', data: next, updated_at: new Date().toISOString() });
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
        cat:                p.cat,
        name:               p.name,
        desc:               p.desc,
        badge:              p.badge,
        disabled:           p.disabled || false,
        imgs:               p.imgs || [],
        pricing:            p.pricing,
        sqft:               p.sqft || null,
        opts:               (p.opts || []).map(g => ({
          ...g,
          opts: (g.opts || []).map(o => ({ ...o, size_prices: o.size_prices || {} })),
        })),
        // Turnaround
        rush_ok:            p.rush_ok,
        express_ok:         p.express_ok,
        // Specs & extended description
        specs:              p.specs || [],
        long_desc:          p.long_desc || '',
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
    <AppContext.Provider value={{ page, go, syncing, cart, addToCart, removeFromCart, clearCart, cartSubtotal, cats, setCats, prods, setProds, store, setStore, pricing, setPricing, pages, setPages: setPagesSynced, builtinPages, setBuiltinPages, curProd, setCurProd, showProduct, toast, showToast, adminAuthed, setAdminAuthed, calcPrice, cfg, ls }}>
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
  turnaround: { title: 'Turnaround Times', slug: 'turnaround', nav: true, body: '>>> Turnaround time starts after proof approval — not from when you place your order. All times are business days (Monday–Friday, excluding holidays).\n\n## Production Options\n\n| Option | Time | Surcharge |\n|---|---|---|\n| Standard | 5–7 business days | Included |\n| Rush | 2–3 business days | +25% |\n| Express | Same / Next business day | +50% |\n\nRush and Express availability varies by product and current workload. Call (437) 997-9921 to confirm before ordering.\n\n## Turnaround by Product Category\n\n| Product | Standard | Rush | Express |\n|---|---|---|---|\n| Business Cards | 5–7 days | 2–3 days | Next day |\n| Flyers & Postcards | 5–7 days | 2–3 days | Next day |\n| Vinyl Banners | 5–7 days | 2–3 days | Same/Next day |\n| Stickers & Labels | 5–7 days | 2–3 days | Next day |\n| Vehicle Wraps | 7–10 days | 3–5 days | Call us |\n| Foam Boards & Signs | 5–7 days | 2–3 days | Next day |\n| Real Estate Signs | 3–5 days | 1–2 days | Same day |\n| Canvas & Posters | 5–7 days | 2–3 days | Next day |\n| Calendars | 7–10 days | 5 days | Not available |\n\n## Same-Day Pickup\n\nSame-day pickup is available for Express orders placed before 10:30 AM with artwork approved by noon. We will call or email you when your order is ready.\n\nPickup location: 6033 Shawson Dr, Unit 40, Mississauga · Mon–Fri 9AM–6PM\n\n## Important Notes\n\nTurnaround time does not include shipping time. If you are shipping via Canada Post (3–7 days) or Courier (1–3 days), add the shipping time to the production time for your total estimated delivery date.\n\nComplex projects such as large vehicle wraps, multi-piece trade show displays, or orders requiring extensive pre-press work may require additional time. We will advise you during the quote or proof stage.' },
  shipping: { title: 'Shipping Policy', slug: 'shipping', nav: true, body: '>>> Nexa Customs ships Canada-wide. Free local pickup always available at our Mississauga location. All prices in CAD + applicable taxes.\n\n## Delivery Options\n\n| Method | Cost | Estimated Delivery |\n|---|---|---|\n| Free Pickup | $0.00 | Ready same or next day (after proof approval) |\n| Canada Post | $18.00 flat | 3–7 business days |\n| Courier (FedEx/UPS) | $45.00 flat | 1–3 business days |\n\n## Free Local Pickup\n\nPickup is available at no charge at our Mississauga location:\n\n6033 Shawson Dr, Unit 40, Mississauga, ON L5T 1J6\nMonday – Friday: 9:00 AM – 6:00 PM\nSaturday: By appointment only\nPhone: (437) 997-9921\n\nWe will notify you by email when your order is ready for pickup.\n\n## Canada-Wide Shipping\n\nWe ship to all provinces and territories across Canada via Canada Post and FedEx/UPS. Flat-rate shipping applies regardless of order size or weight.\n\nOrders are shipped after proof approval and production completion. Tracking information will be emailed to you once the order ships.\n\n## Production Time vs. Shipping Time\n\nShipping time is separate from production time. Your total wait time = Production Time + Shipping Time.\n\nExample: Standard 5–7 day production + Canada Post 3–7 days = 8–14 business days total.\n\nFor fastest delivery, choose Express production + Courier shipping.\n\n## Damaged or Lost Shipments\n\nIf your order arrives damaged, contact us within 5 business days of delivery at info@nexacustoms.ca with photos of the damaged packaging and products. We will file a claim with the carrier and arrange a reprint or refund.\n\nNexa Customs is not responsible for carrier delays, lost packages after handoff to the carrier, or incorrect addresses provided by the customer. Please double-check your shipping address at checkout.' },
  returns: { title: 'Return Policy', slug: 'returns', nav: true, body: '>>> All our products are custom-printed to order. Please review your digital proof carefully before approving — production begins only after your approval.\n\n## Our Policy\n\nDue to the custom-printed nature of our products, we do not accept returns or exchanges for buyer\'s remorse, incorrect quantity ordered, or customer-supplied artwork errors.\n\nHowever, we stand 100% behind our print quality. If there is a manufacturing defect or error on our part, we will reprint your order at no charge.\n\n## When We Will Reprint or Refund\n\n| Situation | Our Response |\n|---|---|\n| Print defect (colour, banding, miscut) | Free reprint |\n| Wrong product shipped | Free reprint + return shipping |\n| Order lost in transit | Free reprint or full refund |\n| Our file/setup error | Free reprint |\n| Customer artwork error (approved proof) | Not eligible |\n| Change of mind | Not eligible |\n| Incorrect qty ordered | Not eligible |\n\n## How to Submit a Claim\n\n1. Email info@nexacustoms.ca within 5 business days of receiving your order\n2. Include your order number (NCX-XXXXX) in the subject line\n3. Attach clear photos of the defect and the packaging\n4. We will respond within 1 business day\n\n## The Proof Process\n\nEvery order includes a free digital PDF proof before printing. This is your opportunity to:\n\n- Check spelling, layout, and colours\n- Verify all artwork is correct\n- Confirm sizes and quantities\n\nProduction begins only after you approve the proof in writing (by email or website). By approving your proof, you confirm the artwork is correct and accept responsibility for any errors in the approved file.\n\n## Contact\n\nFor any concerns about your order, please contact us:\nEmail: info@nexacustoms.ca\nPhone: (437) 997-9921\nHours: Monday–Friday 9AM–6PM' },
  privacy: { title: 'Privacy Policy', slug: 'privacy', nav: false, body: '>>> Nexa Customs Inc. is committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information. Last updated: June 2026.\n\n## What We Collect\n\n| Information | Why We Collect It |\n|---|---|\n| Name, email, phone | Order processing and communication |\n| Shipping address | Delivery of your order |\n| Payment info | Processed securely via Stripe (we never store card numbers) |\n| IP address & browser | Website analytics and security |\n| Order history | Customer support and reorders |\n\n## How We Use Your Information\n\nWe use your information to:\n- Process and fulfill your orders\n- Send order confirmations, proofs, and shipping notifications\n- Respond to your questions and support requests\n- Improve our products and services\n- Comply with legal obligations\n\nWe do not sell, rent, or share your personal information with third parties for marketing purposes.\n\n## Payment Security\n\nAll payments are processed by Stripe, a PCI DSS Level 1 certified payment processor. Nexa Customs never stores your full credit card number. All transactions are encrypted using SSL/TLS technology.\n\n## Cookies & Analytics\n\nOur website uses Google Analytics to understand how visitors use our site. This data is anonymous and aggregated. You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on.\n\n## Data Retention\n\nWe retain your order information for 7 years as required by Canadian tax law. You may request deletion of your personal data at any time (subject to legal retention requirements) by emailing info@nexacustoms.ca.\n\n## Your Rights (PIPEDA)\n\nUnder Canada\'s Personal Information Protection and Electronic Documents Act (PIPEDA), you have the right to:\n- Access your personal information\n- Correct inaccurate information\n- Withdraw consent (may affect service delivery)\n- File a complaint with the Office of the Privacy Commissioner of Canada\n\n## Contact\n\nFor privacy questions or to exercise your rights:\nEmail: info@nexacustoms.ca\nPhone: (437) 997-9921\nAddress: 6033 Shawson Dr, Unit 40, Mississauga, ON L5T 1J6' },
  terms: { title: 'Terms & Conditions', slug: 'terms', nav: false, body: '>>> By placing an order with Nexa Customs Inc., you agree to these Terms & Conditions. Last updated: June 2026.\n\n## 1. Artwork & Intellectual Property\n\nYou confirm that you own or have legal rights to all artwork, logos, images, and text submitted to Nexa Customs. Nexa Customs accepts no liability for intellectual property infringement resulting from customer-supplied artwork. We reserve the right to refuse any order that contains unlicensed, offensive, or illegal content.\n\n## 2. Proofs & Approval\n\nA free digital proof is provided for every order. Production begins only after written proof approval by the customer (by email or through our website). By approving your proof, you accept full responsibility for any errors in the approved artwork including spelling, layout, colours, and bleed.\n\n## 3. Colour Accuracy\n\nAll products are printed in CMYK. Colours displayed on screen (RGB) may appear different when printed. Nexa Customs does not guarantee exact colour matching unless a hard-copy proof is requested and approved. Pantone colour matching is available upon request.\n\n## 4. Pricing & Payment\n\nAll prices are in Canadian dollars (CAD) and include applicable HST. Prices are subject to change without notice. Orders are confirmed upon receipt of payment. We accept major credit cards, debit, e-transfer, and cash.\n\n## 5. Turnaround Times\n\nTurnaround begins after proof approval, not order placement. Times are business days and are estimates only — they do not constitute a guarantee. Nexa Customs is not responsible for delays caused by customer artwork revisions, supplier issues, or circumstances beyond our control.\n\n## 6. Shipping & Delivery\n\nNexa Customs ships via Canada Post and FedEx/UPS. Once an order is handed to the carrier, Nexa Customs is not responsible for delays, damage, or loss. Claims for damaged shipments must be made within 5 business days of delivery.\n\n## 7. Returns & Reprints\n\nDue to the custom nature of our products, we do not accept returns. If there is a manufacturing defect on our part, we will reprint at no charge. Claims must include photos and be submitted within 5 business days of delivery. See our Return Policy for full details.\n\n## 8. Limitation of Liability\n\nNexa Customs liability is limited to the value of the order. We are not responsible for indirect, incidental, or consequential damages arising from the use of our products or services.\n\n## 9. Privacy\n\nWe collect personal information solely for order processing and communication purposes. We do not sell or share your information with third parties. See our Privacy Policy at nexacustoms.ca/privacy for full details.\n\n## 10. Governing Law\n\nThese terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein. Any disputes shall be resolved in the courts of Ontario.' },
};
