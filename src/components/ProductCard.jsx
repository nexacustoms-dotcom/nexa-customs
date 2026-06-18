import { useApp, imgUrl } from '../context/AppContext';
import { CAT_BG } from '../data/products';

export default function ProductCard({ prod, onOpen }) {
  const { cats } = useApp();
  const cat = cats.find(c => c.id === prod.cat);
  const firstImg = prod.imgs?.find(x => x?.length) || prod.img || '';
  const fromPrice = prod.pricing?.[0]?.p || 0;

  return (
    <div className="card" onClick={onOpen} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 118, background: CAT_BG[prod.cat] || 'var(--s2)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--bd)', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        {firstImg
          ? <img src={imgUrl(firstImg, 400)} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          : cat?.img
            ? <img src={imgUrl(cat.img, 400)} alt={cat.l} style={{ width: '60%', height: '60%', objectFit: 'cover', borderRadius: 8, opacity: 0.6 }} loading="lazy" />
            : <span style={{ fontSize: 42 }}>{cat?.i || '🖨️'}</span>
        }
        {prod.badge && (
          <div className="badge-orange" style={{ position: 'absolute', top: 8, left: 8 }}>{prod.badge}</div>
        )}
      </div>
      <div style={{ padding: '13px 15px 15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 10, color: 'var(--o)', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 3 }}>{cat?.l}</div>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, lineHeight: 1.35 }}>{prod.name}</div>
        {prod.desc && <div style={{ fontSize: 11, color: 'var(--mu)', lineHeight: 1.5, marginBottom: 6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', flex:1 }}>{prod.desc}</div>}
        <div style={{ fontSize: 12, color: 'var(--mu)', marginBottom: 11 }}>
          from <strong style={{ color: 'var(--o)', fontSize: 15 }}>${fromPrice.toFixed(2)}</strong>
        </div>
        <div style={{ background: 'var(--o)', color: '#000', borderRadius: 7, padding: '9px 12px', fontSize: 12, fontWeight: 700, textAlign: 'center', transition: 'background .18s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--od)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--o)'}
        >Configure →</div>
      </div>
    </div>
  );
}
