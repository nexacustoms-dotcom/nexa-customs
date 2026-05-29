import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// ─── PRICING ENGINE ──────────────────────────────────────────────────────────
// Price scales by √(area) so larger labels cost more but not linearly
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
    id: 'sheet-stickers',
    slug: 'sheet-stickers',
    name: 'Sheet Stickers',
    badge: '30% OFF',
    desc: 'Full-colour sheet stickers with vibrant, lasting print. Each sheet contains multiple stickers — cost-effective and versatile.',
    shapes: ['Circle', 'Rectangle', 'Square', 'Custom'],
    sizes: ['1" × 1"','1.5" × 1.5"','2" × 2"','2" × 2.5"','3" × 3"','3.5" × 3.5"','4" × 4"'],
    stocks: ['Semi Gloss Paper'],
    inkColors: ['CMYK (Full Colour)'],
    finishing: ['Standard'],
    quantities: [100, 250, 500, 1000, 2000, 5000, 10000],
    turnaround: '3–12 business days',
    color: '#f97316',
    icon: '🏷️',
    cat: 'labels-stickers',
  },
  {
    id: 'square-cut-labels',
    slug: 'square-cut-labels',
    name: 'Square Cut Labels',
    badge: null,
    desc: 'Clean square-cut labels with sharp edges, ideal for product packaging, branding, and professional labelling applications.',
    shapes: ['Square', 'Rectangle', 'Custom'],
    sizes: ['2" × 2"','2" × 3"','3" × 3"','3" × 4"','4" × 4"','4" × 6"'],
    stocks: ['Semi Gloss Paper'],
    inkColors: ['CMYK (Full Colour)'],
    finishing: ['Standard'],
    quantities: [100, 250, 500, 1000, 2000, 5000],
    turnaround: '6–12 business days',
    color: '#457B9D',
    icon: '🔖',
    cat: 'labels-stickers',
  },
  {
    id: 'paper-roll-labels',
    slug: 'paper-roll-labels',
    name: 'Paper Roll Labels',
    badge: 'Cost Effective',
    desc: 'Most popular roll label option. Versatile semi-gloss paper labels in multiple shapes — great for product branding and general use.',
    shapes: ['Circle', 'Oval', 'Square', 'Rectangle', 'Custom'],
    sizes: ['1" × 1"','1.5" × 1.5"','2" × 2"','2" × 1"','2.5" × 2.5"','2" × 3"','3" × 3"','3.5" × 3.5"','2" × 4"','3.5" × 2"','4" × 3"','4" × 4"','4" × 6"','5" × 5"'],
    stocks: ['Semi Gloss Paper'],
    inkColors: ['CMYK (Full Colour)'],
    finishing: ['Standard'],
    quantities: [100, 250, 500, 1000, 2000, 3000, 5000],
    turnaround: '3–12 business days',
    color: '#2D6A4F',
    icon: '📜',
    cat: 'labels-stickers',
  },
  {
    id: 'bopp-roll-labels',
    slug: 'bopp-roll-labels',
    name: 'BOPP Roll Labels',
    badge: 'Waterproof',
    desc: 'Durable BOPP (Biaxially-Oriented Polypropylene) roll labels — waterproof, tear-resistant. Ideal for food, beverage, cosmetics, and moisture-exposed products.',
    shapes: ['Circle', 'Oval', 'Square', 'Rectangle', 'Custom'],
    sizes: ['1" × 1"','1.5" × 1.5"','2" × 2"','2" × 1"','2.5" × 2.5"','3" × 3"','3.5" × 3.5"','4" × 3"','4" × 6"'],
    stocks: ['White Gloss BOPP Permanent','White Gloss BOPP Removable','White Matte BOPP Permanent','White Matte BOPP Removable','Clear Gloss BOPP Permanent','Clear Gloss BOPP Removable'],
    inkColors: ['CMYK (Full Colour)', 'Black Only'],
    finishing: ['None','Matte Lamination','Gloss Lamination','Spot UV','Soft Touch Lamination'],
    quantities: [100, 250, 500, 1000, 2000, 3000, 5000],
    turnaround: '3–12 business days',
    color: '#7B4FA6',
    icon: '🔵',
    cat: 'labels-stickers',
  },
  {
    id: 'white-plastic-labels',
    slug: 'white-plastic-labels',
    name: 'White Plastic Labels',
    badge: 'Durable',
    desc: 'Durable white BOPP plastic labels — waterproof and tear-resistant. Ideal for products exposed to moisture or rough handling.',
    shapes: ['Circle', 'Oval', 'Square', 'Rectangle', 'Custom'],
    sizes: ['1" × 1"','1.5" × 1.5"','2" × 2"','2" × 1"','2.5" × 2.5"','3" × 3"','3.5" × 3.5"','4" × 3"','4" × 6"'],
    stocks: ['White Gloss BOPP Permanent','White Matte BOPP Permanent'],
    inkColors: ['CMYK (Full Colour)'],
    finishing: ['None','Matte Lamination','Gloss Lamination'],
    quantities: [100, 250, 500, 1000, 2000, 3000, 5000],
    turnaround: '3–12 business days',
    color: '#6D6875',
    icon: '🏁',
    cat: 'labels-stickers',
  },
  {
    id: 'clear-plastic-labels',
    slug: 'clear-plastic-labels',
    name: 'Clear Plastic Labels',
    badge: 'Premium',
    desc: 'Premium transparent BOPP labels for a no-label look. Perfect for glass bottles, cosmetics, and premium product packaging.',
    shapes: ['Circle', 'Oval', 'Square', 'Rectangle', 'Custom'],
    sizes: ['1" × 1"','1.5" × 1.5"','2" × 2"','2" × 1"','2.5" × 2.5"','3" × 3"','3.5" × 3.5"','4" × 3"','4" × 6"'],
    stocks: ['Clear Gloss BOPP Permanent','Clear Gloss BOPP Removable'],
    inkColors: ['CMYK (Full Colour)'],
    finishing: ['None','Matte Lamination','Gloss Lamination','Spot UV'],
    quantities: [100, 250, 500, 1000, 2000, 3000, 5000],
    turnaround: '3–12 business days',
    color: '#1B7A8C',
    icon: '💎',
    cat: 'labels-stickers',
  },
];

