import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const TESTIMONIALS = [
  { t: "Nexa Customs printed 500 business cards overnight. Quality was incredible — clients constantly compliment them.", a: "Sarah M.", co: "Bloom Real Estate", i: "S" },
  { t: "Best banner printing in Mississauga. Fast, affordable, and the colours are spot-on every time.", a: "James K.", co: "JK Construction", i: "J" },
  { t: "Our vehicle wrap turned so many heads. Professional from design to installation.", a: "Priya R.", co: "Priya's Catering", i: "P" },
  { t: "Ordered 5,000 flyers for a campaign — on time, vibrant colours, unbeatable pricing.", a: "Lisa T.", co: "Marketing Director", i: "L" },
];

export default function HomePage() {
  const { cats, prods, store, showProduct } = useApp();
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [tIdx, setTIdx] = useState(0);

  const defaultSlides = [
    { ico: '🪪', title: 'Premium Business Cards', sub: 'From $24.32 · Same-week turnaround · Free design proof', img: '' },
    { ico: '🪧', title: 'Vinyl Banners & Signs', sub: 'Custom sizes · Full colour · Indoor & outdoor · Rush available', img: '' },
    { ico: '🚗', title: 'Vehicle Wraps', sub: 'Full & partial wraps · Cast vinyl · 5–7 year life · Professional install', img: '' },
    { ico: '📄', title: 'Flyers & Postcards', sub: '1,000 flyers from $99 · Canada-wide shipping · 100lb gloss or matte', img: '' },
  ];
  const slides = (store.hero_slides && store.hero_slides.length > 0) ? store.hero_slides : defaultSlides;

  useEffect(() => { const t = setInterval(() => setSlide(i => (i + 1) % slides.length), 4000); return () => clearInterval(t); }, [slides.length]);

  const featured = prods.filter(p => p.badge === 'Most Popular' || p.badge === 'Best Seller').slice(0, 4);
  const displayProds = featured.length >= 4 ? featured : prods.slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section style={{ position: 'relative', padding: '76px 0 100px' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {store.hero_bg && <img src={store.hero_bg} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18 }} />}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(249,115,22,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.04) 1px,transparent 1px)', backgroundSize: '54px 54px' }} />
          <div style={{ position: 'absolute', top: -120, right: -60, width: 640, height: 640, borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,.1) 0%,transparent 68%)' }} />
        </div>
        <div className="W">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 410px', gap: 60, alignItems: 'center', position: 'relative', zIndex: 1 }} className="hero-grid">
            <div>
              <div className="badge-orange" style={{ marginBottom: 18 }}>Mississauga's Print Experts Since 2010</div>
              <h1 className="D" style={{ fontSize: 'clamp(52px,6vw,84px)', marginBottom: 22 }}>
                {store.hero1}<br />
                <span style={{ color: 'var(--o)' }}>{store.hero_accent}</span><br />
                {store.hero2}
              </h1>
              <p style={{ fontSize: 15, color: 'var(--mu)', maxWidth: 460, marginBottom: 32, lineHeight: 1.78 }}>{store.hero_sub}</p>
              <div style={{ display: 'flex', gap: 10, marginBottom: 44, flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => navigate('/products')}>Shop All Products →</button>
                <button className="btn btn-ghost" onClick={() => navigate('/quote')}>Get a Free Quote</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
                {[['10K+', 'Orders Completed'], ['500+', 'Happy Clients'], ['24hr', 'Rush Available'], ['4.9★', 'Google Rating']].map(([n, l], i, arr) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                    <div>
                      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 28, lineHeight: 1 }}>{n}</div>
                      <div style={{ fontSize: 11, color: 'var(--mu)' }}>{l}</div>
                    </div>
                    {i < arr.length - 1 && <div style={{ width: 1, height: 36, background: 'var(--bd)' }} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Slide showcase */}
            <div className="hero-right">
              <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 36px 88px rgba(0,0,0,.55)', minHeight: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative' }}>
                {slides[slide]?.img
                  ? <img src={slides[slide].img} alt={slides[slide].title} style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }} />
                  : (
                    <div style={{ padding: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                      <div style={{ fontSize: 64, marginBottom: 16 }}>{slides[slide]?.ico || '🖨️'}</div>
                      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 22, textTransform: 'uppercase', marginBottom: 8 }}>{slides[slide]?.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--mu)', lineHeight: 1.6 }}>{slides[slide]?.sub}</div>
                    </div>
                  )
                }
                <div style={{ display: 'flex', gap: 6, padding: '10px 0', position: 'absolute', bottom: 8 }}>
                  {slides.map((_, i) => (
                    <div key={i} onClick={() => setSlide(i)} style={{ width: 6, height: 6, borderRadius: '50%', background: i === slide ? 'var(--o)' : 'var(--bd)', cursor: 'pointer', transition: 'background .2s' }} />
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 14 }}>
                {[['⭐', '4.9/5', 'Google'], ['⚡', 'Same Day', 'Pickup'], ['✅', 'Free Proof', 'Included'], ['🇨🇦', 'Ontario', 'Wide']].map(([ico, v, l]) => (
                  <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 10, padding: '12px 8px', textAlign: 'center' }}>
                    <span style={{ fontSize: 18 }}>{ico}</span>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{v}</div>
                    <div style={{ fontSize: 9, color: 'var(--mu)' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: '56px 0' }}>
        <div className="W">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <h2 className="D" style={{ fontSize: 'clamp(26px,3.5vw,42px)' }}>Shop By Category</h2>
            <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => navigate('/products')}>View All →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 10 }} className="cat-grid">
            {cats.slice(0, 12).map(c => (
              <div key={c.id} onClick={() => navigate(`/products/${c.id}`)}
                style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: '18px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8, transition: 'all .2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--o)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bd)'; e.currentTarget.style.transform = ''; }}
              >
                {c.img
                  ? <img src={c.img} alt={c.l} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, marginBottom: 2 }} />
                  : <span style={{ fontSize: 28 }}>{c.i}</span>}
                <span style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.3 }}>{c.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR PRODUCTS */}
      <section style={{ background: 'var(--dk)', padding: '56px 0' }}>
        <div className="W">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <div className="badge-orange" style={{ marginBottom: 10 }}>Top Sellers</div>
              <h2 className="D" style={{ fontSize: 'clamp(26px,3.5vw,42px)' }}>Most Popular Products</h2>
            </div>
            <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => navigate('/products')}>All Products →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }} className="prod-grid-4">
            {displayProds.map(p => <ProductCard key={p.id} prod={p} onOpen={() => showProduct(p.id)} />)}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '68px 0' }}>
        <div className="W">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 13 }} className="feat-grid">
            {[
              { ico: '⚡', t: 'Same-Day Pickup', d: 'Order before 10:30 AM for same-day pickup at our Mississauga location.' },
              { ico: '🛡️', t: 'Quality Guaranteed', d: 'Not satisfied? We reprint at no charge. Every order checked before delivery.' },
              { ico: '🎨', t: 'Free Design Proof', d: "See your print before it goes to press. Revisions until you're 100% happy." },
              { ico: '🚚', t: 'Ontario-Wide Shipping', d: 'Fast courier delivery across Ontario. Flat rate, no surprises.' },
            ].map(f => (
              <div key={f.t} style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: '24px 20px' }}>
                <div style={{ width: 40, height: 40, background: 'rgba(249,115,22,.1)', border: '1px solid rgba(249,115,22,.18)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 13 }}>{f.ico}</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 5 }}>{f.t}</div>
                <div style={{ fontSize: 12, color: 'var(--mu)', lineHeight: 1.65 }}>{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: 'linear-gradient(135deg,rgba(249,115,22,.13),rgba(249,115,22,.04))', borderTop: '1px solid rgba(249,115,22,.16)', borderBottom: '1px solid rgba(249,115,22,.16)', padding: '58px 0' }}>
        <div className="W">
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, justifyContent: 'space-between' }} className="testi-row">
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--o)', fontSize: 14, marginBottom: 10 }}>★★★★★</div>
              <p style={{ fontSize: 14, color: 'var(--mu)', lineHeight: 1.75, marginBottom: 16, fontStyle: 'italic' }}>"{TESTIMONIALS[tIdx].t}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--o)', color: '#000', fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{TESTIMONIALS[tIdx].i}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{TESTIMONIALS[tIdx].a}</div>
                  <div style={{ fontSize: 11, color: 'var(--mu)' }}>{TESTIMONIALS[tIdx].co}</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setTIdx(i)} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--bd)', background: i === tIdx ? 'var(--o)' : 'var(--s2)', color: i === tIdx ? '#000' : 'var(--mu)', fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all .2s' }}>{i + 1}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: '68px 0' }}>
        <div className="W" style={{ textAlign: 'center' }}>
          <h2 className="D" style={{ fontSize: 'clamp(32px,5vw,60px)', marginBottom: 14 }}>Ready To Print?</h2>
          <p style={{ fontSize: 15, color: 'var(--mu)', marginBottom: 28, maxWidth: 480, margin: '0 auto 28px' }}>Fast turnaround, free proof, quality guaranteed. Let's build something great together.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigate('/products')}>Shop All Products →</button>
            <button className="btn btn-ghost" onClick={() => navigate('/quote')}>Get a Free Quote</button>
          </div>
        </div>
      </section>

      <style>{`
        .hero-grid { }
        .hero-right { }
        @media(max-width:1060px) { .hero-grid { grid-template-columns:1fr !important; } .hero-right { display:none !important; } }
        @media(max-width:1060px) { .cat-grid { grid-template-columns:repeat(4,1fr) !important; } }
        @media(max-width:640px) { .cat-grid { grid-template-columns:repeat(3,1fr) !important; } }
        @media(max-width:1060px) { .prod-grid-4,.feat-grid { grid-template-columns:repeat(2,1fr) !important; } }
        @media(max-width:480px) { .prod-grid-4,.feat-grid { grid-template-columns:1fr !important; } }
        @media(max-width:640px) { .testi-row { flex-direction:column !important; } }
      `}</style>
    </div>
  );
}
