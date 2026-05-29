import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// ─── PRICING ENGINE ──────────────────────────────────────────────────────────
function areaFactor(w, h) {
  const area = parseFloat(w) * parseFloat(h);
  if (!area || area <= 0) return 1;
  return Math.max(1, Math.sqrt(area));
}

const BASE_PRICING = {
  'sheet-stickers': [
    { qty: 100,   base: 26.00,  orig: 39.00  },
    { qty: 250,   base: 39.34,  orig: 59.00  },
    { qty: 500,   base: 59.34,  orig: 89.00  },
    { qty: 1000,  base: 79.34,  orig: 119.00 },
    { qty: 2000,  base: 131.34, orig: 197.00 },
    { qty: 5000,  base: 171.34, orig: 257.00 },
    { qty: 10000, base: 258.01, orig: 387.00 },
  ],
  roll: [
    { qty: 100,  base: 69.30  },
    { qty: 250,  base: 89.10  },
    { qty: 500,  base: 107.25 },
    { qty: 1000, base: 137.95 },
    { qty: 2000, base: 193.75 },
    { qty: 3000, base: 209.25 },
    { qty: 5000, base: 234.05 },
  ],
};

function pricingKey(productId) {
  return productId === 'sheet-stickers' ? 'sheet-stickers' : 'roll';
}

function computePrice(w, h, qty, productId) {
  const table = BASE_PRICING[pricingKey(productId)];
  if (!table) return null;
  const row = table.find(r => r.qty === qty) || table[0];
  if (!row) return null;
  const factor = areaFactor(w, h);
  const price = +(row.base * factor).toFixed(2);
  const orig  = row.orig ? +(row.orig * factor).toFixed(2) : null;
  const perUnit = +(price / qty).toFixed(4);
  const base100 = table[0].base * factor;
  const save = qty === table[0].qty ? null : Math.round((1 - price / base100) * 100);
  return { price, orig, perUnit, save };
}

function pricingRows(w, h, productId) {
  return BASE_PRICING[pricingKey(productId)].map(row => ({
    qty: row.qty, ...computePrice(w, h, row.qty, productId)
  }));
}

