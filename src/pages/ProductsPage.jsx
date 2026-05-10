import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const { cats, prods, showProduct } = useApp();
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = prods;
    if (activeCat !== 'all') list = list.filter(p => p.cat === activeCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.desc?.toLowerCase().includes(q));
    }
    return list;
  }, [prods, activeCat, search]);

  return (
    <div>
      <div style={{ background: 'var(--dk)', borderBottom: '1px solid var(--bd)', padding: '44px 0', textAlign: 'center' }}>
        <div className="W">
          <div className="badge-orange" style={{ marginBottom: 12 }}>Full Catalogue</div>
          <h1 className="D" style={{ fontSize: 'clamp(32px,5vw,58px)', marginBottom: 8 }}>All Products</h1>
          <p style={{ fontSize: 13, color: 'var(--mu)' }}>Professional print, signs & graphics for businesses across Ontario.</p>
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
              <SidebarItem label="All Products" count={prods.length} active={activeCat === 'all'} onClick={() => setActiveCat('all')} />
              {cats.map(c => (
                <SidebarItem key={c.id} label={`${c.i} ${c.l}`} count={prods.filter(p => p.cat === c.id).length} active={activeCat === c.id} onClick={() => setActiveCat(c.id)} />
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
                <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => { setSearch(''); setActiveCat('all'); }}>Clear filters</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(196px,1fr))', gap: 12 }}>
                {filtered.map(p => <ProductCard key={p.id} prod={p} onOpen={() => showProduct(p.id)} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .pl-layout { @media(max-width:1060px) { grid-template-columns:1fr !important; } }
        .pl-sidebar { @media(max-width:1060px) { position:static !important; } }
      `}</style>
    </div>
  );
}

function SidebarItem({ label, count, active, onClick }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 8px', borderRadius: 6, fontSize: 12, cursor: 'pointer', transition: 'all .15s', color: active ? 'var(--o)' : 'var(--mu)', background: active ? 'rgba(249,115,22,.09)' : 'transparent', fontWeight: active ? 600 : 400 }}
      onMouseEnter={e => !active && (e.currentTarget.style.color = 'var(--tx)')}
      onMouseLeave={e => !active && (e.currentTarget.style.color = 'var(--mu)')}
    >
      <span>{label}</span>
      <span style={{ fontSize: 10, background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 10, padding: '1px 5px', color: 'var(--mu)' }}>{count}</span>
    </div>
  );
}
