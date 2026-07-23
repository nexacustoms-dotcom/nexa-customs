import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, imgUrl } from '../context/AppContext';
import { DEFAULT_STORE } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const { cats, prods, store: _store, showProduct } = useApp();
  const store = { ...DEFAULT_STORE, ..._store };
  const TESTIMONIALS = (store.testimonials && store.testimonials.length > 0) ? store.testimonials : DEFAULT_STORE.testimonials;
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [tIdx, setTIdx] = useState(0);

  const defaultSlides = [
    { ico: '🪪', title: 'Premium Business Cards', sub: 'From $24.32 · Same-week turnaround · Free design proof', img: '', link: '/products/business-cards' },
    { ico: '🪧', title: 'Vinyl Banners & Signs', sub: 'Custom sizes · Full colour · Indoor & outdoor · Rush available', img: '', link: '/products/signs-banners' },
    { ico: '🚗', title: 'Vehicle Wraps', sub: 'Full & partial wraps · Cast vinyl · 5–7 year life · Professional install', img: '', link: '/products/vehicle-graphics' },
    { ico: '📄', title: 'Flyers & Postcards', sub: '1,000 flyers from $99 · Canada-wide shipping · 100lb gloss or matte', img: '', link: '/products/flyers-postcards' },
  ];
  const slides = (store.hero_slides && store.hero_slides.length > 0) ? store.hero_slides : defaultSlides;

  useEffect(() => { const t = setInterval(() => setSlide(i => (i + 1) % slides.length), 4000); return () => clearInterval(t); }, [slides.length]);

  const featured = prods.filter(p => !p.disabled && (p.badge === 'Most Popular' || p.badge === 'Best Seller')).slice(0, 4);
  const displayProds = featured.length >= 4 ? featured : prods.filter(p => !p.disabled).slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section style={{ position: 'relative', padding: '76px 0 100px' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {store.hero_bg && <img src={imgUrl(store.hero_bg, 500, 35)} alt="" width="500" height="500" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18 }} />}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(249,115,22,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.04) 1px,transparent 1px)', backgroundSize: '54px 54px' }} />
          <div style={{ position: 'absolute', top: -120, right: -60, width: 640, height: 640, borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,.1) 0%,transparent 68%)' }} />
        </div>
        <div className="W">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 410px', gap: 60, alignItems: 'center', position: 'relative', zIndex: 1 }} className="hero-grid">
            <div>
              <div className="badge-orange" style={{ marginBottom: 18 }}>{store.hero_badge || "Mississauga's Print Experts Since 2010"}</div>
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
              <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 36px 88px rgba(0,0,0,.55)', minHeight: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', cursor: slides[slide]?.link ? 'pointer' : 'default' }}
                onClick={() => slides[slide]?.link && navigate(slides[slide].link)}>
                {slides[slide]?.link && (
                  <div style={{ position: 'absolute', top: 10, right: 10, background: 'var(--o)', color: '#000', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 20, zIndex: 2, letterSpacing: '.05em', textTransform: 'uppercase' }}>Shop Now →</div>
                )}
                {slides[slide]?.img
                  ? (
                    <div style={{ position: 'relative', width: '100%' }}>
                      <img src={imgUrl(slides[slide].img, 1200)} alt={slides[slide].title} width="1200" height="260" style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }} fetchpriority="high" />
                      {(slides[slide]?.title || slides[slide]?.sub) && (
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.75))', padding: '28px 16px 14px' }}>
                          {slides[slide]?.title && <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 18, textTransform: 'uppercase', color: '#fff', marginBottom: 3 }}>{slides[slide].title}</div>}
                          {slides[slide]?.sub && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5 }}>{slides[slide].sub}</div>}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ padding: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                      <div style={{ fontSize: 64, marginBottom: 16 }}>{slides[slide]?.ico || '🖨️'}</div>
                      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 22, textTransform: 'uppercase', marginBottom: 8 }}>{slides[slide]?.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--mu)', lineHeight: 1.6 }}>{slides[slide]?.sub}</div>
                    </div>
                  )
                }
                <div style={{ display: 'flex', gap: 6, padding: '10px 0', position: 'absolute', bottom: 8 }}>
                  {slides.map((_, i) => (
                    <div key={i} onClick={e => { e.stopPropagation(); setSlide(i); }} style={{ width: 6, height: 6, borderRadius: '50%', background: i === slide ? 'var(--o)' : 'var(--bd)', cursor: 'pointer', transition: 'background .2s' }} />
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
  <h2 className="D" style={{ fontSize: 'clamp(26px,3.5vw,42px)' }}>Shop By Category</h2>
  <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => navigate('/products')}>View All →</button>
</div>

<p style={{ fontSize: 15, color: '#aaa', marginBottom: 28, maxWidth: 680, lineHeight: 1.7 }}>
  Explore our full range of custom print products from{' '}
  <a href="/products" style={{ color: '#f90', textDecoration: 'none', fontWeight: 500 }}>
    business cards and vinyl banners
  </a>{' '}
  to vehicle wraps, stickers, and signage. Nexa Customs is Mississauga's trusted{' '}
    print shop
  {' '}
  for businesses across the GTA same-day pickup, free proof, ships Canada-wide.
</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }} className="cat-grid">
            {cats.slice(0, 12).map(c => (
              <div key={c.id} onClick={() => navigate(`/products/${c.id}`)}
                style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 0, transition: 'all .2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--o)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bd)'; e.currentTarget.style.transform = ''; }}
              >
                {c.img
                  ? <img src={imgUrl(c.img, 500)} alt={c.l} width="500" height="180" decoding="async" style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} loading="lazy" />
                  : <div style={{ width: '100%', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, background: 'var(--s2)' }}>{c.i}</div>}
                <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, padding: '13px 10px' }}>{c.l}</span>
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
              <p style={{ fontSize: 15, color: '#aaa', maxWidth: 580, lineHeight: 1.7, margin: '0 0 0 0' }}>
  {'Mississauga\'s most-ordered custom print products business cards, banners, vehicle wraps, stickers, and more. '}
  <a href="/products" style={{ color: '#f90', textDecoration: 'none', fontWeight: 500 }}>
    Browse all products
  </a>
  {' and get a free proof with every order.'}
