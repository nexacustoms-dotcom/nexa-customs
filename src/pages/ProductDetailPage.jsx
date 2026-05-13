import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { CAT_BG } from '../data/products';

export default function ProductDetailPage() {
  const { curProd, cats, prods, addToCart, calcPrice, showToast, store } = useApp();
  const navigate = useNavigate();
  const [selOpts, setSelOpts] = useState({});
  const [selQty, setSelQty] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [custW, setCustW] = useState('');
  const [custH, setCustH] = useState('');

  const prod = curProd;

  useEffect(() => {
    if (!prod) return;
    const defaults = {};
    (prod.opts || []).forEach(g => { const f = g.opts?.find(o => !o.disabled); if (f) defaults[g.key] = f.id; });
    setSelOpts(defaults);
    setSelQty(prod.pricing?.length > 1 ? prod.pricing[1].q : prod.pricing?.[0]?.q ?? 1);
    setImgIdx(0); setCustW(''); setCustH('');
  }, [prod?.id]);

  if (!prod) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14, textAlign: 'center', padding: 40 }}>
      <div style={{ fontSize: 56 }}>🖨️</div>
      <div style={{ color: 'var(--mu)' }}>No product selected.</div>
      <button className="btn btn-primary" onClick={() => navigate('/products')}>Browse Products</button>
    </div>
  );

  const cat = cats.find(c => c.id === prod.cat);
  const imgs = prod.imgs?.filter(x => x?.length) || [];
  const isSqft = prod.sqft?.enabled;
  const isCustomSize = isSqft && selOpts?.size === 'custom';
  const priceOpts = isCustomSize ? { ...selOpts, _custW: custW, _custH: custH } : selOpts;
  const { total: price, unit: unitPrice } = calcPrice(prod, selQty, priceOpts);

  function handleAdd() {
    if (price === 0) { showToast('Please configure your order'); return; }
    const optLabels = Object.entries(selOpts).map(([key, val]) => {
      const g = prod.opts?.find(x => x.key === key);
      return g?.opts?.find(o => o.id === val)?.l || val;
    }).filter(Boolean);
    if (isCustomSize && custW && custH) optLabels.push(`${custW}′ × ${custH}′`);
    addToCart({ id: prod.id, name: prod.name, qty: selQty, opts: optLabels, price, unitPrice });
  }

  const related = prods.filter(p => p.cat === prod.cat && p.id !== prod.id).slice(0, 4);

  return (
    <div>
      <div className="W">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--mu)', margin: '20px 0 24px', flexWrap: 'wrap' }}>
          {[['Home','home'],['Products','products'],[cat?.l,null],[prod.name,null]].map(([label, pg], i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {i > 0 && <span>›</span>}
              <span onClick={pg ? () => navigate(pg === 'home' ? '/' : '/'+pg) : undefined} style={{ cursor: pg ? 'pointer' : 'default', color: pg ? 'inherit' : 'var(--tx)' }}
                onMouseEnter={e => pg && (e.currentTarget.style.color = 'var(--o)')}
                onMouseLeave={e => pg && (e.currentTarget.style.color = '')}
              >{label}</span>
            </span>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 42, alignItems: 'start', paddingBottom: 60 }} className="det-layout">
          {/* Image col */}
          <div style={{ position: 'sticky', top: 82 }} className="det-img">
            <div style={{ background: CAT_BG[prod.cat] || 'var(--s2)', borderRadius: 14, overflow: 'hidden', marginBottom: 8 }}>
              {imgs.length > 0
                ? <img src={imgs[imgIdx]} alt={prod.name} style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block' }} />
                : <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>{cat?.i || '🖨️'}</div>
              }
            </div>
            {imgs.length > 1 && (
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 12 }}>
                {imgs.map((_, i) => <div key={i} onClick={() => setImgIdx(i)} style={{ width: 7, height: 7, borderRadius: '50%', background: i === imgIdx ? 'var(--o)' : 'var(--bd)', cursor: 'pointer' }} />)}
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
              {[['✅','Free Proof'],['⚡','Rush Available'],['🛡️','Guaranteed'],['🚚','ON Shipping']].map(([ico, l]) => (
                <div key={l} style={{ background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 7, padding: '8px 10px', fontSize: 11, color: 'var(--mu)', display: 'flex', alignItems: 'center', gap: 6 }}>{ico} {l}</div>
              ))}
            </div>
          </div>

          {/* Configurator */}
          <div>
            {prod.badge && <div className="badge-orange" style={{ marginBottom: 8 }}>{prod.badge}</div>}
            <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 32, margin: '8px 0 10px' }}>{prod.name}</h1>
            <p style={{ fontSize: 14, color: 'var(--mu)', lineHeight: 1.72, marginBottom: 20 }}>{prod.desc}</p>

            {/* Options */}
            {(prod.opts || []).map(g => (
              <div key={g.key} style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--mu)', marginBottom: 7 }}>{g.label}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {(g.opts || []).filter(o => !o.disabled).map(o => (
                    <button key={o.id} className={`ob${selOpts[g.key] === o.id ? ' sel' : ''}`}
                      onClick={() => setSelOpts(prev => ({ ...prev, [g.key]: o.id }))}
                    >
                      {o.l}
                      {isSqft && g.key === 'size' && o.sqft > 0 && <span style={{ display: 'block', fontSize: 9, opacity: .65, marginTop: 1 }}>{o.sqft} sq ft</span>}
                    </button>
                  ))}
                </div>
                {/* Custom size inputs */}
                {g.key === 'size' && isCustomSize && (
                  <div style={{ marginTop: 10, background: 'var(--sf)', border: '1px solid var(--o)', borderRadius: 9, padding: 13 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--o)', marginBottom: 10 }}>Custom Dimensions</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
                      {[['Width (ft)', custW, setCustW], ['Height (ft)', custH, setCustH]].map(([lbl, val, setter]) => (
                        <div key={lbl}>
                          <div style={{ fontSize: 10, color: 'var(--mu)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.05em' }}>{lbl}</div>
                          <input type="number" min="0.5" max="50" step="0.5" placeholder="e.g. 3" value={val}
                            onChange={e => setter(e.target.value)}
                            style={{ width: '100%', background: 'var(--s2)', border: '1px solid var(--bd)', color: 'var(--tx)', padding: '8px 10px', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--mu)' }}>Rate: <strong style={{ color: 'var(--o)' }}>${prod.sqft?.rate?.toFixed(2)}/sq ft</strong> · Min {prod.sqft?.min} sq ft</div>
                  </div>
                )}
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(105px,1fr))', gap: 7 }}>
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

            {/* Price box */}
            <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: '17px 22px', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--mu)' }}>Total</span>
                {!isSqft && selQty >= 500 && <span style={{ fontSize: 11, color: 'var(--gr)' }}>✓ Volume discount applied</span>}
              </div>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 42, color: 'var(--o)', lineHeight: 1 }}>${price.toFixed(2)}</div>
              {selQty > 1 && unitPrice > 0 && !isSqft && (
                <div style={{ fontSize: 12, color: 'var(--tx)', fontFamily: "'DM Mono',monospace", marginTop: 3 }}>${(price / selQty).toFixed(3)} each</div>
              )}
              {isSqft && custW && custH && (
                <div style={{ fontSize: 12, color: 'var(--mu)', marginTop: 3 }}>{custW}ft × {custH}ft = {(parseFloat(custW) * parseFloat(custH)).toFixed(1)} sq ft</div>
              )}
            </div>

            <button onClick={handleAdd} style={{ width: '100%', fontSize: 15, padding: 15, borderRadius: 'var(--r)', background: 'var(--o)', color: '#000', border: 'none', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'background .18s', marginBottom: 8 }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--od)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--o)'}
            >Add to Cart — ${price.toFixed(2)}</button>
            <div style={{ fontSize: 11, color: 'var(--mu)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span>🔒 Secure checkout</span><span>·</span><span>✅ Free proof</span><span>·</span><span>📞 {store.phone}</span>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ paddingBottom: 60 }}>
            <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 26, marginBottom: 18 }}>More in {cat?.l}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }} className="related-grid">
              {related.map(r => <ProductCard key={r.id} prod={r} onOpen={() => navigate(`/products/${r.cat}/${r.id}`)} />)}
            </div>
          </div>
        )}
      </div>
      <style>{`
        .det-layout{@media(max-width:1060px){grid-template-columns:1fr !important}}
        .det-img{@media(max-width:1060px){position:static !important}}
        .related-grid{@media(max-width:640px){grid-template-columns:repeat(2,1fr) !important}}
      `}</style>
    </div>
  );
}
