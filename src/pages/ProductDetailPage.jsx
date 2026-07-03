import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, imgUrl } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { CAT_BG } from '../data/products';
import LabelConfigurator from './LabelConfigurator';

export default function ProductDetailPage() {
  const { curProd, cats, prods, pages, addToCart, calcPrice, showToast, store, pricing } = useApp();
  const navigate = useNavigate();
  const [selOpts, setSelOpts] = useState({});
  const [selQty, setSelQty] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [custW, setCustW] = useState('');
  const [custH, setCustH] = useState('');
  const [turnaround, setTurnaround] = useState('standard');
  const [activeTab, setActiveTab] = useState('overview');

  const prod = curProd;

  useEffect(() => {
    if (!prod) return;
    const defaults = {};
    (prod.opts || []).forEach(g => { const f = g.opts?.find(o => !o.disabled); if (f) defaults[g.key] = f.id; });
    setImgIdx(0); setCustW(''); setCustH('');

    // Restore a shared configuration from the URL if this link was shared (?qty=250&opt_paper=16pt&ta=rush)
    const params = new URLSearchParams(window.location.search);
    if (params.get('p') === prod.id) {
      const restored = { ...defaults };
      (prod.opts || []).forEach(g => { const v = params.get('opt_' + g.key); if (v) restored[g.key] = v; });
      setSelOpts(restored);
      setSelQty(parseInt(params.get('qty')) || prod.pricing?.[0]?.q || 1);
      setTurnaround(params.get('ta') || 'standard');
      if (params.get('w')) setCustW(params.get('w'));
      if (params.get('h')) setCustH(params.get('h'));
    } else {
      setSelOpts(defaults);
      setSelQty(prod.pricing?.[0]?.q ?? 1);
      setTurnaround('standard');
    }
  }, [prod?.id]);

  if (!prod) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14, textAlign: 'center', padding: 40 }}>
      <div style={{ fontSize: 56 }}>🖨️</div>
      <div style={{ color: 'var(--mu)' }}>No product selected.</div>
      <button className="btn btn-primary" onClick={() => navigate('/products')}>Browse Products</button>
    </div>
  );

  if (prod.label_configurator) return <LabelConfigurator prod={prod} />;

  const cat = cats.find(c => c.id === prod.cat);
  const imgs = prod.imgs?.filter(x => x?.length) || [];
  const isSqft = prod.sqft?.enabled;
  const isCustomSize = isSqft && selOpts?.size === 'custom';
  const priceOpts = isCustomSize ? { ...selOpts, _custW: custW, _custH: custH } : selOpts;
  const { total: basePrice, unit: unitPrice } = calcPrice(prod, selQty, priceOpts);

  const rushOk    = prod.rush_ok    !== false;
  const expressOk = prod.express_ok !== false;
  const overSamedayLimit = prod.sameday_max_qty > 0 && selQty > prod.sameday_max_qty;
  const rushAvail    = rushOk    && !overSamedayLimit;
  const expressAvail = expressOk && !overSamedayLimit;
  const rushMult    = pricing?.rush_pct    ?? 0.25;
  const expressMult = pricing?.express_pct ?? 0.50;
  const taMult = turnaround === 'rush' ? rushMult : turnaround === 'express' ? expressMult : 0;
  const taFee  = +(basePrice * taMult).toFixed(2);
  const price  = +(basePrice + taFee).toFixed(2);

  // If quantity climbs above the same-day/rush ceiling while Rush/Express was selected, fall back to Standard
  useEffect(() => {
    if (overSamedayLimit && turnaround !== 'standard') setTurnaround('standard');
  }, [overSamedayLimit]);

  function handleAdd() {
    if (price === 0) { showToast('Please configure your order'); return; }
    const optLabels = Object.entries(selOpts).map(([key, val]) => {
      const g = prod.opts?.find(x => x.key === key);
      return g?.opts?.find(o => o.id === val)?.l || val;
    }).filter(Boolean);
    if (isCustomSize && custW && custH) optLabels.push(`${custW}′ × ${custH}′`);
    addToCart({ id: prod.id, name: prod.name, qty: selQty, opts: optLabels, price, unitPrice, turnaround, imgs: prod.imgs?.filter(x=>x?.length) || [] });
    showToast(`✅ Added to cart!`);
  }

  function buildShareUrl() {
    const params = new URLSearchParams();
    params.set('p', prod.id);
    if (selQty) params.set('qty', selQty);
    if (turnaround !== 'standard') params.set('ta', turnaround);
    Object.entries(selOpts).forEach(([k, v]) => params.set('opt_' + k, v));
    if (isCustomSize) { if (custW) params.set('w', custW); if (custH) params.set('h', custH); }
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }

  function handleShare() {
    const url = buildShareUrl();
    navigator.clipboard?.writeText(url).then(
      () => showToast('🔗 Link copied — this exact configuration will load when opened'),
      () => showToast(url)
    );
  }

  function handleEmailQuote() {
    const optLabels = Object.entries(selOpts).map(([key, val]) => {
      const g = prod.opts?.find(x => x.key === key);
      return g?.opts?.find(o => o.id === val)?.l || val;
    }).filter(Boolean);
    const lines = [
      `${prod.name}`,
      `Quantity: ${selQty?.toLocaleString()}${isSqft ? ' pcs' : ' units'}`,
      isCustomSize && custW && custH ? `Size: ${custW}′ × ${custH}′` : null,
      ...optLabels.map(l => `- ${l}`),
      `Turnaround: ${turnaround === 'rush' ? 'Rush (2–3 days)' : turnaround === 'express' ? 'Express (same/next day)' : 'Standard (5–7 days)'}`,
      `Price: $${price.toFixed(2)}`,
      '',
      `View & order: ${buildShareUrl()}`,
    ].filter(Boolean);
    const subject = encodeURIComponent(`Quote: ${prod.name} — Nexa Customs`);
    const body = encodeURIComponent(lines.join('\n'));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  function handlePrint() { window.print(); }

  const related = prods.filter(p => !p.disabled && p.cat === prod.cat && p.id !== prod.id).slice(0, 4);
  const relatedPosts = (pages || []).filter(pg => pg.relatedCat === prod.cat).slice(0, 3);

  // Build config summary for right panel
  const configSummary = [
    ...Object.entries(selOpts).map(([key, val]) => {
      const g = prod.opts?.find(x => x.key === key);
      const o = g?.opts?.find(o => o.id === val);
      return [g?.label || key, o?.l || val];
    }),
    isSqft && isCustomSize && custW && custH ? ['Size', `${custW}ft × ${custH}ft`] : null,
    !isSqft && selQty ? ['Qty', `${selQty?.toLocaleString()} units`] : null,
    ['Turnaround', turnaround],
  ].filter(Boolean);

  return (
    <div>
      <div className="W">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--mu)', margin: '20px 0 24px', flexWrap: 'wrap' }}>
          {[['Home', '/'], ['Products', '/products'], [cat?.l, `/products/${cat?.id}`], [prod.name, null]].map(([label, path], i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {i > 0 && <span>›</span>}
              <span onClick={path ? () => navigate(path) : undefined}
                style={{ cursor: path ? 'pointer' : 'default', color: path ? 'inherit' : 'var(--tx)' }}
                onMouseEnter={e => path && (e.currentTarget.style.color = 'var(--o)')}
                onMouseLeave={e => path && (e.currentTarget.style.color = '')}
              >{label}</span>
            </span>
          ))}
        </div>

        {/* 3-column layout: image | configurator | sticky summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr 280px', gap: 28, alignItems: 'start', paddingBottom: 60 }} className="det-layout">

          {/* ── COL 1: Image (sticky) + Overview/Specs tabs (scrolls normally below) ── */}
          <div className="det-img">
            <div style={{ position: 'sticky', top: 82 }} className="det-img-sticky">
              <div style={{ background: CAT_BG[prod.cat] || 'var(--s2)', borderRadius: 14, overflow: 'hidden', marginBottom: 8 }}>
                {imgs.length > 0
                  ? <img src={imgUrl(imgs[imgIdx], 900)} alt={prod.name} width="900" height="360" style={{ width: '100%', height: 360, objectFit: 'cover', display: 'block' }} fetchpriority="high" />
                  : <div style={{ height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 90 }}>{cat?.i || '🖨️'}</div>
                }
              </div>
              {imgs.length > 1 && (
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 10 }}>
                  {imgs.map((_, i) => <div key={i} onClick={() => setImgIdx(i)} style={{ width: 7, height: 7, borderRadius: '50%', background: i === imgIdx ? 'var(--o)' : 'var(--bd)', cursor: 'pointer' }} />)}
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {[['✅','Free Proof'],['⚡','Rush Avail.'],['🛡️','Guaranteed'],['🚚','ON Shipping']].map(([ico, l]) => (
                  <div key={l} style={{ background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 7, padding: '7px 9px', fontSize: 10, color: 'var(--mu)', display: 'flex', alignItems: 'center', gap: 5 }}>{ico} {l}</div>
                ))}
              </div>
            </div>

            {/* Overview / Specs tabs — uses the space under the image, scrolls normally */}
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--bd)', marginBottom: 16 }}>
                {[
                  ['overview', 'Overview'],
                  ...(prod.specs?.filter(s=>s.k&&s.v).length > 0 ? [['specs', 'Specifications']] : []),
                ].map(([id, label]) => (
                  <button key={id} onClick={() => setActiveTab(id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px 4px', marginRight: 18, fontSize: 13, fontWeight: 700, color: activeTab === id ? 'var(--o)' : 'var(--mu)', borderBottom: `2px solid ${activeTab === id ? 'var(--o)' : 'transparent'}`, fontFamily: 'inherit' }}>
                    {label}
                  </button>
                ))}
              </div>

              {activeTab === 'overview' && (
                <div>
                  <p style={{ fontSize: 13, color: 'var(--tx)', lineHeight: 1.85, marginBottom: prod.long_desc ? 14 : 0, fontWeight: 500 }}>{prod.desc}</p>
                  {prod.long_desc && prod.long_desc.split('\n\n').map((block, bi) => {
                    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
                    const isBulletBlock = lines.length > 0 && lines.every(l => l.startsWith('- '));
                    if (isBulletBlock) {
                      return (
                        <ul key={bi} style={{ margin: '0 0 14px', paddingLeft: 18, fontSize: 13, color: 'var(--mu)', lineHeight: 1.8 }}>
                          {lines.map((l, li) => <li key={li}>{l.slice(2)}</li>)}
                        </ul>
                      );
                    }
                    return <p key={bi} style={{ fontSize: 13, color: 'var(--mu)', lineHeight: 1.8, marginBottom: 14, whiteSpace: 'pre-line' }}>{block}</p>;
                  })}
                </div>
              )}

              {activeTab === 'specs' && prod.specs && (
                <div style={{ background: 'var(--s2)', borderRadius: 8, border: '1px solid var(--bd)', overflow: 'hidden' }}>
                  {prod.specs.filter(s=>s.k&&s.v).map((s, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '38% 1fr', borderBottom: i < prod.specs.filter(s=>s.k&&s.v).length - 1 ? '1px solid var(--bd)' : 'none' }}>
                      <div style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: 'var(--mu)', borderRight: '1px solid var(--bd)', background: 'rgba(0,0,0,.15)' }}>{s.k}</div>
                      <div style={{ padding: '8px 12px', fontSize: 11, color: 'var(--tx)' }}>{s.v}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── COL 2: Configurator ── */}
          <div>
            {prod.badge && <div className="badge-orange" style={{ marginBottom: 8 }}>{prod.badge}</div>}
            <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 30, margin: '6px 0 20px' }}>{prod.name}</h1>

            {/* Options */}
            {(prod.opts || []).map(g => (
              <div key={g.key} style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mu)', marginBottom: 7 }}>{g.label}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {(g.opts || []).filter(o => !o.disabled).map(o => (
                    <button key={o.id} className={`ob${selOpts[g.key] === o.id ? ' sel' : ''}`}
                      onClick={() => setSelOpts(prev => ({ ...prev, [g.key]: o.id }))}>
                      {o.l}
                      {/* sq ft hidden from size chips */}
                    </button>
                  ))}
                </div>
                {g.key === 'size' && isCustomSize && (() => {
                  const maxW = prod.sqft?.maxW > 0 ? prod.sqft.maxW : null;
                  const maxH = prod.sqft?.maxH > 0 ? prod.sqft.maxH : null;
                  const minW = prod.sqft?.minW > 0 ? prod.sqft.minW : null;
                  const minH = prod.sqft?.minH > 0 ? prod.sqft.minH : null;
                  const wOver  = maxW && custW && parseFloat(custW) > maxW;
                  const hOver  = maxH && custH && parseFloat(custH) > maxH;
                  const wUnder = minW && custW && parseFloat(custW) < minW;
                  const hUnder = minH && custH && parseFloat(custH) < minH;
                  const wErr = wOver || wUnder;
                  const hErr = hOver || hUnder;
                  const hasLimit = maxW || maxH || minW || minH;
                  return (
                    <div style={{ marginTop: 10, background: 'var(--sf)', border: '1px solid var(--o)', borderRadius: 9, padding: 13 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--o)', marginBottom: 10 }}>Custom Dimensions</div>
                      {hasLimit && (
                        <div style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                          {(minW || minH) && <span>Min: <strong style={{ color: 'var(--tx)' }}>{minW || '—'}ft × {minH || '—'}ft</strong></span>}
                          {(maxW || maxH) && <span>Max: <strong style={{ color: 'var(--tx)' }}>{maxW || '—'}ft × {maxH || '—'}ft</strong></span>}
                        </div>
                      )}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
                        {[['Width (ft)', custW, setCustW, maxW], ['Height (ft)', custH, setCustH, maxH]].map(([lbl, val, setter, max]) => (
                          <div key={lbl}>
                            <div style={{ fontSize: 10, color: 'var(--mu)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.05em' }}>{lbl}</div>
                            <input type="number" step="0.5" placeholder="e.g. 3" value={val}
                              onChange={e => setter(e.target.value)}
                              style={{ width: '100%', background: 'var(--s2)', border: '1px solid ' + ((lbl.includes('Width') ? wErr : hErr) ? '#e55' : 'var(--bd)'), color: 'var(--tx)', padding: '8px 10px', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                          </div>
                        ))}
                      </div>
                      {(wErr || hErr) && (
                        <div style={{ fontSize: 11, color: '#e55', background: 'rgba(238,85,85,0.08)', border: '1px solid rgba(238,85,85,0.25)', borderRadius: 6, padding: '7px 10px', marginTop: 4 }}>
                          ⚠️ {wOver || hOver
                            ? (wOver && hOver ? 'Width and height exceed' : wOver ? 'Width exceeds' : 'Height exceeds') + ' our maximum print size. Please '
                            : (wUnder && hUnder ? 'Width and height are below' : wUnder ? 'Width is below' : 'Height is below') + ' our minimum print size. Please '}
                          <a href="/quote" style={{ color: 'var(--o)' }}>request a custom quote</a>.
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            ))}

            {/* Quantity */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mu)', marginBottom: 7 }}>
                {isSqft ? 'Quantity (Pieces)' : 'Select Quantity'}
              </div>
              {isSqft ? (
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--bd)', background: 'var(--s2)', borderRadius: 10, overflow: 'hidden', width: 'fit-content' }}>
                  <button onClick={() => setSelQty(q => Math.max(1, (q || 1) - 1))} style={{ padding: '11px 18px', fontSize: 20, fontWeight: 800, background: 'none', border: 'none', color: 'var(--tx)', cursor: 'pointer', borderRight: '1.5px solid var(--bd)' }}>−</button>
                  <span style={{ padding: '11px 24px', fontSize: 18, fontWeight: 800 }}>{selQty}</span>
                  <button onClick={() => setSelQty(q => (q || 1) + 1)} style={{ padding: '11px 18px', fontSize: 20, fontWeight: 800, background: 'none', border: 'none', color: 'var(--tx)', cursor: 'pointer', borderLeft: '1.5px solid var(--bd)' }}>+</button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(100px,1fr))', gap: 7 }}>
                  {prod.pricing.map(tier => {
                    const { total: tp } = calcPrice(prod, tier.q, selOpts);
                    const disp = tier.q >= 1000 ? (tier.q / 1000).toFixed(tier.q % 1000 ? 1 : 0) + 'K' : String(tier.q);
                    const sel = selQty === tier.q;
                    return (
                      <button key={tier.q} className={`qb${sel ? ' sel' : ''}`} onClick={() => setSelQty(tier.q)}>
                        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 18, lineHeight: 1.2 }}>{disp}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--o)' }}>${tp.toFixed(2)}</span>
                        <span style={{ fontSize: 10, color: 'var(--mu)', fontFamily: "'DM Mono',monospace" }}>${(tp / tier.q).toFixed(3)}/ea</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Turnaround */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mu)', marginBottom: 7 }}>Turnaround Time</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
                {[
                  { id: 'standard', ico: '📦', label: 'Standard', sub: '5–7 business days', fee: 0, ok: true },
                  { id: 'rush',     ico: '⚡', label: 'Rush',     sub: '2–3 business days', fee: rushMult, ok: rushAvail },
                  { id: 'express',  ico: '🚀', label: 'Express',  sub: 'Same / next day',   fee: expressMult, ok: expressAvail },
                ].map(opt => {
                  const sel = turnaround === opt.id;
                  const feeAmt = +(basePrice * opt.fee).toFixed(2);
                  return (
                    <div key={opt.id} onClick={() => opt.ok && setTurnaround(opt.id)}
                      style={{ border: `2px solid ${sel ? 'var(--o)' : 'var(--bd)'}`, borderRadius: 10, padding: '11px 8px', textAlign: 'center', cursor: opt.ok ? 'pointer' : 'not-allowed', background: sel ? 'var(--ol)' : opt.ok ? 'var(--s2)' : 'var(--sf)', opacity: opt.ok ? 1 : 0.45, transition: 'all .15s', position: 'relative' }}>
                      {!opt.ok && <div style={{ position: 'absolute', top: 4, right: 6, fontSize: 9, color: 'var(--mu)', fontWeight: 700 }}>N/A</div>}
                      <div style={{ fontSize: 18, marginBottom: 2 }}>{opt.ico}</div>
                      <div style={{ fontWeight: 700, fontSize: 12 }}>{opt.label}</div>
                      <div style={{ fontSize: 10, color: 'var(--mu)', marginTop: 2 }}>{opt.sub}</div>
                      {opt.fee > 0 && opt.ok && (
                        <div style={{ fontSize: 10, color: sel ? 'var(--o)' : 'var(--mu)', fontWeight: 700, marginTop: 3 }}>
                          +${feeAmt.toFixed(2)} ({Math.round(opt.fee * 100)}%)
                        </div>
                      )}
                      {opt.fee === 0 && <div style={{ fontSize: 10, color: 'var(--gr)', fontWeight: 700, marginTop: 3 }}>Included</div>}
                    </div>
                  );
                })}
              </div>
              {overSamedayLimit && (
                <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 8, lineHeight: 1.6 }}>
                  Rush & Express aren't available above {prod.sameday_max_qty.toLocaleString()} units for this product — orders this size ship Standard (5–7 business days). We'll ship sooner if it's ready early.
                </div>
              )}
            </div>
          </div>

          {/* ── COL 3: Sticky price summary ── */}
          <div style={{ position: 'sticky', top: 82, display: 'flex', flexDirection: 'column', gap: 12 }} className="det-sum">

            {/* Price box */}
            <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 4 }}>Total</div>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 44, color: 'var(--o)', lineHeight: 1 }}>
                ${price.toFixed(2)}
              </div>
              {selQty > 1 && unitPrice > 0 && !isSqft && (
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'var(--mu)', marginTop: 4 }}>
                  ${(basePrice / selQty).toFixed(3)}/ea · {selQty.toLocaleString()} units
                </div>
              )}
              {isSqft && custW && custH && (
                <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 4 }}>
                  {custW}ft × {custH}ft
                </div>
              )}
              {taFee > 0 && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--bd)', display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--mu)' }}>Base</span><span>${basePrice.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--o)', fontWeight: 700 }}>
                    <span>{turnaround === 'rush' ? '⚡ Rush' : '🚀 Express'} ({Math.round(taMult * 100)}%)</span>
                    <span>+${taFee.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Config summary */}
            <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 18 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mu)', marginBottom: 10 }}>Your Configuration</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {configSummary.map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 12, borderBottom: '1px solid var(--bd)', paddingBottom: 5 }}>
                    <span style={{ color: 'var(--mu)', flexShrink: 0 }}>{k}</span>
                    <span style={{ fontWeight: 600, textAlign: 'right', color: 'var(--tx)' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <button onClick={handleAdd}
              style={{ width: '100%', fontSize: 14, padding: '14px 0', borderRadius: 'var(--r)', background: 'var(--o)', color: '#000', border: 'none', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'background .18s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--od)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--o)'}>
              Add to Cart — ${price.toFixed(2)}
            </button>

            {/* Share / Email / Print actions */}
            <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginTop: 8 }}>
              <button onClick={handleShare} style={{ fontSize: 11, padding: '9px 4px', borderRadius: 8, border: '1px solid var(--bd)', background: 'var(--s2)', color: 'var(--mu)', cursor: 'pointer', fontWeight: 600 }}>🔗 Share</button>
              <button onClick={handleEmailQuote} style={{ fontSize: 11, padding: '9px 4px', borderRadius: 8, border: '1px solid var(--bd)', background: 'var(--s2)', color: 'var(--mu)', cursor: 'pointer', fontWeight: 600 }}>✉️ Email Quote</button>
              <button onClick={handlePrint} style={{ fontSize: 11, padding: '9px 4px', borderRadius: 8, border: '1px solid var(--bd)', background: 'var(--s2)', color: 'var(--mu)', cursor: 'pointer', fontWeight: 600 }}>🖨️ Print / PDF</button>
            </div>

            {/* Trust */}
            <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 14 }}>
              {[['🔒','Secure checkout'],['✅','Free proof included'],['🛡️','Quality guaranteed'],['📞', store.phone || '(437) 997-9921']].map(([ico, l]) => (
                <div key={l} style={{ display: 'flex', gap: 7, fontSize: 11, color: 'var(--mu)', marginBottom: 6, alignItems: 'center' }}>{ico} {l}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ paddingBottom: relatedPosts.length > 0 ? 40 : 60 }}>
            <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 26, marginBottom: 18 }}>More in {cat?.l}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }} className="related-grid">
              {related.map(r => <ProductCard key={r.id} prod={r} onOpen={() => navigate(`/products/${r.cat}/${r.id}`)} />)}
            </div>
          </div>
        )}

        {/* Related reading — links back to blog posts about this category */}
        {relatedPosts.length > 0 && (
          <div style={{ paddingBottom: 60 }}>
            <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 22, marginBottom: 16 }}>Helpful Guides</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
              {relatedPosts.map(post => (
                <div key={post.id} onClick={() => navigate(`/p/${post.slug}`)} style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 12, padding: '16px 18px', cursor: 'pointer', transition: 'border-color .15s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--o)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--bd)'}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--o)', marginBottom: 6 }}>Read More</div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{post.title} →</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`
        @media(max-width:1100px){
          .det-layout{grid-template-columns:1fr 260px !important}
          .det-img{grid-column:1/-1}
          .det-img-sticky{position:static !important; display:grid; grid-template-columns:200px 1fr; gap:16px; align-items:start}
        }
        @media(max-width:700px){
          .det-layout{grid-template-columns:1fr !important}
          .det-img-sticky{grid-template-columns:1fr !important; margin-bottom:8px}
          .det-sum{position:static !important}
        }
        @media(max-width:640px){.related-grid{grid-template-columns:repeat(2,1fr) !important}}
      `}</style>
    </div>
  );
}