</p>
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
          <div style={{ marginBottom: 32 }}>
    <h2 className="D" style={{ fontSize: 'clamp(22px,3vw,36px)', marginBottom: 10 }}>
      Why Businesses Choose Nexa Customs
    </h2>
    <p style={{ fontSize: 15, color: '#aaa', maxWidth: 580, lineHeight: 1.7, margin: 0 }}>
      {'From rush orders to large-format printing we make it easy for businesses across Mississauga and the GTA to get '}
      <a href="https://maps.app.goo.gl/VTDW9Cx2daL9KZtF8" style={{ color: '#f90', textDecoration: 'none', fontWeight: 500 }}>
        professional print, signs, and graphics
      </a>
      {' delivered fast, printed right, every time.'}
    </p>
  </div>
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
          {store.google_review_url && (
            <a href={store.google_review_url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 22, padding: '8px 14px', background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 30, textDecoration: 'none', color: 'var(--tx)', fontSize: 12 }}>
              <span style={{ color: 'var(--o)' }}>★★★★★</span>
              <strong>{store.google_rating || '4.9'}</strong>
              <span style={{ color: 'var(--mu)' }}>{store.google_review_count ? `(${store.google_review_count} reviews)` : ''} on Google</span>
            </a>
          )}
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
       {/* FAQ SECTION */}
