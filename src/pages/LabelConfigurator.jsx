import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, imgUrl } from '../context/AppContext';

// ─── PRICING ENGINE ──────────────────────────────────────────────────────────
// Price scales by √(L×B) — larger labels cost more but not linearly
function areaFactor(w, h) {
  const area = parseFloat(w) * parseFloat(h);
  if (!area || area <= 0) return 1;
  return Math.max(1, Math.sqrt(area));
}

function parseSize(s) {
  if (!s || s.includes('Custom')) return { w: 1, h: 1 };
  const parts = s.replace(/"/g, '').split(/[×x]/i).map(p => parseFloat(p.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) return { w: parts[0], h: parts[1] };
  return { w: 1, h: 1 };
}

// Compute price from prod.pricing tiers × area factor
function computePrice(w, h, qty, prod) {
  const table = prod.pricing;
  if (!table?.length) return null;
  const row = table.find(r => r.q === qty) || table[0];
  if (!row) return null;
  const factor = areaFactor(w, h);
  const base = +(row.p * factor).toFixed(2);
  const perUnit = +(base / qty).toFixed(4);
  const base100 = +(table[0].p * factor).toFixed(2);
  const save = qty === table[0].q ? null : Math.round((1 - base / base100) * 100);
  return { price: base, perUnit, save };
}

function pricingRows(w, h, prod) {
  return (prod.pricing || []).map(row => ({
    qty: row.q,
    ...computePrice(w, h, row.q, prod),
  }));
}

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

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function LabelConfigurator({ prod }) {
  const { addToCart, showToast, pricing, prods } = useApp();
  const navigate = useNavigate();

  // Read config from prod — falls back to defaults
  const shapes   = prod.lbl_shapes   || ['Circle', 'Oval', 'Square', 'Rectangle', 'Custom'];
  const sizes    = prod.lbl_sizes    || ['2" × 2"', '3" × 3"', '4" × 4"'];
  const stocks   = prod.lbl_stocks   || ['Semi Gloss Paper'];
  const inks     = prod.lbl_ink      || ['CMYK (Full Colour)'];
  const finishes = prod.lbl_finishing || ['Standard'];
  const quantities = (prod.pricing || []).map(r => r.q);

  // State
  const [shape,        setShape]        = useState(shapes[0]);
  const [customNote,   setCustomNote]   = useState('');
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [customW,      setCustomW]      = useState('');
  const [customH,      setCustomH]      = useState('');
  const [stock,        setStock]        = useState(stocks[0]);
  const [inkColor,     setInkColor]     = useState(inks[0]);
  const [finishing,    setFinishing]    = useState(finishes[0]);
  const [qty,          setQty]          = useState(quantities[0] ?? 100);
  const [turnaround,   setTurnaround]   = useState('standard');
  const [imgIdx,       setImgIdx]       = useState(0);

  // Safe image helpers — prevents crash when imgs array changes
  const validImgs  = (prod?.imgs || []).filter(x => x?.length);
  const safeImgIdx = validImgs.length > 0 ? Math.min(imgIdx, validImgs.length - 1) : 0;

  // Reset when product changes
  useEffect(() => {
    setShape(shapes[0]); setCustomNote(''); setIsCustomSize(false);
    setSelectedSize(sizes[0]); setCustomW(''); setCustomH('');
    setStock(stocks[0]); setInkColor(inks[0]);
    setFinishing(finishes[0]); setQty(quantities[0] ?? 100);
    setTurnaround('standard');
  }, [prod.id]);

  const isCustomShape = shape === 'Custom';

  // Effective dimensions for pricing
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

  const isEstimate  = isCustomSize && hasValidDims;
  const showPricing = hasValidDims;

  const priceResult = showPricing ? computePrice(effectiveW, effectiveH, qty, prod) : null;
  const rows        = showPricing ? pricingRows(effectiveW, effectiveH, prod) : [];

  // Turnaround
  const rushMult    = pricing?.rush_pct    ?? 0.25;
  const expressMult = pricing?.express_pct ?? 0.50;
  const rushOk      = prod.rush_ok    !== false;
  const expressOk   = prod.express_ok !== false;
  const taMult      = turnaround === 'rush' ? rushMult : turnaround === 'express' ? expressMult : 0;
  const basePrice   = priceResult?.price ?? 0;
  const taFee       = +(basePrice * taMult).toFixed(2);
  const totalPrice  = +(basePrice + taFee).toFixed(2);

  const sizeLabel = isCustomSize
    ? (customW && customH ? `${customW}" × ${customH}"` : '—')
    : selectedSize || '—';

  // Sibling label products for cross-navigation
  const siblings = prods.filter(p => !p.disabled && p.cat === 'labels-stickers' && p.label_configurator && p.id !== prod.id);

  function handleAddToCart() {
    if (isCustomShape || !showPricing || totalPrice === 0) {
      navigate('/quote');
      return;
    }
    const opts = [
      `Shape: ${shape}`,
      `Size: ${sizeLabel}`,
      `Stock: ${stock}`,
      `Ink: ${inkColor}`,
      `Finish: ${finishing}`,
    ];
    addToCart({
      id: prod.id + '-' + Date.now(),
      name: prod.name,
      qty,
      opts,
      price: totalPrice,
      unitPrice: +(totalPrice / qty).toFixed(4),
      turnaround,
    });
    showToast(`✅ ${prod.name} added to cart!`);
  }

  // Shared input styles matching site theme
  const si = {
    width: '100%', background: 'var(--s2)', border: '1px solid var(--bd)',
    borderRadius: 'var(--r)', color: 'var(--tx)', padding: '10px 13px',
    fontSize: 13, outline: 'none', fontFamily: "'DM Sans',sans-serif",
    transition: 'border-color .18s',
  };
  const sl = {
    ...si, appearance: 'none',
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237c7c8a' stroke-width='1.5' fill='none'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 32,
  };

  return (
    <div className="W" style={{ padding: '32px 0 80px' }}>

      {/* Back */}
      <button onClick={() => navigate('/products/labels-stickers')} className="btn btn-ghost" style={{ fontSize: 12, marginBottom: 20, padding: '7px 14px' }}>
        ← Labels & Stickers
      </button>

      {/* Sibling product tabs */}
      {siblings.length > 0 && (
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 24 }}>
          <button className="ob sel" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {prod.badge && <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 6px', background: 'var(--ol)', color: 'var(--o)', borderRadius: 4 }}>{prod.badge}</span>}
            {prod.name}
          </button>
          {siblings.map(p => (
            <button key={p.id} onClick={() => navigate(`/products/labels-stickers/${p.id}`)} className="ob"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {p.name}
              {p.badge && <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 6px', background: 'var(--ol)', color: 'var(--o)', borderRadius: 4 }}>{p.badge}</span>}
            </button>
          ))}
        </div>
      )}

      {/* Product header */}
      <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: '22px 26px', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* Image gallery */}
          {validImgs.length > 0 && (
            <div style={{ flexShrink: 0 }}>
              {/* Main image */}
              <div style={{ width: 200, height: 200, borderRadius: 12, overflow: 'hidden', background: 'var(--s2)', border: '1px solid var(--bd)', marginBottom: 8 }}>
                <img
                  src={imgUrl(validImgs[safeImgIdx] || validImgs[0], 400)}
                  alt={prod.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              {/* Thumbnails */}
              {validImgs.length > 1 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', maxWidth: 200 }}>
                  {validImgs.map((img, i) => (
                    <button key={i} onClick={() => setImgIdx(i)}
                      style={{ width: 44, height: 44, borderRadius: 7, overflow: 'hidden', padding: 0, border: '2px solid ' + (i === imgIdx ? 'var(--o)' : 'var(--bd)'), cursor: 'pointer', background: 'var(--s2)', flexShrink: 0 }}>
                      <img src={imgUrl(img, 80)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Product info */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
              <h1 className="D" style={{ fontSize: 'clamp(20px,4vw,32px)', margin: 0 }}>{prod.name}</h1>
              {prod.badge && <span className="badge-orange">{prod.badge}</span>}
            </div>
            <p style={{ fontSize: 13, color: 'var(--mu)', marginBottom: 10, lineHeight: 1.7 }}>{prod.desc}</p>
            <div style={{ fontSize: 11, color: 'var(--mu)', display: 'flex', gap: 14 }}>
              <span>🇨🇦 Ships Canada-wide</span>
              <span>✅ Free digital proof</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }} className="lbl-layout">

        {/* ── LEFT ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Shape */}
          <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 20 }}>
            <div className="flbl" style={{ marginBottom: 12 }}>Shape</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {shapes.map(s => {
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
                {sizes.map(s => {
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
                  {shape === 'Circle' && ' For a perfect circle, set Length = Breadth.'}
                  {shape === 'Oval'   && ' For an oval, Length is the long side, Breadth is the short side.'}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'end', maxWidth: 300 }}>
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
                  <div style={{ marginTop: 10, fontSize: 11, color: 'var(--mu)', background: 'var(--s2)', borderRadius: 'var(--r)', padding: '8px 12px', display: 'inline-flex', gap: 12, flexWrap: 'wrap' }}>
                    <span>Area = {(parseFloat(customW) * parseFloat(customH)).toFixed(2)} in²</span>
                    <span>·</span>
                    <span>Factor: ×{areaFactor(customW, customH).toFixed(2)}</span>
                    <span>·</span>
                    <span style={{ color: 'var(--o)' }}>Price scales with √(L×B)</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stock + Ink + Finishing */}
          <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 20 }}>
            <div className="flbl" style={{ marginBottom: 8 }}>Stock / Material</div>
            <select value={stock} onChange={e => setStock(e.target.value)} style={{ ...sl, marginBottom: 16 }}>
              {stocks.map(s => <option key={s}>{s}</option>)}
            </select>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <div className="flbl" style={{ marginBottom: 8 }}>Ink Colour</div>
                <select value={inkColor} onChange={e => setInkColor(e.target.value)} style={sl}>
                  {inks.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <div className="flbl" style={{ marginBottom: 8 }}>Finishing</div>
                <select value={finishing} onChange={e => setFinishing(e.target.value)} style={sl}>
                  {finishes.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 20 }}>
            <div className="flbl" style={{ marginBottom: 12 }}>Quantity</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {quantities.map(q => (
                <button key={q} onClick={() => setQty(q)} className={qty === q ? 'ob sel' : 'ob'}
                  style={{ minWidth: 60, textAlign: 'center', fontWeight: qty === q ? 700 : 500 }}>
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
                { id: 'standard', ico: '📦', label: 'Standard', sub: '5–7 business days', fee: 0, ok: true },
                { id: 'rush',     ico: '⚡', label: 'Rush',     sub: '2–3 business days', fee: rushMult, ok: rushOk },
                { id: 'express',  ico: '🚀', label: 'Express',  sub: 'Same / next day',   fee: expressMult, ok: expressOk },
              ].map(opt => {
                const sel = turnaround === opt.id;
                const feeAmt = +(basePrice * opt.fee).toFixed(2);
                return (
                  <div key={opt.id} onClick={() => opt.ok && setTurnaround(opt.id)}
                    style={{ border: `2px solid ${sel ? 'var(--o)' : 'var(--bd)'}`, borderRadius: 10, padding: '12px 10px', textAlign: 'center', cursor: opt.ok ? 'pointer' : 'not-allowed', background: sel ? 'var(--ol)' : 'var(--s2)', opacity: opt.ok ? 1 : 0.45, transition: 'all .15s', position: 'relative' }}>
                    {!opt.ok && <div style={{ position: 'absolute', top: 4, right: 7, fontSize: 9, color: 'var(--mu)', fontWeight: 700 }}>N/A</div>}
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{opt.ico}</div>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>{opt.label}</div>
                    <div style={{ fontSize: 10, color: 'var(--mu)', marginTop: 2, lineHeight: 1.4 }}>{opt.sub}</div>
                    {opt.fee > 0 && opt.ok && basePrice > 0
                      ? <div style={{ fontSize: 10, color: sel ? 'var(--o)' : 'var(--mu)', fontWeight: 700, marginTop: 4 }}>+${feeAmt.toFixed(2)} ({Math.round(opt.fee*100)}%)</div>
                      : opt.fee === 0 && <div style={{ fontSize: 10, color: 'var(--gr)', fontWeight: 700, marginTop: 4 }}>Included</div>
                    }
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing table */}
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
                          ${row.price?.toFixed(2)}
                        </td>
                        <td style={{ padding: '10px 16px', color: 'var(--mu)', fontFamily: "'DM Mono',monospace" }}>${row.perUnit?.toFixed(4)}</td>
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

          {!showPricing && (
            <div style={{ fontSize: 13, color: 'var(--mu)', padding: '4px 0' }}>
              {isCustomShape ? 'Custom shape — a quote will be provided.' : 'Select or enter a size above to see live pricing.'}
            </div>
          )}
        </div>

        {/* ── RIGHT — Summary + CTA ── */}
        <div style={{ position: 'sticky', top: 90, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Price box */}
          <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--mu)' }}>Total</span>
              {prod.badge && <span className="badge-orange">{prod.badge}</span>}
            </div>
            {showPricing && priceResult ? (
              <>
                <div className="D" style={{ fontSize: 42, color: 'var(--o)', lineHeight: 1, marginBottom: 4 }}>
                  ${totalPrice.toFixed(2)}
                </div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: 'var(--mu)', marginBottom: 2 }}>
                  ${(totalPrice / qty).toFixed(4)}/unit · {qty.toLocaleString()} units
                </div>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, fontSize: 12 }}>
              {[
                ['Shape', `${shape}${isCustomShape && customNote ? ` (${customNote})` : ''}`],
                ['Size', sizeLabel],
                ['Stock', stock],
                ['Qty', qty.toLocaleString() + ' units'],
                ['Ink', inkColor],
                ['Finish', finishing],
                ['Turnaround', turnaround],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, borderBottom: '1px solid var(--bd)', paddingBottom: 5 }}>
                  <span style={{ color: 'var(--mu)' }}>{k}</span>
                  <span style={{ fontWeight: 600, textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>
            {isEstimate && (
              <div style={{ marginTop: 12, fontSize: 11, color: 'var(--mu)', background: 'var(--s2)', borderRadius: 7, padding: '7px 10px', borderLeft: '3px solid var(--o)' }}>
                📐 Custom size — pricing is estimated. We will confirm before production.
              </div>
            )}
            {isCustomShape && (
              <div style={{ marginTop: 12, fontSize: 11, color: 'var(--mu)', background: 'var(--s2)', borderRadius: 7, padding: '7px 10px', borderLeft: '3px solid var(--o)' }}>
                ⚡ Custom shape — we will follow up within 1 business day with exact pricing.
              </div>
            )}
          </div>

          {/* CTA */}
          <button onClick={handleAddToCart} className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: 14, borderRadius: 'var(--r)' }}>
            {isCustomShape
              ? 'Request a Quote →'
              : showPricing
              ? `Add to Cart — $${totalPrice.toFixed(2)}`
              : 'Configure to Continue'}
          </button>

          {/* Trust */}
          <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 16 }}>
            {[['✅','Free digital proof before printing'],['🇨🇦','Ships Canada-wide'],['⚡','Rush & Express available'],['🔒','Secure checkout'],['💬','(437) 997-9921']].map(([ico, t]) => (
              <div key={t} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--mu)', marginBottom: 7, alignItems: 'center' }}>
                <span>{ico}</span>{t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Extended description + Specs — below configurator */}
      {prod.long_desc && (
        <p style={{ fontSize: 12, color: 'var(--mu)', lineHeight: 1.8, marginTop: 20, padding:'10px 14px', background:'var(--s2)', borderRadius:8, borderLeft:'3px solid var(--o)' }}>{prod.long_desc}</p>
      )}
      {prod.specs && prod.specs.length > 0 && (
        <div style={{ marginTop: 18, marginBottom: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mu)', marginBottom: 8 }}>Specifications</div>
          <div style={{ background: 'var(--s2)', borderRadius: 8, border: '1px solid var(--bd)', overflow: 'hidden' }}>
            {prod.specs.filter(s=>s.k&&s.v).map((s, i, arr) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '38% 1fr', borderBottom: i < arr.length-1 ? '1px solid var(--bd)' : 'none' }}>
                <div style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: 'var(--mu)', borderRight: '1px solid var(--bd)', background: 'rgba(0,0,0,.15)' }}>{s.k}</div>
                <div style={{ padding: '8px 12px', fontSize: 11, color: 'var(--tx)' }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:700px){.lbl-layout{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  );
}
