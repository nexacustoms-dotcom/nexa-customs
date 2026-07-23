import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp, imgUrl } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const { cats, prods } = useApp();
  const navigate = useNavigate();
  const { catSlug } = useParams();
  const activeCat = catSlug || 'all';
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = prods.filter(p => !p.disabled);
    if (activeCat !== 'all') list = list.filter(p => p.cat === activeCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.desc?.toLowerCase().includes(q));
    }
    return list;
  }, [prods, activeCat, search]);

  function handleCatClick(id) {
    setSearch('');
    if (id === 'all') navigate('/products');
    else navigate(`/products/${id}`);
  }

  return (
    <div>
      <div style={{ background: 'var(--dk)', borderBottom: '1px solid var(--bd)', padding: '44px 0', textAlign: 'center' }}>
        <div className="W">
          <div className="badge-orange" style={{ marginBottom: 12 }}>{activeCat === 'all' ? 'Full Catalogue' : 'Category'}</div>
          <h1 className="D" style={{ fontSize: 'clamp(32px,5vw,58px)', marginBottom: 8 }}>
  {activeCat === 'all' ? 'All Products' : (cats.find(c => c.id === activeCat)?.l || 'Products')}
</h1>
<p style={{ fontSize: 13, color: 'var(--mu)' }}>Professional print, signs & graphics for businesses across Ontario.</p>

<h2 style={{ fontSize: 'clamp(16px,2vw,22px)', fontWeight: 700, marginTop: 18, marginBottom: 8, color: 'var(--fg)', textAlign: 'center' }}>
  Custom Print Products for GTA Businesses
</h2>
<p style={{ fontSize: 14, color: '#aaa', maxWidth: 620, lineHeight: 1.75, marginBottom: 0, textAlign: 'center', margin: '0 auto' }}>
  {'From business cards and vinyl banners to vehicle wraps, stickers, and signage Nexa Customs offers professional '}
  <a href="https://nexacustoms.ca" style={{ color: '#f90', textDecoration: 'none', fontWeight: 500 }}>
    custom printing in Mississauga
  </a>
  {' with free proofs, same-day pickup, and Canada-wide shipping. Trusted by businesses across Toronto, Brampton, Oakville, and the GTA.'}
</p>
        </div>
      </div>

      <div className="W">
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, padding: '28px 0 72px', alignItems: 'start' }} className="pl-layout">
          {/* Sidebar */}
          <div style={{ position: 'sticky', top: 72 }} className="pl-sidebar">
            <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 12, marginBottom: 10 }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--mu)', fontSize: 12 }}>🔍</span>
                <input className="finp" style={{ paddingLeft: 32, fontSize: 12 }} placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 'var(--rl)', padding: 10 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mu)', padding: '4px 8px 10px', borderBottom: '1px solid var(--bd)', marginBottom: 4 }}>Categories</div>
              <SidebarItem label="All Products" count={prods.length} active={activeCat === 'all'} onClick={() => handleCatClick('all')} />
              {cats.map(c => (
                <SidebarItem key={c.id} label={c.l} emoji={c.i} img={c.img} count={prods.filter(p => p.cat === c.id).length} active={activeCat === c.id} onClick={() => handleCatClick(c.id)} />
              ))}
            </div>
          </div>

          {/* Grid */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: 'var(--mu)' }}>
                <strong style={{ color: 'var(--tx)' }}>{filtered.length}</strong> products
                {activeCat !== 'all' && ` in ${cats.find(c => c.id === activeCat)?.l}`}
              </div>
            </div>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--mu)' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>No products found</div>
                <div style={{ fontSize: 12 }}>Try a different search or category</div>
                <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => handleCatClick('all')}>Clear filters</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(196px,1fr))', gap: 12 }}>
                {filtered.map(p => <ProductCard key={p.id} prod={p} onOpen={() => navigate(`/products/${p.cat}/${p.id}`)} />)}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* PRODUCTS PAGE FAQ SECTION */}