// ─── SHAPE SVG ────────────────────────────────────────────────────────────────
function ShapeSVG({ shape, color, size = 36 }) {
  const s = size;
  const c = color;
  switch (shape) {
    case 'Circle':    return <svg width={s} height={s} viewBox="0 0 38 38"><circle cx="19" cy="19" r="15" fill={c} opacity="0.9"/></svg>;
    case 'Oval':      return <svg width={s} height={s} viewBox="0 0 38 38"><ellipse cx="19" cy="19" rx="17" ry="10" fill={c} opacity="0.9"/></svg>;
    case 'Square':    return <svg width={s} height={s} viewBox="0 0 38 38"><rect x="4" y="4" width="30" height="30" rx="3" fill={c} opacity="0.9"/></svg>;
    case 'Rectangle': return <svg width={s} height={s} viewBox="0 0 38 38"><rect x="2" y="10" width="34" height="18" rx="3" fill={c} opacity="0.9"/></svg>;
    case 'Custom':    return <svg width={s} height={s} viewBox="0 0 38 38"><polygon points="19,2 23,13 35,13 26,21 29,33 19,25 9,33 12,21 3,13 15,13" fill={c} opacity="0.9"/></svg>;
    default:          return <svg width={s} height={s} viewBox="0 0 38 38"><circle cx="19" cy="19" r="15" fill={c} opacity="0.9"/></svg>;
  }
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function LabelsStickersPage({ productId }) {
  const { addToCart, showToast, pricing } = useApp();
  const navigate = useNavigate();

  const prod = LABEL_PRODUCTS.find(p => p.id === productId) || LABEL_PRODUCTS[0];

  // Config state
  const [shape,        setShape]        = useState(prod.shapes[0]);
  const [customNote,   setCustomNote]   = useState('');
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [selectedSize, setSelectedSize] = useState(prod.sizes[0]);
  const [customW,      setCustomW]      = useState('');
  const [customH,      setCustomH]      = useState('');
  const [customDia,    setCustomDia]    = useState('');
  const [stock,        setStock]        = useState(prod.stocks[0]);
  const [inkColor,     setInkColor]     = useState(prod.inkColors[0]);
  const [finishing,    setFinishing]    = useState(prod.finishing[0]);
  const [qty,          setQty]          = useState(prod.quantities[0]);
  const [turnaround,   setTurnaround]   = useState('standard');

  // Reset when product changes
  useEffect(() => {
    setShape(prod.shapes[0]);
    setCustomNote(''); setIsCustomSize(false);
    setSelectedSize(prod.sizes[0]);
    setCustomW(''); setCustomH(''); setCustomDia('');
    setStock(prod.stocks[0]); setInkColor(prod.inkColors[0]);
    setFinishing(prod.finishing[0]); setQty(prod.quantities[0]);
    setTurnaround('standard');
  }, [prod.id]);

  const isCircleOrOval = shape === 'Circle' || shape === 'Oval';
  const isCustomShape  = shape === 'Custom';

  // Resolve effective W/H for pricing
  const { effectiveW, effectiveH, hasValidDims } = useMemo(() => {
    if (isCustomSize) {
      if (isCircleOrOval || isCustomShape) {
        const d = parseFloat(customDia);
        if (!isNaN(d) && d > 0) return { effectiveW: d, effectiveH: d, hasValidDims: true };
      } else {
        const w = parseFloat(customW), h = parseFloat(customH);
        if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) return { effectiveW: w, effectiveH: h, hasValidDims: true };
      }
      return { effectiveW: 1, effectiveH: 1, hasValidDims: false };
    }
    if (selectedSize) {
      const { w, h } = parseSize(selectedSize);
      return { effectiveW: w, effectiveH: h, hasValidDims: true };
    }
    return { effectiveW: 1, effectiveH: 1, hasValidDims: false };
  }, [isCustomSize, isCircleOrOval, isCustomShape, customDia, customW, customH, selectedSize]);

  const isEstimate  = isCustomSize && hasValidDims;
  const needsQuote  = isCustomShape || !hasValidDims;
  const showPricing = hasValidDims && !needsQuote;

  const priceResult = showPricing ? computePrice(effectiveW, effectiveH, qty, prod.id) : null;
  const rows        = showPricing ? pricingRows(effectiveW, effectiveH, prod.id) : [];

  // Turnaround
  const rushMult    = pricing?.rush_pct    ?? 0.25;
  const expressMult = pricing?.express_pct ?? 0.50;
  const taMult  = turnaround === 'rush' ? rushMult : turnaround === 'express' ? expressMult : 0;
  const basePrice   = priceResult?.price ?? 0;
  const taFee       = +(basePrice * taMult).toFixed(2);
  const totalPrice  = +(basePrice + taFee).toFixed(2);

  const sizeLabel = isCustomSize
    ? (isCircleOrOval || isCustomShape)
      ? customDia ? `⌀ ${customDia}"` : '—'
      : (customW && customH ? `${customW}" × ${customH}"` : '—')
    : selectedSize || '—';

  function handleAddToCart() {
    if (!showPricing || totalPrice === 0) {
      navigate('/quote');
      return;
    }
    const optLabels = [
      `Shape: ${isCustomShape ? `Custom${customNote ? ` (${customNote})` : ''}` : shape}`,
      `Size: ${sizeLabel}`,
      `Stock: ${stock}`,
      `Ink: ${inkColor}`,
      `Finish: ${finishing}`,
    ];
    addToCart({
      id: prod.id + '-' + Date.now(),
      name: prod.name,
      qty,
      opts: optLabels,
      price: totalPrice,
      unitPrice: +(totalPrice / qty).toFixed(4),
      turnaround,
    });
    showToast(`✅ ${prod.name} added to cart!`);
  }

  const inp = { background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 8, color: 'var(--tx)', padding: '8px 12px', fontSize: 14, outline: 'none', fontFamily: "'DM Sans',sans-serif", width: '100%' };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '32px 20px 80px' }}>

      {/* Back */}
      <button onClick={() => navigate('/products/labels-stickers')}
        style={{ background: 'none', border: 'none', color: 'var(--mu)', fontSize: 12, cursor: 'pointer', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 5 }}>
        ← Back to Labels & Stickers
      </button>

      {/* Product tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {LABEL_PRODUCTS.map(p => (
          <button key={p.id} onClick={() => navigate(`/products/labels-stickers/${p.id}`)}
            style={{ padding: '7px 14px', borderRadius: 20, border: `1.5px solid ${p.id === prod.id ? prod.color : 'var(--bd)'}`, background: p.id === prod.id ? prod.color + '18' : 'var(--s2)', color: p.id === prod.id ? prod.color : 'var(--mu)', fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all .15s' }}>
            {p.icon} {p.name}
          </button>
        ))}
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 28 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: prod.color + '18', border: `2px solid ${prod.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>{prod.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 28, textTransform: 'uppercase', margin: 0 }}>{prod.name}</h1>
            {prod.badge && <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 20, background: prod.color, color: '#fff', textTransform: 'uppercase', letterSpacing: '.05em' }}>{prod.badge}</span>}
          </div>
          <p style={{ fontSize: 13, color: 'var(--mu)', lineHeight: 1.7, margin: 0 }}>{prod.desc}</p>
          <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 6 }}>⏱ Turnaround: {prod.turnaround} · 🇨🇦 Ships Canada-wide</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }} className="lbl-layout">

        {/* LEFT — Configurator */}
        <div>

          {/* Shape */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mu)', marginBottom: 10 }}>Shape</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {prod.shapes.map(s => (
                <button key={s} onClick={() => { setShape(s); if (s !== 'Custom') setCustomNote(''); }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 14px', borderRadius: 12, border: `2px solid ${shape === s ? prod.color : 'var(--bd)'}`, background: shape === s ? prod.color + '12' : 'var(--s2)', cursor: 'pointer', transition: 'all .15s', minWidth: 64 }}>
                  <ShapeSVG shape={s} color={shape === s ? prod.color : 'var(--mu)'} size={34} />
                  <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: shape === s ? prod.color : 'var(--mu)' }}>{s}</span>
                </button>
              ))}
            </div>
            {isCustomShape && (
              <div style={{ marginTop: 10 }}>
                <input style={inp} placeholder="Describe your shape (e.g. star, hexagon, die-cut logo)…" value={customNote} onChange={e => setCustomNote(e.target.value)} />
                <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 5 }}>Our team will confirm feasibility before production.</div>
              </div>
            )}
          </div>

          {/* Size */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mu)' }}>Size (inches)</div>
              <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1.5px solid var(--bd)' }}>
                {['Preset', 'Custom'].map(opt => (
                  <button key={opt} onClick={() => setIsCustomSize(opt === 'Custom')}
                    style={{ padding: '5px 14px', border: 'none', fontSize: 11, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', cursor: 'pointer', background: (isCustomSize ? opt === 'Custom' : opt === 'Preset') ? prod.color : 'var(--s2)', color: (isCustomSize ? opt === 'Custom' : opt === 'Preset') ? '#fff' : 'var(--mu)', transition: 'all .15s' }}>
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
                    <button key={s} onClick={() => setSelectedSize(s)}
                      style={{ padding: '7px 11px', borderRadius: 9, border: `1.5px solid ${sel ? prod.color : 'var(--bd)'}`, background: sel ? prod.color + '15' : 'var(--s2)', color: sel ? prod.color : 'var(--tx)', fontSize: 12, fontWeight: sel ? 700 : 500, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, transition: 'all .15s' }}>
                      {s}
                      <span style={{ fontSize: 9, color: sel ? prod.color : 'var(--mu)', opacity: .8 }}>{area} in²</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {(isCircleOrOval || isCustomShape) ? (
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mu)', marginBottom: 6 }}>
                      {isCustomShape ? 'Max Diameter / Width' : 'Diameter'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="number" min="0.25" step="0.25" placeholder="e.g. 2.5" value={customDia} onChange={e => setCustomDia(e.target.value)}
                        style={{ ...inp, width: 100 }} />
                      <span style={{ color: 'var(--mu)', fontSize: 13 }}>in</span>
                    </div>
                    {customDia && !isNaN(parseFloat(customDia)) && (
                      <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 6, background: 'var(--s2)', borderRadius: 7, padding: '6px 10px', display: 'inline-block' }}>
                        Area ≈ {(Math.PI * (parseFloat(customDia)/2) ** 2).toFixed(2)} in² · Factor: ×{areaFactor(parseFloat(customDia), parseFloat(customDia)).toFixed(2)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mu)', marginBottom: 6 }}>Length (L)</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input type="number" min="0.25" step="0.25" placeholder="4" value={customW} onChange={e => setCustomW(e.target.value)} style={{ ...inp, width: 90 }} />
                          <span style={{ color: 'var(--mu)', fontSize: 13 }}>in</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 22, color: 'var(--mu)', paddingBottom: 4 }}>×</div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mu)', marginBottom: 6 }}>Breadth (B)</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input type="number" min="0.25" step="0.25" placeholder="2" value={customH} onChange={e => setCustomH(e.target.value)} style={{ ...inp, width: 90 }} />
                          <span style={{ color: 'var(--mu)', fontSize: 13 }}>in</span>
                        </div>
                      </div>
                    </div>
                    {customW && customH && parseFloat(customW) > 0 && parseFloat(customH) > 0 && (
                      <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 8, background: 'var(--s2)', borderRadius: 7, padding: '6px 10px', display: 'inline-block' }}>
                        Area = {(parseFloat(customW) * parseFloat(customH)).toFixed(2)} in² · Factor: ×{areaFactor(customW, customH).toFixed(2)} · Price scales with √(L×B)
                      </div>
                    )}
                  </div>
                )}
                <div style={{ fontSize: 11, color: 'var(--mu)' }}>Pricing updates live based on your dimensions.</div>
              </div>
            )}
          </div>

          {/* Stock */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mu)', marginBottom: 8 }}>Stock / Material</div>
            <select value={stock} onChange={e => setStock(e.target.value)} style={{ ...inp, appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%23888\' stroke-width=\'1.5\' fill=\'none\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 32 }}>
              {prod.stocks.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Ink + Finishing */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mu)', marginBottom: 8 }}>Ink Colour</div>
              <select value={inkColor} onChange={e => setInkColor(e.target.value)} style={{ ...inp, appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%23888\' stroke-width=\'1.5\' fill=\'none\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 32 }}>
                {prod.inkColors.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mu)', marginBottom: 8 }}>Finishing</div>
              <select value={finishing} onChange={e => setFinishing(e.target.value)} style={{ ...inp, appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%23888\' stroke-width=\'1.5\' fill=\'none\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 32 }}>
                {prod.finishing.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mu)', marginBottom: 10 }}>Quantity</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {prod.quantities.map(q => (
                <button key={q} onClick={() => setQty(q)}
                  style={{ padding: '7px 14px', borderRadius: 8, border: `1.5px solid ${qty === q ? prod.color : 'var(--bd)'}`, background: qty === q ? prod.color : 'var(--s2)', color: qty === q ? '#fff' : 'var(--mu)', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all .15s', fontFamily: "'Syne',sans-serif" }}>
                  {q.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Turnaround */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mu)', marginBottom: 10 }}>Turnaround Time</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {[
                { id: 'standard', ico: '📦', label: 'Standard', sub: prod.turnaround, fee: 0 },
                { id: 'rush',     ico: '⚡', label: 'Rush',     sub: '2–3 business days', fee: rushMult, ok: prod.rush_ok !== false },
                { id: 'express',  ico: '🚀', label: 'Express',  sub: 'Same / next day',  fee: expressMult, ok: prod.express_ok !== false },
              ].map(opt => {
                const sel = turnaround === opt.id;
                const ok = opt.ok !== false;
                const feeAmt = +(basePrice * (opt.fee || 0)).toFixed(2);
                return (
                  <div key={opt.id} onClick={() => ok && setTurnaround(opt.id)}
                    style={{ border: `2px solid ${sel ? prod.color : 'var(--bd)'}`, borderRadius: 10, padding: '11px 10px', textAlign: 'center', cursor: ok ? 'pointer' : 'not-allowed', background: sel ? prod.color + '10' : 'var(--s2)', opacity: ok ? 1 : 0.4, transition: 'all .15s', position: 'relative' }}>
                    {!ok && <div style={{ position: 'absolute', top: 4, right: 6, fontSize: 9, color: 'var(--mu)', fontWeight: 700 }}>N/A</div>}
                    <div style={{ fontSize: 18, marginBottom: 3 }}>{opt.ico}</div>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>{opt.label}</div>
                    <div style={{ fontSize: 10, color: 'var(--mu)', marginTop: 2, lineHeight: 1.4 }}>{opt.sub}</div>
                    {opt.fee > 0 && ok && basePrice > 0 && (
                      <div style={{ fontSize: 10, color: sel ? prod.color : 'var(--mu)', fontWeight: 700, marginTop: 3 }}>+${feeAmt.toFixed(2)} ({Math.round(opt.fee * 100)}%)</div>
                    )}
                    {opt.fee === 0 && <div style={{ fontSize: 10, color: '#22c55e', fontWeight: 700, marginTop: 3 }}>Included</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing table */}
          {showPricing && rows.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mu)', marginBottom: 10 }}>
                {isEstimate ? '⚡ Estimated Pricing' : 'Pricing'} — {sizeLabel}
              </div>
              {isEstimate && (
                <div style={{ fontSize: 11, color: '#7a6000', background: '#fffbea', border: '1px solid #f0d060', borderRadius: 8, padding: '8px 12px', marginBottom: 10, lineHeight: 1.5 }}>
                  ⚡ Custom size estimate — confirm with a quote for exact cost.
                </div>
              )}
              <div style={{ borderRadius: 10, border: '1px solid var(--bd)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: 'var(--s2)' }}>
                      {['Qty', 'Price (CAD)', '/ unit', 'Savings'].map(h => (
                        <th key={h} style={{ padding: '9px 12px', textAlign: 'left', fontSize: 9.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mu)', borderBottom: '1px solid var(--bd)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(row => {
                      const active = row.qty === qty;
                      return (
                        <tr key={row.qty} onClick={() => setQty(row.qty)} style={{ background: active ? prod.color + '0d' : 'transparent', cursor: 'pointer', transition: 'background .1s', borderBottom: '1px solid var(--bd)' }}>
                          <td style={{ padding: '9px 12px', fontWeight: active ? 700 : 400 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              {active && <span style={{ width: 7, height: 7, borderRadius: '50%', background: prod.color, display: 'inline-block', flexShrink: 0 }} />}
                              {row.qty.toLocaleString()}
                            </span>
                          </td>
                          <td style={{ padding: '9px 12px', fontWeight: 700, color: active ? prod.color : 'var(--tx)' }}>
                            ${row.price.toFixed(2)}
                            {row.orig && <span style={{ fontSize: 10, color: 'var(--mu)', textDecoration: 'line-through', marginLeft: 6 }}>${row.orig.toFixed(2)}</span>}
                          </td>
                          <td style={{ padding: '9px 12px', color: 'var(--mu)', fontSize: 11 }}>${row.perUnit.toFixed(4)}</td>
                          <td style={{ padding: '9px 12px' }}>
                            {row.save
                              ? <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: prod.color + '22', color: prod.color }}>Save {row.save}%</span>
                              : <span style={{ color: 'var(--mu)' }}>—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!showPricing && !needsQuote && (
            <div style={{ fontSize: 13, color: 'var(--mu)', padding: '12px 0' }}>Select a size above to see pricing.</div>
          )}

        </div>

        {/* RIGHT — Summary + CTA */}
        <div style={{ position: 'sticky', top: 90 }}>

          {/* Config summary */}
          <div style={{ background: 'var(--sf)', border: `1.5px solid ${prod.color}44`, borderRadius: 14, padding: 20, marginBottom: 14 }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--mu)', marginBottom: 12 }}>Your Configuration</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              {[
                `${shape}${isCustomShape && customNote ? ` (${customNote})` : ''}`,
                sizeLabel,
                stock,
                `${qty.toLocaleString()} units`,
                inkColor,
                finishing,
                turnaround,
              ].map(v => (
                <span key={v} style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', background: 'var(--s2)', borderRadius: 6, border: `1px solid ${prod.color}44`, color: prod.color }}>
                  {v}
                </span>
              ))}
            </div>

            {needsQuote && (
              <div style={{ fontSize: 11, color: '#7a6000', background: '#fffbea', borderRadius: 8, padding: '8px 12px', marginBottom: 12, lineHeight: 1.6, borderLeft: '3px solid #f0d060' }}>
                ⚡ Custom shape/size — our team will follow up within 1 business day with exact pricing.
              </div>
            )}
            {isEstimate && !needsQuote && (
              <div style={{ fontSize: 11, color: '#1a5276', background: '#eaf4fd', borderRadius: 8, padding: '8px 12px', marginBottom: 12, lineHeight: 1.6, borderLeft: '3px solid #5dade2' }}>
                📐 Price is estimated from your L×B dimensions. Confirm with a quote for exact cost.
              </div>
            )}

            {/* Price display */}
            {showPricing && priceResult && (
              <div style={{ borderTop: '1px solid var(--bd)', paddingTop: 14, marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 4 }}>Total</div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 38, color: prod.color, lineHeight: 1 }}>
                  ${totalPrice.toFixed(2)}
                </div>
                <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 4 }}>${(totalPrice / qty).toFixed(4)}/unit</div>
                {priceResult.orig && (
                  <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 2 }}>
                    <span style={{ textDecoration: 'line-through' }}>${priceResult.orig.toFixed(2)}</span>
                    <span style={{ color: '#22c55e', fontWeight: 700, marginLeft: 8 }}>30% OFF</span>
                  </div>
                )}
                {taFee > 0 && (
                  <div style={{ fontSize: 11, marginTop: 6, color: prod.color }}>
                    Base: ${basePrice.toFixed(2)} + {turnaround} fee: +${taFee.toFixed(2)}
                  </div>
                )}
              </div>
            )}

            <button onClick={handleAddToCart}
              style={{ width: '100%', padding: '13px 0', borderRadius: 10, border: 'none', background: prod.color, color: '#fff', fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'opacity .15s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              {needsQuote ? 'Request a Quote →' : `Add to Cart — $${totalPrice.toFixed(2)}`}
            </button>
          </div>

          {/* Info */}
          <div style={{ background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 12, padding: 16 }}>
            {[['✅', 'Free digital proof before printing'],['🇨🇦', 'Ships Canada-wide'],['⚡', 'Rush & Express available'],['💬', 'Call (437) 997-9921']].map(([ico, t]) => (
              <div key={t} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--mu)', marginBottom: 7 }}><span>{ico}</span>{t}</div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:700px) { .lbl-layout { grid-template-columns:1fr !important; } }
      `}</style>
    </div>
  );
}

// Export product list for routing
export { LABEL_PRODUCTS };