<section style={{ background: 'var(--dk)', padding: '72px 0' }}>
  <div className="W">

    {/* Heading */}
    <div style={{ textAlign: 'center', marginBottom: 48 }}>
      <div className="badge-orange" style={{ marginBottom: 12 }}>FAQs</div>
      <h2 className="D" style={{ fontSize: 'clamp(26px,3.5vw,42px)', marginBottom: 12 }}>
        Frequently Asked Questions
      </h2>
      <p style={{ fontSize: 15, color: '#aaa', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
        {'Everything you need to know about custom printing at Nexa Customs Mississauga\'s trusted print shop.'}
      </p>
    </div>

    {/* FAQ Grid */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, maxWidth: 960, margin: '0 auto' }}>
      {[
        {
          q: 'Where is Nexa Customs located?',
          a: 'Nexa Customs is located at 6033 Shawson Dr, Unit 40, Mississauga, Ontario, L5T 1J6. We serve businesses across the GTA including Toronto, Brampton, Oakville, and Vaughan.'
        },
        {
          q: 'Does Nexa Customs offer same-day printing?',
          a: 'Yes. Nexa Customs offers same-day pickup in Mississauga for orders placed before 10:30 AM. Rush printing is available 24 hours for select products.'
        },
        {
          q: 'What products does Nexa Customs print?',
          a: 'Nexa Customs prints business cards, vinyl banners, vehicle wraps, stickers, labels, flyers, postcards, signage, foam boards, posters, window graphics, real estate signs, and more.'
        },
        {
          q: 'Does Nexa Customs ship across Canada?',
          a: 'Yes. Nexa Customs ships Canada-wide with fast courier delivery. Flat-rate shipping is available across Ontario, with delivery to all major Canadian cities.'
        },
        {
          q: 'What is the best print shop near Mississauga?',
          a: 'Nexa Customs is one of the GTA\'s most trusted print shops, based in Mississauga. We offer full-colour printing, free design proofs, same-day pickup, and Canada-wide shipping — serving businesses since 2020.'
        },
        {
          q: 'Do you provide a free proof before printing?',
          a: 'Yes. Every order at Nexa Customs includes a free digital proof before it goes to press. We revise until you are 100% satisfied, with no additional charge.'
        },
        {
          q: 'Can I get custom vehicle wraps in Mississauga?',
          a: 'Yes. Nexa Customs produces custom vehicle wraps, fleet graphics, and magnetic vehicle signs for businesses across Mississauga, Toronto, Brampton, and the GTA.'
        },
        {
          q: 'What file formats does Nexa Customs accept?',
          a: 'Nexa Customs accepts PDF, AI, EPS, PSD, and high-resolution PNG or JPG files. For best results, submit files at 300 DPI in CMYK colour mode with bleed included.'
        },
      ].map((item, i) => (
        <div key={i} style={{
          background: 'var(--sf)',
          border: '1px solid var(--bd)',
          borderRadius: 'var(--rl)',
          padding: '24px 22px',
        }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              minWidth: 28, height: 28,
              background: 'rgba(249,115,22,.1)',
              border: '1px solid rgba(249,115,22,.25)',
              borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#f90', flexShrink: 0
            }}>Q</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, lineHeight: 1.5 }}>{item.q}</div>
              <div style={{ fontSize: 13, color: 'var(--mu)', lineHeight: 1.75 }}>{item.a}</div>
            </div>
          </div>
        </div>
      ))}
    </div>

  </div>
</section>

{/* FAQ SCHEMA */}
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Where is Nexa Customs located?", "acceptedAnswer": { "@type": "Answer", "text": "Nexa Customs is located at 6033 Shawson Dr, Unit 40, Mississauga, Ontario, L5T 1J6. We serve businesses across the GTA including Toronto, Brampton, Oakville, and Vaughan." }},
    { "@type": "Question", "name": "Does Nexa Customs offer same-day printing?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Nexa Customs offers same-day pickup in Mississauga for orders placed before 10:30 AM. Rush printing is available 24 hours for select products." }},
    { "@type": "Question", "name": "What products does Nexa Customs print?", "acceptedAnswer": { "@type": "Answer", "text": "Nexa Customs prints business cards, vinyl banners, vehicle wraps, stickers, labels, flyers, postcards, signage, foam boards, posters, window graphics, real estate signs, and more." }},
    { "@type": "Question", "name": "Does Nexa Customs ship across Canada?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Nexa Customs ships Canada-wide with fast courier delivery. Flat-rate shipping is available across Ontario, with delivery to all major Canadian cities." }},
    { "@type": "Question", "name": "What is the best print shop near Mississauga?", "acceptedAnswer": { "@type": "Answer", "text": "Nexa Customs is one of the GTA's most trusted print shops, based in Mississauga. We offer full-colour printing, free design proofs, same-day pickup, and Canada-wide shipping — serving businesses since 2020." }},
    { "@type": "Question", "name": "Do you provide a free proof before printing?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Every order at Nexa Customs includes a free digital proof before it goes to press. We revise until you are 100% satisfied, with no additional charge." }},
    { "@type": "Question", "name": "Can I get custom vehicle wraps in Mississauga?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Nexa Customs produces custom vehicle wraps, fleet graphics, and magnetic vehicle signs for businesses across Mississauga, Toronto, Brampton, and the GTA." }},
    { "@type": "Question", "name": "What file formats does Nexa Customs accept?", "acceptedAnswer": { "@type": "Answer", "text": "Nexa Customs accepts PDF, AI, EPS, PSD, and high-resolution PNG or JPG files. For best results, submit files at 300 DPI in CMYK colour mode with bleed included." }},
  ]
})}} />       
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