<section style={{ background: 'var(--sf)', padding: '72px 0', borderTop: '1px solid var(--bd)' }}>
  <div className="W">

    {/* Heading */}
    <div style={{ textAlign: 'center', marginBottom: 48 }}>
      <div className="badge-orange" style={{ marginBottom: 12 }}>Got Questions?</div>
      <h2 className="D" style={{ fontSize: 'clamp(24px,3vw,38px)', marginBottom: 12 }}>
        Ordering Custom Prints — FAQs
      </h2>
      <p style={{ fontSize: 15, color: '#aaa', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
        {'Everything you need to know before placing your order at Nexa Customs Mississauga\'s trusted print shop.'}
      </p>
    </div>

    {/* FAQ Grid */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, maxWidth: 960, margin: '0 auto 0' }}>
      {[
        {
          q: 'How do I place a custom print order?',
          a: 'Browse our products, select your size and quantity, upload your artwork or choose a template, and proceed to checkout. You will receive a free digital proof before we print anything.'
        },
        {
          q: 'What is the minimum order quantity?',
          a: 'Minimum order quantities vary by product. Business cards start from as low as 50 units. Banners and signs can be ordered as a single piece. Check each product page for specific minimums.'
        },
        {
          q: 'How long does printing take?',
          a: 'Standard turnaround is 2–3 business days. Same-day pickup is available in Mississauga for orders placed before 10:30 AM. Rush 24-hour printing is available on select products.'
        },
        {
          q: 'Can I get a discount on bulk or wholesale orders?',
          a: 'Yes. Nexa Customs offers volume discounts on bulk print orders for businesses, agencies, and resellers across the GTA. Contact us at (437) 997-9921 for a custom wholesale quote.'
        },
        {
          q: 'Do you print for small businesses and startups?',
          a: 'Absolutely. Nexa Customs works with businesses of all sizes — from solo entrepreneurs to large corporations across Mississauga, Toronto, Brampton, and Ontario. Low minimums make it easy to start small.'
        },
        {
          q: 'Can I order if I don\'t have a designer?',
          a: 'Yes. Our team can help with basic design setup. You can also submit your logo and text and we will prepare a print-ready layout. A free proof is always included before printing starts.'
        },
        {
          q: 'What is your reprint or refund policy?',
          a: 'If your order has a print defect or quality issue on our end, we will reprint it at no charge. We stand behind every order — quality is guaranteed on all products from Nexa Customs.'
        },
        {
          q: 'How do I track my order after placing it?',
          a: 'Once your order ships, you will receive a tracking number via email. For pickup orders, we will notify you as soon as your prints are ready at our Mississauga location.'
        },
      ].map((item, i) => (
        <div key={i} style={{
          background: 'var(--dk)',
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

    {/* CTA below FAQ */}
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      <p style={{ fontSize: 14, color: '#aaa', marginBottom: 16 }}>
        {'Still have questions? We\'re happy to help.'}
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="/contact" style={{
          background: '#f90', color: '#000', fontWeight: 700,
          padding: '11px 24px', borderRadius: 8, fontSize: 14,
          textDecoration: 'none', display: 'inline-block'
        }}>Contact Us</a>
        <a href="tel:+14379979921" style={{
          background: 'transparent', color: '#f90', fontWeight: 700,
          padding: '11px 24px', borderRadius: 8, fontSize: 14,
          textDecoration: 'none', border: '1px solid rgba(249,115,22,.4)',
          display: 'inline-block'
        }}>(437) 997-9921</a>
      </div>
    </div>

  </div>
</section>

{/* PRODUCTS PAGE FAQ SCHEMA */}
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "How do I place a custom print order?", "acceptedAnswer": { "@type": "Answer", "text": "Browse our products, select your size and quantity, upload your artwork or choose a template, and proceed to checkout. You will receive a free digital proof before we print anything." }},
    { "@type": "Question", "name": "What is the minimum order quantity?", "acceptedAnswer": { "@type": "Answer", "text": "Minimum order quantities vary by product. Business cards start from as low as 50 units. Banners and signs can be ordered as a single piece. Check each product page for specific minimums." }},
    { "@type": "Question", "name": "How long does printing take?", "acceptedAnswer": { "@type": "Answer", "text": "Standard turnaround is 2-3 business days. Same-day pickup is available in Mississauga for orders placed before 10:30 AM. Rush 24-hour printing is available on select products." }},
    { "@type": "Question", "name": "Can I get a discount on bulk or wholesale orders?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Nexa Customs offers volume discounts on bulk print orders for businesses, agencies, and resellers across the GTA. Contact us at (437) 997-9921 for a custom wholesale quote." }},
    { "@type": "Question", "name": "Do you print for small businesses and startups?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. Nexa Customs works with businesses of all sizes — from solo entrepreneurs to large corporations across Mississauga, Toronto, Brampton, and Ontario." }},
    { "@type": "Question", "name": "Can I order if I don't have a designer?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Our team can help with basic design setup. You can also submit your logo and text and we will prepare a print-ready layout. A free proof is always included before printing starts." }},
    { "@type": "Question", "name": "What is your reprint or refund policy?", "acceptedAnswer": { "@type": "Answer", "text": "If your order has a print defect or quality issue on our end, we will reprint it at no charge. Quality is guaranteed on all products from Nexa Customs." }},
    { "@type": "Question", "name": "How do I track my order after placing it?", "acceptedAnswer": { "@type": "Answer", "text": "Once your order ships, you will receive a tracking number via email. For pickup orders, we will notify you as soon as your prints are ready at our Mississauga location." }},
  ]
})}} />

      <style>{`
        .pl-layout { @media(max-width:1060px) { grid-template-columns:1fr !important; } }
        .pl-sidebar { @media(max-width:1060px) { position:static !important; } }
      `}</style>
    </div>
  );
}

function SidebarItem({ label, emoji, img, count, active, onClick }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'space-between', padding: '7px 8px', borderRadius: 6, fontSize: 12, cursor: 'pointer', transition: 'all .15s', color: active ? 'var(--o)' : 'var(--mu)', background: active ? 'rgba(249,115,22,.09)' : 'transparent', fontWeight: active ? 600 : 400 }}
      onMouseEnter={e => !active && (e.currentTarget.style.color = 'var(--tx)')}
      onMouseLeave={e => !active && (e.currentTarget.style.color = 'var(--mu)')}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {img
          ? <img src={imgUrl(img, 80)} alt={label} style={{ width: 20, height: 20, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} loading="lazy" />
          : <span style={{ fontSize: 14 }}>{emoji}</span>}
        <span>{label}</span>
      </div>
      <span style={{ fontSize: 10, background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 10, padding: '1px 5px', color: 'var(--mu)', flexShrink: 0 }}>{count}</span>
    </div>
  );
}