function parseSize(s) {
  if (!s || s.includes('Custom')) return { w: 1, h: 1 };
  const parts = s.replace(/"/g, '').split(/[×x]/i).map(p => parseFloat(p.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) return { w: parts[0], h: parts[1] };
  return { w: 1, h: 1 };
}

// ─── PRODUCT DATA ─────────────────────────────────────────────────────────────
const LABEL_PRODUCTS = [
  {
    id: 'sheet-stickers', name: 'Sheet Stickers', badge: '30% OFF',
    desc: 'Full-colour sheet stickers — vibrant, lasting print. Each sheet contains multiple stickers. Cost-effective and versatile for any use.',
    shapes: ['Circle', 'Oval', 'Square', 'Rectangle', 'Custom'],
    sizes: ['1" × 1"','1.5" × 1.5"','2" × 2"','2" × 2.5"','3" × 3"','3.5" × 3.5"','4" × 4"'],
    stocks: ['Semi Gloss Paper'],
    inkColors: ['CMYK (Full Colour)'],
    finishing: ['Standard'],
    quantities: [100, 250, 500, 1000, 2000, 5000, 10000],
    turnaround: '3–12 business days', icon: '🏷️',
  },
  {
    id: 'square-cut-labels', name: 'Square Cut Labels', badge: null,
    desc: 'Clean square-cut labels with sharp edges. Ideal for product packaging, branding, and professional labelling.',
    shapes: ['Square', 'Rectangle', 'Custom'],
    sizes: ['2" × 2"','2" × 3"','3" × 3"','3" × 4"','4" × 4"','4" × 6"'],
    stocks: ['Semi Gloss Paper'],
    inkColors: ['CMYK (Full Colour)'],
    finishing: ['Standard'],
    quantities: [100, 250, 500, 1000, 2000, 5000],
    turnaround: '6–12 business days', icon: '🔖',
  },
  {
    id: 'paper-roll-labels', name: 'Paper Roll Labels', badge: 'Cost Effective',
    desc: 'Most popular roll label — versatile semi-gloss paper labels in multiple shapes. Great for product branding and general use.',
    shapes: ['Circle', 'Oval', 'Square', 'Rectangle', 'Custom'],
    sizes: ['1" × 1"','1.5" × 1.5"','2" × 2"','2" × 1"','2.5" × 2.5"','2" × 3"','3" × 3"','3.5" × 3.5"','2" × 4"','3.5" × 2"','4" × 3"','4" × 4"','4" × 6"','5" × 5"'],
    stocks: ['Semi Gloss Paper'],
    inkColors: ['CMYK (Full Colour)'],
    finishing: ['Standard'],
    quantities: [100, 250, 500, 1000, 2000, 3000, 5000],
    turnaround: '3–12 business days', icon: '📜',
  },
  {
    id: 'bopp-roll-labels', name: 'BOPP Roll Labels', badge: 'Waterproof',
    desc: 'Durable BOPP (Biaxially-Oriented Polypropylene) labels — waterproof, tear-resistant. Ideal for food, beverage, cosmetics, and moisture-exposed products.',
    shapes: ['Circle', 'Oval', 'Square', 'Rectangle', 'Custom'],
    sizes: ['1" × 1"','1.5" × 1.5"','2" × 2"','2" × 1"','2.5" × 2.5"','3" × 3"','3.5" × 3.5"','4" × 3"','4" × 6"'],
    stocks: ['White Gloss BOPP Permanent','White Gloss BOPP Removable','White Matte BOPP Permanent','White Matte BOPP Removable','Clear Gloss BOPP Permanent','Clear Gloss BOPP Removable'],
    inkColors: ['CMYK (Full Colour)', 'Black Only'],
    finishing: ['None','Matte Lamination','Gloss Lamination','Spot UV','Soft Touch Lamination'],
    quantities: [100, 250, 500, 1000, 2000, 3000, 5000],
    turnaround: '3–12 business days', icon: '🔵',
  },
  {
    id: 'white-plastic-labels', name: 'White Plastic Labels', badge: 'Durable',
    desc: 'Durable white BOPP plastic labels — waterproof and tear-resistant. Ideal for products exposed to moisture or rough handling.',
    shapes: ['Circle', 'Oval', 'Square', 'Rectangle', 'Custom'],
    sizes: ['1" × 1"','1.5" × 1.5"','2" × 2"','2" × 1"','2.5" × 2.5"','3" × 3"','3.5" × 3.5"','4" × 3"','4" × 6"'],
    stocks: ['White Gloss BOPP Permanent','White Matte BOPP Permanent'],
    inkColors: ['CMYK (Full Colour)'],
    finishing: ['None','Matte Lamination','Gloss Lamination'],
    quantities: [100, 250, 500, 1000, 2000, 3000, 5000],
    turnaround: '3–12 business days', icon: '🏁',
  },
  {
    id: 'clear-plastic-labels', name: 'Clear Plastic Labels', badge: 'Premium',
    desc: 'Premium transparent BOPP labels for a no-label look. Perfect for glass bottles, cosmetics, and premium product packaging.',
    shapes: ['Circle', 'Oval', 'Square', 'Rectangle', 'Custom'],
    sizes: ['1" × 1"','1.5" × 1.5"','2" × 2"','2" × 1"','2.5" × 2.5"','3" × 3"','3.5" × 3.5"','4" × 3"','4" × 6"'],
    stocks: ['Clear Gloss BOPP Permanent','Clear Gloss BOPP Removable'],
    inkColors: ['CMYK (Full Colour)'],
    finishing: ['None','Matte Lamination','Gloss Lamination','Spot UV'],
    quantities: [100, 250, 500, 1000, 2000, 3000, 5000],
    turnaround: '3–12 business days', icon: '💎',
  },
];

// ─── SHAPE SVG ────────────────────────────────────────────────────────────────
function ShapeSVG({ shape, active }) {
  const fill = active ? 'var(--o)' : 'var(--mu)';
  switch (shape) {
    case 'Circle':    return <svg width="28" height="28" viewBox="0 0 38 38"><circle cx="19" cy="19" r="15" fill={fill} opacity="0.85"/></svg>;
    case 'Oval':      return <svg width="28" height="28" viewBox="0 0 38 38"><ellipse cx="19" cy="19" rx="17" ry="10" fill={fill} opacity="0.85"/></svg>;
    case 'Square':    return <svg width="28" height="28" viewBox="0 0 38 38"><rect x="4" y="4" width="30" height="30" rx="3" fill={fill} opacity="0.85"/></svg>;
    case 'Rectangle': return <svg width="28" height="28" viewBox="0 0 38 38"><rect x="2" y="10" width="34" height="18" rx="3" fill={fill} opacity="0.85"/></svg>;
    case 'Custom':    return <svg width="28" height="28" viewBox="0 0 38 38"><polygon points="19,2 23,13 35,13 26,21 29,33 19,25 9,33 12,21 3,13 15,13" fill={fill} opacity="0.85"/></svg>;
    default:          return <svg width="28" height="28" viewBox="0 0 38 38"><circle cx="19" cy="19" r="15" fill={fill} opacity="0.85"/></svg>;
  }
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function LabelsStickersPage({ productId }) {
  const { addToCart, showToast, pricing } = useApp();
  const navigate = useNavigate();

  const prod = LABEL_PRODUCTS.find(p => p.id === productId) || LABEL_PRODUCTS[0];

  const [shape,        setShape]        = useState(prod.shapes[0]);
  const [customNote,   setCustomNote]   = useState('');
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [selectedSize, setSelectedSize] = useState(prod.sizes[0]);
  const [customW,      setCustomW]      = useState('');
  const [customH,      setCustomH]      = useState('');
  const [stock,        setStock]        = useState(prod.stocks[0]);
  const [inkColor,     setInkColor]     = useState(prod.inkColors[0]);
  const [finishing,    setFinishing]    = useState(prod.finishing[0]);
  const [qty,          setQty]          = useState(prod.quantities[0]);
  const [turnaround,   setTurnaround]   = useState('standard');

  useEffect(() => {
    setShape(prod.shapes[0]); setCustomNote(''); setIsCustomSize(false);
    setSelectedSize(prod.sizes[0]); setCustomW(''); setCustomH('');
    setStock(prod.stocks[0]); setInkColor(prod.inkColors[0]);
    setFinishing(prod.finishing[0]); setQty(prod.quantities[0]);
    setTurnaround('standard');
  }, [prod.id]);

  // ALL shapes use L×B — circle uses equal L=B, oval uses L×B
  const isCustomShape = shape === 'Custom';

  const { effectiveW, effectiveH, hasValidDims } = useMemo(() => {
    if (isCustomSize) {
      const w = parseFloat(customW), h = parseFloat(customH);
      if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) return { effectiveW: w, effectiveH: h, hasValidDims: true };
      return { effectiveW: 1, effectiveH: 1, hasValidDims: false };
    }
    if (selectedSize) {
      const { w, h } = parseSize(selectedSize);
      return { effectiveW: w, effectiveH: h, hasValidDims: true };
    }
    return { effectiveW: 1, effectiveH: 1, hasValidDims: false };
  }, [isCustomSize, customW, customH, selectedSize]);

  const needsQuote  = isCustomShape && !customNote;
  const showPricing = hasValidDims && !needsQuote;
  const isEstimate  = isCustomSize && hasValidDims;

  const priceResult = showPricing ? computePrice(effectiveW, effectiveH, qty, prod.id) : null;
  const rows        = showPricing ? pricingRows(effectiveW, effectiveH, prod.id) : [];

  const rushMult    = pricing?.rush_pct    ?? 0.25;
  const expressMult = pricing?.express_pct ?? 0.50;
  const taMult      = turnaround === 'rush' ? rushMult : turnaround === 'express' ? expressMult : 0;
  const basePrice   = priceResult?.price ?? 0;
  const taFee       = +(basePrice * taMult).toFixed(2);
  const totalPrice  = +(basePrice + taFee).toFixed(2);

  const sizeLabel = isCustomSize
    ? (customW && customH ? `${customW}" × ${customH}"` : '—')
    : selectedSize || '—';

  function handleAddToCart() {
    if (isCustomShape || !showPricing || totalPrice === 0) {
      navigate('/quote');
      return;
    }
    const opts = [
      `Shape: ${shape}`, `Size: ${sizeLabel}`,
      `Stock: ${stock}`, `Ink: ${inkColor}`, `Finish: ${finishing}`,
    ];
    addToCart({ id: prod.id + '-' + Date.now(), name: prod.name, qty, opts, price: totalPrice, unitPrice: +(totalPrice / qty).toFixed(4), turnaround });
    showToast(`✅ ${prod.name} added to cart!`);
  }

  // Shared input style matching site theme
  const si = { width: '100%', background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 'var(--r)', color: 'var(--tx)', padding: '10px 13px', fontSize: 13, outline: 'none', fontFamily: "'DM Sans',sans-serif", transition: 'border-color .18s' };
  const sl = { ...si, appearance: 'none', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237c7c8a' stroke-width='1.5' fill='none'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 32 };

  return (
    <div className="W" style={{ padding: '32px 0 80px' }}>

      {/* Back */}
      <button onClick={() => navigate('/products/labels-stickers')} className="btn btn-ghost" style={{ fontSize: 12, marginBottom: 20, padding: '7px 14px' }}>
        ← Labels & Stickers
      </button>

      {/* Product tabs */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 28 }}>
        {LABEL_PRODUCTS.map(p => (
          <button key={p.id} onClick={() => navigate(`/products/labels-stickers/${p.id}`)}
            className={p.id === prod.id ? 'ob sel' : 'ob'} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {p.icon} {p.name}
            {p.badge && <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 6px', background: 'var(--ol)', color: 'var(--o)', borderRadius: 4, textTransform: 'uppercase' }}>{p.badge}</span>}
          </button>
        ))}
      </div>

      {/* Header */}
      <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: '24px 28px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 40 }}>{prod.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 5 }}>
              <h1 className="D" style={{ fontSize: 'clamp(22px,4vw,34px)', margin: 0 }}>{prod.name}</h1>
              {prod.badge && <span className="badge-orange">{prod.badge}</span>}
            </div>
            <p style={{ fontSize: 13, color: 'var(--mu)', margin: 0, lineHeight: 1.7 }}>{prod.desc}</p>
          </div>
          <div style={{ fontSize: 11, color: 'var(--mu)', textAlign: 'right', whiteSpace: 'nowrap' }}>
            <div>⏱ {prod.turnaround}</div>
            <div style={{ marginTop: 3 }}>🇨🇦 Ships Canada-wide</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }} className="lbl-layout">

        {/* ── LEFT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Shape */}
          <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 20 }}>
            <div className="flbl" style={{ marginBottom: 12 }}>Shape</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {prod.shapes.map(s => {
                const sel = shape === s;
                return (
                  <button key={s} onClick={() => { setShape(s); if (s !== 'Custom') setCustomNote(''); }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '10px 14px', borderRadius: 'var(--r)', border: `1.5px solid ${sel ? 'var(--o)' : 'var(--bd)'}`, background: sel ? 'var(--ol)' : 'var(--s2)', cursor: 'pointer', transition: 'all .15s', minWidth: 68 }}>
                    <ShapeSVG shape={s} active={sel} />
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: sel ? 'var(--o)' : 'var(--mu)' }}>{s}</span>
                  </button>
                );
              })}
            </div>
            {isCustomShape && (
              <div style={{ marginTop: 12 }}>
                <input style={si} placeholder="Describe your shape (e.g. star, hexagon, die-cut logo)…" value={customNote} onChange={e => setCustomNote(e.target.value)} />
                <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 5 }}>Our team will confirm feasibility before production. You will receive a quote.</div>
              </div>
            )}
          </div>

          {/* Size */}
          <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="flbl" style={{ margin: 0 }}>Size (inches)</div>
              <div style={{ display: 'flex', borderRadius: 7, overflow: 'hidden', border: '1px solid var(--bd)' }}>
                {['Preset', 'Custom'].map(opt => (
                  <button key={opt} onClick={() => { setIsCustomSize(opt === 'Custom'); setCustomW(''); setCustomH(''); }}
                    style={{ padding: '5px 14px', border: 'none', fontSize: 11, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', cursor: 'pointer', background: (isCustomSize ? opt === 'Custom' : opt === 'Preset') ? 'var(--o)' : 'var(--s2)', color: (isCustomSize ? opt === 'Custom' : opt === 'Preset') ? '#000' : 'var(--mu)', transition: 'all .15s' }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {!isCustomSize ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {prod.sizes.map(s => {
                  const { w, h } = parseSize(s);
                  const area = (w * h).toFixed(2);
                  const sel = selectedSize === s;
                  return (
                    <button key={s} onClick={() => setSelectedSize(s)} className={sel ? 'ob sel' : 'ob'}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '7px 12px' }}>
                      <span style={{ fontWeight: 700 }}>{s}</span>
                      <span style={{ fontSize: 9, opacity: .7 }}>{area} in²</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div>
                <p style={{ fontSize: 12, color: 'var(--mu)', marginBottom: 14, lineHeight: 1.6 }}>
                  Enter your custom dimensions in inches. All shapes use Length × Breadth.
                  {(shape === 'Circle') && ' For a circle, set Length = Breadth (equal sides).'}
                  {(shape === 'Oval') && ' For an oval, Length is the long side, Breadth is the short side.'}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'end', maxWidth: 320 }}>
                  <div>
                    <div className="flbl" style={{ marginBottom: 6 }}>Length (in)</div>
                    <input type="number" min="0.25" step="0.25" placeholder="e.g. 3" value={customW} onChange={e => setCustomW(e.target.value)} style={si} />
                  </div>
                  <div style={{ paddingBottom: 10, color: 'var(--mu)', fontSize: 18, fontWeight: 700 }}>×</div>
                  <div>
                    <div className="flbl" style={{ marginBottom: 6 }}>Breadth (in)</div>
                    <input type="number" min="0.25" step="0.25" placeholder="e.g. 2" value={customH} onChange={e => setCustomH(e.target.value)} style={si} />
                  </div>
                </div>
                {customW && customH && parseFloat(customW) > 0 && parseFloat(customH) > 0 && (
                  <div style={{ marginTop: 10, fontSize: 11, color: 'var(--mu)', background: 'var(--s2)', borderRadius: 'var(--r)', padding: '8px 12px', display: 'inline-flex', gap: 12 }}>
                    <span>Area = {(parseFloat(customW) * parseFloat(customH)).toFixed(2)} in²</span>
                    <span>·</span>
                    <span>Size factor: ×{areaFactor(customW, customH).toFixed(2)}</span>
                    <span>·</span>
                    <span style={{ color: 'var(--o)' }}>Price scales with √(L×B)</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stock + Ink + Finishing */}
          <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 20 }}>
            <div className="flbl" style={{ marginBottom: 10 }}>Stock / Material</div>
            <select value={stock} onChange={e => setStock(e.target.value)} style={{ ...sl, marginBottom: 16 }}>
              {prod.stocks.map(s => <option key={s}>{s}</option>)}
            </select>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <div className="flbl" style={{ marginBottom: 8 }}>Ink Colour</div>
                <select value={inkColor} onChange={e => setInkColor(e.target.value)} style={sl}>
                  {prod.inkColors.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <div className="flbl" style={{ marginBottom: 8 }}>Finishing</div>
                <select value={finishing} onChange={e => setFinishing(e.target.value)} style={sl}>
                  {prod.finishing.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 20 }}>
            <div className="flbl" style={{ marginBottom: 12 }}>Quantity</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {prod.quantities.map(q => (
                <button key={q} onClick={() => setQty(q)} className={qty === q ? 'ob sel' : 'ob'}
                  style={{ fontWeight: qty === q ? 700 : 500, minWidth: 60, textAlign: 'center' }}>
                  {q.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Turnaround */}
          <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 20 }}>
            <div className="flbl" style={{ marginBottom: 12 }}>Turnaround Time</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {[
                { id: 'standard', ico: '📦', label: 'Standard', sub: prod.turnaround, fee: 0 },
                { id: 'rush',     ico: '⚡', label: 'Rush',     sub: '2–3 business days', fee: rushMult },
                { id: 'express',  ico: '🚀', label: 'Express',  sub: 'Same / next day',   fee: expressMult },
              ].map(opt => {
                const sel = turnaround === opt.id;
                const feeAmt = +(basePrice * opt.fee).toFixed(2);
                return (
                  <div key={opt.id} onClick={() => setTurnaround(opt.id)}
                    style={{ border: `2px solid ${sel ? 'var(--o)' : 'var(--bd)'}`, borderRadius: 10, padding: '12px 10px', textAlign: 'center', cursor: 'pointer', background: sel ? 'var(--ol)' : 'var(--s2)', transition: 'all .15s' }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{opt.ico}</div>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>{opt.label}</div>
                    <div style={{ fontSize: 10, color: 'var(--mu)', marginTop: 2, lineHeight: 1.4 }}>{opt.sub}</div>
                    {opt.fee > 0 && basePrice > 0
                      ? <div style={{ fontSize: 10, color: sel ? 'var(--o)' : 'var(--mu)', fontWeight: 700, marginTop: 4 }}>+${feeAmt.toFixed(2)} ({Math.round(opt.fee*100)}%)</div>
                      : <div style={{ fontSize: 10, color: 'var(--gr)', fontWeight: 700, marginTop: 4 }}>Included</div>
                    }
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing Table */}
          {showPricing && rows.length > 0 && (
            <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px 10px', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div className="flbl" style={{ margin: 0 }}>{isEstimate ? '⚡ Estimated Pricing' : 'Pricing'} — {sizeLabel}</div>
                {isEstimate && <span style={{ fontSize: 10, color: 'var(--o)', background: 'var(--ol)', padding: '2px 8px', borderRadius: 4 }}>Custom size — estimate only</span>}
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: 'var(--dk)' }}>
                    {['Qty', 'Price (CAD)', '/ unit', 'Savings'].map(h => (
                      <th key={h} style={{ padding: '9px 16px', textAlign: 'left', fontSize: 9, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mu)', borderBottom: '1px solid var(--bd)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => {
                    const active = row.qty === qty;
                    return (
                      <tr key={row.qty} onClick={() => setQty(row.qty)}
                        style={{ background: active ? 'var(--ol)' : 'transparent', cursor: 'pointer', borderBottom: '1px solid var(--bd)', transition: 'background .1s' }}>
                        <td style={{ padding: '10px 16px', fontWeight: active ? 700 : 400 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            {active && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--o)', display: 'inline-block' }} />}
                            {row.qty.toLocaleString()}
                          </span>
                        </td>
                        <td style={{ padding: '10px 16px', fontWeight: 700, color: active ? 'var(--o)' : 'var(--tx)' }}>
                          ${row.price.toFixed(2)}
                          {row.orig && <span style={{ fontSize: 10, color: 'var(--mu)', textDecoration: 'line-through', marginLeft: 7 }}>${row.orig.toFixed(2)}</span>}
                        </td>
                        <td style={{ padding: '10px 16px', color: 'var(--mu)', fontFamily: "'DM Mono',monospace" }}>${row.perUnit.toFixed(4)}</td>
                        <td style={{ padding: '10px 16px' }}>
                          {row.save
                            ? <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: 'var(--ol)', color: 'var(--o)' }}>Save {row.save}%</span>
                            : <span style={{ color: 'var(--mu)' }}>—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!showPricing && !isCustomShape && (
            <div style={{ fontSize: 13, color: 'var(--mu)', padding: '8px 0' }}>
              {!hasValidDims ? 'Enter your dimensions above to see live pricing.' : 'Select a size to see pricing.'}
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN — Summary + CTA ── */}
        <div style={{ position: 'sticky', top: 90, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Price box */}
          <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--mu)' }}>Total</span>
              {showPricing && priceResult?.orig && <span style={{ fontSize: 11, color: 'var(--gr)', fontWeight: 700 }}>30% OFF</span>}
            </div>

            {showPricing && priceResult ? (
              <>
                <div className="D" style={{ fontSize: 42, color: 'var(--o)', lineHeight: 1, marginBottom: 4 }}>
                  ${totalPrice.toFixed(2)}
                </div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: 'var(--mu)', marginBottom: 4 }}>
                  ${(totalPrice / qty).toFixed(4)}/unit
                </div>
                {priceResult.orig && (
                  <div style={{ fontSize: 12, color: 'var(--mu)' }}>
                    Was: <span style={{ textDecoration: 'line-through' }}>${priceResult.orig.toFixed(2)}</span>
                  </div>
                )}
                {taFee > 0 && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--bd)', fontSize: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--mu)' }}>Base price</span><span>${basePrice.toFixed(2)}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--o)', fontWeight: 700 }}>
                      <span>{turnaround === 'rush' ? '⚡ Rush' : '🚀 Express'} ({Math.round(taMult*100)}%)</span>
                      <span>+${taFee.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ color: 'var(--mu)', fontSize: 13, padding: '8px 0' }}>
                {isCustomShape ? 'Custom shape — quote required' : 'Configure above to see price'}
              </div>
            )}
          </div>

          {/* Config summary */}
          <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 18 }}>
            <div className="flbl" style={{ marginBottom: 10 }}>Your Configuration</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
              {[
                ['Shape', `${shape}${isCustomShape && customNote ? ` (${customNote})` : ''}`],
                ['Size', sizeLabel],
                ['Stock', stock],
                ['Qty', qty.toLocaleString() + ' units'],
                ['Ink', inkColor],
                ['Finish', finishing],
                ['Turnaround', turnaround],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ color: 'var(--mu)' }}>{k}</span>
                  <span style={{ fontWeight: 600, textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>
            {isEstimate && (
              <div style={{ marginTop: 12, fontSize: 11, color: 'var(--mu)', background: 'var(--s2)', borderRadius: 7, padding: '7px 10px', borderLeft: '3px solid var(--o)' }}>
                📐 Custom size — pricing is an estimate. We will confirm before production.
              </div>
            )}
            {isCustomShape && (
              <div style={{ marginTop: 12, fontSize: 11, color: 'var(--mu)', background: 'var(--s2)', borderRadius: 7, padding: '7px 10px', borderLeft: '3px solid var(--o)' }}>
                ⚡ Custom shape — our team will follow up within 1 business day with exact pricing.
              </div>
            )}
          </div>

          {/* CTA */}
          <button onClick={handleAddToCart} className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: 14, borderRadius: 'var(--r)' }}>
            {isCustomShape ? 'Request a Quote →' : showPricing ? `Add to Cart — $${totalPrice.toFixed(2)}` : 'Configure to Continue'}
          </button>

          {/* Trust badges */}
          <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 16 }}>
            {[['✅', 'Free digital proof before printing'],['🇨🇦', 'Ships Canada-wide'],['⚡', 'Rush & Express available'],['🔒', 'Secure checkout'],['💬', '(437) 997-9921']].map(([ico, t]) => (
              <div key={t} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--mu)', marginBottom: 7, alignItems: 'center' }}>
                <span>{ico}</span>{t}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:700px){.lbl-layout{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  );
}

export { LABEL_PRODUCTS };
